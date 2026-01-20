# GitHub OAuth Device Flow Setup

Blueprint Studio supports **OAuth Device Flow** for easy GitHub authentication! No manual token creation needed.

## 🎉 Pre-Configured OAuth App (Recommended)

**Good news!** Blueprint Studio comes with a **pre-configured shared OAuth app** that all users can use immediately.

### ⚡ Just Click and Go!

1. Click **"Login with GitHub OAuth"** in Git Settings
2. Visit the URL and enter the code shown
3. Authorize Blueprint Studio
4. Done! You're logged in

**No setup required** - the OAuth app is already configured for you!

### 🔒 Is This Safe?

Yes! This is the standard approach used by:
- ✅ GitHub CLI (`gh`)
- ✅ VSCode
- ✅ Git Credential Manager
- ✅ Many other tools

The OAuth Client ID is **public and meant to be shared**. Each user still:
- Authenticates with their own GitHub account
- Gets their own private access token
- Controls their own authorization

---

## 🔧 Advanced: Using Your Own OAuth App (Optional)

If you prefer to use your own GitHub OAuth app for privacy/security reasons, you can create one:

### Step 1: Create a GitHub OAuth App

1. Go to: https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Fill in the details:
   - **Application name:** Blueprint Studio (or any name)
   - **Homepage URL:** `https://github.com/yourusername/repo` (or any URL)
   - **Authorization callback URL:** Leave blank or use `http://localhost` (not used by Device Flow)
   - **Application description:** (optional)

4. Click **"Register application"**

5. You'll see your **Client ID** - copy this (it looks like: `Ov23liXXXXXXXXXXXXXX`)

6. **Important:** You do NOT need to generate a client secret for Device Flow!

### Step 2: Configure Your Custom Client ID

To use your own OAuth Client ID, you can set it via browser console:

**Open Browser Console** (F12 or right-click → Inspect → Console):
```javascript
localStorage.setItem("githubOAuthClientId", "YOUR_CLIENT_ID_HERE");
```

Replace `YOUR_CLIENT_ID_HERE` with your actual Client ID.

**That's it!** Next time you click "Login with GitHub OAuth", it will use your custom Client ID instead of the shared one.

### Step 3: Use Your OAuth App

After configuring your Client ID:
1. Refresh Blueprint Studio
2. Click "Login with GitHub OAuth"
3. Authorize using your OAuth app
4. Done!

---

## 🔐 Security & Privacy

### Default OAuth App

- **Client ID is public** - This is normal and safe for OAuth Device Flow
- **No client secret** - Device Flow doesn't use secrets
- **Used by all Blueprint Studio users** - Shared OAuth app (like VSCode, GitHub CLI)
- **Your credentials stay local** - Only stored on your Home Assistant instance
- **No data sent to third parties** - Direct GitHub API communication only

### Your Own OAuth App

- **Full control** - You own and manage the OAuth app
- **Private** - Only you use this OAuth app
- **Same security** - OAuth Device Flow is equally secure

---

## 📝 How OAuth Device Flow Works

1. **Request Code:** Blueprint Studio asks GitHub for a device code and user code
2. **Show Code:** You see a code like `ABCD-1234`
3. **Authorize:** Visit GitHub and enter the code
4. **Poll for Token:** Blueprint Studio polls GitHub for authorization
5. **Get Token:** Once authorized, GitHub provides an access token
6. **Save Token:** Token is saved persistently (same as PAT method)
7. **Done:** You're logged in!

**Technical Details:**
- Uses GitHub's standard Device Flow API
- No redirect URLs needed (perfect for local Home Assistant)
- Works on any network (local, VPN, remote)
- Token is saved with base64 encoding (same as PAT)

---

## 🆚 PAT vs OAuth Device Flow Comparison

| Feature | PAT Method | OAuth Device Flow |
|---------|------------|-------------------|
| **Setup Complexity** | Manual token creation | Click and authorize |
| **User Experience** | Copy/paste token | Click and type code |
| **Security** | Long-lived token | OAuth token (refreshable) |
| **2FA Support** | Manual | Automatic |
| **Token Visibility** | You see it | Hidden from user |
| **Persistence** | ✅ Yes | ✅ Yes |
| **OAuth App Required** | ❌ No | ⚠️ Yes (provided by default) |

---

## 🐛 Troubleshooting

### "Failed to start device flow"

**Cause:** Cannot reach GitHub's OAuth API

**Solutions:**
- Check your internet connection
- Verify Home Assistant can reach github.com
- Check firewall settings

### "Login expired"

**Cause:** Took too long to authorize (usually 15 minutes)

**Solutions:**
- Click "Login with GitHub" again
- Authorize faster (code expires in 15 min)

### "Access denied"

**Cause:** You clicked "Cancel" or denied authorization on GitHub

**Solutions:**
- Click "Login with GitHub" again
- Accept the authorization on GitHub

### "Invalid client_id"

**Cause:** Using a custom OAuth app with wrong Client ID

**Solutions:**
- Verify your Client ID is correct
- Make sure you copied the full ID from GitHub
- Try using the default OAuth app first

---

## 🔄 Switching Between Methods

You can switch between OAuth and PAT at any time:

**From PAT to OAuth:**
1. Open Git Settings
2. Click "Login with GitHub"
3. Authorize
4. Your new OAuth token replaces the PAT

**From OAuth to PAT:**
1. Open Git Settings
2. Scroll to "Manual PAT Configuration"
3. Enter username and PAT token
4. Click "Save Credentials"
5. Your new PAT replaces the OAuth token

**Note:** Only one set of credentials is stored at a time.

---

## 📚 Additional Resources

- **GitHub Device Flow Docs:** https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps#device-flow
- **Creating PAT Tokens:** https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
- **OAuth Best Practices:** https://docs.github.com/en/developers/apps/building-oauth-apps/best-practices-for-oauth-apps

---

## ✨ Benefits Over PAT

1. **Easier for new users** - No need to navigate GitHub settings
2. **Better UX** - Click, code, done
3. **More secure** - No manual token handling
4. **Works with 2FA** - No special setup needed
5. **Standard OAuth** - Same flow as VSCode, GitHub CLI, etc.

---

## 💡 FAQ

**Q: Do I need to create an OAuth app?**
A: No! Blueprint Studio provides a pre-configured shared OAuth app for all users.

**Q: Can I use my own OAuth app?**
A: Yes! Use browser console to set your custom Client ID (instructions above).

**Q: Is the shared OAuth app safe?**
A: Yes! This is the standard approach used by GitHub CLI, VSCode, and many other tools. Your credentials stay private on your Home Assistant instance.

**Q: Is OAuth more secure than PAT?**
A: Both are secure. OAuth has better UX and works better with 2FA.

**Q: Will my credentials persist after restart?**
A: Yes! Both PAT and OAuth tokens are saved persistently.

**Q: Can I switch between PAT and OAuth?**
A: Yes! You can switch at any time in Git Settings.

**Q: What happens to the old token when I switch?**
A: It's replaced with the new one. Old token is deleted.

**Q: Where are credentials stored?**
A: In `.storage/blueprint_studio.credentials` on your Home Assistant instance (encrypted by Home Assistant).

**Q: Can I revoke access?**
A: Yes! Go to GitHub Settings → Applications → Blueprint Studio → Revoke

---

## 🎉 Enjoy Easy GitHub Authentication!

No more manually creating PAT tokens! Just click "Login with GitHub" and you're done.

Happy coding! 🚀
