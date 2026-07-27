const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const sshScript = 'C:\\Users\\marsh\\.gemini\\antigravity-ide\\brain\\0c16d623-1655-4866-8347-89711b6c8257\\scratch\\ssh.js';

const imagesRootDir = path.join(__dirname, '../property-images');

const folders = fs.readdirSync(imagesRootDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

let stays = [];
try {
  const out = execSync(`node "${sshScript}" "curl -s http://localhost:3000/api/stays"`).toString();
  const startIdx = out.indexOf('[');
  const endIdx = out.lastIndexOf(']');
  if (startIdx !== -1 && endIdx !== -1) {
    stays = JSON.parse(out.substring(startIdx, endIdx + 1));
  }
} catch (e) {
  console.error(e);
}

console.log(`Analyzing ${folders.length} property folders against ${stays.length} stays in DB:\n`);

folders.forEach(folder => {
  const folderPath = path.join(imagesRootDir, folder);
  const files = fs.readdirSync(folderPath).filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f));
  
  // Try exact or fuzzy matching
  const normFolder = folder.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  const matches = stays.filter(s => {
    const normTitle = (s.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const normId = (s.id || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    return normTitle === normFolder || normId === normFolder ||
           normTitle.includes(normFolder) || normFolder.includes(normTitle) ||
           normId.includes(normFolder) || normFolder.includes(normId);
  });

  console.log(`Folder: "${folder}" (${files.length} images)`);
  if (matches.length > 0) {
    matches.forEach(m => {
      console.log(`  -> Match: Title: "${m.title}", ID: "${m.id || m._id}", current imageUrl: "${m.imageUrl || ''}", current images count: ${(m.images || []).length}`);
    });
  } else {
    console.log(`  -> NO MATCH FOUND IN DB!`);
  }
  console.log('----------------------------------------------------');
});
