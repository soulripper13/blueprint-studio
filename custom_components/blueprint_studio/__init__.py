"""The Blueprint Studio integration."""
from __future__ import annotations

import base64
import io
import logging
import os
import shutil
import zipfile
from pathlib import Path
from typing import Any

import yaml
from aiohttp import web

from homeassistant.components import frontend
from homeassistant.components.http import HomeAssistantView, StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import DOMAIN, NAME

_LOGGER = logging.getLogger(__name__)


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Set up the Blueprint Studio component."""
    hass.data.setdefault(DOMAIN, {})
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Blueprint Studio from a config entry."""
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = {}

    config_dir = Path(hass.config.config_dir)
    hass.http.register_view(BlueprintStudioApiView(config_dir))

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


class BlueprintStudioApiView(HomeAssistantView):
    """View to handle API requests for Blueprint Studio."""

    url = f"/api/{DOMAIN}"
    name = f"api:{DOMAIN}"
    requires_auth = True

    # File extensions allowed for editing
    ALLOWED_EXTENSIONS = {
        ".yaml", ".yml", ".json", ".py", ".js", ".css", ".html", ".txt",
        ".md", ".conf", ".cfg", ".ini", ".sh", ".log",
    }

    # Directories/patterns to exclude
    EXCLUDED_PATTERNS = {
        "__pycache__",
        ".git",
        ".cache",
        "deps",
        "tts",
        ".storage",
    }

    # Protected paths that cannot be deleted
    PROTECTED_PATHS = {
        "configuration.yaml",
        "secrets.yaml",
        "home-assistant.log",
        "custom_components",
    }

    def __init__(self, config_dir: Path) -> None:
        """Initialize the view."""
        self.config_dir = config_dir.resolve()

    def _is_path_safe(self, path: str) -> bool:
        """Check if the path is safe (no path traversal)."""
        try:
            full_path = (self.config_dir / path.lstrip("/")).resolve()
            return full_path.is_relative_to(self.config_dir)
        except (ValueError, OSError):
            return False

    def _get_safe_path(self, path: str) -> Path | None:
        """Get a safe, resolved path within config_dir."""
        if not self._is_path_safe(path):
            return None
        return (self.config_dir / path.lstrip("/")).resolve()

    def _is_protected(self, path: str) -> bool:
        """Check if path is protected from deletion."""
        path_parts = path.strip("/").split("/")
        if path_parts[0] in self.PROTECTED_PATHS:
            return True
        return path.strip("/") in self.PROTECTED_PATHS

    async def get(self, request: web.Request) -> web.Response:
        """Handle GET requests."""
        params = request.query
        action = params.get("action")

        if not action:
            return self.json_message("Missing action", status_code=400)

        hass = request.app["hass"]

        if action == "list_files":
            files = await hass.async_add_executor_job(self._list_files)
            return self.json(files)

        if action == "list_all":
            items = await hass.async_add_executor_job(self._list_all)
            return self.json(items)

        if action == "read_file":
            path = params.get("path")
            if not path:
                return self.json_message("Missing path", status_code=400)
            return await self._read_file(hass, path)

        if action == "download_folder":
            path = params.get("path")
            if not path:
                return self.json_message("Missing path", status_code=400)
            return await self._download_folder(hass, path)

        return self.json_message("Unknown action", status_code=400)

    async def post(self, request: web.Request) -> web.Response:
        """Handle POST requests."""
        try:
            data: dict[str, Any] = await request.json()
        except ValueError:
            return self.json_message("Invalid JSON", status_code=400)

        action = data.get("action")

        if not action:
            return self.json_message("Missing action", status_code=400)

        hass = request.app["hass"]

        if action == "write_file":
            path = data.get("path")
            content = data.get("content")
            if not path or content is None:
                return self.json_message("Missing path or content", status_code=400)
            return await self._write_file(hass, path, content)

        if action == "create_file":
            path = data.get("path")
            content = data.get("content", "")
            if not path:
                return self.json_message("Missing path", status_code=400)
            return await self._create_file(hass, path, content)

        if action == "create_folder":
            path = data.get("path")
            if not path:
                return self.json_message("Missing path", status_code=400)
            return await self._create_folder(hass, path)

        if action == "delete":
            path = data.get("path")
            if not path:
                return self.json_message("Missing path", status_code=400)
            return await self._delete(hass, path)

        if action == "copy":
            source = data.get("source")
            destination = data.get("destination")
            if not source or not destination:
                return self.json_message("Missing source or destination", status_code=400)
            return await self._copy(hass, source, destination)

        if action == "rename":
            source = data.get("source")
            destination = data.get("destination")
            if not source or not destination:
                return self.json_message("Missing source or destination", status_code=400)
            return await self._rename(hass, source, destination)

        if action == "check_yaml":
            content = data.get("content")
            if content is None:
                return self.json_message("Missing content", status_code=400)
            return self._check_yaml(content)

        if action == "upload_file":
            path = data.get("path")
            content = data.get("content")
            overwrite = data.get("overwrite", False)
            if not path or content is None:
                return self.json_message("Missing path or content", status_code=400)
            return await self._upload_file(hass, path, content, overwrite)

        if action == "upload_folder":
            path = data.get("path")
            zip_data = data.get("zip_data")
            if not path or not zip_data:
                return self.json_message("Missing path or zip_data", status_code=400)
            return await self._upload_folder(hass, path, zip_data)

        return self.json_message("Unknown action", status_code=400)

    def _list_files(self) -> list[dict[str, Any]]:
        """List files recursively."""
        result: list[dict[str, Any]] = []

        for root, dirs, files in os.walk(self.config_dir):
            dirs[:] = [
                d for d in dirs
                if d not in self.EXCLUDED_PATTERNS and not d.startswith(".")
            ]

            rel_root = Path(root).relative_to(self.config_dir)

            for name in sorted(files):
                file_path = Path(root) / name
                rel_path = rel_root / name if str(rel_root) != "." else Path(name)

                if name.startswith("."):
                    continue
                if file_path.suffix.lower() not in self.ALLOWED_EXTENSIONS:
                    continue

                result.append({
                    "path": str(rel_path),
                    "name": name,
                    "type": "file",
                })

        return sorted(result, key=lambda x: x["path"])

    def _list_all(self) -> list[dict[str, Any]]:
        """List all files and folders recursively."""
        result: list[dict[str, Any]] = []

        for root, dirs, files in os.walk(self.config_dir):
            dirs[:] = [
                d for d in dirs
                if d not in self.EXCLUDED_PATTERNS and not d.startswith(".")
            ]

            rel_root = Path(root).relative_to(self.config_dir)

            # Add directories
            for name in sorted(dirs):
                rel_path = rel_root / name if str(rel_root) != "." else Path(name)
                result.append({
                    "path": str(rel_path),
                    "name": name,
                    "type": "folder",
                })

            # Add files
            for name in sorted(files):
                file_path = Path(root) / name
                rel_path = rel_root / name if str(rel_root) != "." else Path(name)

                if name.startswith("."):
                    continue
                if file_path.suffix.lower() not in self.ALLOWED_EXTENSIONS:
                    continue

                result.append({
                    "path": str(rel_path),
                    "name": name,
                    "type": "file",
                })

        return sorted(result, key=lambda x: x["path"])

    async def _read_file(self, hass: HomeAssistant, path: str) -> web.Response:
        """Read the contents of a file."""
        safe_path = self._get_safe_path(path)
        if safe_path is None:
            return self.json_message("Invalid path", status_code=403)

        if not safe_path.exists() or not safe_path.is_file():
            return self.json_message("File not found", status_code=404)

        if safe_path.suffix.lower() not in self.ALLOWED_EXTENSIONS:
            return self.json_message("File type not allowed", status_code=403)

        try:
            content = await hass.async_add_executor_job(safe_path.read_text, "utf-8")
            return self.json({"content": content})
        except UnicodeDecodeError:
            return self.json_message("File is not a text file", status_code=400)
        except OSError as err:
            _LOGGER.error("Error reading file %s: %s", safe_path, err)
            return self.json_message("Error reading file", status_code=500)

    async def _write_file(
        self, hass: HomeAssistant, path: str, content: str
    ) -> web.Response:
        """Write content to a file."""
        safe_path = self._get_safe_path(path)
        if safe_path is None:
            return self.json_message("Invalid path", status_code=403)

        if safe_path.suffix.lower() not in self.ALLOWED_EXTENSIONS:
            return self.json_message("File type not allowed", status_code=403)

        if not safe_path.parent.exists():
            return self.json_message("Parent directory does not exist", status_code=400)

        try:
            await hass.async_add_executor_job(safe_path.write_text, content, "utf-8")
            return self.json({"success": True})
        except OSError as err:
            _LOGGER.error("Error writing file %s: %s", safe_path, err)
            return self.json_message("Error writing file", status_code=500)

    async def _create_file(
        self, hass: HomeAssistant, path: str, content: str
    ) -> web.Response:
        """Create a new file."""
        safe_path = self._get_safe_path(path)
        if safe_path is None:
            return self.json_message("Invalid path", status_code=403)

        if safe_path.suffix.lower() not in self.ALLOWED_EXTENSIONS:
            return self.json_message("File type not allowed", status_code=403)

        if safe_path.exists():
            return self.json_message("File already exists", status_code=409)

        if not safe_path.parent.exists():
            return self.json_message("Parent directory does not exist", status_code=400)

        try:
            await hass.async_add_executor_job(safe_path.write_text, content, "utf-8")
            return self.json({"success": True, "path": path})
        except OSError as err:
            _LOGGER.error("Error creating file %s: %s", safe_path, err)
            return self.json_message("Error creating file", status_code=500)

    async def _create_folder(self, hass: HomeAssistant, path: str) -> web.Response:
        """Create a new folder."""
        safe_path = self._get_safe_path(path)
        if safe_path is None:
            return self.json_message("Invalid path", status_code=403)

        if safe_path.exists():
            return self.json_message("Folder already exists", status_code=409)

        if not safe_path.parent.exists():
            return self.json_message("Parent directory does not exist", status_code=400)

        try:
            await hass.async_add_executor_job(safe_path.mkdir, 0o755)
            return self.json({"success": True, "path": path})
        except OSError as err:
            _LOGGER.error("Error creating folder %s: %s", safe_path, err)
            return self.json_message("Error creating folder", status_code=500)

    async def _delete(self, hass: HomeAssistant, path: str) -> web.Response:
        """Delete a file or folder."""
        if self._is_protected(path):
            return self.json_message("Cannot delete protected path", status_code=403)

        safe_path = self._get_safe_path(path)
        if safe_path is None:
            return self.json_message("Invalid path", status_code=403)

        if not safe_path.exists():
            return self.json_message("Path not found", status_code=404)

        # Prevent deleting the config directory itself
        if safe_path == self.config_dir:
            return self.json_message("Cannot delete config directory", status_code=403)

        try:
            if safe_path.is_dir():
                await hass.async_add_executor_job(shutil.rmtree, safe_path)
            else:
                await hass.async_add_executor_job(safe_path.unlink)
            return self.json({"success": True})
        except OSError as err:
            _LOGGER.error("Error deleting %s: %s", safe_path, err)
            return self.json_message("Error deleting", status_code=500)

    async def _copy(
        self, hass: HomeAssistant, source: str, destination: str
    ) -> web.Response:
        """Copy a file or folder."""
        safe_source = self._get_safe_path(source)
        safe_dest = self._get_safe_path(destination)

        if safe_source is None or safe_dest is None:
            return self.json_message("Invalid path", status_code=403)

        if not safe_source.exists():
            return self.json_message("Source not found", status_code=404)

        if safe_dest.exists():
            return self.json_message("Destination already exists", status_code=409)

        if not safe_dest.parent.exists():
            return self.json_message("Destination directory does not exist", status_code=400)

        try:
            if safe_source.is_dir():
                await hass.async_add_executor_job(shutil.copytree, safe_source, safe_dest)
            else:
                await hass.async_add_executor_job(shutil.copy2, safe_source, safe_dest)
            return self.json({"success": True, "path": destination})
        except OSError as err:
            _LOGGER.error("Error copying %s to %s: %s", safe_source, safe_dest, err)
            return self.json_message("Error copying", status_code=500)

    async def _rename(
        self, hass: HomeAssistant, source: str, destination: str
    ) -> web.Response:
        """Rename/move a file or folder."""
        if self._is_protected(source):
            return self.json_message("Cannot rename protected path", status_code=403)

        safe_source = self._get_safe_path(source)
        safe_dest = self._get_safe_path(destination)

        if safe_source is None or safe_dest is None:
            return self.json_message("Invalid path", status_code=403)

        if not safe_source.exists():
            return self.json_message("Source not found", status_code=404)

        if safe_dest.exists():
            return self.json_message("Destination already exists", status_code=409)

        if not safe_dest.parent.exists():
            return self.json_message("Destination directory does not exist", status_code=400)

        try:
            await hass.async_add_executor_job(safe_source.rename, safe_dest)
            return self.json({"success": True, "path": destination})
        except OSError as err:
            _LOGGER.error("Error renaming %s to %s: %s", safe_source, safe_dest, err)
            return self.json_message("Error renaming", status_code=500)

    def _check_yaml(self, content: str) -> web.Response:
        """Check for YAML syntax errors."""
        try:
            yaml.safe_load(content)
            return self.json({"valid": True})
        except yaml.YAMLError as err:
            return self.json({"valid": False, "error": str(err)})

    async def _upload_file(
        self, hass: HomeAssistant, path: str, content: str, overwrite: bool
    ) -> web.Response:
        """Upload/create a file with content."""
        safe_path = self._get_safe_path(path)
        if safe_path is None:
            return self.json_message("Invalid path", status_code=403)

        if safe_path.suffix.lower() not in self.ALLOWED_EXTENSIONS:
            return self.json_message("File type not allowed", status_code=403)

        if safe_path.exists() and not overwrite:
            return self.json_message("File already exists", status_code=409)

        if not safe_path.parent.exists():
            return self.json_message("Parent directory does not exist", status_code=400)

        try:
            await hass.async_add_executor_job(safe_path.write_text, content, "utf-8")
            return self.json({"success": True, "path": path})
        except OSError as err:
            _LOGGER.error("Error uploading file %s: %s", safe_path, err)
            return self.json_message("Error uploading file", status_code=500)

    async def _download_folder(
        self, hass: HomeAssistant, path: str
    ) -> web.Response:
        """Download a folder as a ZIP file (base64 encoded)."""
        safe_path = self._get_safe_path(path)
        if safe_path is None:
            return self.json_message("Invalid path", status_code=403)

        if not safe_path.exists() or not safe_path.is_dir():
            return self.json_message("Folder not found", status_code=404)

        try:
            zip_data = await hass.async_add_executor_job(
                self._create_zip, safe_path, path
            )
            return self.json({
                "success": True,
                "filename": f"{safe_path.name}.zip",
                "data": zip_data
            })
        except OSError as err:
            _LOGGER.error("Error creating zip for %s: %s", safe_path, err)
            return self.json_message("Error creating zip", status_code=500)

    def _create_zip(self, folder_path: Path, rel_base: str) -> str:
        """Create a ZIP file from a folder and return base64 encoded data."""
        buffer = io.BytesIO()

        with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as zf:
            for root, dirs, files in os.walk(folder_path):
                # Filter excluded directories
                dirs[:] = [
                    d for d in dirs
                    if d not in self.EXCLUDED_PATTERNS and not d.startswith(".")
                ]

                for file in files:
                    if file.startswith("."):
                        continue

                    file_path = Path(root) / file

                    # Only include allowed extensions
                    if file_path.suffix.lower() not in self.ALLOWED_EXTENSIONS:
                        continue

                    # Calculate archive name relative to the folder being zipped
                    arc_name = file_path.relative_to(folder_path)
                    zf.write(file_path, arc_name)

        buffer.seek(0)
        return base64.b64encode(buffer.read()).decode("utf-8")

    async def _upload_folder(
        self, hass: HomeAssistant, path: str, zip_data: str
    ) -> web.Response:
        """Upload a folder from a ZIP file (base64 encoded)."""
        safe_path = self._get_safe_path(path)
        if safe_path is None:
            return self.json_message("Invalid path", status_code=403)

        if not safe_path.parent.exists():
            return self.json_message("Parent directory does not exist", status_code=400)

        try:
            extracted_files = await hass.async_add_executor_job(
                self._extract_zip, safe_path, zip_data
            )
            return self.json({
                "success": True,
                "path": path,
                "files_extracted": extracted_files
            })
        except (OSError, zipfile.BadZipFile) as err:
            _LOGGER.error("Error extracting zip to %s: %s", safe_path, err)
            return self.json_message("Error extracting zip", status_code=500)

    def _extract_zip(self, target_path: Path, zip_data: str) -> int:
        """Extract a ZIP file to a target path."""
        # Decode base64 data
        zip_bytes = base64.b64decode(zip_data)
        buffer = io.BytesIO(zip_bytes)

        # Create target directory if it doesn't exist
        target_path.mkdir(parents=True, exist_ok=True)

        files_extracted = 0

        with zipfile.ZipFile(buffer, "r") as zf:
            for member in zf.namelist():
                # Security: prevent path traversal
                member_path = (target_path / member).resolve()
                if not member_path.is_relative_to(target_path):
                    continue

                # Only extract allowed file types
                if not member.endswith("/"):
                    ext = Path(member).suffix.lower()
                    if ext not in self.ALLOWED_EXTENSIONS:
                        continue

                zf.extract(member, target_path)
                files_extracted += 1

        return files_extracted
