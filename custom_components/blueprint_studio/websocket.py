"""WebSocket API for Blueprint Studio."""
from __future__ import annotations

import logging
import asyncio
import time
from typing import Any
import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

_LOGGER = logging.getLogger(__name__)

@callback
def async_register_websockets(hass: HomeAssistant):
    """Register websocket commands."""
    _LOGGER.debug("Registering Blueprint Studio websocket commands")
    websocket_api.async_register_command(hass, websocket_subscribe_updates)
    
    # Start filesystem watcher
    async def start_watcher():
        if "blueprint_studio_watcher" not in hass.data:
            _LOGGER.debug("Starting Blueprint Studio filesystem watcher")
            hass.data["blueprint_studio_watcher"] = hass.async_create_task(
                async_watch_filesystem(hass)
            )

    # If HA is already running, start immediately
    from homeassistant.core import CoreState
    if hass.state == CoreState.running:
        hass.async_create_task(start_watcher())
    else:
        from homeassistant.const import EVENT_HOMEASSISTANT_STARTED
        hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STARTED, lambda _: hass.async_create_task(start_watcher()))

async def async_watch_filesystem(hass: HomeAssistant):
    """Background task to watch for filesystem changes."""
    import time
    # Local changes fire immediately via FileManager
    
    try:
        while True:
            # We fire a heartbeat/check event every 10 seconds for external changes
            await asyncio.sleep(10)
            
            hass.bus.async_fire("blueprint_studio_update", {
                "action": "poll",
                "timestamp": time.time()
            })
    except asyncio.CancelledError:
        _LOGGER.debug("Blueprint Studio filesystem watcher stopped")
    except Exception as e:
        _LOGGER.error("Error in Blueprint Studio watcher: %s", e)

@websocket_api.require_admin
@websocket_api.async_response
@websocket_api.websocket_command({
    vol.Required("type"): "blueprint_studio/subscribe_updates",
})
async def websocket_subscribe_updates(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]):
    """Subscribe to Blueprint Studio updates."""
    
    @callback
    def forward_update(event):
        """Forward custom event to websocket."""
        connection.send_message(websocket_api.event_message(msg["id"], event.data))

    # Standard subscription pattern
    connection.subscriptions[msg["id"]] = hass.bus.async_listen(
        "blueprint_studio_update", forward_update
    )
    
    connection.send_result(msg["id"])
