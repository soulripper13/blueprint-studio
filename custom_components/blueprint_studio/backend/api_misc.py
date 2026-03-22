"""Settings, AI, syntax check, and utility handlers for Blueprint Studio API."""
from __future__ import annotations

import logging
import time

from ..const import VERSION
from .util import json_response

_LOGGER = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Short-lived in-memory cache for expensive HA state/registry reads.
# These endpoints are called on every page load and panel open, but the
# underlying data rarely changes within a few seconds.
# ---------------------------------------------------------------------------
class _HassCache:
    """Simple TTL cache for HA state queries."""

    _store: dict[str, tuple[float, object]] = {}
    _ttl: float = 5.0  # seconds

    @classmethod
    def get(cls, key: str) -> object | None:
        entry = cls._store.get(key)
        if entry and (time.monotonic() - entry[0]) < cls._ttl:
            return entry[1]
        return None

    @classmethod
    def set(cls, key: str, value: object) -> None:
        cls._store[key] = (time.monotonic(), value)

    @classmethod
    def invalidate(cls, key: str) -> None:
        cls._store.pop(key, None)

    @classmethod
    def invalidate_all(cls) -> None:
        cls._store.clear()


# ========== Settings ==========

async def save_settings(data, store, hass, stored_data):
    """Save settings and broadcast change."""
    stored_data["settings"] = data.get("settings", {})
    await store.async_save(stored_data)
    hass.bus.async_fire("blueprint_studio_settings_changed", {
        "action": "settings_updated"
    })
    return json_response({"success": True})


# ========== Syntax Checkers ==========

async def check_yaml(ai_manager, data, hass):
    return await hass.async_add_executor_job(ai_manager.check_yaml, data.get("content", ""))


async def check_jinja(ai_manager, data, hass):
    return await hass.async_add_executor_job(ai_manager.check_jinja, data.get("content", ""))


async def check_json(ai_manager, data, hass):
    return await hass.async_add_executor_job(ai_manager.check_json, data.get("content", ""))


async def check_python(ai_manager, data, hass):
    return await hass.async_add_executor_job(ai_manager.check_python, data.get("content", ""))


async def check_javascript(ai_manager, data, hass):
    return await hass.async_add_executor_job(ai_manager.check_javascript, data.get("content", ""))


async def check_syntax(ai_manager, data, hass):
    """Universal syntax checker - detects file type and applies appropriate validator."""
    content = data.get("content", "")
    file_path = data.get("file_path", "")
    return await hass.async_add_executor_job(ai_manager.check_syntax, content, file_path)


async def convert_to_blueprint(ai_manager, data, hass):
    """Convert automation YAML to blueprint format."""
    from .ai_generators import convert_automation_to_blueprint
    content = data.get("content", "")
    blueprint_name = data.get("blueprint_name", "")
    result = await hass.async_add_executor_job(convert_automation_to_blueprint, content, blueprint_name)
    return json_response({"success": True, "blueprint": result})


async def parse_blueprint_inputs(ai_manager, data, hass):
    """Parse blueprint YAML and return structured input description for the Use Blueprint form."""
    from .ai_generators import parse_blueprint_inputs as _parse
    content = data.get("content", "")
    result = await hass.async_add_executor_job(_parse, content)
    return json_response({"success": True, "inputs": result})


async def instantiate_blueprint(ai_manager, data, hass):
    """Substitute !input references in a blueprint and return ready-to-use automation YAML."""
    from .ai_generators import instantiate_blueprint as _inst
    content = data.get("content", "")
    input_values = data.get("input_values", {})
    name = data.get("name", "My Automation")
    description = data.get("description", "")
    result = await hass.async_add_executor_job(_inst, content, input_values, name, description)
    return json_response({"success": True, "automation": result})


# ========== AI ==========

async def ai_query(ai_manager, data):
    """Handle AI query."""
    return await ai_manager.query(
        data.get("query"), data.get("current_file"),
        data.get("file_content"), data.get("ai_type"),
        data.get("cloud_provider"), data.get("ai_model")
    )


# ========== Utility ==========

async def restart_home_assistant(hass):
    """Restart Home Assistant."""
    await hass.services.async_call("homeassistant", "restart")
    return json_response({"success": True, "message": "Restarting..."})


async def get_entities(hass, data):
    """Get HA entities, optionally filtered by query, domains, and/or device_class.

    Parameters:
        domains       – If set, only return entities from these domains.
        device_classes – If set, only return entities with these device_class values.
        ensure_domains – Domains whose entities are *always* included before the cap,
                         even when 'domains' is unset (mixed restricted/unrestricted case).
        query         – Text filter on entity_id / friendly_name.
    """
    query = data.get("query", "").lower()
    domains = data.get("domains")           # e.g. ["camera", "light"]
    device_classes = data.get("device_classes")  # e.g. ["motion", "door"]
    ensure_domains = data.get("ensure_domains")  # e.g. ["camera", "device_tracker"]

    # Only use the cache for unfiltered requests (the common page-load case).
    # Filtered requests (AI autocomplete, entity pickers) are always fresh.
    use_cache = not query and not domains and not device_classes and not ensure_domains
    cache_key = "entities_all"
    if use_cache:
        cached = _HassCache.get(cache_key)
        if cached is not None:
            return json_response({"entities": cached})

    # Build entity_id → platform (integration) lookup from entity registry
    platform_map = {}
    try:
        from homeassistant.helpers import entity_registry as er
        ent_reg = er.async_get(hass)
        for entry in ent_reg.entities.values():
            platform_map[entry.entity_id] = entry.platform
    except Exception:
        pass  # Graceful fallback — entities just won't have integration info

    ensured = []   # entities from ensure_domains — always included
    general = []   # everything else — capped

    for s in hass.states.async_all():
        eid = s.entity_id
        eid_lower = eid.lower()
        if domains and not any(eid_lower.startswith(d + ".") for d in domains):
            continue
        if device_classes:
            dc = (s.attributes.get("device_class") or "").lower()
            if dc not in device_classes:
                continue
        fname = str(s.attributes.get("friendly_name", "")).lower()
        if query and query not in eid_lower and query not in fname:
            continue
        entry = {
            "entity_id": eid,
            "friendly_name": s.attributes.get("friendly_name"),
            "icon": s.attributes.get("icon"),
            "state": s.state,
            "device_class": s.attributes.get("device_class"),
            "integration": platform_map.get(eid),
        }
        if ensure_domains and not domains and any(eid_lower.startswith(d + ".") for d in ensure_domains):
            ensured.append(entry)
        else:
            general.append(entry)

    # Always include all ensured entities, fill remaining cap with general entities
    cap = 1000
    remaining = max(0, cap - len(ensured))
    entities = ensured + general[:remaining]

    if use_cache:
        _HassCache.set(cache_key, entities)

    return json_response({"entities": entities})


async def get_version(hass):
    """Get version info."""
    from homeassistant.const import __version__ as ha_version_const

    is_haos = False
    try:
        is_haos = hass.data.get('supervisor', {}).get('addon_info') is not None or \
                  hass.data.get('homeassistant', {}).get('installation_type') == 'hassio'
    except Exception as e:
        _LOGGER.debug("Could not detect HAOS: %s", e)

    return json_response({
        "ha_version": ha_version_const,
        "integration_version": VERSION,
        "is_haos": is_haos
    })


async def get_devices(hass):
    """Return all registered devices with integration, manufacturer, and model."""
    cached = _HassCache.get("devices")
    if cached is not None:
        return json_response({"success": True, "devices": cached})
    try:
        from homeassistant.helpers import device_registry as dr
        dev_reg = dr.async_get(hass)
        devices = []
        for d in dev_reg.devices.values():
            identifiers = list(d.identifiers) if d.identifiers else []
            integration = identifiers[0][0] if identifiers else None
            devices.append({
                "id": d.id,
                "name": d.name_by_user or d.name or d.id,
                "manufacturer": d.manufacturer,
                "model": d.model,
                "integration": integration,
            })
        _HassCache.set("devices", devices)
        return json_response({"success": True, "devices": devices})
    except Exception as e:
        _LOGGER.debug("get_devices failed: %s", e)
        return json_response({"success": True, "devices": []})


async def get_areas(hass):
    """Return all registered areas as id/name pairs."""
    cached = _HassCache.get("areas")
    if cached is not None:
        return json_response({"success": True, "areas": cached})
    try:
        from homeassistant.helpers import area_registry as ar
        area_reg = ar.async_get(hass)
        areas = [{"id": a.id, "name": a.name} for a in area_reg.areas.values()]
        _HassCache.set("areas", areas)
        return json_response({"success": True, "areas": areas})
    except Exception as e:
        _LOGGER.debug("get_areas failed: %s", e)
        return json_response({"success": True, "areas": []})


async def get_labels(hass):
    """Return all registered labels as id/name pairs."""
    try:
        from homeassistant.helpers import label_registry as lr
        label_reg = lr.async_get(hass)
        labels = [{"id": lb.label_id, "name": lb.name} for lb in label_reg.labels.values()]
        return json_response({"success": True, "labels": labels})
    except Exception as e:
        _LOGGER.debug("get_labels failed: %s", e)
        return json_response({"success": True, "labels": []})


async def get_floors(hass):
    """Return all registered floors as id/name pairs."""
    try:
        from homeassistant.helpers import floor_registry as fr
        floor_reg = fr.async_get(hass)
        floors = [{"id": f.floor_id, "name": f.name} for f in floor_reg.floors.values()]
        return json_response({"success": True, "floors": floors})
    except Exception as e:
        _LOGGER.debug("get_floors failed: %s", e)
        return json_response({"success": True, "floors": []})


async def reload_automations(hass):
    """Reload automations without restarting HA."""
    try:
        await hass.services.async_call("automation", "reload")
        return json_response({"success": True, "message": "Automations reloaded"})
    except Exception as e:
        _LOGGER.error("reload_automations failed: %s", e)
        return json_response({"success": False, "message": str(e)})


async def get_themes(hass):
    """Return all installed theme names."""
    try:
        themes = list(getattr(hass.data.get('frontend_storage', {}), 'themes', {}).keys())
        # Fallback: try hass.themes directly
        if not themes:
            themes_obj = getattr(hass, 'themes', None)
            if themes_obj:
                themes = list(getattr(themes_obj, 'themes', {}).keys())
        return json_response({"success": True, "themes": themes})
    except Exception as e:
        _LOGGER.debug("get_themes failed: %s", e)
        return json_response({"success": True, "themes": []})


async def get_addons(hass):
    """Return installed Supervisor add-ons (HAOS only)."""
    try:
        hassio = hass.components.hassio
        if not hassio.is_hassio():
            return json_response({"success": True, "addons": []})
        addons = await hassio.async_get_addon_store_info()
        result = [{"slug": a["slug"], "name": a["name"]} for a in addons if a.get("installed")]
        return json_response({"success": True, "addons": result})
    except Exception as e:
        _LOGGER.debug("get_addons failed: %s", e)
        return json_response({"success": True, "addons": []})


async def get_services(hass):
    """Return all registered HA services as domain.service strings with descriptions.

    Uses a 30-second TTL cache — services change rarely and are only used for
    editor autocomplete, so a brief staleness is acceptable.
    """
    cached = _HassCache.get("services")
    if cached is not None:
        return json_response({"success": True, "services": cached})

    try:
        raw = hass.services.async_services()
        services = []
        for domain, domain_services in raw.items():
            for service_name, service_obj in domain_services.items():
                description = ""
                try:
                    if hasattr(service_obj, "description"):
                        description = service_obj.description or ""
                except Exception:
                    pass
                services.append({
                    "service": f"{domain}.{service_name}",
                    "domain": domain,
                    "name": service_name,
                    "description": description,
                })
        services.sort(key=lambda s: s["service"])
        # Store with a 30-second effective TTL (services rarely change)
        _HassCache._store["services"] = (time.monotonic() - _HassCache._ttl + 30.0, services)
        return json_response({"success": True, "services": services})
    except Exception as e:
        _LOGGER.debug("get_services failed: %s", e)
        return json_response({"success": True, "services": []})
