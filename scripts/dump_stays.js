const { execSync } = require('child_process');

const sshScript = 'C:\\Users\\marsh\\.gemini\\antigravity-ide\\brain\\0c16d623-1655-4866-8347-89711b6c8257\\scratch\\ssh.js';

try {
  const out = execSync(`node "${sshScript}" "curl -s http://localhost:3000/api/stays"`).toString();
  const startIdx = out.indexOf('[');
  const endIdx = out.lastIndexOf(']');
  if (startIdx !== -1 && endIdx !== -1) {
    const jsonStr = out.substring(startIdx, endIdx + 1);
    const stays = JSON.parse(jsonStr);
    console.log(`TOTAL STAYS: ${stays.length}`);
    stays.forEach((s, i) => {
      console.log(`${i + 1}. "${s.title}" (id: "${s.id || s._id}") | imageUrl: "${s.imageUrl || ''}" | images: ${(s.images || []).length}`);
    });
  }
} catch (e) {
  console.error(e);
}
