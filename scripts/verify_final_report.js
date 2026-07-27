const { execSync } = require('child_process');
const sshScript = 'C:\\Users\\marsh\\.gemini\\antigravity-ide\\brain\\0c16d623-1655-4866-8347-89711b6c8257\\scratch\\ssh.js';

try {
  const out = execSync(`node "${sshScript}" "curl -s http://localhost:3000/api/stays"`).toString();
  const startIdx = out.indexOf('[');
  const endIdx = out.lastIndexOf(']');
  if (startIdx !== -1 && endIdx !== -1) {
    const stays = JSON.parse(out.substring(startIdx, endIdx + 1));
    console.log(`Total Stays in DB: ${stays.length}`);
    console.table(stays.map(s => ({
      ID: s.id,
      Title: s.title,
      'Main Image': s.imageUrl ? 'YES' : 'NO',
      'Gallery Images': (s.images || []).length
    })));
  }
} catch (e) {
  console.error(e);
}
