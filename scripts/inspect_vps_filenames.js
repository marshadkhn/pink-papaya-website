const { execSync } = require('child_process');
const sshScript = 'C:\\Users\\marsh\\.gemini\\antigravity-ide\\brain\\0c16d623-1655-4866-8347-89711b6c8257\\scratch\\ssh.js';

try {
  const out = execSync(`node "${sshScript}" "ls /srv/papaya-media/uploads"`).toString();
  const files = out.trim().split('\n').map(f => f.trim()).filter(f => f.endsWith('.webp'));
  
  console.log(`Total 1559 WebP files. Sample 50 filenames:`);
  console.log(files.slice(0, 50));
} catch (e) {
  console.error(e.message);
}
