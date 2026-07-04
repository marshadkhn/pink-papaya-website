# CDN & Caching Task Runner

You are helping manage CDN and caching for **pinkpapayastays.com** hosted on a VPS (187.127.187.184) with Cloudflare in front.

## Infrastructure

- **VPS:** Hostinger KVM2, Ubuntu 24.04, IP `187.127.187.184`
- **App:** Next.js 15, running via PM2 as user `papaya`, at `/var/www/pink-papaya`
- **Media storage:** `/srv/papaya-media/` (images uploaded here, served at `/media/`)
- **Nginx:** `/etc/nginx/sites-available/pink-papaya`
- **Cloudflare:** pinkpapayastays.com zone, Full (strict) SSL, Origin Certificate at `/etc/nginx/ssl/`
- **SSH:** `root@187.127.187.184` (ask user for password if needed)

## Media Pipeline

Images uploaded via `/api/upload` or `/api/cms/media/upload`:
1. Converted to WebP via `sharp` (max 2000px, 80% quality)
2. Saved to `/srv/papaya-media/uploads/` or `/srv/papaya-media/cms-media/`
3. Served by Nginx at `/media/uploads/...` with `Cache-Control: public, immutable`
4. Cloudflare caches at edge via Cache Rule (Edge TTL 30 days, Browser TTL 1 day)

Key files:
- `src/lib/media-storage.ts` — upload + WebP conversion logic
- `src/lib/media-url.ts` — URL helpers
- `src/app/api/upload/route.ts` — public upload API
- `src/app/api/cms/media/upload/route.ts` — CMS upload API (auth required)
- `vps/nginx/pink-papaya` — Nginx vhost config

## Cloudflare Settings (already configured)

- **Cache Rule:** `/media/*` and `/_next/static/*` → Eligible for cache, Edge TTL 30d, Browser TTL 1d
- **Polish:** Lossy + WebP (auto re-compress images at edge)
- **SSL:** Full (strict)
- **Always Use HTTPS:** ON

## Common Tasks

### 1. Purge Cloudflare cache for media
Use Cloudflare API:
```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/{ZONE_ID}/purge_cache" \
  -H "Authorization: Bearer {CF_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{"prefixes":["https://pinkpapayastays.com/media/"]}'
```
Or purge everything: `{"purge_everything": true}`

### 2. Check what's cached on VPS vs Cloudflare
```bash
# Hit origin directly (bypass Cloudflare)
curl -I --resolve pinkpapayastays.com:443:187.127.187.184 https://pinkpapayastays.com/media/uploads/somefile.webp

# Hit via Cloudflare (check CF-Cache-Status header)
curl -I https://pinkpapayastays.com/media/uploads/somefile.webp
# CF-Cache-Status: HIT = served from edge, MISS = fetched from VPS
```

### 3. Change WebP quality or max image size
Edit `src/lib/media-storage.ts`:
- `MAX_DIMENSION` — max width/height in pixels (currently 2000)
- `WEBP_QUALITY` — 0-100 (currently 80)
Then rebuild and restart on VPS:
```bash
cd /var/www/pink-papaya && git pull && npm run build
su - papaya -c 'pm2 restart pink-papaya'
```

### 4. Check disk usage of media
```bash
ssh root@187.127.187.184
du -sh /srv/papaya-media/
du -sh /srv/papaya-media/uploads/
du -sh /srv/papaya-media/cms-media/
df -h /srv
```

### 5. Add a new upload folder/type
In `src/lib/media-storage.ts`, the `folder` param in `uploadPublicAsset()` controls the subfolder.
Pass `folder: "your-folder"` when calling `uploadPublicAsset`. It auto-creates the directory.

### 6. Nginx cache headers
Current config in `vps/nginx/pink-papaya`:
- `/media/*` → `expires 30d; Cache-Control: public, immutable`
- `/_next/static/*` → `expires 1y; Cache-Control: public, immutable`

To update, edit the file and run:
```bash
scp vps/nginx/pink-papaya root@187.127.187.184:/tmp/pink-papaya.nginx
ssh root@187.127.187.184 "mv /tmp/pink-papaya.nginx /etc/nginx/sites-available/pink-papaya && nginx -t && systemctl reload nginx"
```

### 7. Cloudflare dashboard quick links
- Cache Rules: dash.cloudflare.com → pinkpapayastays.com → Caching → Cache Rules
- Polish: → Speed → Optimization → Images
- Purge Cache: → Caching → Configuration → Purge Everything
- SSL mode: → SSL/TLS → Overview

## Environment Variables (VPS .env)

| Variable | Purpose |
|---|---|
| `MEDIA_DIR` | Local disk path for uploads (`/srv/papaya-media`) |
| `NEXT_PUBLIC_CDN_BASE_URL` | Base URL for media (set to `https://pinkpapayastays.com` for absolute URLs) |
| `NEXT_PUBLIC_SITE_URL` | Site URL (`https://pinkpapayastays.com`) |

To update env and restart:
```bash
ssh root@187.127.187.184
echo 'NEXT_PUBLIC_CDN_BASE_URL=https://pinkpapayastays.com' >> /var/www/pink-papaya/.env
su - papaya -c 'pm2 restart pink-papaya'
```
