# Quick Start: GitHub Authentication

## ⚡ Fastest Way (30 seconds)

**OAuth is pre-configured - no setup needed!**

1. Click **Git Settings** button (GitHub icon)
2. Click **"Login with GitHub OAuth"**
3. Visit the URL shown
4. Enter the code displayed
5. Click "Authorize"
6. Done! ✅

You're now logged in and will stay logged in across restarts.

**No OAuth app creation needed** - Blueprint Studio provides a shared OAuth app for all users!

---

## 🔄 Alternative: Manual PAT Token

If you prefer the traditional method:

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name (e.g., "Blueprint Studio")
4. Select scope: `repo`
5. Generate and copy the token
6. In Blueprint Studio:
   - Click Git Settings
   - Scroll to "Manual PAT Configuration"
   - Enter username and token
   - Click "Save Credentials"

---

## 📖 Full Documentation

See [GITHUB_OAUTH_SETUP.md](./GITHUB_OAUTH_SETUP.md) for complete details, troubleshooting, and advanced configuration.

---

## ✨ Features

- ✅ Stay logged in forever (credentials persist)
- ✅ Easy OAuth Device Flow
- ✅ Traditional PAT support
- ✅ Works with 2FA
- ✅ Switch between methods anytime
