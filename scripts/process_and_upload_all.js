const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { randomUUID } = require('crypto');
let Client;
try {
  Client = require('ssh2').Client;
} catch (e) {
  Client = require('C:/Users/marsh/.gemini/antigravity-ide/brain/0c16d623-1655-4866-8347-89711b6c8257/scratch/node_modules/ssh2').Client;
}

const imagesRootDir = path.join(__dirname, '../property-images');
const localUploadsDir = path.join(__dirname, '../public/uploads/uploads');

if (!fs.existsSync(localUploadsDir)) {
  fs.mkdirSync(localUploadsDir, { recursive: true });
}

// 17 folder mappings to stay ID / title
const MAPPINGS = [
  { folder: 'belle masion', id: 'belle-maison', title: 'Belle Maison', area: 'Candolim, North Goa', bed: '1 Bed', guests: '2 Guests', category: 'Apartment' },
  { folder: 'Belo Nido', id: 'belo-nido-003', title: 'Belo Nido 003', area: 'Calangute, North Goa', bed: '1 Bed', guests: '2 Guests', category: 'Apartment' },
  { folder: 'candolim bliss', id: 'candolim-bliss', title: 'Candolim Bliss', area: 'Candolim, North Goa', bed: '1 Bed', guests: '2 Guests', category: 'Apartment' },
  { folder: 'Casa de pactao', id: 'casa-de-pacato', title: 'Casa de Pacato', area: 'Candolim, North Goa', bed: '1 Bed', guests: '2 Guests', category: 'Apartment' },
  { folder: 'Casa Sarena', id: 'casa-sarena', title: 'Casa Sarena', area: 'Candolim, North Goa', bed: '1 Bed', guests: '2 Guests', category: 'Apartment' },
  { folder: 'Case Mare', id: 'case-mare', title: 'Case Mare', area: 'Candolim, North Goa', bed: '1 Bed', guests: '2 Guests', category: 'Apartment' },
  { folder: 'Jigsaw', id: 'jigsaw', title: 'Jigsaw', area: 'Near Candolim, North Goa', bed: '1 Bed', guests: '2 Guests', category: 'Apartment' },
  { folder: 'Juno', id: 'juno', title: 'Juno', area: 'Near Candolim, North Goa', bed: '1 Bed', guests: '2 Guests', category: 'Apartment' },
  { folder: 'La Mish', id: 'la-mish', title: 'La Mish', area: 'Reis Magos, North Goa', bed: '1 Bed', guests: '2 Guests', category: 'Apartment' },
  { folder: 'La Prana', id: 'la-prana', title: 'La Prana', area: 'Siolim, North Goa', bed: '1 Bed', guests: '2 Guests', category: 'Apartment' },
  { folder: 'laziest turtle', id: 'laziest-turtle', title: 'Laziest Turtle', area: 'Candolim, North Goa', bed: '1 Bed', guests: '2 Guests', category: 'Apartment' },
  { folder: 'Lazy Turtle', id: 'lazy-turtle', title: 'Lazy Turtle', area: 'Candolim, North Goa', bed: '1 Bed', guests: '2 Guests', category: 'Apartment' },
  { folder: 'The Blue Door', id: 'the-blue-door', title: 'The Blue Door', area: 'Near Candolim, North Goa', bed: '1 Bed', guests: '2 Guests', category: 'Apartment' },
  { folder: 'The Green', id: 'the-green', title: 'The Green', area: 'Candolim, North Goa', bed: '1 Bed', guests: '2 Guests', category: 'Apartment' },
  { folder: 'The Green Window', id: 'the-green-window', title: 'The Green Window', area: 'Siolim, North Goa', bed: '1 Bed', guests: '2 Guests', category: 'Apartment' },
  { folder: 'Umile Dimora', id: 'umile-dimora', title: 'Umile Dimora', area: 'Candolim, North Goa', bed: '1 Bed', guests: '2 Guests', category: 'Apartment' },
  { folder: 'Vista Verde', id: 'vista-verde-002', title: 'Vista Verde 002', area: 'Calangute, North Goa', bed: '1 Bed', guests: '2 Guests', category: 'Apartment' },
];

function safeBaseName(fileName) {
  const base = path.basename(fileName, path.extname(fileName));
  return base.toLowerCase().replace(/[^a-z0-9-_]/g, '-').slice(0, 60) || 'file';
}

function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

async function processImagesForFolder(folderInfo, sftp) {
  const folderPath = path.join(imagesRootDir, folderInfo.folder);
  if (!fs.existsSync(folderPath)) {
    console.log(`Folder not found: ${folderPath}`);
    return null;
  }

  const files = fs.readdirSync(folderPath)
    .filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f))
    .sort(naturalSort);

  console.log(`\nProcessing "${folderInfo.folder}" -> ${files.length} images...`);

  const mediaUrls = [];
  let processedCount = 0;

  for (const fileName of files) {
    const filePath = path.join(folderPath, fileName);
    const timeStamp = Date.now();
    const uuid = randomUUID();
    const base = safeBaseName(fileName);
    const key = `uploads/${timeStamp}-${uuid}-${base}.webp`;
    const localDest = path.join(__dirname, '../public/uploads', key);
    const vpsDest = `/srv/papaya-media/${key}`;

    // Ensure local subfolder
    fs.mkdirSync(path.dirname(localDest), { recursive: true });

    // Process image with Sharp
    await sharp(filePath)
      .rotate()
      .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 65, effort: 4 })
      .toFile(localDest);

    // Upload to VPS via SFTP if sftp available
    if (sftp) {
      await new Promise((resolve, reject) => {
        sftp.fastPut(localDest, vpsDest, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    const url = `/media/${key}`;
    mediaUrls.push(url);
    processedCount++;
    process.stdout.write(`.`);
  }

  console.log(`\nDone processing & uploading ${processedCount} images for ${folderInfo.title}`);
  return {
    ...folderInfo,
    imageUrl: mediaUrls[0] || '',
    images: mediaUrls,
    count: processedCount
  };
}

async function main() {
  const conn = new Client();
  
  await new Promise((resolve, reject) => {
    conn.on('ready', resolve).on('error', reject).connect({
      host: '187.127.187.184',
      port: 22,
      username: 'root',
      password: 'P+,1fLHpL22/A9+;'
    });
  });

  console.log('SSH connection established to VPS.');

  // Create SFTP session
  const sftp = await new Promise((resolve, reject) => {
    conn.sftp((err, sftpSession) => err ? reject(err) : resolve(sftpSession));
  });

  // Ensure remote directory exists
  await new Promise((resolve) => {
    conn.exec('mkdir -p /srv/papaya-media/uploads', () => resolve());
  });

  const report = [];

  for (const item of MAPPINGS) {
    try {
      const res = await processImagesForFolder(item, sftp);
      if (res) {
        // Prepare vps node script to update or create
        const updateJs = `
          const fetch = globalThis.fetch || require("node-fetch");
          async function run() {
            const patchRes = await fetch("http://localhost:3000/api/stays/${res.id}", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ imageUrl: "${res.imageUrl}", images: ${JSON.stringify(res.images)} })
            });
            if (!patchRes.ok) {
              const postRes = await fetch("http://localhost:3000/api/stays", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id: "${res.id}",
                  title: "${res.title}",
                  area: "${res.area}",
                  bed: "${res.bed}",
                  guests: "${res.guests}",
                  category: "${res.category}",
                  imageUrl: "${res.imageUrl}",
                  images: ${JSON.stringify(res.images)}
                })
              });
              console.log("POST res:", await postRes.status);
            } else {
              console.log("PATCH res:", patchRes.status);
            }
          }
          run();
        `;

        // Write temp js on VPS and execute
        const updateResult = await new Promise((resolve) => {
          conn.exec(`su - papaya -c "cat << 'EOF' > /tmp/update_${res.id}.js\n${updateJs}\nEOF\nnode /tmp/update_${res.id}.js; rm -f /tmp/update_${res.id}.js"`, (err, stream) => {
            let out = '';
            stream.on('data', d => out += d);
            stream.on('close', () => resolve(out.trim()));
          });
        });

        console.log(`Updated DB on VPS for ${res.title}:`, updateResult);
        report.push({ ...res, dbStatus: 'Updated' });
      }
    } catch (e) {
      console.error(`Error processing ${item.folder}:`, e.message);
      report.push({ ...item, error: e.message, dbStatus: 'Failed' });
    }
  }

  conn.end();

  console.log('\n================ MASTER REPORT ================');
  console.table(report.map(r => ({
    Folder: r.folder,
    'Matched Stay': r.title,
    'Stay ID': r.id,
    'Images Uploaded': r.count || 0,
    'Main Image URL': r.imageUrl ? 'Set' : 'None',
    Status: r.dbStatus
  })));
}

main().catch(console.error);
