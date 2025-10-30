# GitHub Setup Instructions

## Step 1: Create a GitHub Repository

1. Go to https://github.com/new
2. Repository name: `rhdh-mcp-demo` (or any name you prefer)
3. Choose **Public** or **Private**
4. **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

## Step 2: Add Remote and Push

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add your GitHub repository as remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/rhdh-mcp-demo.git

# Rename branch to main if needed (GitHub uses 'main' by default)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Or if using SSH:**
```bash
git remote add origin git@github.com:YOUR_USERNAME/rhdh-mcp-demo.git
git branch -M main
git push -u origin main
```

## Step 3: Point Backstage to the Repository

Once pushed to GitHub:

1. Go to your Backstage portal: http://localhost:7007
2. Navigate to **Catalog** → **Register Existing Component**
3. Select **GitHub** as the location type
4. Enter the repository URL: `https://github.com/YOUR_USERNAME/rhdh-mcp-demo`
5. Backstage will auto-discover all `catalog-info.yaml` files

**Or register individual components:**
- Backend: `https://github.com/YOUR_USERNAME/rhdh-mcp-demo/blob/main/backend/catalog-info.yaml`
- Frontend: `https://github.com/YOUR_USERNAME/rhdh-mcp-demo/blob/main/frontend/catalog-info.yaml`
- Client: `https://github.com/YOUR_USERNAME/rhdh-mcp-demo/blob/main/client-service/catalog-info.yaml`
- System: `https://github.com/YOUR_USERNAME/rhdh-mcp-demo/blob/main/catalog-info.yaml`

## Alternative: Update catalog-info.yaml URLs

If you want the catalog files to reference the GitHub location, update the `backstage.io/techdocs-ref` annotation in each catalog-info.yaml to point to your GitHub repo.
