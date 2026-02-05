"""The Blueprint Studio integration."""
from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components import frontend
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.storage import Store

from .const import DOMAIN, NAME
from .api import BlueprintStudioApiView
from .websocket import async_register_websockets

_LOGGER = logging.getLogger(__name__)

# Storage version for credentials
STORAGE_VERSION = 1
STORAGE_KEY = f"{DOMAIN}.credentials"

# This integration is configured via config entries (UI)
CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Set up the Blueprint Studio component."""
    hass.data.setdefault(DOMAIN, {})
    return True

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Blueprint Studio from a config entry."""
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = {}

    # Initialize credential storage
    store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
    data = await store.async_load() or {}

    # Migrate legacy credentials (flat structure -> nested)
    if "username" in data and "credentials" not in data:
        data = {
            "credentials": {
                "username": data.pop("username"),
                "token": data.pop("token", None)
            },
            "settings": data.get("settings", {})
        }

    config_dir = Path(hass.config.config_dir)
    api_view = BlueprintStudioApiView(config_dir, store, data)
    hass.http.register_view(api_view)
    
    # Register WebSocket commands
    async_register_websockets(hass)

    await hass.http.async_register_static_paths([
        StaticPathConfig(
            f"/local/{DOMAIN}",
            str(hass.config.path("custom_components", DOMAIN)),
            cache_headers=False,
        )
    ])

    frontend.async_register_built_in_panel(
        hass,
        component_name="iframe",
        sidebar_title=NAME,
        sidebar_icon="mdi:file-document-edit",
        frontend_url_path=DOMAIN,
        config={"url": f"/local/{DOMAIN}/panels/panel_custom.html"},
        require_admin=True,
    )

    return True

async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    frontend.async_remove_panel(hass, DOMAIN)
    hass.data[DOMAIN].pop(entry.entry_id, None)
    return True