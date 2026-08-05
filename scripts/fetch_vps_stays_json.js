const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const sshScript = 'C:\\Users\\marsh\\.gemini\\antigravity-ide\\brain\\0c16d623-1655-4866-8347-89711b6c8257\\scratch\\ssh.js';

try {
  console.log('Fetching live stays from VPS API...');
  const out = execSync(`node "${sshScript}" "curl -s http://localhost:3000/api/stays"`).toString();
  const startIdx = out.indexOf('[');
  const endIdx = out.lastIndexOf(']');
  if (startIdx !== -1 && endIdx !== -1) {
    const jsonStr = out.substring(startIdx, endIdx + 1);
    const stays = JSON.parse(jsonStr);
    console.log(`Fetched ${stays.length} stays from VPS MongoDB database!`);
    
    // Save to vps-stays-backup.json
    fs.writeFileSync(path.join(__dirname, 'vps-stays-backup.json'), JSON.stringify(stays, null, 2));
    console.log('Saved backup to scripts/vps-stays-backup.json');

    const withUploads = stays.filter(s => s.imageUrl && s.imageUrl.includes('/media/uploads/'));
    console.log(`Stays with real uploaded VPS images (/media/uploads/): ${withUploads.length}`);
    withUploads.forEach(s => {
      console.log(`- ${s.id || s._id} (${s.title}): ${s.imageUrl} (Gallery: ${s.images ? s.images.length : 0})`);
    });
  } else {
    console.log('No JSON output returned:', out);
  }
} catch (e) {
  console.error('Error fetching VPS stays:', e.message);
}
