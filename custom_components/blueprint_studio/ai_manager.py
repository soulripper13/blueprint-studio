"AI management for Blueprint Studio."
from __future__ import annotations

import logging
import re
import yaml
import aiohttp
import time
from aiohttp import web
from homeassistant.core import HomeAssistant

from .util import json_response, json_message

_LOGGER = logging.getLogger(__name__)

# Domain synonym mapping - maps natural language to HA domains
DOMAIN_SYNONYMS = {
    "light": ["light", "lights", "bulb", "bulbs", "lamp", "lamps", "lighting", "chandelier", "spotlight", "led strip", "led", "strip light"],
    "switch": ["switch", "switches", "plug", "plugs", "outlet", "outlets", "socket", "wall switch", "power strip"],
    "cover": ["cover", "covers", "blind", "blinds", "shade", "shades", "curtain", "curtains", "shutter", "shutters", "garage door", "gate", "roller", "awning"],
    "climate": ["climate", "thermostat", "heater", "heating", "ac", "air conditioning", "hvac", "temperature control", "cooling", "heat pump"],
    "lock": ["lock", "locks", "door lock", "deadbolt", "smart lock"],
    "fan": ["fan", "fans", "ceiling fan", "exhaust fan", "ventilator"],
    "media_player": ["media", "player", "tv", "television", "speaker", "speakers", "music", "audio", "stereo", "soundbar", "chromecast", "roku", "apple tv"],
    "camera": ["camera", "cameras", "cam", "cams", "security camera", "webcam", "doorbell"],
    "vacuum": ["vacuum", "vacuums", "cleaner", "robot vacuum", "roomba", "mop"],
    "sensor": ["sensor", "sensors", "temperature sensor", "humidity sensor", "light sensor", "power sensor", "energy sensor"],
    "binary_sensor": ["motion sensor", "motion", "door sensor", "window sensor", "leak sensor", "water sensor", "smoke detector", "smoke", "occupancy", "presence"],
    "alarm_control_panel": ["alarm", "security system", "alarm panel", "security panel"],
    "input_boolean": ["input boolean", "toggle", "virtual switch", "helper toggle"],
    "input_number": ["input number", "slider", "number helper"],
    "input_select": ["input select", "dropdown", "select helper"],
    "input_datetime": ["input datetime", "date helper", "time helper"],
    "input_text": ["input text", "text helper", "text input"],
    "automation": ["automation", "automations", "auto"],
    "script": ["script", "scripts"],
    "scene": ["scene", "scenes"],
    "notify": ["notify", "notification", "alert", "message"],
    "timer": ["timer", "timers", "countdown"],
    "counter": ["counter", "counters"],
    "button": ["button", "buttons", "press button"],
    "number": ["number", "numbers"],
    "select": ["select", "selection"],
    "siren": ["siren", "sirens", "alarm siren"],
    "humidifier": ["humidifier", "dehumidifier"],
    "water_heater": ["water heater", "boiler"],
    "remote": ["remote", "remotes", "remote control"],
    "device_tracker": ["device tracker", "phone", "tracker", "location"],
    "person": ["person", "people", "user"],
    "zone": ["zone", "zones", "area", "geofence"],
    "group": ["group", "groups"],
}

# Action mapping for different domains
DOMAIN_ACTIONS = {
    "light": {"on": "turn_on", "off": "turn_off", "toggle": "toggle"},
    "switch": {"on": "turn_on", "off": "turn_off", "toggle": "toggle"},
    "cover": {"on": "open_cover", "off": "close_cover", "stop": "stop_cover", "toggle": "toggle"},
    "lock": {"on": "unlock", "off": "lock"},
    "fan": {"on": "turn_on", "off": "turn_off", "toggle": "toggle"},
    "climate": {"on": "turn_on", "off": "turn_off", "set_temp": "set_temperature", "set_hvac": "set_hvac_mode"},
    "media_player": {"on": "turn_on", "off": "turn_off", "play": "media_play", "pause": "media_pause", "stop": "media_stop", "volume_up": "volume_up", "volume_down": "volume_down", "mute": "volume_mute"},
    "vacuum": {"on": "start", "off": "return_to_base", "pause": "pause", "stop": "stop"},
    "input_boolean": {"on": "turn_on", "off": "turn_off", "toggle": "toggle"},
    "automation": {"on": "turn_on", "off": "turn_off", "toggle": "toggle", "trigger": "trigger"},
    "script": {"on": "turn_on"},
    "scene": {"on": "turn_on"},
    "notify": {"send": "send_message"},
    "button": {"press": "press"},
    "siren": {"on": "turn_on", "off": "turn_off"},
    "alarm_control_panel": {"arm_away": "alarm_arm_away", "arm_home": "alarm_arm_home", "disarm": "alarm_disarm"},
}

# Common YAML errors and their solutions
YAML_ERROR_PATTERNS = {
    "legacy_service": {
        "pattern": r"^\s*service:\s*(\w+\.\w+)",
        "message": "Legacy 'service:' syntax detected",
        "solution": "Replace 'service:' with 'action:' (modern 2024+ syntax)",
        "example": "service: light.turn_on  →  action: light.turn_on"
    },
    "missing_id": {
        "pattern": r"^-\s+alias:",
        "message": "Automation missing unique 'id:' field",
        "solution": "Add 'id: \"XXXXXXXXXXXXX\"' (13-digit timestamp) before 'alias:'",
        "example": "- alias: My Auto  →  - id: '1738012345678'\n  alias: My Auto"
    },
    "singular_trigger": {
        "pattern": r"^\s*trigger:\s*$",
        "message": "Legacy singular 'trigger:' key detected",
        "solution": "Use modern plural 'triggers:' instead",
        "example": "trigger:  →  triggers:"
    },
    "singular_condition": {
        "pattern": r"^\s*condition:\s*$",
        "message": "Legacy singular 'condition:' key detected",
        "solution": "Use modern plural 'conditions:' instead",
        "example": "condition:  →  conditions:"
    },
    "singular_action": {
        "pattern": r"^\s*action:\s*$",
        "message": "Legacy singular 'action:' key detected at top level",
        "solution": "Use modern plural 'actions:' at automation level",
        "example": "action:  →  actions:"
    },
    "old_trigger_syntax": {
        "pattern": r"^\s*-\s+platform:\s+(\w+)",
        "message": "Legacy 'platform:' trigger syntax detected",
        "solution": "Use modern '- trigger: platform' syntax",
        "example": "- platform: time  →  - trigger: time"
    },
    "missing_metadata": {
        "pattern": r"(action:\s+\w+\.\w+)(?!.*metadata:)",
        "message": "Action missing 'metadata: {}' field",
        "solution": "Add 'metadata: {}' after action declaration",
        "example": "action: light.turn_on\ntarget:  →  action: light.turn_on\nmetadata: {}\ntarget:"
    },
    "malformed_entity_id": {
        "pattern": r"entity_id:\s+([a-zA-Z_]+)(?!\.[a-zA-Z_])",
        "message": "Malformed entity_id (missing domain or entity name)",
        "solution": "Entity IDs must follow format: domain.entity_name",
        "example": "entity_id: kitchen  →  entity_id: light.kitchen"
    },
    "invalid_domain": {
        "pattern": r"entity_id:\s+([a-zA-Z0-9_]+)\.",
        "message": "Potentially invalid domain in entity_id",
        "solution": "Check if domain exists in Home Assistant",
        "example": "Common domains: light, switch, sensor, binary_sensor, climate, etc."
    },
}

# Common Jinja2 template patterns for Home Assistant
JINJA_PATTERNS = {
    "state": {
        "templates": [
            "{{ states('sensor.temperature') }}",
            "{{ states('light.kitchen') }}",
            "{{ state_attr('light.kitchen', 'brightness') }}",
        ],
        "description": "Get entity state or attribute"
    },
    "condition": {
        "templates": [
            "{% if states('light.kitchen') == 'on' %}...{% endif %}",
            "{% if is_state('light.kitchen', 'on') %}...{% endif %}",
            "{% if state_attr('light.kitchen', 'brightness') > 100 %}...{% endif %}",
        ],
        "description": "Conditional logic"
    },
    "loop": {
        "templates": [
            "{% for state in states.light %}{{ state.name }}{% endfor %}",
            "{% for entity in expand('group.all_lights') %}...{% endfor %}",
        ],
        "description": "Loop through entities"
    },
    "time": {
        "templates": [
            "{{ now() }}",
            "{{ now().strftime('%H:%M') }}",
            "{{ as_timestamp(now()) }}",
            "{{ today_at('19:00') }}",
        ],
        "description": "Time and date functions"
    },
    "math": {
        "templates": [
            "{{ (states('sensor.temp') | float) * 1.8 + 32 }}",
            "{{ states('sensor.value') | float | round(2) }}",
        ],
        "description": "Mathematical operations"
    },
    "filters": {
        "templates": [
            "{{ value | default(0) }}",
            "{{ value | float }}",
            "{{ value | int }}",
            "{{ value | round(2) }}",
            "{{ value | lower }}",
            "{{ value | upper }}",
            "{{ value | title }}",
        ],
        "description": "Common Jinja filters"
    },
}

# Common Jinja errors and solutions
JINJA_ERROR_PATTERNS = {
    "missing_quotes": {
        "pattern": r"states\((\w+\.\w+)\)",
        "message": "Entity ID should be in quotes",
        "solution": "Wrap entity_id in quotes",
        "example": "states(sensor.temp) → states('sensor.temp')"
    },
    "wrong_brackets": {
        "pattern": r"\{\{\s*\{",
        "message": "Too many opening brackets",
        "solution": "Use {{ for expressions, not {{{",
        "example": "{{{ value }}} → {{ value }}"
    },
    "missing_pipe": {
        "pattern": r"states\(['\"][\w\.]+['\"]\)\s*(float|int|round|default)",
        "message": "Missing pipe | for filter",
        "solution": "Use | before filter name",
        "example": "states('sensor.temp') float → states('sensor.temp') | float"
    },
}


class AIManager:
    """Class to handle AI operations with advanced natural language understanding."""

    def __init__(self, hass: HomeAssistant | None, data: dict) -> None:
        """Initialize AI manager."""
        self.hass = hass
        self.data = data

    def check_yaml(self, content: str) -> web.Response:
        """Check for YAML syntax errors and provide smart solutions."""
        syntax_errors = []
        best_practice_warnings = []

        # First check basic YAML syntax
        try:
            class HAYamlLoader(yaml.SafeLoader): pass
            def ha_constructor(loader, node): return loader.construct_scalar(node)
            tags = ['!include', '!include_dir_list', '!include_dir_named', '!include_dir_merge_list', '!include_dir_merge_named', '!secret', '!env_var', '!input']
            for tag in tags: HAYamlLoader.add_constructor(tag, ha_constructor)
            parsed = yaml.load(content, Loader=HAYamlLoader)
        except yaml.YAMLError as e:
            return json_response({
                "valid": False,
                "error": str(e),
                "type": "syntax_error",
                "suggestions": [
                    "Check for proper indentation (use 2 spaces, not tabs)",
                    "Ensure all quotes are properly closed",
                    "Verify that list items start with '-' followed by a space",
                    "Check for special characters that need quoting"
                ]
            })
        except Exception as e:
            return json_response({"valid": False, "error": str(e)})

        # Advanced validation - check for common mistakes and legacy syntax
        lines = content.split('\n')

        for line_num, line in enumerate(lines, 1):
            # Check for legacy service: syntax
            if re.search(YAML_ERROR_PATTERNS["legacy_service"]["pattern"], line):
                best_practice_warnings.append({
                    "line": line_num,
                    "type": "legacy_syntax",
                    "message": YAML_ERROR_PATTERNS["legacy_service"]["message"],
                    "solution": YAML_ERROR_PATTERNS["legacy_service"]["solution"],
                    "example": YAML_ERROR_PATTERNS["legacy_service"]["example"],
                    "original": line.strip()
                })

            # Check for old trigger platform: syntax
            if re.search(YAML_ERROR_PATTERNS["old_trigger_syntax"]["pattern"], line):
                best_practice_warnings.append({
                    "line": line_num,
                    "type": "legacy_trigger",
                    "message": YAML_ERROR_PATTERNS["old_trigger_syntax"]["message"],
                    "solution": YAML_ERROR_PATTERNS["old_trigger_syntax"]["solution"],
                    "example": YAML_ERROR_PATTERNS["old_trigger_syntax"]["example"],
                    "original": line.strip()
                })

            # Check for singular keys
            if re.match(r"^\s*trigger:\s*$", line):
                best_practice_warnings.append({
                    "line": line_num,
                    "type": "singular_key",
                    "message": YAML_ERROR_PATTERNS["singular_trigger"]["message"],
                    "solution": YAML_ERROR_PATTERNS["singular_trigger"]["solution"],
                    "example": YAML_ERROR_PATTERNS["singular_trigger"]["example"],
                    "original": line.strip()
                })

            if re.match(r"^\s*condition:\s*$", line):
                best_practice_warnings.append({
                    "line": line_num,
                    "type": "singular_key",
                    "message": YAML_ERROR_PATTERNS["singular_condition"]["message"],
                    "solution": YAML_ERROR_PATTERNS["singular_condition"]["solution"],
                    "example": YAML_ERROR_PATTERNS["singular_condition"]["example"],
                    "original": line.strip()
                })

            # Check for malformed entity_id
            entity_match = re.search(r"entity_id:\s+([^\s\n]+)", line)
            if entity_match:
                entity_id = entity_match.group(1)
                # Remove quotes if present
                entity_id = entity_id.strip('"\'')
                if '.' not in entity_id and not entity_id.startswith('['):
                    syntax_errors.append({
                        "line": line_num,
                        "type": "malformed_entity_id",
                        "message": f"Malformed entity_id: '{entity_id}'",
                        "solution": "Entity IDs must follow format: domain.entity_name",
                        "example": f"entity_id: light.{entity_id}",
                        "original": line.strip()
                    })

        # Check for missing automation id
        if isinstance(parsed, list):
            for idx, item in enumerate(parsed):
                if isinstance(item, dict) and 'alias' in item and 'id' not in item:
                    # Find the line with this alias
                    alias_value = item['alias']
                    for line_num, line in enumerate(lines, 1):
                        if f"alias: {alias_value}" in line or f'alias: "{alias_value}"' in line or f"alias: '{alias_value}'" in line:
                            best_practice_warnings.append({
                                "line": line_num,
                                "type": "missing_id",
                                "message": f"Automation '{alias_value}' missing unique 'id:' field",
                                "solution": YAML_ERROR_PATTERNS["missing_id"]["solution"],
                                "example": f"- id: '{int(time.time() * 1000)}'\n  alias: {alias_value}",
                                "original": line.strip()
                            })
                            break

        # Return results
        if syntax_errors:
            return json_response({
                "valid": False,
                "errors": syntax_errors,
                "error_count": len(syntax_errors),
                "message": f"Found {len(syntax_errors)} syntax error(s)"
            })

        if best_practice_warnings:
            return json_response({
                "valid": True,
                "warnings": best_practice_warnings,
                "warning_count": len(best_practice_warnings),
                "message": f"YAML is valid but found {len(best_practice_warnings)} best practice issue(s)"
            })

        return json_response({
            "valid": True,
            "message": "YAML is valid and follows best practices!"
        })

    def check_jinja(self, content: str) -> web.Response:
        """Check Jinja2 template syntax and provide intelligent suggestions."""
        errors = []
        suggestions = []

        lines = content.split('\n')

        for line_num, line in enumerate(lines, 1):
            # Check for missing quotes in states()
            if re.search(JINJA_ERROR_PATTERNS["missing_quotes"]["pattern"], line):
                errors.append({
                    "line": line_num,
                    "type": "syntax_error",
                    "message": JINJA_ERROR_PATTERNS["missing_quotes"]["message"],
                    "solution": JINJA_ERROR_PATTERNS["missing_quotes"]["solution"],
                    "example": JINJA_ERROR_PATTERNS["missing_quotes"]["example"],
                    "original": line.strip()
                })

            # Check for wrong brackets
            if re.search(JINJA_ERROR_PATTERNS["wrong_brackets"]["pattern"], line):
                errors.append({
                    "line": line_num,
                    "type": "syntax_error",
                    "message": JINJA_ERROR_PATTERNS["wrong_brackets"]["message"],
                    "solution": JINJA_ERROR_PATTERNS["wrong_brackets"]["solution"],
                    "example": JINJA_ERROR_PATTERNS["wrong_brackets"]["example"],
                    "original": line.strip()
                })

            # Check for missing pipe
            if re.search(JINJA_ERROR_PATTERNS["missing_pipe"]["pattern"], line):
                errors.append({
                    "line": line_num,
                    "type": "syntax_error",
                    "message": JINJA_ERROR_PATTERNS["missing_pipe"]["message"],
                    "solution": JINJA_ERROR_PATTERNS["missing_pipe"]["solution"],
                    "example": JINJA_ERROR_PATTERNS["missing_pipe"]["example"],
                    "original": line.strip()
                })

        # Provide helpful suggestions based on content
        if "states(" in content:
            suggestions.append({
                "type": "tip",
                "message": "Using states() function",
                "examples": JINJA_PATTERNS["state"]["templates"]
            })

        if "{% if" in content or "{% for" in content:
            suggestions.append({
                "type": "tip",
                "message": "Control structures detected",
                "examples": JINJA_PATTERNS["condition"]["templates"] if "{% if" in content else JINJA_PATTERNS["loop"]["templates"]
            })

        if "now()" in content or "timestamp" in content:
            suggestions.append({
                "type": "tip",
                "message": "Time functions available",
                "examples": JINJA_PATTERNS["time"]["templates"]
            })

        if errors:
            return json_response({
                "valid": False,
                "errors": errors,
                "suggestions": suggestions,
                "error_count": len(errors),
                "message": f"Found {len(errors)} error(s) in Jinja template"
            })

        return json_response({
            "valid": True,
            "suggestions": suggestions,
            "message": "Jinja template syntax looks good!",
            "tip": "Use {{ }} for expressions and {% %} for statements"
        })

    def _detect_domain(self, query: str) -> str:
        """Detect domain from natural language query using synonym mapping."""
        query_lower = query.lower()
        words = set(re.findall(r'\w+', query_lower))

        # Score each domain based on synonym matches
        domain_scores = {}
        for domain, synonyms in DOMAIN_SYNONYMS.items():
            score = 0
            for synonym in synonyms:
                synonym_words = synonym.split()
                if len(synonym_words) == 1:
                    if synonym in words:
                        score += 2
                else:
                    if synonym in query_lower:
                        score += 3
            if score > 0:
                domain_scores[domain] = score

        # Return highest scoring domain, default to light
        if domain_scores:
            return max(domain_scores, key=domain_scores.get)
        return "light"

    def _extract_area(self, query: str) -> str | None:
        """Extract area/room name from query (kitchen, bedroom, etc.)."""
        area_keywords = ["kitchen", "bedroom", "living room", "bathroom", "garage", "office",
                         "hallway", "basement", "attic", "dining room", "laundry", "porch",
                         "garden", "backyard", "frontyard", "front yard", "upstairs", "downstairs",
                         "balcony", "patio", "deck", "entryway", "foyer", "closet", "pantry",
                         "mudroom", "study", "den", "family room", "playroom", "nursery"]

        query_lower = query.lower()
        for area in area_keywords:
            if area in query_lower:
                return area
        return None

    def _find_best_entities(self, query: str, domain: str, limit: int = 1) -> list[str]:
        """Find best matching entities with improved scoring and area awareness."""
        if not self.hass:
            return [f"{domain}.your_device"]

        entities = []
        words = set(re.findall(r'\w+', query.lower()))
        area = self._extract_area(query)

        # Check for "all" keyword to return multiple entities
        find_all = any(word in query.lower() for word in ["all", "every", "entire"])

        for state in self.hass.states.async_all():
            if state.domain != domain:
                continue

            score = 0
            entity_lower = state.entity_id.lower()
            friendly_name = state.attributes.get("friendly_name", "").lower()

            # Area matching bonus
            if area:
                if area in entity_lower:
                    score += 10
                if area in friendly_name:
                    score += 10

            # Word matching with better scoring
            for w in words:
                if len(w) < 3:
                    continue
                # Exact entity_id part match
                entity_parts = entity_lower.split('.')[1].split('_')
                if w in entity_parts:
                    score += 5
                elif w in entity_lower:
                    score += 2

                # Friendly name word match
                friendly_words = friendly_name.split()
                if w in friendly_words:
                    score += 8
                elif w in friendly_name:
                    score += 3

            if score > 0:
                entities.append((state.entity_id, score))

        if not entities:
            return [f"{domain}.your_device"]

        # Sort by score and return top matches
        entities.sort(key=lambda x: x[1], reverse=True)

        if find_all and len(entities) > 1:
            # Return all entities with score > 50% of top score
            top_score = entities[0][1]
            threshold = top_score * 0.5
            return [e[0] for e in entities if e[1] >= threshold][:10]  # Max 10 entities

        return [e[0] for e in entities[:limit]]

    def _extract_conditions(self, query: str) -> list[dict]:
        """Extract conditions from natural language (if home, after dark, on weekdays, etc.)."""
        conditions = []
        query_lower = query.lower()

        # Person home/away detection
        if any(phrase in query_lower for phrase in ["if home", "when home", "if someone", "if anyone", "when someone", "when anyone"]):
            if self.hass:
                person_entities = [s.entity_id for s in self.hass.states.async_all() if s.domain == "person"]
                if person_entities:
                    conditions.append({
                        "condition": "state",
                        "entity_id": person_entities[0],
                        "state": "home"
                    })
        elif any(phrase in query_lower for phrase in ["if away", "when away", "if nobody", "if no one", "when nobody", "when no one"]):
            if self.hass:
                person_entities = [s.entity_id for s in self.hass.states.async_all() if s.domain == "person"]
                if person_entities:
                    conditions.append({
                        "condition": "state",
                        "entity_id": person_entities[0],
                        "state": "not_home"
                    })

        # Sun position detection
        if any(phrase in query_lower for phrase in ["after dark", "at night", "when dark", "if dark", "after sunset"]):
            conditions.append({
                "condition": "state",
                "entity_id": "sun.sun",
                "state": "below_horizon"
            })
        elif any(phrase in query_lower for phrase in ["during day", "when light", "if light", "in daylight", "after sunrise"]):
            conditions.append({
                "condition": "state",
                "entity_id": "sun.sun",
                "state": "above_horizon"
            })

        # Day of week detection
        if any(phrase in query_lower for phrase in ["on weekdays", "during weekdays", "weekday only", "weekdays only"]):
            conditions.append({
                "condition": "time",
                "weekday": ["mon", "tue", "wed", "thu", "fri"]
            })
        elif any(phrase in query_lower for phrase in ["on weekends", "during weekends", "weekend only", "weekends only"]):
            conditions.append({
                "condition": "time",
                "weekday": ["sat", "sun"]
            })

        # Temperature conditions
        temp_condition = re.search(r"(?:if|when)\s+temp(?:erature)?\s*(above|below|over|under|greater than|less than)\s*(\d+)", query_lower)
        if temp_condition:
            operator = temp_condition.group(1)
            value = int(temp_condition.group(2))
            above = operator in ["above", "over", "greater than"]

            if self.hass:
                temp_sensors = [s.entity_id for s in self.hass.states.async_all()
                               if s.domain == "sensor" and "temperature" in s.entity_id.lower()]
                if temp_sensors:
                    conditions.append({
                        "condition": "numeric_state",
                        "entity_id": temp_sensors[0],
                        "above" if above else "below": value
                    })

        return conditions

    def _extract_values(self, query: str, domain: str) -> dict:
        """Extract numeric values like brightness, temperature, position from query."""
        query_lower = query.lower()
        values = {}

        # Brightness percentage (for lights/fans)
        if domain in ["light", "fan"]:
            pct_match = re.search(r"(\d+)\s*(?:%|percent)", query_lower)
            if pct_match:
                values["brightness_pct"] = int(pct_match.group(1))

        # Temperature (for climate)
        if domain == "climate":
            temp_match = re.search(r"(?:set to |to )?(\d+)\s*(?:degrees?|deg|°|celsius|c\b|fahrenheit|f\b)", query_lower)
            if temp_match:
                values["temperature"] = int(temp_match.group(1))

            # HVAC mode
            if "heat" in query_lower and "cool" not in query_lower:
                values["hvac_mode"] = "heat"
            elif "cool" in query_lower or "ac" in query_lower:
                values["hvac_mode"] = "cool"
            elif "auto" in query_lower:
                values["hvac_mode"] = "auto"
            elif "off" in query_lower:
                values["hvac_mode"] = "off"

        # Cover position
        if domain == "cover":
            pos_match = re.search(r"(?:position|set to|open to)\s*(\d+)\s*(?:%|percent)?", query_lower)
            if pos_match:
                values["position"] = int(pos_match.group(1))

        # Fan speed
        if domain == "fan":
            speed_match = re.search(r"(?:speed|set to)\s*(\d+)(?:\s*%)?", query_lower)
            if speed_match:
                values["percentage"] = int(speed_match.group(1))

        # Media player volume
        if domain == "media_player":
            vol_match = re.search(r"volume\s*(?:to|at)?\s*(\d+)\s*(?:%|percent)?", query_lower)
            if vol_match:
                values["volume_level"] = int(vol_match.group(1)) / 100.0

        # Color temperature (kelvin)
        if domain == "light":
            kelvin_match = re.search(r"(\d+)\s*(?:k|kelvin)", query_lower)
            if kelvin_match:
                values["kelvin"] = int(kelvin_match.group(1))

        # RGB color detection
        if domain == "light":
            color_map = {
                "red": [255, 0, 0],
                "green": [0, 255, 0],
                "blue": [0, 0, 255],
                "white": [255, 255, 255],
                "yellow": [255, 255, 0],
                "purple": [128, 0, 128],
                "orange": [255, 165, 0],
                "pink": [255, 192, 203],
                "cyan": [0, 255, 255],
                "magenta": [255, 0, 255],
                "warm white": [255, 244, 229],
                "cool white": [201, 226, 255],
            }
            for color_name, rgb in color_map.items():
                if color_name in query_lower:
                    values["rgb_color"] = rgb
                    break

        return values

    def _detect_additional_actions(self, query: str) -> list[dict]:
        """Detect additional actions like notifications, delays, etc."""
        actions = []
        query_lower = query.lower()

        # Notification detection
        notify_patterns = [
            r"(?:send|notify|alert|message|tell)\s+(?:me|us|notification)\s+[\"']?(.+?)[\"']?$",
            r"(?:send|notify)\s+[\"'](.+?)[\"']",
            r"notification\s+[\"'](.+?)[\"']"
        ]

        for pattern in notify_patterns:
            match = re.search(pattern, query_lower)
            if match:
                message = match.group(1).strip()
                actions.append({
                    "type": "notify",
                    "message": message
                })
                break

        # Delay detection
        delay_match = re.search(r"(?:wait|delay|after)\s+(\d+)\s*(second|seconds|minute|minutes|hour|hours)", query_lower)
        if delay_match:
            amount = int(delay_match.group(1))
            unit = delay_match.group(2)

            if "minute" in unit:
                delay_time = f"00:{amount:02d}:00"
            elif "hour" in unit:
                delay_time = f"{amount:02d}:00:00"
            else:  # seconds
                delay_time = f"00:00:{amount:02d}"

            actions.append({
                "type": "delay",
                "duration": delay_time
            })

        return actions

    def _detect_trigger_type(self, query: str) -> dict:
        """Detect trigger type from query (time, state, numeric_state, etc.)."""
        query_lower = query.lower()

        # Motion sensor triggers
        if any(phrase in query_lower for phrase in ["motion detected", "motion sensor", "when motion", "if motion", "detects motion"]):
            if self.hass:
                motion_sensors = [s.entity_id for s in self.hass.states.async_all()
                                 if s.domain == "binary_sensor" and "motion" in s.entity_id.lower()]
                if motion_sensors:
                    return {"type": "state", "entity_id": motion_sensors[0], "to": "on"}

        # Door/window sensor triggers
        if any(phrase in query_lower for phrase in ["door opens", "door closes", "window opens", "window closes"]):
            state = "on" if "opens" in query_lower else "off"
            if self.hass:
                door_sensors = [s.entity_id for s in self.hass.states.async_all()
                               if s.domain == "binary_sensor" and ("door" in s.entity_id.lower() or "window" in s.entity_id.lower())]
                if door_sensors:
                    return {"type": "state", "entity_id": door_sensors[0], "to": state}

        # Numeric state triggers (temperature, humidity, etc.)
        numeric_trigger = re.search(r"(?:when|if)\s+(\w+)\s*(above|below|over|under|greater than|less than)\s*(\d+)", query_lower)
        if numeric_trigger:
            sensor_type = numeric_trigger.group(1)
            operator = numeric_trigger.group(2)
            value = int(numeric_trigger.group(3))
            above = operator in ["above", "over", "greater than"]

            if self.hass:
                sensors = [s.entity_id for s in self.hass.states.async_all()
                          if s.domain == "sensor" and sensor_type in s.entity_id.lower()]
                if sensors:
                    return {"type": "numeric_state", "entity_id": sensors[0],
                           "above" if above else "below": value}

        # State change triggers (generic)
        state_trigger = re.search(r"(?:when|if)\s+(.+?)\s+(?:turns?|becomes?)\s+(on|off|home|away)", query_lower)
        if state_trigger and self.hass:
            entity_name = state_trigger.group(1).strip()
            to_state = state_trigger.group(2)
            # Try to find matching entity
            for state in self.hass.states.async_all():
                if entity_name in state.entity_id.lower() or entity_name in state.attributes.get("friendly_name", "").lower():
                    return {"type": "state", "entity_id": state.entity_id, "to": to_state}

        # Time trigger patterns
        # 1. Matches "at 7:00pm", "at 7:30 pm"
        # 2. Matches "at 7pm", "at 7 am"
        # 3. Matches "7:00pm", "7:30 pm"
        # 4. Matches "7pm", "7am"
        time_patterns = [
            r"\bat\s+(\d{1,2}:\d{2}(?:\s*(?:am|pm))?)",
            r"\bat\s+(\d{1,2}(?:\s*(?:am|pm)))",
            r"(?<!\d)(\d{1,2}:\d{2}(?:\s*(?:am|pm))?)",
            r"(?<!\d)(\d{1,2}(?:\s*(?:am|pm)))"
        ]

        for pattern in time_patterns:
            times = re.findall(pattern, query_lower)
            if times:
                formatted_times = []
                for t in times:
                    t = t.strip().lower()
                    is_pm = "pm" in t
                    has_minutes = ":" in t
                    
                    clean_t = t.replace("am", "").replace("pm", "").strip()
                    
                    try:
                        if has_minutes:
                            hour_str, minute_str = clean_t.split(":")
                            hour = int(hour_str)
                            minute = int(minute_str)
                        else:
                            hour = int(clean_t)
                            minute = 0

                        # 12-hour clock conversion
                        if "am" in t or "pm" in t:
                            if is_pm and hour != 12:
                                hour += 12
                            elif not is_pm and hour == 12:
                                hour = 0
                        
                        formatted_times.append(f"{hour:02d}:{minute:02d}:00")
                    except ValueError:
                        continue

                if formatted_times:
                    return {"type": "time", "times": formatted_times}

        # Default to time trigger
        return {"type": "time", "times": ["12:00:00"]}

    def _extract_automation_name(self, query: str) -> str:
        """Extract automation name from query."""
        query_lower = query.lower()

        # Look for "called", "named", "name it"
        name_patterns = [
            r"(?:called|named|name it|call it)\s+[\"']?([^\"']+)[\"']?",
            r"create\s+(?:an?\s+)?automation\s+[\"']?([^\"']+)[\"']?",
        ]

        for pattern in name_patterns:
            match = re.search(pattern, query_lower)
            if match:
                return match.group(1).strip().title()

        # Generate default name
        domain = self._detect_domain(query)
        area = self._extract_area(query)
        action = "Control"

        if "turn on" in query_lower:
            action = "Turn On"
        elif "turn off" in query_lower:
            action = "Turn Off"
        elif "toggle" in query_lower:
            action = "Toggle"

        if area:
            return f"{area.title()} {domain.title()} {action}"

        return f"New {domain.title()} Automation"

    async def query(self, query: str | None, current_file: str | None, file_content: str | None) -> web.Response:
        """Process AI query with advanced natural language understanding."""
        try:
            if not query:
                return json_message("Query is empty", status_code=400)

            query_lower = query.lower()
            settings = self.data.get("settings", {})
            provider = settings.get("aiProvider", "local")
            model = settings.get("aiModel")

            # Cloud AI providers
            if provider in ["gemini", "openai"]:
                system = """You are the Blueprint Studio AI Copilot, a Senior Home Assistant Configuration Expert.

CRITICAL RULES (2024+ Best Practices):
1. Use modern plural keys: triggers:, conditions:, actions:
2. Use modern syntax: - trigger: platform, - action: domain.service
3. Every automation MUST have id: 'XXXXXXXXXXXXX' (13-digit timestamp)
4. Include metadata: {} in all actions
5. Use conditions: [] if no conditions
6. Use mode: single or restart
7. NEVER use legacy service: key - always use action:

Example modern automation:
```yaml
- id: '1738012345678'
  alias: Kitchen Light Control
  triggers:
  - trigger: time
    at: '19:00:00'
  conditions: []
  actions:
  - action: light.turn_on
    metadata: {}
    target:
      entity_id: light.kitchen
    data:
      brightness_pct: 80
  mode: single
```"""
                context = f"Current file:\n```yaml\n{file_content}\n```\n" if file_content else ""
                prompt = f"{context}\nUser request: {query}"

                if provider == "gemini":
                    key = settings.get("geminiApiKey")
                    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model or 'gemini-2.0-flash-exp'}:generateContent?key={key}"
                    async with aiohttp.ClientSession() as s:
                        async with s.post(url, json={"contents": [{"parts": [{"text": f"{system}\n\n{prompt}"}]}]}) as r:
                            if r.status == 200:
                                res = await r.json()
                                return json_response({"success": True, "response": res['candidates'][0]['content']['parts'][0]['text']})
                            return json_message(f"Gemini Error: {r.status}", status_code=r.status)
                else:
                    key = settings.get("openaiApiKey")
                    url = "https://api.openai.com/v1/chat/completions"
                    async with aiohttp.ClientSession() as s:
                        async with s.post(url, headers={"Authorization": f"Bearer {key}"}, json={
                            "model": model or "gpt-4o",
                            "messages": [
                                {"role": "system", "content": system},
                                {"role": "user", "content": prompt}
                            ]
                        }) as r:
                            if r.status == 200:
                                res = await r.json()
                                return json_response({"success": True, "response": res['choices'][0]['message']['content']})
                            return json_message(f"OpenAI Error: {r.status}", status_code=r.status)

            # ===== ADVANCED LOCAL LOGIC ENGINE =====

            # 1. Intent Detection: Analysis/Fix
            if any(word in query_lower for word in ["check", "fix", "analyze", "validate", "error", "debug", "lint"]):
                if not file_content:
                    return json_response({"success": False, "response": "Please open a file to check for errors."})
                
                # Determine if we should check YAML or Jinja
                is_jinja = "jinja" in query_lower or (current_file and current_file.endswith((".jinja", ".jinja2", ".j2")))
                
                if is_jinja:
                    check_result = self.check_jinja(file_content)
                    result_data = check_result._body if hasattr(check_result, '_body') else "{}"
                    import json
                    try:
                        res = json.loads(result_data)
                        if res.get("valid"):
                            return json_response({"success": True, "response": f"✅ **Jinja Analysis Passed**\n\n{res.get('message')}\n\n**Tip:** {res.get('tip')}"})
                        else:
                            errors = "\n".join([f"- Line {e['line']}: {e['message']} (Fix: `{e['solution']}`)" for e in res.get('errors', [])])
                            return json_response({"success": True, "response": f"❌ **Found {res.get('error_count')} Jinja Errors**\n\n{errors}"})
                    except:
                        return check_result

                else:
                    check_result = self.check_yaml(file_content)
                    result_data = check_result._body if hasattr(check_result, '_body') else "{}"
                    import json
                    try:
                        res = json.loads(result_data)
                        if res.get("valid"):
                            msg = f"✅ **YAML Analysis Passed**\n\n{res.get('message')}"
                            if res.get("warnings"):
                                warnings = "\n".join([f"- Line {w['line']}: {w['message']}" for w in res.get('warnings', [])])
                                msg += f"\n\n**Warnings:**\n{warnings}"
                            return json_response({"success": True, "response": msg})
                        else:
                            errors = "\n".join([f"- Line {e['line']}: {e['message']} (Fix: `{e['solution']}`)" for e in res.get('errors', [])])
                            return json_response({"success": True, "response": f"❌ **Found {res.get('error_count')} YAML Errors**\n\n{errors}"})
                    except:
                        return check_result

            # 2. Intent Detection: Generation (Automation/Script/Scene)
            config_type = "automation"
            if "scene" in query_lower:
                config_type = "scene"
            elif "script" in query_lower:
                config_type = "script"

            domain = self._detect_domain(query)
            entities = self._find_best_entities(query, domain, limit=5)
            primary_entity = entities[0]
            values = self._extract_values(query, domain)
            conditions = self._extract_conditions(query)
            trigger_info = self._detect_trigger_type(query)
            name = self._extract_automation_name(query)

            is_list = current_file and any(f in current_file for f in ["automations.yaml", "scripts.yaml", "scenes.yaml"])
            ind = "" if is_list else "  "
            hdr = f"{config_type}:\n  " if not is_list else ""
            uid = str(int(time.time() * 1000))

            actions = DOMAIN_ACTIONS.get(domain, {"on": "turn_on", "off": "turn_off"})

            # ===== SCENE GENERATION =====
            if config_type == "scene":
                # Detect scene type (morning, evening, movie, etc.)
                scene_type = None
                if any(word in query_lower for word in ["morning", "wake", "breakfast"]):
                    scene_type = "morning"
                elif any(word in query_lower for word in ["evening", "night", "bedtime", "sleep"]):
                    scene_type = "evening"
                elif any(word in query_lower for word in ["movie", "cinema", "tv", "watch"]):
                    scene_type = "movie"
                elif any(word in query_lower for word in ["reading", "read", "study"]):
                    scene_type = "reading"
                elif any(word in query_lower for word in ["romantic", "dinner", "date"]):
                    scene_type = "romantic"
                elif any(word in query_lower for word in ["party", "celebration"]):
                    scene_type = "party"
                elif any(word in query_lower for word in ["relax", "chill"]):
                    scene_type = "relax"

                # Build entity states with full attribute support
                entity_states = {}

                # Apply scene-specific defaults
                scene_defaults = self._get_scene_defaults(scene_type)

                for ent in entities[:10]:  # Increased from 5 to 10
                    ent_domain = ent.split('.')[0]

                    if ent_domain == "light":
                        state_config = ["state: on"]

                        # Apply brightness
                        if "brightness_pct" in values:
                            state_config.append(f"brightness_pct: {values['brightness_pct']}")
                        elif scene_type and "brightness" in scene_defaults:
                            state_config.append(f"brightness_pct: {scene_defaults['brightness']}")

                        # Apply color
                        if "rgb_color" in values:
                            state_config.append(f"rgb_color: {values['rgb_color']}")
                        elif scene_type and "color" in scene_defaults:
                            state_config.append(f"rgb_color: {scene_defaults['color']}")

                        # Apply color temperature
                        if "kelvin" in values:
                            state_config.append(f"kelvin: {values['kelvin']}")
                        elif scene_type and "kelvin" in scene_defaults:
                            state_config.append(f"kelvin: {scene_defaults['kelvin']}")

                        # Apply transition
                        if "transition" in query_lower:
                            transition_match = re.search(r"transition\s*(?:of|for)?\s*(\d+)", query_lower)
                            if transition_match:
                                state_config.append(f"transition: {transition_match.group(1)}")
                            else:
                                state_config.append("transition: 2")
                        elif scene_type:
                            state_config.append("transition: 1")

                        entity_states[ent] = "\n" + "\n".join([f"{ind}    {cfg}" for cfg in state_config])

                    elif ent_domain == "climate":
                        state_config = []
                        if "temperature" in values:
                            state_config.append(f"temperature: {values['temperature']}")
                        if "hvac_mode" in values:
                            state_config.append(f"hvac_mode: {values['hvac_mode']}")

                        if state_config:
                            entity_states[ent] = "\n" + "\n".join([f"{ind}    {cfg}" for cfg in state_config])
                        else:
                            entity_states[ent] = "heat"

                    elif ent_domain == "cover":
                        if "position" in values:
                            entity_states[ent] = f"\n{ind}    state: open\n{ind}    position: {values['position']}"
                        else:
                            entity_states[ent] = "open" if "open" in query_lower else "closed"

                    elif ent_domain == "media_player":
                        if "volume_level" in values:
                            entity_states[ent] = f"\n{ind}    state: on\n{ind}    volume_level: {values['volume_level']}"
                        else:
                            entity_states[ent] = "on"

                    else:
                        # Default: just turn on/off
                        entity_states[ent] = "on" if "on" in query_lower or "activate" in query_lower else "off"

                scene_name = name.lower().replace(' ', '_')
                entities_yaml = "\n".join([f"{ind}    {ent}:{' ' + state if isinstance(state, str) else state}" for ent, state in entity_states.items()])

                # Add scene description with icon
                icon = self._get_scene_icon(scene_type, query_lower)
                description = self._get_scene_description(scene_type, name)

                code = f"""{hdr}{scene_name}:
{ind}  name: {name}
{ind}  icon: {icon}
{ind}  entities:
{entities_yaml}"""

                return json_response({"success": True, "response": f"Generated Scene:\n\n```yaml\n{code}\n```\n\n💡 **Tip:** Activate with `scene.turn_on` or via UI"})

            # ===== SCRIPT GENERATION =====
            if config_type == "script":
                # Detect if it's a multi-step script
                multi_step = any(word in query_lower for word in ["then", "after", "sequence", "followed by", "next", "and then"])

                script_name = name.lower().replace(' ', '_')

                # Build sequence
                sequence_steps = []

                # Step 1: Primary action
                action_name = actions.get("on" if "on" in query_lower or "turn on" in query_lower else "off", "turn_on")
                data_block = self._build_data_block(values, domain, ind)
                target_yaml = self._build_target_yaml(entities, ind)

                # Check if turning on multiple entities
                if len(entities) > 1 and any(word in query_lower for word in ["all", "every"]):
                    # Parallel execution for multiple entities
                    for ent in entities[:5]:
                        sequence_steps.append(f"""{ind}  - action: {domain}.{action_name}
{ind}    metadata: {{}}
{ind}    target:
{ind}      entity_id: {ent}{data_block}""")
                else:
                    sequence_steps.append(f"""{ind}  - action: {domain}.{action_name}
{ind}    metadata: {{}}
{ind}    {target_yaml}{data_block}""")

                # Add delay if specified
                additional_actions = self._detect_additional_actions(query_lower)
                for add_action in additional_actions:
                    if add_action["type"] == "delay":
                        duration_parts = add_action['duration'].split(':')
                        hours, minutes, seconds = int(duration_parts[0]), int(duration_parts[1]), int(duration_parts[2])
                        sequence_steps.append(f"""{ind}  - delay:
{ind}      hours: {hours}
{ind}      minutes: {minutes}
{ind}      seconds: {seconds}""")
                    elif add_action["type"] == "notify":
                        sequence_steps.append(f"""{ind}  - action: notify.notify
{ind}    metadata: {{}}
{ind}    data:
{ind}      message: "{add_action['message']}" """)

                # Detect "then turn off" pattern
                if multi_step and any(phrase in query_lower for phrase in ["then off", "then turn off", "then close"]):
                    off_action = actions.get("off", "turn_off")
                    sequence_steps.append(f"""{ind}  - action: {domain}.{off_action}
{ind}    metadata: {{}}
{ind}    {target_yaml}
{ind}    data: {{}}""")

                # Build final script with mode and description
                sequence_yaml = "\n".join(sequence_steps)

                # Detect script mode
                mode = "single"
                if any(word in query_lower for word in ["parallel", "simultaneously", "at once"]):
                    mode = "parallel"
                elif any(word in query_lower for word in ["restart", "interrupt"]):
                    mode = "restart"
                elif any(word in query_lower for word in ["queue", "queued"]):
                    mode = "queued"

                # Add fields based on complexity
                fields_yaml = ""
                if any(word in query_lower for word in ["variable", "input", "parameter"]):
                    fields_yaml = f"""
{ind}  fields:
{ind}    brightness:
{ind}      description: Brightness level
{ind}      example: 80"""

                code = f"""{hdr}{script_name}:
{ind}  alias: {name}
{ind}  description: {self._get_script_description(query_lower)}
{ind}  mode: {mode}{fields_yaml}
{ind}  sequence:
{sequence_yaml}"""

                return json_response({"success": True, "response": f"Generated Script:\n\n```yaml\n{code}\n```\n\n💡 **Tip:** Call with `script.{script_name}` or via UI"})

            # ===== AUTOMATION GENERATION =====
            multi_intent = ("on" in query_lower and "off" in query_lower) or ("open" in query_lower and "close" in query_lower)

            if multi_intent and trigger_info["type"] == "time" and len(trigger_info["times"]) >= 2:
                code = self._generate_multi_intent_automation(
                    uid, name, domain, actions, entities, trigger_info["times"], values, conditions, ind, hdr
                )
            else:
                code = self._generate_single_intent_automation(
                    uid, name, domain, actions, entities, trigger_info, values, conditions, ind, hdr, query_lower
                )

            return json_response({"success": True, "response": f"Generated Modern Automation:\n\n```yaml\n{code}\n```"})

        except Exception as e:
            _LOGGER.error(f"AI Error: {e}", exc_info=True)
            return json_message(str(e), status_code=500)

    def _build_data_block(self, values: dict, domain: str, ind: str) -> str:
        """Build data block from extracted values."""
        if not values:
            return f"\n{ind}    data: {{}}"

        data_lines = []
        for key, value in values.items():
            if isinstance(value, list):
                data_lines.append(f"{ind}      {key}: {value}")
            else:
                data_lines.append(f"{ind}      {key}: {value}")

        if data_lines:
            return f"\n{ind}    data:\n" + "\n".join(data_lines)
        return f"\n{ind}    data: {{}}"

    def _generate_multi_intent_automation(self, uid, name, domain, actions, entities, times, values, conditions, ind, hdr):
        """Generate automation with multiple intents (on/off at different times)."""
        on_data = self._build_data_block(values, domain, ind)
        target_yaml = self._build_target_yaml(entities, ind)

        triggers_yaml = f"""{ind}  triggers:
{ind}  - trigger: time
{ind}    at: '{times[0]}'
{ind}    id: 'on'
{ind}  - trigger: time
{ind}    at: '{times[1]}'
{ind}    id: 'off'"""

        conditions_yaml = self._build_conditions_yaml(conditions, ind)

        actions_yaml = f"""{ind}  actions:
{ind}  - choose:
{ind}    - conditions:
{ind}      - condition: trigger
{ind}        id: 'on'
{ind}      sequence:
{ind}      - action: {domain}.{actions['on']}
{ind}        metadata: {{}}
{ind}        {target_yaml}{on_data}
{ind}    - conditions:
{ind}      - condition: trigger
{ind}        id: 'off'
{ind}      sequence:
{ind}      - action: {domain}.{actions['off']}
{ind}        metadata: {{}}
{ind}        {target_yaml}
{ind}        data: {{}}"""

        return f"""{hdr}- id: '{uid}'
{ind}  alias: {name}
{ind}  description: Multi-intent automation
{triggers_yaml}
{conditions_yaml}
{actions_yaml}
{ind}  mode: single"""

    def _generate_single_intent_automation(self, uid, name, domain, actions, entities, trigger_info, values, conditions, ind, hdr, query_lower):
        """Generate single intent automation."""
        action_type = "on"
        if "off" in query_lower or "close" in query_lower:
            action_type = "off"

        action_name = actions.get(action_type, "turn_on")

        # Build triggers based on type
        if trigger_info["type"] == "time":
            time_val = trigger_info["times"][0] if trigger_info["times"] else "12:00:00"
            triggers_yaml = f"""{ind}  triggers:
{ind}  - trigger: time
{ind}    at: '{time_val}'"""
        elif trigger_info["type"] == "state":
            triggers_yaml = f"""{ind}  triggers:
{ind}  - trigger: state
{ind}    entity_id: {trigger_info['entity_id']}
{ind}    to: '{trigger_info['to']}'"""
        elif trigger_info["type"] == "numeric_state":
            threshold_key = "above" if "above" in trigger_info else "below"
            threshold_val = trigger_info[threshold_key]
            triggers_yaml = f"""{ind}  triggers:
{ind}  - trigger: numeric_state
{ind}    entity_id: {trigger_info['entity_id']}
{ind}    {threshold_key}: {threshold_val}"""
        else:
            triggers_yaml = f"""{ind}  triggers:
{ind}  - trigger: state
{ind}    entity_id: binary_sensor.motion_sensor
{ind}    to: 'on'"""

        conditions_yaml = self._build_conditions_yaml(conditions, ind)
        data_block = self._build_data_block(values, domain, ind)
        target_yaml = self._build_target_yaml(entities, ind)

        # Check for additional actions (notifications, delays)
        additional_actions = self._detect_additional_actions(query_lower)

        # Build main action
        actions_yaml_lines = [f"{ind}  actions:"]
        actions_yaml_lines.append(f"{ind}  - action: {domain}.{action_name}")
        actions_yaml_lines.append(f"{ind}    metadata: {{}}")
        actions_yaml_lines.append(f"{ind}    {target_yaml}{data_block}")

        # Add additional actions
        for add_action in additional_actions:
            if add_action["type"] == "notify":
                actions_yaml_lines.append(f"{ind}  - action: notify.notify")
                actions_yaml_lines.append(f"{ind}    metadata: {{}}")
                actions_yaml_lines.append(f"{ind}    data:")
                actions_yaml_lines.append(f"{ind}      message: \"{add_action['message']}\"")
            elif add_action["type"] == "delay":
                actions_yaml_lines.append(f"{ind}  - delay:")
                actions_yaml_lines.append(f"{ind}      hours: 0")
                actions_yaml_lines.append(f"{ind}      minutes: 0")
                actions_yaml_lines.append(f"{ind}      seconds: {add_action['duration'].split(':')[-1]}")

        actions_yaml = "\n".join(actions_yaml_lines)

        return f"""{hdr}- id: '{uid}'
{ind}  alias: {name}
{ind}  description: Automated control
{triggers_yaml}
{conditions_yaml}
{actions_yaml}
{ind}  mode: single"""

    def _build_conditions_yaml(self, conditions: list[dict], ind: str) -> str:
        """Build conditions YAML block."""
        if not conditions:
            return f"{ind}  conditions: []"

        cond_lines = [f"{ind}  conditions:"]
        for cond in conditions:
            if cond.get("condition") == "state":
                cond_lines.append(f"{ind}  - condition: state")
                cond_lines.append(f"{ind}    entity_id: {cond['entity_id']}")
                cond_lines.append(f"{ind}    state: '{cond['state']}'")
            elif cond.get("condition") == "time":
                cond_lines.append(f"{ind}  - condition: time")
                if "weekday" in cond:
                    cond_lines.append(f"{ind}    weekday:")
                    for day in cond["weekday"]:
                        cond_lines.append(f"{ind}    - {day}")

        return "\n".join(cond_lines)

    def _build_target_yaml(self, entities: list[str], ind: str) -> str:
        """Build target YAML (single entity or multiple)."""
        if len(entities) == 1:
            return f"target:\n{ind}          entity_id: {entities[0]}"
        else:
            entity_list = "\n".join([f"{ind}          - {ent}" for ent in entities])
            return f"target:\n{ind}          entity_id:\n{entity_list}"

    def _get_scene_defaults(self, scene_type: str | None) -> dict:
        """Get default values for different scene types."""
        scene_presets = {
            "morning": {
                "brightness": 100,
                "kelvin": 4000,  # Cool white
                "description": "Energizing morning ambiance"
            },
            "evening": {
                "brightness": 40,
                "kelvin": 2700,  # Warm white
                "color": [255, 147, 41],  # Warm orange
                "description": "Relaxing evening atmosphere"
            },
            "movie": {
                "brightness": 10,
                "color": [0, 0, 100],  # Dim blue
                "description": "Perfect for watching movies"
            },
            "reading": {
                "brightness": 80,
                "kelvin": 4000,  # Cool white for reading
                "description": "Comfortable reading light"
            },
            "romantic": {
                "brightness": 20,
                "color": [255, 0, 100],  # Soft pink/red
                "description": "Romantic mood lighting"
            },
            "party": {
                "brightness": 100,
                "color": [255, 0, 255],  # Vibrant magenta
                "description": "Energetic party atmosphere"
            },
            "relax": {
                "brightness": 50,
                "kelvin": 2700,  # Warm
                "description": "Calm and relaxing environment"
            }
        }
        return scene_presets.get(scene_type, {})

    def _get_scene_icon(self, scene_type: str | None, query: str) -> str:
        """Get appropriate icon for scene."""
        icon_map = {
            "morning": "mdi:weather-sunny",
            "evening": "mdi:weather-night",
            "movie": "mdi:movie",
            "reading": "mdi:book-open",
            "romantic": "mdi:heart",
            "party": "mdi:party-popper",
            "relax": "mdi:sofa",
        }

        if scene_type and scene_type in icon_map:
            return icon_map[scene_type]

        # Fallback based on keywords
        if any(word in query for word in ["bright", "day"]):
            return "mdi:lightbulb-on"
        elif any(word in query for word in ["dim", "dark"]):
            return "mdi:lightbulb-outline"
        elif any(word in query for word in ["work", "office"]):
            return "mdi:desk"
        elif any(word in query for word in ["sleep", "bed"]):
            return "mdi:sleep"

        return "mdi:lightbulb-group"

    def _get_scene_description(self, scene_type: str | None, name: str) -> str:
        """Get scene description."""
        if scene_type:
            defaults = self._get_scene_defaults(scene_type)
            return defaults.get("description", f"{name} scene")
        return f"Custom {name.lower()} scene"

    def _get_script_description(self, query: str) -> str:
        """Generate intelligent script description."""
        if "turn on" in query or "activate" in query:
            return "Activates devices with configured settings"
        elif "turn off" in query or "deactivate" in query:
            return "Deactivates specified devices"
        elif "toggle" in query:
            return "Toggles device states"
        elif "sequence" in query or "then" in query:
            return "Executes a sequence of actions"
        elif "notification" in query or "notify" in query:
            return "Sends notifications and controls devices"
        elif "climate" in query or "temperature" in query:
            return "Controls climate and temperature settings"
        else:
            return "Custom automation script"
