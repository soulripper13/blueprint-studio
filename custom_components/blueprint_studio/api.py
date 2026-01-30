"""API for Blueprint Studio."""
from __future__ import annotations

import logging
import os
from typing import Any
from pathlib import Path

from aiohttp import web
from homeassistant.components.http import HomeAssistantView
from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import BINARY_EXTENSIONS
from .util import json_message, json_response
from .git_manager import GitManager
from .ai_manager import AIManager
from .file_manager import FileManager

_LOGGER = logging.getLogger(__name__)

class BlueprintStudioApiView(HomeAssistantView):
    """View to handle API requests for Blueprint Studio."""

    url = "/api/blueprint_studio"
    name = "api:blueprint_studio"
    requires_auth = True

    def __init__(self, config_dir: Path, store: Store, data: dict) -> None:
        """Initialize the view."""
        self.config_dir = config_dir
        self.store = store
        self.data = data
        self.git = GitManager(None, config_dir, data, store)
        self.ai = AIManager(None, data)
        self.file = FileManager(None, config_dir)

    def _update_hass(self, hass: HomeAssistant) -> None:
        """Update hass instance in managers."""
        self.git.hass = hass
        self.ai.hass = hass
        self.file.hass = hass

    async def get(self, request: web.Request) -> web.Response:
        """Handle GET requests."""
        params = request.query
        action = params.get("action")
        if not action: return json_message("Missing action", status_code=400)
        
        hass = request.app["hass"]
        self._update_hass(hass)

        if action == "list_files":
            show_hidden = params.get("show_hidden", "false").lower() == "true"
            files = await hass.async_add_executor_job(self.file.list_files, show_hidden)
            return json_response(files)
        if action == "list_all":
            show_hidden = params.get("show_hidden", "false").lower() == "true"
            items = await hass.async_add_executor_job(self.file.list_all, show_hidden)
            return json_response(items)
        if action == "list_git_files":
            items = await hass.async_add_executor_job(self.file.list_git_files)
            return json_response(items)
        if action == "read_file":
            path = params.get("path")
            if not path: return json_message("Missing path", status_code=400)
            return await self.file.read_file(path)
        if action == "download_folder":
            path = params.get("path")
            if not path: return json_message("Missing path", status_code=400)
            return await self.file.download_folder(path)
        if action == "get_settings":
            return json_response(self.data.get("settings", {}))
        
        return json_message("Unknown action", status_code=400)

    async def post(self, request: web.Request) -> web.Response:
        """Handle POST requests."""
        try: data = await request.json()
        except: return json_message("Invalid JSON", status_code=400)
        
        action = data.get("action")
        if not action: return json_message("Missing action", status_code=400)
        
        hass = request.app["hass"]
        self._update_hass(hass)

        # Settings
        if action == "save_settings":
            self.data["settings"] = data.get("settings", {})
            await self.store.async_save(self.data)
            return json_response({"success": True})

        # Files
        if action == "write_file":
            path = data.get("path")
            content = data.get("content")
            response = await self.file.write_file(path, content)
            
            # Auto-reload logic
            if path and "/" not in path: # Only root files
                if path == "automations.yaml":
                    await hass.services.async_call("automation", "reload")
                elif path == "scripts.yaml":
                    await hass.services.async_call("script", "reload")
                elif path == "scenes.yaml":
                    await hass.services.async_call("scene", "reload")
                elif path == "groups.yaml":
                    await hass.services.async_call("group", "reload")
            
            return response

        if action == "create_file": return await self.file.create_file(data.get("path"), data.get("content", ""), data.get("is_base64", False))
        if action == "create_folder": return await self.file.create_folder(data.get("path"))
        if action == "delete": return await self.file.delete(data.get("path"))
        if action == "copy": return await self.file.copy(data.get("source"), data.get("destination"))
        if action == "rename": return await self.file.rename(data.get("source"), data.get("destination"))
        if action == "upload_file": return await self.file.upload_file(data.get("path"), data.get("content"), data.get("overwrite", False), data.get("is_base64", False))
        if action == "upload_folder": return await self.file.upload_folder(data.get("path"), data.get("zip_data"))
        if action == "download_multi": return await self.file.download_multi(data.get("paths", []))
        if action == "check_yaml":
            result = await hass.async_add_executor_job(self.ai.check_yaml, data.get("content", ""))
            return result
        if action == "check_jinja":
            result = await hass.async_add_executor_job(self.ai.check_jinja, data.get("content", ""))
            return result

        # Git
        if action == "git_status": return await self.git.get_status(data.get("fetch", False))
        if action == "git_log": return await self.git.get_log(data.get("count", 20))
        if action == "git_diff_commit": return await self.git.diff_commit(data.get("hash"))
        if action == "git_pull": return await self.git.pull()
        if action == "git_push": return await self.git.push(data.get("commit_message", "Update via Blueprint Studio"))
        if action == "git_push_only": return await self.git.push_only()
        if action == "git_commit": return await self.git.commit(data.get("commit_message", "Update via Blueprint Studio"))
        if action == "git_show": return await self.git.show(data.get("path"))
        if action == "git_init": return await self.git.init()
        if action == "git_add_remote": return await self.git.add_remote(data.get("name", "origin"), data.get("url"))
        if action == "git_remove_remote": return await self.git.remove_remote(data.get("name"))
        if action == "git_delete_repo": return await self.git.delete_repo()
        if action == "git_repair_index": return await self.git.repair_index()
        if action == "git_rename_branch": return await self.git.rename_branch(data.get("old_name"), data.get("new_name"))
        if action == "git_merge_unrelated": return await self.git.merge_unrelated(data.get("remote", "origin"), data.get("branch", "main"))
        if action == "git_force_push": return await self.git.force_push()
        if action == "git_hard_reset": return await self.git.hard_reset(data.get("remote", "origin"), data.get("branch", "main"))
        if action == "git_delete_remote_branch": return await self.git.delete_remote_branch(data.get("branch"))
        if action == "git_abort": return await self.git.abort()
        if action == "git_stage": return await self.git.stage(data.get("files", []))
        if action == "git_unstage": return await self.git.unstage(data.get("files", []))
        if action == "git_reset": return await self.git.reset(data.get("files", []))
        if action == "git_clean_locks": return await self.git.clean_locks()
        if action == "git_stop_tracking": return await self.git.stop_tracking(data.get("files", []))
        if action == "git_get_remotes": return await self.git.get_remotes()
        if action == "git_get_credentials": return self.git.get_credentials()
        if action == "git_set_credentials": return await self.git.set_credentials(data.get("username"), data.get("token"), data.get("remember_me", True))
        if action == "git_clear_credentials": return await self.git.clear_credentials()
        if action == "git_test_connection": return await self.git.test_connection()
        
        # AI
        if action == "ai_query": return await self.ai.query(data.get("query"), data.get("current_file"), data.get("file_content"))

        # GitHub Specific
        if action == "github_create_repo": return await self.git.github_create_repo(data.get("repo_name"), data.get("description", ""), data.get("is_private", True))
        if action == "github_set_default_branch": return await self.git.github_set_default_branch(data.get("branch"))
        if action == "github_device_flow_start": return await self.git.github_device_flow_start(data.get("client_id"))
        if action == "github_device_flow_poll": return await self.git.github_device_flow_poll(data.get("client_id"), data.get("device_code"))

        # Misc
        if action == "restart_home_assistant":
            await hass.services.async_call("homeassistant", "restart")
            return json_response({"success": True, "message": "Restarting..."})
        if action == "get_entities":
            query = data.get("query", "").lower()
            entities = []
            for s in hass.states.async_all():
                eid = s.entity_id.lower()
                fname = str(s.attributes.get("friendly_name", "")).lower()
                if not query or query in eid or query in fname:
                    entities.append({
                        "entity_id": s.entity_id,
                        "friendly_name": s.attributes.get("friendly_name"), 
                        "icon": s.attributes.get("icon"),
                        "state": s.state
                    })
            # Limit results to avoid massive payloads if query is empty/broad
            return json_response({"entities": entities[:1000]})
        if action == "global_search":
            results = await hass.async_add_executor_job(self._global_search, data.get("query"), data.get("case_sensitive", False), data.get("use_regex", False))
            return json_response(results)

        return json_message("Unknown action", status_code=400)

    def _global_search(self, query: str, case_sensitive: bool, use_regex: bool) -> list[dict]:
        """Perform global search across config files."""
        # Simple implementation for now, moved from __init__
        import re
        results = []
        try:
            pattern = re.compile(query if use_regex else re.escape(query), 0 if case_sensitive else re.IGNORECASE)
            for root, dirs, files in os.walk(self.config_dir):
                # Exclude all hidden folders (starting with .) and specific dependency/cache folders
                dirs[:] = [d for d in dirs if not d.startswith(".") and d not in ["__pycache__", "deps", "tts"]]
                for name in files:
                    file_path = Path(root) / name
                    # Skip if file is not allowed or is binary (e.g., .db, .sqlite, .zip)
                    if not self.file._is_file_allowed(file_path): continue
                    if file_path.suffix.lower() in BINARY_EXTENSIONS: continue
                    
                    try:
                        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                            for i, line in enumerate(f):
                                if pattern.search(line):
                                    results.append({"path": str(file_path.relative_to(self.config_dir)), "line": i + 1, "content": line.strip()})
                                if len(results) >= 1000: return results
                    except: pass
        except: pass
        return results
