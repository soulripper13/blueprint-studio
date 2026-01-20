"""The Blueprint Studio integration."""
from __future__ import annotations

import asyncio
import base64
import io
import logging
import os
import shutil
import subprocess
import zipfile
from pathlib import Path
from typing import Any

import aiohttp
import yaml
from aiohttp import web

from homeassistant.components import frontend
from homeassistant.components.http import HomeAssistantView, StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.storage import Store

from .const import DOMAIN, NAME

_LOGGER = logging.getLogger(__name__)

# Storage version for credentials
STORAGE_VERSION = 1
STORAGE_KEY = f"{DOMAIN}.credentials"

# GitHub OAuth Device Flow endpoints
GITHUB_DEVICE_CODE_URL = "https://github.com/login/device/code"
GITHUB_ACCESS_TOKEN_URL = "https://github.com/login/oauth/access_token"
GITHUB_CREATE_REPO_URL = "https://api.github.com/user/repos"

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
    credentials = await store.async_load()

    config_dir = Path(hass.config.config_dir)
    api_view = BlueprintStudioApiView(config_dir, store, credentials)
    hass.http.register_view(api_view)

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

    def __init__(self, config_dir: Path, store: Store, credentials: dict | None) -> None:
        """Initialize the view."""
        self.config_dir = config_dir.resolve()
        self.store = store
        self.credentials = credentials or {}

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
            show_hidden = params.get("show_hidden", "false").lower() == "true"
            files = await hass.async_add_executor_job(self._list_files, show_hidden)
            return self.json(files)

        if action == "list_all":
            show_hidden = params.get("show_hidden", "false").lower() == "true"
            items = await hass.async_add_executor_job(self._list_all, show_hidden)
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

        if action == "git_status":
            return await self._git_status(hass)

        if action == "git_pull":
            return await self._git_pull(hass)

        if action == "git_push":
            commit_message = data.get("commit_message", "Update via Blueprint Studio")
            return await self._git_push(hass, commit_message)

        if action == "git_push_only":
            return await self._git_push_only(hass)

        if action == "git_commit":
            commit_message = data.get("commit_message", "Update via Blueprint Studio")
            return await self._git_commit(hass, commit_message)

        if action == "git_init":
            return await self._git_init(hass)

        if action == "git_add_remote":
            name = data.get("name", "origin")
            url = data.get("url")
            if not url:
                return self.json_message("Missing remote URL", status_code=400)
            return await self._git_add_remote(hass, name, url)

        if action == "github_create_repo":
            repo_name = data.get("repo_name")
            description = data.get("description", "")
            is_private = data.get("is_private", True)
            return await self._github_create_repo(hass, repo_name, description, is_private)

        if action == "git_get_remotes":
            return await self._git_get_remotes(hass)

        if action == "git_get_credentials":
            return self._git_get_credentials()

        if action == "git_set_credentials":
            username = data.get("username")
            token = data.get("token")
            remember_me = data.get("remember_me", True)
            if not username or not token:
                return self.json_message("Missing username or token", status_code=400)
            return await self._git_set_credentials(hass, username, token, remember_me)

        if action == "git_clear_credentials":
            return await self._git_clear_credentials(hass)

        if action == "git_test_connection":
            return await self._git_test_connection(hass)

        if action == "github_device_flow_start":
            client_id = data.get("client_id")
            if not client_id:
                return self.json_message("Missing OAuth client_id", status_code=400)
            return await self._github_device_flow_start(hass, client_id)

        if action == "github_device_flow_poll":
            client_id = data.get("client_id")
            device_code = data.get("device_code")
            if not client_id or not device_code:
                return self.json_message("Missing client_id or device_code", status_code=400)
            return await self._github_device_flow_poll(hass, client_id, device_code)

        if action == "git_stage":
            files = data.get("files", [])
            if not files:
                return self.json_message("Missing files to stage", status_code=400)
            return await self._git_stage(hass, files)

        if action == "git_unstage":
            files = data.get("files", [])
            if not files:
                return self.json_message("Missing files to unstage", status_code=400)
            return await self._git_unstage(hass, files)

        if action == "git_reset":
            files = data.get("files", [])
            if not files:
                return self.json_message("Missing files to reset", status_code=400)
            return await self._git_reset(hass, files)

        if action == "git_clean_locks":
            return await self._git_clean_locks(hass)

        return self.json_message("Unknown action", status_code=400)

    def _list_files(self, show_hidden: bool = False) -> list[dict[str, Any]]:
        """List files recursively."""
        result: list[dict[str, Any]] = []

        for root, dirs, files in os.walk(self.config_dir):
            # Filter directories
            if show_hidden:
                dirs[:] = [
                    d for d in dirs
                    if d not in self.EXCLUDED_PATTERNS
                ]
            else:
                dirs[:] = [
                    d for d in dirs
                    if d not in self.EXCLUDED_PATTERNS and not d.startswith(".")
                ]

            rel_root = Path(root).relative_to(self.config_dir)

            for name in sorted(files):
                file_path = Path(root) / name
                rel_path = rel_root / name if str(rel_root) != "." else Path(name)

                # Filter hidden files unless show_hidden is True
                if not show_hidden and name.startswith("."):
                    continue
                if file_path.suffix.lower() not in self.ALLOWED_EXTENSIONS:
                    continue

                result.append({
                    "path": str(rel_path),
                    "name": name,
                    "type": "file",
                })

        return sorted(result, key=lambda x: x["path"])

    def _list_all(self, show_hidden: bool = False) -> list[dict[str, Any]]:
        """List all files and folders recursively."""
        result: list[dict[str, Any]] = []

        for root, dirs, files in os.walk(self.config_dir):
            # Filter directories
            if show_hidden:
                dirs[:] = [
                    d for d in dirs
                    if d not in self.EXCLUDED_PATTERNS
                ]
            else:
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

                # Filter hidden files unless show_hidden is True
                if not show_hidden and name.startswith("."):
                    continue
                if file_path.suffix.lower() not in self.ALLOWED_EXTENSIONS:
                    continue
                
                try:
                    size = file_path.stat().st_size
                except (OSError, FileNotFoundError):
                    size = 0

                result.append({
                    "path": str(rel_path),
                    "name": name,
                    "type": "file",
                    "size": size,
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
        """Check for YAML syntax errors (Home Assistant-aware)."""
        try:
            # Simple approach: just allow HA tags without trying to load them
            import yaml

            # Create a simple loader that accepts HA tags
            class HAYamlLoader(yaml.SafeLoader):
                pass

            # Add constructors for HA tags that just return the tag as-is for validation
            def ha_constructor(loader, node):
                """Constructor that returns the scalar value without processing."""
                return loader.construct_scalar(node)

            # Register all Home Assistant custom tags
            HAYamlLoader.add_constructor('!include', ha_constructor)
            HAYamlLoader.add_constructor('!include_dir_list', ha_constructor)
            HAYamlLoader.add_constructor('!include_dir_named', ha_constructor)
            HAYamlLoader.add_constructor('!include_dir_merge_list', ha_constructor)
            HAYamlLoader.add_constructor('!include_dir_merge_named', ha_constructor)
            HAYamlLoader.add_constructor('!secret', ha_constructor)
            HAYamlLoader.add_constructor('!env_var', ha_constructor)
            HAYamlLoader.add_constructor('!input', ha_constructor)

            # Try to parse the YAML
            yaml.load(content, Loader=HAYamlLoader)
            return self.json({"valid": True})
        except yaml.YAMLError as err:
            return self.json({"valid": False, "error": str(err)})
        except Exception as err:
            # Fallback for any other errors
            return self.json({"valid": False, "error": f"Validation error: {str(err)}"})

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

    async def _git_status(self, hass: HomeAssistant) -> web.Response:
        """Get git status with structured data."""
        try:
            # Get porcelain status
            result = await hass.async_add_executor_job(
                self._run_git_command, ["status", "--porcelain"]
            )

            if not result["success"]:
                return self.json_message(result["error"], status_code=500)

            # Parse the status output
            status_data = {
                "modified": [],
                "added": [],
                "deleted": [],
                "untracked": [],
                "staged": [],
                "unstaged": [],
            }

            for line in result["output"].split("\n"):
                if not line.strip():
                    continue

                # Status format: XY filename
                # X = staged, Y = unstaged
                if len(line) < 4:
                    continue

                x_status = line[0]  # Staged status
                y_status = line[1]  # Unstaged status
                filename = line[3:].strip()

                # Parse staged changes
                if x_status == 'M':
                    status_data["modified"].append(filename)
                    status_data["staged"].append(filename)
                elif x_status == 'A':
                    status_data["added"].append(filename)
                    status_data["staged"].append(filename)
                elif x_status == 'D':
                    status_data["deleted"].append(filename)
                    status_data["staged"].append(filename)

                # Parse unstaged changes
                if y_status == 'M':
                    if filename not in status_data["modified"]:
                        status_data["modified"].append(filename)
                    status_data["unstaged"].append(filename)
                elif y_status == 'D':
                    if filename not in status_data["deleted"]:
                        status_data["deleted"].append(filename)
                    status_data["unstaged"].append(filename)

                # Untracked files
                if x_status == '?' and y_status == '?':
                    status_data["untracked"].append(filename)

            has_changes = any([
                status_data["modified"],
                status_data["added"],
                status_data["deleted"],
                status_data["untracked"]
            ])

            return self.json({
                "success": True,
                "status": result["output"],
                "has_changes": has_changes,
                "files": status_data
            })
        except Exception as err:
            _LOGGER.error("Error getting git status: %s", err)
            return self.json_message(str(err), status_code=500)

    async def _git_pull(self, hass: HomeAssistant) -> web.Response:
        """Pull changes from git remote."""
        try:
            result = await hass.async_add_executor_job(
                self._run_git_command, ["pull", "--rebase"]
            )

            if result["success"]:
                return self.json({
                    "success": True,
                    "output": result["output"]
                })
            else:
                return self.json_message(result["error"], status_code=500)
        except Exception as err:
            _LOGGER.error("Error pulling from git: %s", err)
            return self.json_message(str(err), status_code=500)

    async def _git_commit(self, hass: HomeAssistant, commit_message: str) -> web.Response:
        """Commit changes to git."""
        try:
            # Stage all changes
            stage_result = await hass.async_add_executor_job(
                self._run_git_command, ["add", "-A"]
            )

            if not stage_result["success"]:
                return self.json_message(stage_result["error"], status_code=500)

            # Commit changes
            commit_result = await hass.async_add_executor_job(
                self._run_git_command, ["commit", "-m", commit_message]
            )

            if commit_result["success"]:
                return self.json({
                    "success": True,
                    "output": commit_result["output"]
                })
            else:
                return self.json_message(commit_result["error"], status_code=500)
        except Exception as err:
            _LOGGER.error("Error committing to git: %s", err)
            return self.json_message(str(err), status_code=500)

    async def _git_push(self, hass: HomeAssistant, commit_message: str) -> web.Response:
        """Commit and push changes to git remote."""
        try:
            # Check if git repo is initialized
            git_dir = self.config_dir / ".git"
            if not git_dir.exists():
                return self.json_message("Git repository not initialized. Click 'Git Settings' to initialize.", status_code=400)

            # Check if there are any commits in the repository
            check_commits = await hass.async_add_executor_job(
                self._run_git_command, ["rev-parse", "HEAD"]
            )

            has_commits = check_commits["success"]

            # If no commits exist, we need to create the first commit
            if not has_commits:
                # Stage all files for the initial commit
                stage_result = await hass.async_add_executor_job(
                    self._run_git_command, ["add", "-A"]
                )

                if not stage_result["success"]:
                    return self.json_message(f"Failed to stage files: {stage_result['error']}", status_code=500)

                # Commit the changes
                commit_result = await self._git_commit(hass, commit_message)

                # Check if commit succeeded
                try:
                    commit_data = await commit_result.json()
                    if not commit_data.get("success"):
                        return commit_result
                except:
                    pass
            else:
                # Check if there are uncommitted changes
                status_result = await hass.async_add_executor_job(
                    self._run_git_command, ["status", "--porcelain"]
                )

                has_changes = status_result["success"] and status_result["output"].strip()

                # Only commit if there are changes
                if has_changes:
                    commit_result = await self._git_commit(hass, commit_message)

                    # Check if commit succeeded
                    try:
                        commit_data = await commit_result.json()
                        if not commit_data.get("success"):
                            # If commit failed and it's not "nothing to commit", return error
                            if "nothing to commit" not in str(commit_data):
                                return commit_result
                    except:
                        pass

            # At this point, we have commits to push
            # Push changes (with -u to set upstream automatically on first push)
            push_result = await hass.async_add_executor_job(
                self._run_git_command, ["push", "-u", "origin", "HEAD"]
            )

            if push_result["success"]:
                return self.json({
                    "success": True,
                    "output": push_result["output"]
                })
            else:
                return self.json_message(push_result["error"], status_code=500)
        except Exception as err:
            _LOGGER.error("Error pushing to git: %s", err)
            return self.json_message(str(err), status_code=500)

    async def _git_push_only(self, hass: HomeAssistant) -> web.Response:
        """Push existing commits to remote without committing first."""
        try:
            # Check if git repo is initialized
            git_dir = self.config_dir / ".git"
            if not git_dir.exists():
                return self.json_message("Git repository not initialized. Click 'Git Settings' to initialize.", status_code=400)

            # Check if there are any commits in the repository
            check_commits = await hass.async_add_executor_job(
                self._run_git_command, ["rev-parse", "HEAD"]
            )

            if not check_commits["success"]:
                return self.json_message("No commits to push. Please stage and commit files first.", status_code=400)

            # Check if working tree is clean or has uncommitted changes
            status_result = await hass.async_add_executor_job(
                self._run_git_command, ["status", "--porcelain"]
            )

            if status_result["success"] and status_result["output"].strip():
                return self.json_message("You have uncommitted changes. Please commit them first or use the regular Push button.", status_code=400)

            # Push changes (with -u to set upstream automatically on first push)
            push_result = await hass.async_add_executor_job(
                self._run_git_command, ["push", "-u", "origin", "HEAD"]
            )

            if push_result["success"]:
                return self.json({
                    "success": True,
                    "message": "Successfully pushed to remote",
                    "output": push_result["output"]
                })
            else:
                error_msg = push_result["error"]
                _LOGGER.error("Git push failed: %s", error_msg)
                return self.json_message(f"Push failed: {error_msg}", status_code=500)
        except Exception as err:
            _LOGGER.error("Error pushing to git: %s", err)
            return self.json_message(str(err), status_code=500)

    def _run_git_command(self, args: list[str]) -> dict[str, Any]:
        """Run a git command in the config directory."""
        try:
            # Prepare environment
            env = os.environ.copy()

            # Add safe.directory configuration to trust the config directory
            # This prevents "dubious ownership" errors in containerized environments
            safe_dir_config = f"safe.directory={self.config_dir}"

            # Determine timeout based on operation
            # Operations that process many files need more time
            timeout = 30  # default
            if any(cmd in args for cmd in ["add", "commit", "push", "pull", "clone"]):
                timeout = 300  # 5 minutes for operations that process many files

            # If we have stored credentials and this is a push/pull/fetch command,
            # configure git to use our credentials
            needs_auth = any(cmd in args for cmd in ["push", "pull", "fetch", "clone"])

            if needs_auth and self.credentials and "username" in self.credentials and "token" in self.credentials:
                username = self.credentials["username"]
                # Decode the base64-encoded token
                token = base64.b64decode(self.credentials["token"]).decode()

                # Create a temporary credential helper script
                helper_script = self.config_dir / ".git_credential_helper.sh"
                helper_content = f"""#!/bin/sh
echo "username={username}"
echo "password={token}"
"""
                helper_script.write_text(helper_content)
                helper_script.chmod(0o700)

                # Configure git to use our helper for this command
                result = subprocess.run(
                    ["git", "-c", safe_dir_config, "-c", f"credential.helper={helper_script}"] + args,
                    cwd=self.config_dir,
                    capture_output=True,
                    text=True,
                    timeout=timeout,
                    env=env
                )

                # Clean up helper script
                try:
                    helper_script.unlink()
                except:
                    pass
            else:
                result = subprocess.run(
                    ["git", "-c", safe_dir_config] + args,
                    cwd=self.config_dir,
                    capture_output=True,
                    text=True,
                    timeout=timeout,
                    env=env
                )

            if result.returncode == 0:
                return {
                    "success": True,
                    "output": result.stdout,
                    "error": None
                }
            else:
                return {
                    "success": False,
                    "output": result.stdout,
                    "error": result.stderr or "Git command failed"
                }
        except subprocess.TimeoutExpired:
            return {
                "success": False,
                "output": "",
                "error": "Git command timed out"
            }
        except FileNotFoundError:
            return {
                "success": False,
                "output": "",
                "error": "Git is not installed or not in PATH"
            }
        except Exception as err:
            return {
                "success": False,
                "output": "",
                "error": str(err)
            }

    async def _git_init(self, hass: HomeAssistant) -> web.Response:
        """Initialize a git repository."""
        try:
            result = await hass.async_add_executor_job(
                self._run_git_command, ["init"]
            )

            if result["success"]:
                # Create a sensible .gitignore file for Home Assistant
                await self._create_gitignore_if_missing(hass)

                return self.json({
                    "success": True,
                    "message": "Git repository initialized",
                    "output": result["output"]
                })
            else:
                return self.json_message(result["error"], status_code=500)
        except Exception as err:
            _LOGGER.error("Error initializing git: %s", err)
            return self.json_message(str(err), status_code=500)

    async def _create_gitignore_if_missing(self, hass: HomeAssistant) -> None:
        """Create a .gitignore file if it doesn't exist."""
        try:
            gitignore_path = self.config_dir / ".gitignore"

            # Only create if it doesn't exist
            if not gitignore_path.exists():
                gitignore_content = """# Home Assistant - Git Ignore File
# Automatically created by Blueprint Studio

# Runtime lock files
.ha_run.lock

# Database files
*.db
*.db-shm
*.db-wal
*.db-journal

# Log files
*.log
*.log.*

# Storage directory (contains tokens and sensitive data)
.storage/
.cloud/

# Temporary files
*.tmp
*.temp
*.swp
*.swo
*~
.DS_Store
Thumbs.db

# Python cache
__pycache__/
*.py[cod]
*$py.class
*.so
.Python

# Virtual environments
venv/
env/
ENV/

# IDE
.vscode/
.idea/
*.sublime-*

# Dependencies
deps/
tts/

# Large TTS model files (exceed GitHub limits)
piper/
*.onnx

# Backups
*.backup
*.bak
backups/
*.db-backup

# Secrets (just in case)
secrets.yaml.backup

# Blueprint Studio internal
.git_credential_helper.sh

# OS generated
._.DS_Store
.Spotlight-V100
.Trashes
ehthumbs.db
desktop.ini
"""
                await hass.async_add_executor_job(
                    gitignore_path.write_text, gitignore_content
                )
                _LOGGER.info("Created .gitignore file in config directory")
        except Exception as err:
            _LOGGER.warning("Failed to create .gitignore: %s", err)

    async def _git_add_remote(
        self, hass: HomeAssistant, name: str, url: str
    ) -> web.Response:
        """Add or update a git remote."""
        try:
            # Check if remote exists
            check_result = await hass.async_add_executor_job(
                self._run_git_command, ["remote", "get-url", name]
            )

            if check_result["success"]:
                # Remote exists, update it
                result = await hass.async_add_executor_job(
                    self._run_git_command, ["remote", "set-url", name, url]
                )
                message = f"Remote '{name}' updated"
            else:
                # Remote doesn't exist, add it
                result = await hass.async_add_executor_job(
                    self._run_git_command, ["remote", "add", name, url]
                )
                message = f"Remote '{name}' added"

            if result["success"]:
                return self.json({
                    "success": True,
                    "message": message,
                    "output": result["output"]
                })
            else:
                return self.json_message(result["error"], status_code=500)
        except Exception as err:
            _LOGGER.error("Error adding/updating remote: %s", err)
            return self.json_message(str(err), status_code=500)

    async def _github_create_repo(
        self, hass: HomeAssistant, repo_name: str, description: str, is_private: bool
    ) -> web.Response:
        """Create a new GitHub repository."""
        try:
            # Validate repo name
            if not repo_name:
                return self.json_message("Repository name is required", status_code=400)

            # Check if credentials exist
            if not self.credentials or "token" not in self.credentials:
                return self.json_message("Not authenticated. Please login first.", status_code=401)

            # Decode token
            token = base64.b64decode(self.credentials["token"]).decode()
            username = self.credentials.get("username", "")

            # Create repository on GitHub
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    GITHUB_CREATE_REPO_URL,
                    json={
                        "name": repo_name,
                        "description": description,
                        "private": is_private,
                        "auto_init": False  # Don't create README, we'll push our own files
                    },
                    headers={
                        "Authorization": f"Bearer {token}",
                        "Accept": "application/vnd.github+json",
                        "X-GitHub-Api-Version": "2022-11-28"
                    }
                ) as response:
                    if response.status == 201:
                        repo_data = await response.json()
                        clone_url = repo_data.get("clone_url")
                        html_url = repo_data.get("html_url")

                        # Initialize local git repo if not already initialized
                        await self._git_init(hass)

                        # Add remote
                        await self._git_add_remote(hass, "origin", clone_url)

                        return self.json({
                            "success": True,
                            "message": f"Repository '{repo_name}' created successfully",
                            "html_url": html_url,
                            "clone_url": clone_url,
                            "username": username
                        })
                    elif response.status == 422:
                        error_data = await response.json()
                        if "errors" in error_data and any("already exists" in str(e) for e in error_data.get("errors", [])):
                            return self.json_message(
                                f"Repository '{username}/{repo_name}' already exists on GitHub",
                                status_code=422
                            )
                        return self.json_message(
                            error_data.get("message", "Failed to create repository"),
                            status_code=422
                        )
                    else:
                        error_text = await response.text()
                        _LOGGER.error("GitHub create repo failed: %s (status %s)", error_text, response.status)
                        return self.json_message(
                            f"Failed to create repository: {error_text}",
                            status_code=response.status
                        )

        except Exception as err:
            _LOGGER.error("Error creating GitHub repo: %s", err)
            return self.json_message(str(err), status_code=500)

    async def _git_get_remotes(self, hass: HomeAssistant) -> web.Response:
        """Get list of configured git remotes."""
        try:
            result = await hass.async_add_executor_job(
                self._run_git_command, ["remote", "-v"]
            )

            if result["success"]:
                remotes = {}
                for line in result["output"].split("\n"):
                    if not line.strip():
                        continue
                    parts = line.split()
                    if len(parts) >= 2:
                        name = parts[0]
                        url = parts[1]
                        if name not in remotes:
                            remotes[name] = url

                return self.json({
                    "success": True,
                    "remotes": remotes
                })
            else:
                return self.json_message(result["error"], status_code=500)
        except Exception as err:
            _LOGGER.error("Error getting remotes: %s", err)
            return self.json_message(str(err), status_code=500)

    def _git_get_credentials(self) -> web.Response:
        """Get saved git credentials (username only, token masked)."""
        if self.credentials and "username" in self.credentials:
            # Decode token for use, but don't send it back to client
            return self.json({
                "success": True,
                "has_credentials": True,
                "username": self.credentials.get("username", "")
            })
        return self.json({
            "success": True,
            "has_credentials": False,
            "username": ""
        })

    async def _git_set_credentials(
        self, hass: HomeAssistant, username: str, token: str, remember_me: bool = True
    ) -> web.Response:
        """Set git credentials for GitHub authentication."""
        try:
            # Configure git to use credential helper
            config_result = await hass.async_add_executor_job(
                self._run_git_command,
                ["config", "credential.helper", "store"]
            )

            if not config_result["success"]:
                return self.json_message(config_result["error"], status_code=500)

            # Store credentials persistently only if remember_me is True
            if remember_me:
                self.credentials = {
                    "username": username,
                    "token": base64.b64encode(token.encode()).decode()  # Basic encoding
                }
                await self.store.async_save(self.credentials)
            else:
                # Clear stored credentials if not remembering
                self.credentials = {}
                await self.store.async_save(self.credentials)

            # Always keep in memory for current session
            if DOMAIN not in hass.data:
                hass.data[DOMAIN] = {}

            hass.data[DOMAIN]["git_credentials"] = {
                "username": username,
                "token": token
            }

            # Configure git user
            await hass.async_add_executor_job(
                self._run_git_command, ["config", "user.name", username]
            )

            await hass.async_add_executor_job(
                self._run_git_command, ["config", "user.email", f"{username}@users.noreply.github.com"]
            )

            message = "Git credentials saved and will persist across restarts" if remember_me else "Git credentials saved for this session only"
            return self.json({
                "success": True,
                "message": message
            })
        except Exception as err:
            _LOGGER.error("Error setting credentials: %s", err)
            return self.json_message(str(err), status_code=500)

    async def _git_clear_credentials(self, hass: HomeAssistant) -> web.Response:
        """Clear git credentials and sign out."""
        try:
            # Clear stored credentials
            self.credentials = {}
            await self.store.async_save(self.credentials)

            # Clear in-memory credentials
            if DOMAIN in hass.data and "git_credentials" in hass.data[DOMAIN]:
                del hass.data[DOMAIN]["git_credentials"]

            # Unset git credential helper
            await hass.async_add_executor_job(
                self._run_git_command, ["config", "--unset", "credential.helper"]
            )

            return self.json({
                "success": True,
                "message": "Successfully signed out from GitHub"
            })
        except Exception as err:
            _LOGGER.error("Error clearing credentials: %s", err)
            return self.json_message(str(err), status_code=500)

    async def _git_test_connection(self, hass: HomeAssistant) -> web.Response:
        """Test connection to git remote."""
        try:
            # Try to fetch from remote
            result = await hass.async_add_executor_job(
                self._run_git_command, ["ls-remote", "--exit-code", "origin"]
            )

            if result["success"]:
                return self.json({
                    "success": True,
                    "message": "Connection successful"
                })
            else:
                return self.json({
                    "success": False,
                    "message": "Connection failed",
                    "error": result["error"]
                }, status_code=400)
        except Exception as err:
            _LOGGER.error("Error testing connection: %s", err)
            return self.json_message(str(err), status_code=500)

    async def _github_device_flow_start(
        self, hass: HomeAssistant, client_id: str
    ) -> web.Response:
        """Start GitHub OAuth Device Flow."""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    GITHUB_DEVICE_CODE_URL,
                    data={
                        "client_id": client_id,
                        "scope": "repo"
                    },
                    headers={"Accept": "application/json"}
                ) as response:
                    if response.status != 200:
                        error_text = await response.text()
                        _LOGGER.error("GitHub device flow start failed: %s (status %s)", error_text, response.status)
                        return self.json_message(
                            f"Failed to start device flow: {error_text}",
                            status_code=response.status
                        )

                    data = await response.json()

                    # Check if GitHub returned an error in the JSON
                    if "error" in data:
                        error_msg = f"{data.get('error')}: {data.get('error_description', 'Unknown error')}"
                        _LOGGER.error("GitHub device flow error: %s", error_msg)
                        return self.json_message(error_msg, status_code=400)

                    return self.json({
                        "success": True,
                        "device_code": data.get("device_code"),
                        "user_code": data.get("user_code"),
                        "verification_uri": data.get("verification_uri"),
                        "expires_in": data.get("expires_in"),
                        "interval": data.get("interval", 5)
                    })
        except Exception as err:
            _LOGGER.error("Error starting device flow: %s", err)
            return self.json_message(str(err), status_code=500)

    async def _github_device_flow_poll(
        self, hass: HomeAssistant, client_id: str, device_code: str
    ) -> web.Response:
        """Poll for GitHub OAuth Device Flow authorization."""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    GITHUB_ACCESS_TOKEN_URL,
                    data={
                        "client_id": client_id,
                        "device_code": device_code,
                        "grant_type": "urn:ietf:params:oauth:grant-type:device_code"
                    },
                    headers={"Accept": "application/json"}
                ) as response:
                    data = await response.json()

                    # Check for errors
                    if "error" in data:
                        error_code = data["error"]
                        if error_code == "authorization_pending":
                            return self.json({
                                "success": False,
                                "status": "pending",
                                "message": "Authorization pending"
                            })
                        elif error_code == "slow_down":
                            return self.json({
                                "success": False,
                                "status": "slow_down",
                                "message": "Polling too fast"
                            })
                        elif error_code == "expired_token":
                            return self.json({
                                "success": False,
                                "status": "expired",
                                "message": "Device code expired"
                            }, status_code=400)
                        elif error_code == "access_denied":
                            return self.json({
                                "success": False,
                                "status": "denied",
                                "message": "Access denied by user"
                            }, status_code=403)
                        else:
                            return self.json({
                                "success": False,
                                "status": "error",
                                "message": data.get("error_description", "Unknown error")
                            }, status_code=400)

                    # Success - we got an access token
                    access_token = data.get("access_token")
                    if not access_token:
                        return self.json_message("No access token received", status_code=500)

                    # Get GitHub username
                    async with session.get(
                        "https://api.github.com/user",
                        headers={
                            "Authorization": f"Bearer {access_token}",
                            "Accept": "application/json"
                        }
                    ) as user_response:
                        if user_response.status == 200:
                            user_data = await user_response.json()
                            username = user_data.get("login")

                            # Save credentials using existing method
                            await self._git_set_credentials(hass, username, access_token)

                            return self.json({
                                "success": True,
                                "status": "authorized",
                                "username": username,
                                "message": "Successfully authenticated with GitHub"
                            })
                        else:
                            return self.json_message(
                                "Failed to get user info",
                                status_code=user_response.status
                            )

        except Exception as err:
            _LOGGER.error("Error polling device flow: %s", err)
            return self.json_message(str(err), status_code=500)

    async def _git_stage(
        self, hass: HomeAssistant, files: list[str]
    ) -> web.Response:
        """Stage specific files."""
        try:
            # Validate files are within config directory
            for file in files:
                if not self._is_path_safe(file):
                    return self.json_message(f"Invalid path: {file}", status_code=403)

            # Stage files
            result = await hass.async_add_executor_job(
                self._run_git_command, ["add"] + files
            )

            if result["success"]:
                return self.json({
                    "success": True,
                    "message": f"Staged {len(files)} file(s)",
                    "output": result["output"]
                })
            else:
                return self.json_message(result["error"], status_code=500)
        except Exception as err:
            _LOGGER.error("Error staging files: %s", err)
            return self.json_message(str(err), status_code=500)

    async def _git_unstage(
        self, hass: HomeAssistant, files: list[str]
    ) -> web.Response:
        """Unstage specific files."""
        try:
            # Validate files are within config directory
            for file in files:
                if not self._is_path_safe(file):
                    return self.json_message(f"Invalid path: {file}", status_code=403)

            # Unstage files - removed 'HEAD' to support repos with no commits
            result = await hass.async_add_executor_job(
                self._run_git_command, ["reset"] + files
            )

            if result["success"]:
                return self.json({
                    "success": True,
                    "message": f"Unstaged {len(files)} file(s)",
                    "output": result["output"]
                })
            else:
                return self.json_message(result["error"], status_code=500)
        except Exception as err:
            _LOGGER.error("Error unstaging files: %s", err)
            return self.json_message(str(err), status_code=500)

    async def _git_reset(
        self, hass: HomeAssistant, files: list[str]
    ) -> web.Response:
        """Reset/discard changes to specific files."""
        try:
            # Validate files are within config directory
            for file in files:
                if not self._is_path_safe(file):
                    return self.json_message(f"Invalid path: {file}", status_code=403)

            # Reset files to HEAD
            result = await hass.async_add_executor_job(
                self._run_git_command, ["checkout", "HEAD", "--"] + files
            )

            if result["success"]:
                return self.json({
                    "success": True,
                    "message": f"Reset {len(files)} file(s)",
                    "output": result["output"]
                })
            else:
                return self.json_message(result["error"], status_code=500)
        except Exception as err:
            _LOGGER.error("Error resetting files: %s", err)
            return self.json_message(str(err), status_code=500)

    async def _git_clean_locks(self, hass: HomeAssistant) -> web.Response:
        """Clean Git lock files."""
        try:
            import os

            git_dir = self.config_dir / ".git"
            lock_files = [
                git_dir / "index.lock",
                git_dir / "HEAD.lock",
                git_dir / "refs" / "heads" / "master.lock",
                git_dir / "refs" / "heads" / "main.lock",
            ]

            removed = []
            for lock_file in lock_files:
                if lock_file.exists():
                    try:
                        await hass.async_add_executor_job(lock_file.unlink)
                        removed.append(str(lock_file.relative_to(self.config_dir)))
                    except Exception as err:
                        _LOGGER.warning("Could not remove lock file %s: %s", lock_file, err)

            if removed:
                return self.json({
                    "success": True,
                    "message": f"Removed {len(removed)} lock file(s)",
                    "removed": removed
                })
            else:
                return self.json({
                    "success": True,
                    "message": "No lock files found"
                })
        except Exception as err:
            _LOGGER.error("Error cleaning Git locks: %s", err)
            return self.json_message(str(err), status_code=500)

