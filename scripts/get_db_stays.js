const { execSync } = require('child_process');

const sshScript = 'C:\\Users\\marsh\\.gemini\\antigravity-ide\\brain\\0c16d623-1655-4866-8347-89711b6c8257\\scratch\\ssh.js';

try {
  const out = execSync(`node "${sshScript}" "curl -s http://localhost:3000/api/stays"`).toString();
  const startIdx = out.indexOf('[');
  const endIdx = out.lastIndexOf(']');
  if (startIdx !== -1 && endIdx !== -1) {
    const jsonStr = out.substring(startIdx, endIdx + 1);
    const stays = JSON.parse(jsonStr);
    console.log(`TOTAL STAYS IN DATABASE: ${stays.length}\n`);
    stays.forEach((s, i) => {
      console.log(`${i + 1}. Title: "${s.title}"`);
      console.log(`   ID: "${s.id || s._id}"`);
      console.log(`   Category/Location: "${s.category || ''}" / "${s.location || ''}"`);
      console.log(`   Main Image: "${s.imageUrl || '(none)'}"`);
      console.log(`   Gallery Images: ${(s.images || []).length} image(s)`);
      console.log('----------------------------------------------------');
    });
  } else {
    console.log('Could not find JSON array in output:', out);
  }
} catch (e) {
  console.error('Error fetching stays:', e.message);
}
