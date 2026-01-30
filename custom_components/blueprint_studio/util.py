"""Utility functions for Blueprint Studio."""
from __future__ import annotations

import logging
from pathlib import Path
from typing import Any

from aiohttp import web

_LOGGER = logging.getLogger(__name__)

def json_response(data: Any, status_code: int = 200) -> web.Response:
    """Return a JSON response."""
    return web.json_response(data, status=status_code)

def json_message(message: str, success: bool = False, status_code: int = 200) -> web.Response:
    """Return a JSON message response."""
    return web.json_response({"success": success, "message": message}, status=status_code)

def is_path_safe(config_dir: Path, path: str) -> bool:
    """Check if the path is safe (no path traversal)."""
    try:
        full_path = (config_dir / path.lstrip("/")).resolve()
        return full_path.is_relative_to(config_dir)
    except (ValueError, OSError):
        return False

def get_safe_path(config_dir: Path, path: str) -> Path | None:
    """Get a safe, resolved path within config_dir."""
    if not is_path_safe(config_dir, path):
        return None
    return (config_dir / path.lstrip("/")).resolve()
