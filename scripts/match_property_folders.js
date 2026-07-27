const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Read .env
const envPath = path.join(__dirname, '../.env');
const env = {};
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      env[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
  });
}

const imagesRootDir = path.join(__dirname, '../property-images');

async function main() {
  const folders = fs.readdirSync(imagesRootDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  console.log(`Found ${folders.length} property folders:`);
  
  const folderInfo = folders.map(f => {
    const fPath = path.join(imagesRootDir, f);
    const files = fs.readdirSync(fPath)
      .filter(file => /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(file));
    return { name: f, count: files.length, files };
  });

  folderInfo.forEach(fi => {
    console.log(`- "${fi.name}": ${fi.count} image(s)`);
  });

  const uri = env.MONGODB_URI;
  const dbName = env.MONGODB_DB_NAME;

  let stays = [];
  if (uri && dbName) {
    try {
      await mongoose.connect(uri, { dbName });
      const collection = mongoose.connection.db.collection('stays');
      stays = await collection.find({}).toArray();
      console.log(`\nConnected to DB. Found ${stays.length} stays in DB.`);
    } catch (e) {
      console.error('DB Connection error:', e.message);
    }
  }

  console.log('\n--- MATCHING ANALYSIS ---');
  folderInfo.forEach(fi => {
    const normFolder = fi.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const matched = stays.filter(s => {
      const normTitle = (s.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const normId = (s.id || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      return normTitle.includes(normFolder) || normFolder.includes(normTitle) || normId.includes(normFolder) || normFolder.includes(normId);
    });

    if (matched.length > 0) {
      console.log(`MATCHED Folder "${fi.name}" (${fi.count} images) -> Stays:`, matched.map(m => `"${m.title}" (id: ${m.id || m._id})`).join(', '));
    } else {
      console.log(`NO MATCH Folder "${fi.name}" (${fi.count} images)`);
    }
  });

  if (stays.length > 0) {
    console.log('\n--- ALL DB STAYS ---');
    stays.forEach(s => {
      console.log(`Stay: "${s.title}" (id: ${s.id || s._id}) | Current imageUrl: "${s.imageUrl || ''}" | Images count: ${(s.images || []).length}`);
    });
  }

  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
  }
}

main().catch(console.error);
