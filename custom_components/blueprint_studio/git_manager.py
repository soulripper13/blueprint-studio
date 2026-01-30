"""Git management for Blueprint Studio."""
from __future__ import annotations

import base64
import logging
import os
import re
import shutil
import subprocess
from pathlib import Path
from typing import Any

import aiohttp
from aiohttp import web
from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import DOMAIN
from .util import json_response, json_message, is_path_safe

_LOGGER = logging.getLogger(__name__)

# GitHub OAuth Device Flow endpoints
GITHUB_DEVICE_CODE_URL = "https://github.com/login/device/code"
GITHUB_ACCESS_TOKEN_URL = "https://github.com/login/oauth/access_token"
GITHUB_CREATE_REPO_URL = "https://api.github.com/user/repos"

class GitManager:
    """Class to handle Git operations."""

    def __init__(self, hass: HomeAssistant, config_dir: Path, data: dict, store: Store) -> None:
        """Initialize Git manager."""
        self.hass = hass
        self.config_dir = config_dir
        self.data = data
        self.store = store

    def _run_git_command(self, args: list[str]) -> dict[str, Any]:
        """Run a git command in the config directory."""
        try:
            env = os.environ.copy()
            safe_dir_config = f"safe.directory={self.config_dir}"
            timeout = 30
            if any(cmd in args for cmd in ["add", "commit", "push", "pull", "clone", "fetch"]):
                timeout = 300

            needs_auth = any(cmd in args for cmd in ["push", "pull", "fetch", "clone"])
            creds = self.data.get("credentials", {})

            if needs_auth and creds and "username" in creds and "token" in creds:
                username = creds["username"]
                token = base64.b64decode(creds["token"]).decode()
                helper_script = self.config_dir / ".git_credential_helper.sh"
                helper_content = f"#!/bin/sh\necho \"username={username}\"\necho \"password={token}\"\n"
                helper_script.write_text(helper_content)
                helper_script.chmod(0o700)

                result = subprocess.run(
                    ["git", "-c", safe_dir_config, "-c", f"credential.helper={helper_script}"] + args,
                    cwd=self.config_dir,
                    capture_output=True,
                    text=True,
                    timeout=timeout,
                    env=env
                )
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

            return {
                "success": result.returncode == 0,
                "output": result.stdout,
                "error": None if result.returncode == 0 else (result.stderr or "Git command failed")
            }
        except Exception as err:
            return {"success": False, "output": "", "error": str(err)}

    async def get_status(self, should_fetch: bool = False) -> web.Response:
        """Get git status with structured data."""
        try:
            git_dir = self.config_dir / ".git"
            is_initialized = git_dir.exists() and git_dir.is_dir()
            
            has_remote = False
            if is_initialized:
                remote_result = await self.hass.async_add_executor_job(self._run_git_command, ["remote"])
                has_remote = remote_result["success"] and bool(remote_result["output"].strip())

            if is_initialized and has_remote and should_fetch:
                await self.hass.async_add_executor_job(self._run_git_command, ["fetch", "--prune"])

            if not is_initialized:
                 return json_response({
                    "success": True, "is_initialized": False, "has_remote": False, "has_changes": False,
                    "files": {"modified": [], "added": [], "deleted": [], "untracked": [], "staged": [], "unstaged": []}
                })

            result = await self.hass.async_add_executor_job(self._run_git_command, ["status", "--porcelain"])
            if not result["success"]:
                return json_message(result["error"], status_code=500)

            full_status_result = await self.hass.async_add_executor_job(self._run_git_command, ["status"])
            full_status = full_status_result["output"] if full_status_result["success"] else ""

            status_data = {"modified": [], "added": [], "deleted": [], "untracked": [], "staged": [], "unstaged": []}
            for line in result["output"].split("\n"):
                if len(line) < 4: continue
                x_status, y_status, filename = line[0], line[1], line[3:].strip()
                if filename.startswith('"') and filename.endswith('"'): filename = filename[1:-1]
                if x_status == 'M': status_data["modified"].append(filename); status_data["staged"].append(filename)
                elif x_status == 'A': status_data["added"].append(filename); status_data["staged"].append(filename)
                elif x_status == 'D': status_data["deleted"].append(filename); status_data["staged"].append(filename)
                if y_status == 'M':
                    if filename not in status_data["modified"]:
                        status_data["modified"].append(filename)
                    status_data["unstaged"].append(filename)
                elif y_status == 'D':
                    if filename not in status_data["deleted"]:
                        status_data["deleted"].append(filename)
                    status_data["unstaged"].append(filename)
                if x_status == '?' and y_status == '?': status_data["untracked"].append(filename)

            has_changes = any(status_data.values())
            ahead = behind = 0
            if has_remote:
                compare_result = await self.hass.async_add_executor_job(self._run_git_command, ["rev-list", "--left-right", "--count", "HEAD...@{u}"])
                if not compare_result["success"]:
                    branch_result = await self.hass.async_add_executor_job(self._run_git_command, ["symbolic-ref", "--short", "HEAD"])
                    current_branch = branch_result["output"].strip() if branch_result["success"] else "main"
                    compare_result = await self.hass.async_add_executor_job(self._run_git_command, ["rev-list", "--left-right", "--count", f"HEAD...origin/{current_branch}"])
                if compare_result["success"]:
                    try:
                        counts = compare_result["output"].strip().split()
                        if len(counts) == 2: ahead, behind = int(counts[0]), int(counts[1])
                    except ValueError: pass

            branch_result = await self.hass.async_add_executor_job(self._run_git_command, ["symbolic-ref", "--short", "HEAD"])
            current_branch = branch_result["output"].strip() if branch_result["success"] else ("HEAD" if "fatal" in str(branch_result.get("error")) else "unknown")
            all_branches_result = await self.hass.async_add_executor_job(self._run_git_command, ["branch", "--format=%(refname:short)"])
            local_branches = [b.strip() for b in all_branches_result["output"].split("\n") if b.strip()] if all_branches_result["success"] else []
            remote_branches = []
            if has_remote:
                rb_result = await self.hass.async_add_executor_job(self._run_git_command, ["ls-remote", "--heads", "origin"])
                if rb_result["success"]:
                    for line in rb_result["output"].split("\n"):
                        if "\trefs/heads/" in line: remote_branches.append(line.split("\trefs/heads/")[1].strip())

            return json_response({
                "success": True, "is_initialized": True, "has_remote": has_remote, "current_branch": current_branch,
                "local_branches": local_branches, "remote_branches": remote_branches, "ahead": ahead, "behind": behind,
                "status": full_status, "has_changes": has_changes, "files": status_data
            })
        except Exception as err:
            _LOGGER.error("Error getting git status: %s", err)
            return json_message(str(err), status_code=500)

    async def show(self, path: str) -> web.Response:
        """Get file content from HEAD."""
        try:
            if not is_path_safe(self.config_dir, path):
                 return json_message(f"Invalid path: {path}", status_code=403)
            result = await self.hass.async_add_executor_job(self._run_git_command, ["show", f"HEAD:{path}"])
            if result["success"]:
                return json_response({"success": True, "content": result["output"]})
            return json_message(result["error"], status_code=500)
        except Exception as err:
            _LOGGER.error("Error showing git file: %s", err)
            return json_message(str(err), status_code=500)

    async def pull(self) -> web.Response:
        """Pull changes from git remote."""
        try:
            branch_result = await self.hass.async_add_executor_job(self._run_git_command, ["symbolic-ref", "--short", "HEAD"])
            target_branch = branch_result["output"].strip() if branch_result["success"] else None
            if not target_branch:
                remote_head = await self.hass.async_add_executor_job(self._run_git_command, ["remote", "show", "origin"])
                if remote_head["success"]:
                    match = re.search(r"HEAD branch: (.+)", remote_head["output"])
                    if match: target_branch = match.group(1).strip()
            if not target_branch: target_branch = "main"
            result = await self.hass.async_add_executor_job(self._run_git_command, ["pull", "--rebase", "origin", target_branch])
            if result["success"]:
                return json_response({"success": True, "output": result["output"]})
            return json_message(result["error"], status_code=500)
        except Exception as err:
            _LOGGER.error("Error pulling from git: %s", err)
            return json_message(str(err), status_code=500)

    async def commit(self, commit_message: str) -> web.Response:
        """Commit changes to git."""
        try:
            stage_result = await self.hass.async_add_executor_job(self._run_git_command, ["add", "-A"])
            if not stage_result["success"]:
                return json_message(stage_result["error"], status_code=500)
            commit_result = await self.hass.async_add_executor_job(self._run_git_command, ["commit", "-m", commit_message])
            if commit_result["success"]:
                return json_response({"success": True, "output": commit_result["output"]})
            return json_message(commit_result["error"], status_code=500)
        except Exception as err:
            _LOGGER.error("Error committing to git: %s", err)
            return json_message(str(err), status_code=500)

    async def push(self, commit_message: str) -> web.Response:
        """Commit and push changes to git remote."""
        try:
            git_dir = self.config_dir / ".git"
            if not git_dir.exists():
                return json_message("Git repository not initialized.", status_code=400)
            check_commits = await self.hass.async_add_executor_job(self._run_git_command, ["rev-parse", "HEAD"])
            has_commits = check_commits["success"]
            if not has_commits:
                await self.hass.async_add_executor_job(self._run_git_command, ["add", "-A"])
                commit_result = await self.commit(commit_message)
                # handle result if needed
            else:
                status_result = await self.hass.async_add_executor_job(self._run_git_command, ["status", "--porcelain"])
                if status_result["success"] and status_result["output"].strip():
                    await self.commit(commit_message)

            branch_result = await self.hass.async_add_executor_job(self._run_git_command, ["symbolic-ref", "--short", "HEAD"])
            target_branch = branch_result["output"].strip() if branch_result["success"] else "main"
            push_result = await self.hass.async_add_executor_job(self._run_git_command, ["push", "-u", "origin", f"HEAD:refs/heads/{target_branch}"])
            if push_result["success"]:
                return json_response({"success": True, "output": push_result["output"]})
            return json_message(push_result["error"], status_code=500)
        except Exception as err:
            _LOGGER.error("Error pushing to git: %s", err)
            return json_message(str(err), status_code=500)

    async def push_only(self) -> web.Response:
        """Push existing commits to remote without committing first."""
        try:
            git_dir = self.config_dir / ".git"
            if not git_dir.exists(): return json_message("Git repo not initialized.", status_code=400)
            check_commits = await self.hass.async_add_executor_job(self._run_git_command, ["rev-parse", "HEAD"])
            if not check_commits["success"]: return json_message("No commits to push.", status_code=400)
            status_result = await self.hass.async_add_executor_job(self._run_git_command, ["status", "--porcelain"])
            if status_result["success"] and status_result["output"].strip():
                return json_message("You have uncommitted changes.", status_code=400)
            branch_result = await self.hass.async_add_executor_job(self._run_git_command, ["symbolic-ref", "--short", "HEAD"])
            target_branch = branch_result["output"].strip() if branch_result["success"] else "main"
            push_result = await self.hass.async_add_executor_job(self._run_git_command, ["push", "-u", "origin", f"HEAD:refs/heads/{target_branch}"])
            if push_result["success"]:
                return json_response({"success": True, "message": "Successfully pushed", "output": push_result["output"]})
            return json_message(f"Push failed: {push_result['error']}", status_code=500)
        except Exception as err:
            _LOGGER.error("Error pushing to git: %s", err)
            return json_message(str(err), status_code=500)

    async def init(self) -> web.Response:
        """Initialize a git repository."""
        try:
            git_dir = self.config_dir / ".git"
            exists = git_dir.exists()
            result = await self.hass.async_add_executor_job(self._run_git_command, ["init", "-b", "main"])
            if not result["success"]:
                result = await self.hass.async_add_executor_job(self._run_git_command, ["init"])
                if result["success"] and not exists:
                    branch_check = await self.hass.async_add_executor_job(self._run_git_command, ["symbolic-ref", "--short", "HEAD"])
                    if branch_check["success"] and branch_check["output"].strip() == "master":
                        await self.hass.async_add_executor_job(self._run_git_command, ["branch", "-m", "main"])
            if result["success"]:
                await self._create_gitignore_if_missing()
                return json_response({"success": True, "message": "Git repository initialized", "output": result["output"]})
            return json_message(result["error"], status_code=500)
        except Exception as err:
            _LOGGER.error("Error initializing git: %s", err)
            return json_message(str(err), status_code=500)

    async def _create_gitignore_if_missing(self) -> None:
        """Create a .gitignore file if it doesn't exist."""
        try:
            gitignore_path = self.config_dir / ".gitignore"
            if not gitignore_path.exists():
                gitignore_content = "# Home Assistant - Git Ignore File\n*.db\n*.log\n.storage/\n.cloud/\n__pycache__/\n.vscode/\n.git_credential_helper.sh\n"
                await self.hass.async_add_executor_job(gitignore_path.write_text, gitignore_content)
        except Exception as err:
            _LOGGER.warning("Failed to create .gitignore: %s", err)

    async def add_remote(self, name: str, url: str) -> web.Response:
        """Add or update a git remote."""
        try:
            check_result = await self.hass.async_add_executor_job(self._run_git_command, ["remote", "get-url", name])
            if check_result["success"]:
                result = await self.hass.async_add_executor_job(self._run_git_command, ["remote", "set-url", name, url])
                message = f"Remote '{name}' updated"
            else:
                result = await self.hass.async_add_executor_job(self._run_git_command, ["remote", "add", name, url])
                message = f"Remote '{name}' added"
            if result["success"]:
                return json_response({"success": True, "message": message, "output": result["output"]})
            return json_message(result["error"], status_code=500)
        except Exception as err:
            _LOGGER.error("Error adding/updating remote: %s", err)
            return json_message(str(err), status_code=500)

    async def remove_remote(self, name: str) -> web.Response:
        """Remove a git remote."""
        try:
            result = await self.hass.async_add_executor_job(self._run_git_command, ["remote", "remove", name])
            if result["success"]:
                return json_response({"success": True, "message": f"Remote '{name}' removed", "output": result["output"]})
            return json_message(result["error"], status_code=500)
        except Exception as err:
            _LOGGER.error("Error removing remote: %s", err)
            return json_message(str(err), status_code=500)

    async def delete_repo(self) -> web.Response:
        """Delete the .git directory (destroy repo)."""
        try:
            git_dir = self.config_dir / ".git"
            if git_dir.exists() and git_dir.is_dir():
                await self.hass.async_add_executor_job(shutil.rmtree, git_dir)
                return json_response({"success": True, "message": "Git repository deleted"})
            return json_response({"success": True, "message": "No Git repository found"})
        except Exception as err:
            _LOGGER.error("Error deleting repo: %s", err)
            return json_message(str(err), status_code=500)

    async def repair_index(self) -> web.Response:
        """Repair a corrupted git index."""
        try:
            index_file = self.config_dir / ".git" / "index"
            if index_file.exists(): await self.hass.async_add_executor_job(index_file.unlink)
            await self.hass.async_add_executor_job(self._run_git_command, ["reset"])
            return json_response({"success": True, "message": "Git index repaired"})
        except Exception as err:
            _LOGGER.error("Error repairing git index: %s", err)
            return json_message(str(err), status_code=500)

    async def github_create_repo(self, repo_name: str, description: str, is_private: bool) -> web.Response:
        """Create a new GitHub repository."""
        try:
            if not repo_name: return json_message("Repository name is required", status_code=400)
            creds = self.data.get("credentials", {})
            if not creds or "token" not in creds: return json_message("Not authenticated.", status_code=401)
            token = base64.b64decode(creds["token"]).decode()
            async with aiohttp.ClientSession() as session:
                async with session.post(GITHUB_CREATE_REPO_URL, json={"name": repo_name, "description": description, "private": is_private, "auto_init": False}, headers={"Authorization": f"Bearer {token}", "Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28"}) as response:
                    if response.status == 201:
                        repo_data = await response.json()
                        await self.init()
                        await self.add_remote("origin", repo_data.get("clone_url"))
                        return json_response({"success": True, "message": f"Repository '{repo_name}' created successfully", "html_url": repo_data.get("html_url"), "clone_url": repo_data.get("clone_url"), "username": creds.get("username", "")})
                    else:
                        error_text = await response.text()
                        return json_message(f"Failed to create repository: {error_text}", status_code=response.status)
        except Exception as err:
            _LOGGER.error("Error creating GitHub repo: %s", err)
            return json_message(str(err), status_code=500)

    async def github_set_default_branch(self, branch: str) -> web.Response:
        """Set the default branch for the GitHub repository."""
        try:
            remotes_result = await self.hass.async_add_executor_job(self._run_git_command, ["remote", "get-url", "origin"])
            if not remotes_result["success"]: return json_message("Origin remote not found", status_code=400)
            url = remotes_result["output"].strip()
            match = re.search(r"github\.com[:/](.+?)/(.+?)(\.git)?$", url)
            if not match: return json_message(f"Could not parse GitHub owner/repo from URL", status_code=400)
            owner, repo = match.group(1), match.group(2)
            creds = self.data.get("credentials", {})
            if not creds or "token" not in creds: return json_message("Not authenticated", status_code=401)
            token = base64.b64decode(creds["token"]).decode()
            api_url = f"https://api.github.com/repos/{owner}/{repo}"
            async with aiohttp.ClientSession() as session:
                async with session.patch(api_url, json={"default_branch": branch}, headers={"Authorization": f"Bearer {token}", "Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28"}) as response:
                    if response.status == 200: return json_response({"success": True, "message": f"Default branch set to '{branch}'"})
                    else: return json_message(f"GitHub error: {await response.text()}", status_code=response.status)
        except Exception as err:
            _LOGGER.error("Error setting default branch: %s", err)
            return json_message(str(err), status_code=500)

    async def get_remotes(self) -> web.Response:
        """Get list of configured git remotes."""
        try:
            result = await self.hass.async_add_executor_job(self._run_git_command, ["remote", "-v"])
            if result["success"]:
                remotes = {}
                for line in result["output"].split("\n"):
                    parts = line.split()
                    if len(parts) >= 2:
                        if parts[0] not in remotes: remotes[parts[0]] = parts[1]
                return json_response({"success": True, "remotes": remotes})
            return json_message(result["error"], status_code=500)
        except Exception as err:
            _LOGGER.error("Error getting remotes: %s", err)
            return json_message(str(err), status_code=500)

    def get_credentials(self) -> web.Response:
        """Get saved git credentials."""
        creds = self.data.get("credentials", {})
        return json_response({"success": True, "has_credentials": "username" in creds, "username": creds.get("username", "")})

    async def set_credentials(self, username: str, token: str, remember_me: bool = True) -> web.Response:
        """Set git credentials for GitHub authentication."""
        try:
            await self.hass.async_add_executor_job(self._run_git_command, ["config", "credential.helper", "store"])
            if remember_me:
                self.data["credentials"] = {"username": username, "token": base64.b64encode(token.encode()).decode()}
                await self.store.async_save(self.data)
            elif "credentials" in self.data:
                del self.data["credentials"]
                await self.store.async_save(self.data)
            if DOMAIN not in self.hass.data: self.hass.data[DOMAIN] = {}
            self.hass.data[DOMAIN]["git_credentials"] = {"username": username, "token": token}
            await self.hass.async_add_executor_job(self._run_git_command, ["config", "user.name", username])
            await self.hass.async_add_executor_job(self._run_git_command, ["config", "user.email", f"{username}@users.noreply.github.com"])
            return json_response({"success": True, "message": "Git credentials saved"})
        except Exception as err:
            _LOGGER.error("Error setting credentials: %s", err)
            return json_message(str(err), status_code=500)

    async def clear_credentials(self) -> web.Response:
        """Clear git credentials and sign out."""
        try:
            if "credentials" in self.data: del self.data["credentials"]
            await self.store.async_save(self.data)
            if DOMAIN in self.hass.data and "git_credentials" in self.hass.data[DOMAIN]: del self.hass.data[DOMAIN]["git_credentials"]
            await self.hass.async_add_executor_job(self._run_git_command, ["config", "--unset", "credential.helper"])
            return json_response({"success": True, "message": "Successfully signed out"})
        except Exception as err:
            _LOGGER.error("Error clearing credentials: %s", err)
            return json_message(str(err), status_code=500)

    async def test_connection(self) -> web.Response:
        """Test connection to git remote."""
        try:
            result = await self.hass.async_add_executor_job(self._run_git_command, ["ls-remote", "--exit-code", "origin"])
            if result["success"]: return json_response({"success": True, "message": "Connection successful"})
            return json_response({"success": False, "message": "Connection failed", "error": result["error"]}, status_code=400)
        except Exception as err:
            _LOGGER.error("Error testing connection: %s", err)
            return json_message(str(err), status_code=500)

    async def github_device_flow_start(self, client_id: str) -> web.Response:
        """Start GitHub OAuth Device Flow."""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(GITHUB_DEVICE_CODE_URL, data={"client_id": client_id, "scope": "repo"}, headers={"Accept": "application/json"}) as response:
                    if response.status != 200: return json_message(f"Failed to start device flow", status_code=response.status)
                    data = await response.json()
                    if "error" in data: return json_message(data.get('error_description', 'Unknown error'), status_code=400)
                    return json_response({"success": True, "device_code": data.get("device_code"), "user_code": data.get("user_code"), "verification_uri": data.get("verification_uri"), "expires_in": data.get("expires_in"), "interval": data.get("interval", 5)})
        except Exception as err:
            _LOGGER.error("Error starting device flow: %s", err)
            return json_message(str(err), status_code=500)

    async def github_device_flow_poll(self, client_id: str, device_code: str) -> web.Response:
        """Poll for GitHub OAuth Device Flow authorization."""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(GITHUB_ACCESS_TOKEN_URL, data={"client_id": client_id, "device_code": device_code, "grant_type": "urn:ietf:params:oauth:grant-type:device_code"}, headers={"Accept": "application/json"}) as response:
                    data = await response.json()
                    if "error" in data:
                        error_code = data["error"]
                        status = "pending" if error_code == "authorization_pending" else "slow_down" if error_code == "slow_down" else "error"
                        return json_response({"success": False, "status": status, "message": data.get("error_description", "Unknown error")})
                    access_token = data.get("access_token")
                    async with session.get("https://api.github.com/user", headers={"Authorization": f"Bearer {access_token}", "Accept": "application/json"}) as user_response:
                        if user_response.status == 200:
                            user_data = await user_response.json()
                            await self.set_credentials(user_data.get("login"), access_token)
                            return json_response({"success": True, "status": "authorized", "username": user_data.get("login"), "message": "Successfully authenticated"})
                        return json_message("Failed to get user info", status_code=user_response.status)
        except Exception as err:
            _LOGGER.error("Error polling device flow: %s", err)
            return json_message(str(err), status_code=500)

    async def stage(self, files: list[str]) -> web.Response:
        """Stage specific files."""
        try:
            for file in files:
                if not is_path_safe(self.config_dir, file): return json_message(f"Invalid path: {file}", status_code=403)
            result = await self.hass.async_add_executor_job(self._run_git_command, ["add"] + files)
            if result["success"]: return json_response({"success": True, "message": f"Staged {len(files)} file(s)", "output": result["output"]})
            return json_message(result["error"], status_code=500)
        except Exception as err:
            _LOGGER.error("Error staging files: %s", err)
            return json_message(str(err), status_code=500)

    async def unstage(self, files: list[str]) -> web.Response:
        """Unstage specific files."""
        try:
            for file in files:
                if not is_path_safe(self.config_dir, file): return json_message(f"Invalid path: {file}", status_code=403)
            result = await self.hass.async_add_executor_job(self._run_git_command, ["reset"] + files)
            if result["success"]: return json_response({"success": True, "message": f"Unstaged {len(files)} file(s)", "output": result["output"]})
            return json_message(result["error"], status_code=500)
        except Exception as err:
            _LOGGER.error("Error unstaging files: %s", err)
            return json_message(str(err), status_code=500)

    async def reset(self, files: list[str]) -> web.Response:
        """Reset/discard changes to specific files."""
        try:
            for file in files:
                if not is_path_safe(self.config_dir, file): return json_message(f"Invalid path: {file}", status_code=403)
            result = await self.hass.async_add_executor_job(self._run_git_command, ["checkout", "HEAD", "--"] + files)
            if result["success"]: return json_response({"success": True, "message": f"Reset {len(files)} file(s)", "output": result["output"]})
            return json_message(result["error"], status_code=500)
        except Exception as err:
            _LOGGER.error("Error resetting files: %s", err)
            return json_message(str(err), status_code=500)

    async def abort(self) -> web.Response:
        """Abort a rebase or merge operation."""
        try:
            rebase_result = await self.hass.async_add_executor_job(self._run_git_command, ["rebase", "--abort"])
            merge_result = await self.hass.async_add_executor_job(self._run_git_command, ["merge", "--abort"])
            if rebase_result["success"] or merge_result["success"]:
                return json_response({"success": True, "message": "Git operation aborted successfully"})
            reset_result = await self.hass.async_add_executor_job(self._run_git_command, ["reset", "--merge"])
            if reset_result["success"]: return json_response({"success": True, "message": "Sync reset successfully"})
            return json_message("Failed to abort git operation", status_code=500)
        except Exception as err:
            _LOGGER.error("Error aborting git operation: %s", err)
            return json_message(str(err), status_code=500)

    async def stop_tracking(self, files: list[str]) -> web.Response:
        """Stop tracking specific files."""
        try:
            for file in files:
                if not is_path_safe(self.config_dir, file): return json_message(f"Invalid path: {file}", status_code=403)
                await self.hass.async_add_executor_job(self._run_git_command, ["rm", "-r", "--cached", file])
            return json_response({"success": True})
        except Exception as err:
            _LOGGER.error("Error stopping tracking for files: %s", err)
            return json_message(str(err), status_code=500)

    async def clean_locks(self) -> web.Response:
        """Clean Git lock files."""
        try:
            git_dir = self.config_dir / ".git"
            lock_files = [git_dir / "index.lock", git_dir / "HEAD.lock", git_dir / "refs" / "heads" / "master.lock", git_dir / "refs" / "heads" / "main.lock"]
            state_dirs = [git_dir / "rebase-merge", git_dir / "rebase-apply", git_dir / "MERGE_HEAD", git_dir / "CHERRY_PICK_HEAD", git_dir / "REVERT_HEAD"]
            removed = []
            for lock_file in lock_files:
                if lock_file.exists():
                    await self.hass.async_add_executor_job(lock_file.unlink)
                    removed.append(str(lock_file.relative_to(self.config_dir)))
            for state_dir in state_dirs:
                if state_dir.exists():
                    if state_dir.is_dir(): await self.hass.async_add_executor_job(shutil.rmtree, state_dir)
                    else: await self.hass.async_add_executor_job(state_dir.unlink)
                    removed.append(str(state_dir.relative_to(self.config_dir)))
            return json_response({"success": True, "message": f"Removed {len(removed)} lock file(s)", "removed": removed})
        except Exception as err:
            _LOGGER.error("Error cleaning Git locks: %s", err)
            return json_message(str(err), status_code=500)

    async def rename_branch(self, old_name: str, new_name: str) -> web.Response:
        """Rename a git branch."""
        try:
            branch_result = await self.hass.async_add_executor_job(self._run_git_command, ["symbolic-ref", "--short", "HEAD"])
            current = branch_result["output"].strip() if branch_result["success"] else None
            if current == old_name: result = await self.hass.async_add_executor_job(self._run_git_command, ["branch", "-m", new_name])
            else: result = await self.hass.async_add_executor_job(self._run_git_command, ["branch", "-m", old_name, new_name])
            if result["success"]: return json_response({"success": True, "message": f"Branch renamed from {old_name} to {new_name}"})
            return json_message(result["error"], status_code=500)
        except Exception as err:
            _LOGGER.error("Error renaming branch: %s", err)
            return json_message(str(err), status_code=500)

    async def merge_unrelated(self, remote: str, branch: str) -> web.Response:
        """Merge a remote branch with unrelated histories."""
        try:
            result = await self.hass.async_add_executor_job(self._run_git_command, ["merge", f"{remote}/{branch}", "--allow-unrelated-histories", "-m", "Merge unrelated histories"])
            if result["success"]: return json_response({"success": True, "message": "Merged unrelated histories successfully"})
            return json_message(result["error"], status_code=500)
        except Exception as err:
            _LOGGER.error("Error merging unrelated histories: %s", err)
            return json_message(str(err), status_code=500)

    async def force_push(self) -> web.Response:
        """Force push local branch to remote."""
        try:
            branch_result = await self.hass.async_add_executor_job(self._run_git_command, ["symbolic-ref", "--short", "HEAD"])
            current = branch_result["output"].strip() if branch_result["success"] else "main"
            result = await self.hass.async_add_executor_job(self._run_git_command, ["push", "-f", "origin", current])
            if result["success"]: return json_response({"success": True, "message": f"Force pushed to {current} successfully"})
            return json_message(result["error"], status_code=500)
        except Exception as err:
            _LOGGER.error("Error force pushing: %s", err)
            return json_message(str(err), status_code=500)

    async def hard_reset(self, remote: str, branch: str) -> web.Response:
        """Hard reset local branch to match remote exactly."""
        try:
            await self.hass.async_add_executor_job(self._run_git_command, ["fetch", remote])
            result = await self.hass.async_add_executor_job(self._run_git_command, ["reset", "--hard", f"{remote}/{branch}"])
            if result["success"]: return json_response({"success": True, "message": f"Hard reset to {remote}/{branch} successful"})
            return json_message(result["error"], status_code=500)
        except Exception as err:
            _LOGGER.error("Error hard resetting: %s", err)
            return json_message(str(err), status_code=500)

    async def delete_remote_branch(self, branch: str) -> web.Response:
        """Delete a branch on the remote repository."""
        try:
            if branch in ["main", "master"]:
                branch_result = await self.hass.async_add_executor_job(self._run_git_command, ["symbolic-ref", "--short", "HEAD"])
                if branch_result["success"] and branch_result["output"].strip() == branch:
                    return json_message(f"Cannot delete your current active branch '{branch}'", status_code=400)
            result = await self.hass.async_add_executor_job(self._run_git_command, ["push", "origin", "--delete", branch])
            if result["success"]: return json_response({"success": True, "message": f"Branch '{branch}' deleted from GitHub"})
            return json_message(result["error"], status_code=500)
        except Exception as err:
            _LOGGER.error("Error deleting remote branch: %s", err)
            return json_message(str(err), status_code=500)

    async def get_log(self, count: int = 20) -> web.Response:
        """Get recent git commits."""
        try:
            result = await self.hass.async_add_executor_job(self._run_git_command, ["log", f"--pretty=format:%H|%at|%an|%s", f"-n", str(count)])
            if not result["success"]:
                if "does not have any commits" in str(result.get("error")) or "fatal: your current branch" in str(result.get("error")):
                    return json_response({"success": True, "commits": []})
                return json_message(result["error"], status_code=500)
            commits = []
            for line in result["output"].split("\n"):
                if not line.strip(): continue
                parts = line.split("|", 3)
                if len(parts) == 4: commits.append({"hash": parts[0], "timestamp": int(parts[1]), "author": parts[2], "message": parts[3]})
            return json_response({"success": True, "commits": commits})
        except Exception as err:
            _LOGGER.error("Error getting git log: %s", err)
            return json_message(str(err), status_code=500)

    async def diff_commit(self, commit_hash: str) -> web.Response:
        """Get the diff for a specific commit."""
        try:
            result = await self.hass.async_add_executor_job(self._run_git_command, ["show", "--pretty=format:", commit_hash])
            if result["success"]: return json_response({"success": True, "diff": result["output"]})
            return json_message(result["error"], status_code=500)
        except Exception as err:
            _LOGGER.error("Error getting git diff for commit: %s", err)
            return json_message(str(err), status_code=500)