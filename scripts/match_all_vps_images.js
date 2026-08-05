const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const sshScript = 'C:\\Users\\marsh\\.gemini\\antigravity-ide\\brain\\0c16d623-1655-4866-8347-89711b6c8257\\scratch\\ssh.js';

async function main() {
  console.log('Listing all 1564 uploaded WebP files from VPS /srv/papaya-media/uploads...');
  const out = execSync(`node "${sshScript}" "ls /srv/papaya-media/uploads"`).toString();
  const files = out.trim().split('\n').map(f => f.trim()).filter(f => f.endsWith('.webp') || f.endsWith('.jpg') || f.endsWith('.png'));

  console.log(`Retrieved ${files.length} media files from VPS!`);

  const vpsStays = JSON.parse(fs.readFileSync(path.join(__dirname, 'vps-stays-backup.json'), 'utf-8'));

  const propertyMatches = {};

  for (const stay of vpsStays) {
    const id = stay.id;
    const title = stay.title || '';
    const normTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normId = id.toLowerCase().replace(/[^a-z0-9]/g, '');

    const matchedFiles = files.filter(f => {
      const lower = f.toLowerCase();
      return lower.includes(normId) || (normTitle.length > 3 && lower.includes(normTitle));
    });

    propertyMatches[id] = matchedFiles.map(f => `/media/uploads/${f}`);
  }

  console.log('\n--- MATCHING RESULTS FOR ALL PROPERTIES FROM VPS MEDIA UPLOADS ---');
  for (const stay of vpsStays) {
    const matched = propertyMatches[stay.id] || [];
    console.log(`${stay.id} (${stay.title}): ${matched.length} matched VPS media files`);
    if (matched.length > 0) {
      console.log(`   Main: ${matched[0]}`);
    }
  }

  // Save full map to vps-matched-media.json
  fs.writeFileSync(path.join(__dirname, 'vps-matched-media.json'), JSON.stringify(propertyMatches, null, 2));
  console.log('\nSaved full mapping to scripts/vps-matched-media.json');
}

main().catch(console.error);
