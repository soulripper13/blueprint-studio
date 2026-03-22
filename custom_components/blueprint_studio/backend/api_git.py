"""Git, Gitea, and GitHub handlers for Blueprint Studio API."""
from __future__ import annotations

import logging

from .util import json_response

_LOGGER = logging.getLogger(__name__)


# ========== Git Handlers ==========

async def git_status(git_manager, data):
    return await git_manager.get_status(data.get("fetch", False))


async def git_log(git_manager, data):
    return await git_manager.get_log(data.get("count", 20))


async def git_diff_commit(git_manager, data):
    return await git_manager.diff_commit(data.get("hash"))


async def git_pull(git_manager, file_manager):
    response = await git_manager.pull()
    if response.status == 200:
        file_manager.clear_cache()
    return response


async def git_push(git_manager, data):
    return await git_manager.push(data.get("commit_message", "Update via Blueprint Studio"))


async def git_push_only(git_manager):
    return await git_manager.push_only()


async def git_commit(git_manager, data):
    return await git_manager.commit(data.get("commit_message", "Update via Blueprint Studio"))


async def git_show(git_manager, data):
    return await git_manager.show(data.get("path"))


async def git_init(git_manager, file_manager):
    response = await git_manager.init()
    if response.status == 200:
        file_manager.clear_cache()
    return response


async def git_add_remote(git_manager, data):
    return await git_manager.add_remote(data.get("name", "origin"), data.get("url"))


async def git_remove_remote(git_manager, data):
    return await git_manager.remove_remote(data.get("name"))


async def git_delete_repo(git_manager):
    return await git_manager.delete_repo()


async def git_repair_index(git_manager):
    return await git_manager.repair_index()


async def git_rename_branch(git_manager, data):
    return await git_manager.rename_branch(data.get("old_name"), data.get("new_name"))


async def git_merge_unrelated(git_manager, data):
    return await git_manager.merge_unrelated(data.get("remote", "origin"), data.get("branch", "main"))


async def git_force_push(git_manager, data):
    remote = data.get("remote", "origin")
    auth = "gitea" if remote == "gitea" else "github"
    return await git_manager.force_push(remote, auth_provider=auth)


async def git_hard_reset(git_manager, file_manager, data):
    remote = data.get("remote", "origin")
    auth = "gitea" if remote == "gitea" else "github"
    response = await git_manager.hard_reset(remote, data.get("branch", "main"), auth_provider=auth)
    if response.status == 200:
        file_manager.clear_cache()
    return response


async def git_delete_remote_branch(git_manager, data):
    return await git_manager.delete_remote_branch(data.get("branch"))


async def git_checkout_branch(git_manager, data):
    return await git_manager.checkout_branch(data.get("branch"))


async def git_create_branch(git_manager, data):
    return await git_manager.create_branch(data.get("name"), data.get("checkout", True))


async def git_delete_local_branch(git_manager, data):
    return await git_manager.delete_local_branch(data.get("branch"), data.get("force", False))


async def git_merge_branch(git_manager, data):
    return await git_manager.merge_branch(data.get("branch"))


async def git_get_conflict_files(git_manager):
    return await git_manager.get_conflict_files()


async def git_resolve_conflict(git_manager, data):
    return await git_manager.resolve_conflict(data.get("path"), data.get("resolution"))


async def git_abort(git_manager):
    return await git_manager.abort()


async def git_stage(git_manager, data):
    return await git_manager.stage(data.get("files", []))


async def git_unstage(git_manager, data):
    return await git_manager.unstage(data.get("files", []))


async def git_reset(git_manager, data):
    return await git_manager.reset(data.get("files", []))


async def git_clean_locks(git_manager):
    return await git_manager.clean_locks()


async def git_stop_tracking(git_manager, data):
    return await git_manager.stop_tracking(data.get("files", []))


async def git_get_remotes(git_manager):
    return await git_manager.get_remotes()


def git_get_credentials(git_manager):
    return git_manager.get_credentials()


async def git_set_credentials(git_manager, data):
    return await git_manager.set_credentials(
        data.get("username"), data.get("token"), data.get("remember_me", True)
    )


async def git_clear_credentials(git_manager):
    return await git_manager.clear_credentials()


async def git_test_connection(git_manager):
    return await git_manager.test_connection()


# ========== Gitea Handlers ==========

async def gitea_status(git_manager, data):
    return await git_manager.get_status(data.get("fetch", False), remote="gitea", auth_provider="gitea")


async def gitea_pull(git_manager):
    return await git_manager.pull(remote="gitea", auth_provider="gitea")


async def gitea_push(git_manager, data):
    return await git_manager.push(
        data.get("commit_message", "Update via Blueprint Studio"),
        remote="gitea", auth_provider="gitea"
    )


async def gitea_push_only(git_manager):
    return await git_manager.push_only(remote="gitea", auth_provider="gitea")


def gitea_get_credentials(git_manager):
    return git_manager.get_credentials(provider="gitea")


async def gitea_set_credentials(git_manager, data):
    return await git_manager.set_credentials(
        data.get("username"), data.get("token"),
        data.get("remember_me", True), provider="gitea"
    )


async def gitea_clear_credentials(git_manager):
    return await git_manager.clear_credentials(provider="gitea")


async def gitea_test_connection(git_manager):
    return await git_manager.test_connection(remote="gitea", auth_provider="gitea")


async def gitea_add_remote(git_manager, data):
    return await git_manager.add_remote(data.get("name", "gitea"), data.get("url"))


async def gitea_remove_remote(git_manager):
    return await git_manager.remove_remote("gitea")


async def gitea_create_repo(git_manager, data):
    return await git_manager.gitea_create_repo(
        data.get("repo_name"), data.get("description", ""),
        data.get("is_private", True), data.get("gitea_url")
    )


# ========== GitHub Handlers ==========

async def github_create_repo(git_manager, data):
    return await git_manager.github_create_repo(
        data.get("repo_name"), data.get("description", ""),
        data.get("is_private", True)
    )


async def github_set_default_branch(git_manager, data):
    return await git_manager.github_set_default_branch(data.get("branch"))


async def github_device_flow_start(git_manager, data):
    return await git_manager.github_device_flow_start(data.get("client_id"))


async def github_device_flow_poll(git_manager, data):
    return await git_manager.github_device_flow_poll(
        data.get("client_id"), data.get("device_code")
    )


async def github_star(git_manager):
    return await git_manager.github_star()


async def github_follow(git_manager):
    return await git_manager.github_follow()
