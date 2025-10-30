# GitHub Authentication Setup

## Option 1: Use Personal Access Token (Quickest)

1. **Create a Personal Access Token:**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Give it a name: `rhdh-mcp-demo`
   - Select scopes: **repo** (full control of private repositories)
   - Click "Generate token"
   - **COPY THE TOKEN** (you won't see it again!)

2. **Use the token when pushing:**
   ```bash
   # When prompted for password, paste your token instead
   git push -u origin main
   ```

3. **Or configure credential helper to store it:**
   ```bash
   git config --global credential.helper osxkeychain  # macOS
   # Then on first push, use token as password, it will be saved
   ```

## Option 2: Switch to SSH (Recommended for long-term)

1. **Generate SSH key (if you don't have one):**
   ```bash
   ssh-keygen -t ed25519 -C "basivasu@redhat.com"
   # Press Enter to accept default location
   # Press Enter for no passphrase (or set one)
   ```

2. **Add SSH key to ssh-agent:**
   ```bash
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_ed25519
   ```

3. **Copy public key to clipboard:**
   ```bash
   pbcopy < ~/.ssh/id_ed25519.pub
   ```

4. **Add to GitHub:**
   - Go to: https://github.com/settings/keys
   - Click "New SSH key"
   - Paste your key and save

5. **Switch remote to SSH:**
   ```bash
   git remote set-url origin git@github.com:balajisiva/rhdh-mcp-demo.git
   git push -u origin main
   ```

## Quick Fix (HTTPS with Token)

If you have a token ready, you can also update the remote URL to include your username:
```bash
git remote set-url origin https://YOUR_TOKEN@github.com/balajisiva/rhdh-mcp-demo.git
git push -u origin main
```
But this exposes the token in git config (less secure).

**Recommended: Use Option 1 with credential helper or Option 2 (SSH).**
