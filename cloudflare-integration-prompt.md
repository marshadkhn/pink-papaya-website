# Claude Code Prompt — Cloudflare Integration for Pink Papaya VPS

> Paste this whole thing into Claude Code (opened in this repo folder: `d:\Magicteal\pink-papaya-website`).

## Context — current deployment state

- App: Next.js + Mongoose (MongoDB Atlas hosted), custom CMS, NOT Payload.
- Deployed on a Hostinger KVM2 VPS at IP `187.127.187.184`, Ubuntu 24.04, no Docker — PM2 + Nginx.
- App user: `papaya` (sudo, SSH key auth). App code: `/var/www/pink-papaya` (disposable, git-cloned from `vps-deploy` branch). Client-uploaded media: `/srv/papaya-media` (persistent, outside the repo, served by Nginx at `/media/...`).
- PM2 process name: `pink-papaya`, fork mode, 1 instance, started via `pm2 start npm --name pink-papaya --max-memory-restart 1500M -- start`, `pm2 startup` wired to systemd as `pm2-papaya.service`.
- Nginx vhost: `/etc/nginx/sites-available/pink-papaya`, currently `server_name 187.127.187.184;`, proxies `/` to `127.0.0.1:3000`, serves `/media/` as a static alias, caches `/_next/static/`. Plain HTTP only right now (port 80), ufw allows 22/80/443.
- Production env file: `/var/www/pink-papaya/.env` (chmod 600, papaya-owned) — currently has `NEXT_PUBLIC_SITE_URL=http://187.127.187.184`.
- SSH access: key-based, dedicated `ed25519` keypair already installed on the box for both `root` and `papaya`. (If you don't have this key in this session, ask the user for SSH access — they have the password as a fallback but key auth is strongly preferred per their own instructions.)

## What you're being asked to do

Wire up Cloudflare in front of this VPS: domain → Cloudflare DNS (proxied) → Nginx origin, with TLS using a **Cloudflare Origin Certificate** and Cloudflare SSL mode **Full (strict)**.

## What you need from the user before starting

1. **Domain name** — must already be added as a Cloudflare zone (active, not pending nameserver change). Ask for it if not already provided.
2. **Cloudflare API token** — scoped custom token with `Zone:DNS:Edit` and `Zone:SSL and Certificates:Edit` on that specific zone. Ask the user to create one at dash.cloudflare.com → My Profile → API Tokens → Create Custom Token, and paste it to you. **Treat this token as a secret**: never echo it back, never commit it to the repo, never put it directly in a shell command line / shell history — write it to a gitignored temp file or pass it via an environment variable set in the same non-history-logged step, and delete/unset it once done.

## Steps to execute

1. **Verify the zone**: call the Cloudflare API (`GET https://api.cloudflare.com/client/v4/zones?name=<domain>`) with the token to confirm the zone exists and is active. Get the zone ID.
2. **DNS record**: create/update an `A` record for the domain (and `www` subdomain if the user wants it) pointing to `187.127.187.184`, with `proxied: true` (orange-cloud).
3. **SSL mode**: set the zone's SSL/TLS mode to **Full (strict)** via `PATCH /zones/{zone_id}/settings/ssl` with `value: "strict"`. Tell the user this requires the origin to present a cert Cloudflare trusts — which is exactly what step 4 sets up.
4. **Origin Certificate**: generate one via `POST /certificates` (Cloudflare's Origin CA endpoint, separate auth — uses the `X-Auth-User-Service-Key` header or the API token if it has Origin CA permissions; check current Cloudflare docs for the exact endpoint, it may require a separate "Origin CA Key" rather than the zone API token). Request a cert covering the domain and `*.domain`. This returns a certificate + private key — capture both.
5. **Install on the VPS**: SSH in as `papaya`. Write the cert to `/etc/nginx/ssl/papaya-origin.pem` and the key to `/etc/nginx/ssl/papaya-origin.key` (create the dir, `chmod 600` the key, root or papaya-owned — do NOT make the key world-readable). Do this by writing local temp files and `scp`-ing them up, then deleting the local temp copies immediately after — never paste the private key directly into an SSH command argument.
6. **Update Nginx vhost** (`/etc/nginx/sites-available/pink-papaya`): change `server_name` from the bare IP to the real domain (+ www if used), add a `listen 443 ssl;` server block referencing the cert/key paths above, add a redirect from port 80 to 443 (Cloudflare will hit port 80 if "Always Use HTTPS" isn't on, but redirecting is still correct practice), keep the existing `/media/`, `/_next/static/`, and `/` proxy_pass locations. Run `nginx -t` before reloading.
7. **Firewall**: ufw already allows 443, confirm with `ufw status`.
8. **Update app config**: change `NEXT_PUBLIC_SITE_URL` in `/var/www/pink-papaya/.env` to `https://<domain>`. Restart the app: `pm2 restart pink-papaya`.
9. **Cloudflare extras** (ask before doing, or just tell the user to do manually in the dashboard):
   - Cache rule: cache everything under `/media/*` and `/_next/static/*` at the edge.
   - "Always Use HTTPS" toggle on.
10. **Verify**: `curl -I https://<domain>/` should return 200 from origin via Cloudflare (check `cf-ray` header present, `Server: cloudflare`). Confirm a `/media/...` image still loads. Confirm `http://<domain>/` redirects to https.

## Notes / constraints to respect

- This is a 2 vCPU / 8GB box already running close to lean — don't add anything heavyweight.
- Don't touch `/srv/papaya-media` (persistent media bucket) or the app's Mongoose/MongoDB Atlas config — out of scope here.
- Treat any secrets (API token, origin private key) with the same care as the existing SSH key handling in this deployment: no plaintext in shell history/command-line args, temp files cleaned up after use.
- After finishing, give the user a short summary: what DNS record was created, confirmation SSL mode is Full (strict), and the verification curl results. Remind them to flip Cloudflare SSL mode back to "Flexible" temporarily if they ever see SSL handshake errors before the origin cert is correctly installed (common pitfall: enabling Full/strict before the origin cert exists causes 521/525 errors).
