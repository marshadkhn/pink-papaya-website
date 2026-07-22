---
name: live
description: Triggered when user types /live or requests to build, push to GitHub, deploy to VPS, and verify live server status.
---

# Live Deployment Workflow (/live)

When the user asks to deploy to live or triggers `/live`:

1. **Build & Typecheck Verification**:
   - Run `npx tsc --noEmit` and `npm run lint` (or check for compilation errors) in `d:\Freelancing\Magicteal\pink-papaya-website`.

2. **Commit and Push to GitHub**:
   - Stage changes: `git add .`
   - Commit with descriptive message: `git commit -m "..."`
   - Push to main branch: `git push origin main`

3. **Deploy & Verify on VPS**:
   - Execute the deploy script: `node scripts/vps-deploy.js`
   - This script connects via SSH to `187.127.187.184`, pulls `main`, installs dependencies, runs `npm run build`, restarts PM2 (`pink-papaya`), and verifies PM2 status & `curl` response.

4. **Status Report**:
   - Inform the user of successful completion with details on PM2 status and HTTP health.
