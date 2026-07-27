const { execSync } = require('child_process');
const sshScript = 'C:\\Users\\marsh\\.gemini\\antigravity-ide\\brain\\0c16d623-1655-4866-8347-89711b6c8257\\scratch\\ssh.js';

try {
  const out = execSync(`node "${sshScript}" "su - papaya -c \\"cd /var/www/pink-papaya; node -e 'const path = require(\\\\\"path\\\\\"); const { env } = require(\\\\\"./.next/server/chunks/225.js\\\\\"); console.log(env.MEDIA_DIR || path.join(process.cwd(), \\\\\"public\\\\\", \\\\\"uploads\\\\\"))'\\""`).toString();
  console.log('VPS MEDIA DIR OUTPUT:', out);
} catch (e) {
  console.error(e);
}
