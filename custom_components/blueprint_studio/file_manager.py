"""File management for Blueprint Studio."""
from __future__ import annotations

import base64
import io
import logging
import os
import shutil
import zipfile
import mimetypes
from pathlib import Path
from typing import Any

from aiohttp import web
from homeassistant.core import HomeAssistant

from .const import (
    ALLOWED_EXTENSIONS, BINARY_EXTENSIONS, ALLOWED_FILENAMES,
    EXCLUDED_PATTERNS, PROTECTED_PATHS
)
from .util import json_response, json_message, get_safe_path

_LOGGER = logging.getLogger(__name__)

class FileManager:
    """Class to handle file operations."""

    def __init__(self, hass: HomeAssistant, config_dir: Path) -> None:
        """Initialize file manager."""
        self.hass = hass
        self.config_dir = config_dir

    def _is_file_allowed(self, path: Path) -> bool:
        """Check if file type/name is allowed."""
        try:
            if ".storage" in path.relative_to(self.config_dir).parts:
                return True
        except ValueError:
            pass
        return (path.suffix.lower() in ALLOWED_EXTENSIONS or path.name in ALLOWED_FILENAMES)

    def _is_protected(self, path: str) -> bool:
        """Check if path is protected."""
        parts = path.strip("/").split("/")
        return parts[0] in PROTECTED_PATHS or path.strip("/") in PROTECTED_PATHS

    def _get_dir_size(self, path: Path) -> int:
        """Get directory size."""
        total = 0
        try:
            for entry in os.scandir(path):
                if entry.is_file(): total += entry.stat().st_size
                elif entry.is_dir(): total += self._get_dir_size(Path(entry.path))
        except (OSError, PermissionError): pass
        return total

    def list_files(self, show_hidden: bool = False) -> list[dict]:
        """List files recursively."""
        res = []
        for root, dirs, files in os.walk(self.config_dir):
            if not show_hidden: dirs[:] = [d for d in dirs if d not in EXCLUDED_PATTERNS and not d.startswith(".")]
            else: dirs[:] = [d for d in dirs if d not in EXCLUDED_PATTERNS]
            rel_root = Path(root).relative_to(self.config_dir)
            for name in sorted(files):
                file_path = Path(root) / name
                if (not show_hidden and name.startswith(".")) or not self._is_file_allowed(file_path): continue
                res.append({"path": str(rel_root / name if str(rel_root) != "." else name), "name": name, "type": "file"})
        return sorted(res, key=lambda x: x["path"])

    def list_all(self, show_hidden: bool = False) -> list[dict]:
        """List all files and folders."""
        res = []
        for root, dirs, files in os.walk(self.config_dir):
            if not show_hidden: dirs[:] = [d for d in dirs if d not in EXCLUDED_PATTERNS and not d.startswith(".")]
            else: dirs[:] = [d for d in dirs if d not in EXCLUDED_PATTERNS]
            rel_root = Path(root).relative_to(self.config_dir)
            for name in sorted(dirs):
                res.append({"path": str(rel_root / name if str(rel_root) != "." else name), "name": name, "type": "folder", "size": self._get_dir_size(Path(root) / name)})
            for name in sorted(files):
                file_path = Path(root) / name
                if (not show_hidden and name.startswith(".")) or not self._is_file_allowed(file_path): continue
                try: size = file_path.stat().st_size
                except: size = 0
                res.append({"path": str(rel_root / name if str(rel_root) != "." else name), "name": name, "type": "file", "size": size})
        return sorted(res, key=lambda x: x["path"])

    def list_git_files(self) -> list[dict]:
        """List all files for git management."""
        res = []
        for root, dirs, files in os.walk(self.config_dir):
            if ".git" in dirs: dirs.remove(".git")
            rel_root = Path(root).relative_to(self.config_dir)
            for name in sorted(dirs):
                res.append({"path": str(rel_root / name if str(rel_root) != "." else name), "name": name, "type": "folder", "size": self._get_dir_size(Path(root) / name)})
            for name in sorted(files):
                file_path = Path(root) / name
                try: size = file_path.stat().st_size
                except: size = 0
                res.append({"path": str(rel_root / name if str(rel_root) != "." else name), "name": name, "type": "file", "size": size})
        return sorted(res, key=lambda x: x["path"])

    async def read_file(self, path: str) -> web.Response:
        """Read file content."""
        safe_path = get_safe_path(self.config_dir, path)
        if not safe_path or not safe_path.is_file(): return json_message("File not found", status_code=404)
        if not self._is_file_allowed(safe_path): return json_message("Not allowed", status_code=403)
        try:
            if safe_path.suffix.lower() in BINARY_EXTENSIONS:
                content = await self.hass.async_add_executor_job(safe_path.read_bytes)
                return json_response({"content": base64.b64encode(content).decode(), "is_base64": True, "mime_type": mimetypes.guess_type(safe_path.name)[0] or "application/octet-stream"})
            content = await self.hass.async_add_executor_job(safe_path.read_text, "utf-8")
            return json_response({"content": content, "is_base64": False, "mime_type": mimetypes.guess_type(safe_path.name)[0] or "text/plain;charset=utf-8"})
        except Exception as e: return json_message(str(e), status_code=500)

    async def write_file(self, path: str, content: str) -> web.Response:
        """Write file content."""
        safe_path = get_safe_path(self.config_dir, path)
        if not safe_path or not self._is_file_allowed(safe_path): return json_message("Not allowed", status_code=403)
        try:
            await self.hass.async_add_executor_job(safe_path.write_text, content, "utf-8")
            return json_response({"success": True})
        except Exception as e: return json_message(str(e), status_code=500)

    async def create_file(self, path: str, content: str, is_base64: bool = False) -> web.Response:
        """Create a new file."""
        safe_path = get_safe_path(self.config_dir, path)
        if not safe_path or not self._is_file_allowed(safe_path): return json_message("Not allowed", status_code=403)
        if safe_path.exists(): return json_message("Exists", status_code=409)
        try:
            if is_base64: await self.hass.async_add_executor_job(safe_path.write_bytes, base64.b64decode(content))
            else: await self.hass.async_add_executor_job(safe_path.write_text, content, "utf-8")
            return json_response({"success": True, "path": path})
        except Exception as e: return json_message(str(e), status_code=500)

    async def create_folder(self, path: str) -> web.Response:
        """Create a new folder."""
        safe_path = get_safe_path(self.config_dir, path)
        if not safe_path or safe_path.exists(): return json_message("Not allowed or exists", status_code=403)
        try:
            await self.hass.async_add_executor_job(safe_path.mkdir, 0o755)
            return json_response({"success": True, "path": path})
        except Exception as e: return json_message(str(e), status_code=500)

    async def delete(self, path: str) -> web.Response:
        """Delete a file or folder."""
        if self._is_protected(path): return json_message("Protected", status_code=403)
        safe_path = get_safe_path(self.config_dir, path)
        if not safe_path or not safe_path.exists() or safe_path == self.config_dir: return json_message("Not found or not allowed", status_code=404)
        try:
            if safe_path.is_dir(): await self.hass.async_add_executor_job(shutil.rmtree, safe_path)
            else: await self.hass.async_add_executor_job(safe_path.unlink)
            return json_response({"success": True})
        except Exception as e: return json_message(str(e), status_code=500)

    async def copy(self, source: str, destination: str) -> web.Response:
        """Copy a file or folder."""
        src, dest = get_safe_path(self.config_dir, source), get_safe_path(self.config_dir, destination)
        if not src or not dest or not src.exists() or dest.exists(): return json_message("Invalid path or exists", status_code=403)
        try:
            if src.is_dir(): await self.hass.async_add_executor_job(shutil.copytree, src, dest)
            else: await self.hass.async_add_executor_job(shutil.copy2, src, dest)
            return json_response({"success": True, "path": destination})
        except Exception as e: return json_message(str(e), status_code=500)

    async def rename(self, source: str, destination: str) -> web.Response:
        """Rename a file or folder."""
        if self._is_protected(source): return json_message("Protected", status_code=403)
        src, dest = get_safe_path(self.config_dir, source), get_safe_path(self.config_dir, destination)
        if not src or not dest or not src.exists() or dest.exists(): return json_message("Invalid path or exists", status_code=403)
        try:
            await self.hass.async_add_executor_job(src.rename, dest)
            return json_response({"success": True, "path": destination})
        except Exception as e: return json_message(str(e), status_code=500)

    async def download_folder(self, path: str) -> web.Response:
        """Download folder as ZIP."""
        safe_path = get_safe_path(self.config_dir, path)
        if not safe_path or not safe_path.is_dir(): return json_message("Not found", status_code=404)
        try:
            zip_data = await self.hass.async_add_executor_job(self._create_zip, safe_path)
            return json_response({"success": True, "filename": f"{safe_path.name}.zip", "data": zip_data})
        except Exception as e: return json_message(str(e), status_code=500)

    async def download_multi(self, paths: list[str]) -> web.Response:
        """Download multiple items as ZIP."""
        try:
            zip_data = await self.hass.async_add_executor_job(self._create_multi_zip, paths)
            return json_response({"success": True, "filename": "download.zip", "data": zip_data})
        except Exception as e: return json_message(str(e), status_code=500)

    def _create_zip(self, folder_path: Path) -> str:
        """Create ZIP from folder."""
        buf = io.BytesIO()
        with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
            for root, dirs, files in os.walk(folder_path):
                dirs[:] = [d for d in dirs if d not in EXCLUDED_PATTERNS and not d.startswith(".")]
                for f in files:
                    if f.startswith(".") or not self._is_file_allowed(Path(root) / f): continue
                    zf.write(Path(root) / f, (Path(root) / f).relative_to(folder_path))
        buf.seek(0)
        return base64.b64encode(buf.read()).decode()

    def _create_multi_zip(self, paths: list[str]) -> str:
        """Create ZIP from multiple paths."""
        buf = io.BytesIO()
        with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
            for p in paths:
                safe = get_safe_path(self.config_dir, p)
                if not safe or not safe.exists(): continue
                if safe.is_file():
                    if self._is_file_allowed(safe): zf.write(safe, safe.name)
                elif safe.is_dir():
                    for root, dirs, files in os.walk(safe):
                        dirs[:] = [d for d in dirs if d not in EXCLUDED_PATTERNS and not d.startswith(".")]
                        for f in files:
                            if f.startswith(".") or not self._is_file_allowed(Path(root) / f): continue
                            zf.write(Path(root) / f, (Path(root) / f).relative_to(safe.parent))
        buf.seek(0)
        return base64.b64encode(buf.read()).decode()

    async def upload_file(self, path: str, content: str, overwrite: bool, is_base64: bool = False) -> web.Response:
        """Upload/create a file with content."""
        safe_path = get_safe_path(self.config_dir, path)
        if not safe_path or not self._is_file_allowed(safe_path): return json_message("Not allowed", status_code=403)
        if safe_path.exists() and not overwrite: return json_message("File already exists", status_code=409)
        try:
            if is_base64: await self.hass.async_add_executor_job(safe_path.write_bytes, base64.b64decode(content))
            else: await self.hass.async_add_executor_job(safe_path.write_text, content, "utf-8")
            return json_response({"success": True, "path": path})
        except Exception as e: return json_message(str(e), status_code=500)

    async def upload_folder(self, path: str, zip_data: str) -> web.Response:
        """Upload ZIP and extract to folder."""
        safe_path = get_safe_path(self.config_dir, path)
        if not safe_path or not safe_path.exists(): return json_message("Not found", status_code=404)
        try:
            zip_bytes = base64.b64decode(zip_data)
            buf = io.BytesIO(zip_bytes)
            with zipfile.ZipFile(buf) as zf:
                for member in zf.namelist():
                    if not member.endswith("/") and self._is_file_allowed(safe_path / member):
                        zf.extract(member, safe_path)
            return json_response({"success": True})
        except Exception as e: return json_message(str(e), status_code=500)
