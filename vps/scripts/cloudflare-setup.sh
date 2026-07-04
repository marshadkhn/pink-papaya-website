#!/usr/bin/env bash
# cloudflare-setup.sh — run locally (not on the VPS)
# Usage: CF_TOKEN=<your_token> bash cloudflare-setup.sh
#
# Requires: curl, jq, ssh + scp access to the VPS as papaya@187.127.187.184
# The token needs: Zone:DNS:Edit + Zone:SSL and Certificates:Edit + Zone:Read
# (Origin CA certificates also require Zone:SSL and Certificates:Edit)

set -euo pipefail

DOMAIN="pinkpapayastays.com"
VPS_IP="187.127.187.184"
VPS_USER="papaya"
VPS_SSH="${VPS_USER}@${VPS_IP}"

if [[ -z "${CF_TOKEN:-}" ]]; then
  echo "ERROR: set CF_TOKEN before running this script."
  echo "  CF_TOKEN=<token> bash cloudflare-setup.sh"
  exit 1
fi

CF_API="https://api.cloudflare.com/client/v4"
AUTH_HEADER="Authorization: Bearer ${CF_TOKEN}"

# ── 1. Verify zone ────────────────────────────────────────────────────────────
echo "==> [1] Verifying Cloudflare zone for ${DOMAIN}..."
ZONE_RESP=$(curl -sS -X GET "${CF_API}/zones?name=${DOMAIN}" \
  -H "${AUTH_HEADER}" -H "Content-Type: application/json")

ZONE_ID=$(echo "${ZONE_RESP}" | jq -r '.result[0].id // empty')
ZONE_STATUS=$(echo "${ZONE_RESP}" | jq -r '.result[0].status // empty')

if [[ -z "${ZONE_ID}" ]]; then
  echo "ERROR: Zone not found for ${DOMAIN}. Make sure the domain is added to Cloudflare."
  exit 1
fi
if [[ "${ZONE_STATUS}" != "active" ]]; then
  echo "ERROR: Zone status is '${ZONE_STATUS}', expected 'active'. Check nameservers."
  exit 1
fi
echo "  Zone ID: ${ZONE_ID}  Status: ${ZONE_STATUS}"

# ── 2. DNS A record ───────────────────────────────────────────────────────────
echo "==> [2] Creating/updating DNS A records..."
for RECORD_NAME in "${DOMAIN}" "www.${DOMAIN}"; do
  # Check if record already exists
  EXISTING=$(curl -sS -X GET \
    "${CF_API}/zones/${ZONE_ID}/dns_records?type=A&name=${RECORD_NAME}" \
    -H "${AUTH_HEADER}" | jq -r '.result[0].id // empty')

  if [[ -n "${EXISTING}" ]]; then
    curl -sS -X PUT \
      "${CF_API}/zones/${ZONE_ID}/dns_records/${EXISTING}" \
      -H "${AUTH_HEADER}" -H "Content-Type: application/json" \
      -d "{\"type\":\"A\",\"name\":\"${RECORD_NAME}\",\"content\":\"${VPS_IP}\",\"proxied\":true,\"ttl\":1}" \
      | jq -r '"  Updated: \(.result.name) → \(.result.content) proxied=\(.result.proxied)"'
  else
    curl -sS -X POST \
      "${CF_API}/zones/${ZONE_ID}/dns_records" \
      -H "${AUTH_HEADER}" -H "Content-Type: application/json" \
      -d "{\"type\":\"A\",\"name\":\"${RECORD_NAME}\",\"content\":\"${VPS_IP}\",\"proxied\":true,\"ttl\":1}" \
      | jq -r '"  Created: \(.result.name) → \(.result.content) proxied=\(.result.proxied)"'
  fi
done

# ── 3. SSL mode → Full (strict) ───────────────────────────────────────────────
echo "==> [3] Setting SSL mode to Full (strict)..."
curl -sS -X PATCH \
  "${CF_API}/zones/${ZONE_ID}/settings/ssl" \
  -H "${AUTH_HEADER}" -H "Content-Type: application/json" \
  -d '{"value":"strict"}' \
  | jq -r '"  SSL mode: \(.result.value)"'

# ── 4. Generate Origin Certificate ───────────────────────────────────────────
echo "==> [4] Requesting Cloudflare Origin Certificate..."
CERT_RESP=$(curl -sS -X POST \
  "${CF_API}/certificates" \
  -H "${AUTH_HEADER}" -H "Content-Type: application/json" \
  -d "{
    \"hostnames\": [\"${DOMAIN}\", \"*.${DOMAIN}\"],
    \"requested_validity\": 5475,
    \"request_type\": \"origin-rsa\",
    \"csr\": \"\"
  }")

ORIGIN_CERT=$(echo "${CERT_RESP}" | jq -r '.result.certificate // empty')
ORIGIN_KEY=$(echo "${CERT_RESP}" | jq -r '.result.private_key // empty')

if [[ -z "${ORIGIN_CERT}" || -z "${ORIGIN_KEY}" ]]; then
  echo "ERROR: Failed to generate Origin Certificate."
  echo "${CERT_RESP}" | jq .
  exit 1
fi
echo "  Origin certificate issued."

# ── 5. Write temp files locally and SCP to VPS ───────────────────────────────
echo "==> [5] Installing certificate on VPS..."

TMPDIR_LOCAL=$(mktemp -d)
trap 'rm -rf "${TMPDIR_LOCAL}"' EXIT   # always clean up

echo "${ORIGIN_CERT}" > "${TMPDIR_LOCAL}/papaya-origin.pem"
echo "${ORIGIN_KEY}"  > "${TMPDIR_LOCAL}/papaya-origin.key"
chmod 600 "${TMPDIR_LOCAL}/papaya-origin.key"

# Create ssl dir on VPS, then SCP
ssh "${VPS_SSH}" "sudo mkdir -p /etc/nginx/ssl && sudo chown papaya:papaya /etc/nginx/ssl && chmod 700 /etc/nginx/ssl"
scp "${TMPDIR_LOCAL}/papaya-origin.pem" "${VPS_SSH}:/etc/nginx/ssl/papaya-origin.pem"
scp "${TMPDIR_LOCAL}/papaya-origin.key" "${VPS_SSH}:/etc/nginx/ssl/papaya-origin.key"
ssh "${VPS_SSH}" "chmod 644 /etc/nginx/ssl/papaya-origin.pem && chmod 600 /etc/nginx/ssl/papaya-origin.key && sudo chown root:root /etc/nginx/ssl/papaya-origin.*"

# Local temp files cleaned up by trap
echo "  Certificate installed. Local temp copies deleted."

# ── 6. Deploy Nginx vhost ─────────────────────────────────────────────────────
echo "==> [6] Deploying Nginx vhost..."
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NGINX_CONF="${SCRIPT_DIR}/../nginx/pink-papaya"

scp "${NGINX_CONF}" "${VPS_SSH}:/tmp/pink-papaya.nginx"
ssh "${VPS_SSH}" "sudo mv /tmp/pink-papaya.nginx /etc/nginx/sites-available/pink-papaya \
  && sudo nginx -t \
  && sudo systemctl reload nginx"
echo "  Nginx config deployed and reloaded."

# ── 7. Confirm firewall ───────────────────────────────────────────────────────
echo "==> [7] Checking UFW status..."
ssh "${VPS_SSH}" "sudo ufw status" | grep -E "443|Status"

# ── 8. Update app .env on VPS ────────────────────────────────────────────────
echo "==> [8] Updating NEXT_PUBLIC_SITE_URL in app .env..."
ssh "${VPS_SSH}" "sed -i 's|NEXT_PUBLIC_SITE_URL=.*|NEXT_PUBLIC_SITE_URL=https://${DOMAIN}|' /var/www/pink-papaya/.env \
  || echo 'NEXT_PUBLIC_SITE_URL=https://${DOMAIN}' >> /var/www/pink-papaya/.env"
ssh "${VPS_SSH}" "pm2 restart pink-papaya && sleep 3 && pm2 status pink-papaya"
echo "  App restarted with new SITE_URL."

# ── 9. Cloudflare extras (manual — dashboard is easiest) ─────────────────────
echo ""
echo "==> [9] Recommended Cloudflare dashboard tweaks (do manually):"
echo "    a) SSL/TLS → Edge Certificates → Always Use HTTPS → ON"
echo "    b) Caching → Cache Rules → Cache /media/* and /_next/static/* at edge"

# ── 10. Verify ────────────────────────────────────────────────────────────────
echo ""
echo "==> [10] Verifying..."
sleep 5  # give Cloudflare a moment

echo "  HTTPS response:"
curl -sI "https://${DOMAIN}/" | grep -E "HTTP/|cf-ray|server|location" || true

echo ""
echo "  HTTP redirect:"
curl -sI "http://${DOMAIN}/" | grep -E "HTTP/|location" || true

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  DONE                                                    ║"
echo "║  DNS A records: ${DOMAIN} + www → ${VPS_IP} (proxied)  ║"
echo "║  SSL mode: Full (strict)                                 ║"
echo "║  Origin cert: *.${DOMAIN} — valid 15 years               ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "  PITFALL REMINDER: If you ever see 521/525 errors, temporarily"
echo "  switch Cloudflare SSL mode to 'Flexible' until the origin cert"
echo "  is confirmed installed, then switch back to 'Full (strict)'."
