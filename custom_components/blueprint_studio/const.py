"""Constants for the Blueprint Studio integration."""

import json
from pathlib import Path

DOMAIN = "blueprint_studio"
NAME = "Blueprint Studio"
VERSION = json.loads((Path(__file__).parent / "manifest.json").read_text())["version"]

# Binary file extensions that should be base64 encoded
BINARY_EXTENSIONS = {
    ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".ico", ".avif", ".apng", ".pdf", ".zip",
    ".db", ".sqlite", ".sqlite3", ".db-shm", ".db-wal", ".db-journal",
    ".der", ".bin", ".ota", ".tar", ".gz", ".ttf", ".otf", ".woff", ".woff2", ".eot", ".wasm",
    ".mp4", ".webm", ".mov", ".avi", ".mkv", ".flv", ".wmv", ".m4v",
    ".mp3", ".wav", ".ogg", ".flac", ".aac", ".m4a", ".wma", ".opus",
}

# Text file extensions that can be opened directly in the editor.
TEXT_EXTENSIONS = {
    ".yaml", ".yml", ".json", ".toml", ".csv", ".conf", ".cfg", ".ini",
    ".env", ".properties", ".plist", ".lock", ".webmanifest", ".manifest",
    ".html", ".htm", ".xml", ".md", ".rst", ".txt", ".log",
    ".jinja", ".jinja2", ".j2",
    ".py", ".js", ".mjs", ".cjs", ".ts", ".jsx", ".tsx", ".css", ".scss", ".less", ".map",
    ".sh", ".bash", ".zsh",
    ".go", ".rs", ".c", ".cpp", ".h", ".java", ".kt", ".swift",
    ".rb", ".php", ".lua", ".r", ".cs", ".sql",
    ".service", ".gradle", ".dockerignore", ".gitignore",
    ".pem", ".crt", ".key", ".svg",
}

# Directories/patterns to exclude
EXCLUDED_PATTERNS = {
    "__pycache__",
    ".git",
    ".cache",
    "deps",
    "tts",
    ".git_credential_helper",
}

# Protected paths that cannot be deleted
PROTECTED_PATHS = {
    "configuration.yaml",
    "secrets.yaml",
    "home-assistant.log",
    ".storage",
}
