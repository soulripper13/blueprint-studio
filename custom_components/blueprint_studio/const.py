"""Constants for the Blueprint Studio integration."""

DOMAIN = "blueprint_studio"
NAME = "Blueprint Studio"
VERSION = "2.1.5"

# File extensions allowed for editing
ALLOWED_EXTENSIONS = {
    ".yaml", ".yml", ".json", ".py", ".js", ".css", ".html", ".txt",
    ".md", ".conf", ".cfg", ".ini", ".sh", ".log", ".gitignore", ".jinja", ".jinja2", ".j2",
    ".db", ".sqlite",
    ".pem", ".crt", ".key", ".der", ".bin", ".ota", ".cpp", ".h", ".tar", ".gz",
    ".lock",
    ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg", ".webp", ".ico",
    ".pdf", ".zip",
}

# Binary file extensions that should be base64 encoded
BINARY_EXTENSIONS = {
    ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".ico", ".pdf", ".zip",
    ".db", ".sqlite",
    ".der", ".bin", ".ota", ".tar", ".gz"
}

# Specific filenames allowed even if they don't have an extension
ALLOWED_FILENAMES = {
    ".gitignore",
    ".ha_run.lock"
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
