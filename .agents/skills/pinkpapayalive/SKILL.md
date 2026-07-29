---
name: pinkpapayalive
description: Triggered when user types /pinkpapayalive or requests to build, push to GitHub, deploy to VPS, and verify Pink Papaya live server status.
---

# Pink Papaya Live Deployment Workflow (/pinkpapayalive)

When the user asks to deploy to live or triggers `/pinkpapayalive`:

### Core Routing Rules:
- **Domain (`https://pinkpapayastays.com/`)**: MUST ONLY display the minimal "Coming Soon" landing page.
- **IP Address (`http://187.127.187.184`)**: MUST ONLY host and serve the full live website & admin portal (`http://187.127.187.184/admin`).

---

### Deployment Steps:

1. **Build & Typecheck Verification**:
   - Run `npx tsc --noEmit` in `d:\Freelancing\Magicteal\pink-papaya-website`.

2. **Commit and Push to GitHub**:
   - Stage changes: `git add .`
   - Commit with descriptive message: `git commit -m "..."`
   - Push to main branch: `git push origin main`

3. **Deploy & Verify on VPS**:
   - Execute the deploy script: `node scripts/vps-deploy.js`
   - This script connects via SSH to `187.127.187.184`, pulls `main`, installs dependencies, runs `npm run build`, restarts PM2 (`pink-papaya`), and verifies PM2 status.

4. **Verify Routing & Server Health**:
   - Confirm `http://187.127.187.184` serves the full live website.
   - Confirm domain `https://pinkpapayastays.com/` serves the "Coming Soon" page.

5. **Status Report**:
   - Inform the user of successful deployment with live URLs for both IP access and domain Coming Soon status.
