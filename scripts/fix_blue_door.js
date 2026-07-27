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

const item = { folder: 'The Blue Door', id: 'the-blue-door', title: 'The Blue Door', area: 'Near Candolim, North Goa', bed: '1 Bed', guests: '2 Guests', category: 'Apartment' };

function safeBaseName(fileName) {
  const base = path.basename(fileName, path.extname(fileName));
  return base.toLowerCase().replace(/[^a-z0-9-_]/g, '-').slice(0, 60) || 'file';
}

function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
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

  const sftp = await new Promise((resolve, reject) => {
    conn.sftp((err, sftpSession) => err ? reject(err) : resolve(sftpSession));
  });

  const folderPath = path.join(imagesRootDir, item.folder);
  const files = fs.readdirSync(folderPath)
    .filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f))
    .sort(naturalSort);

  console.log(`Processing "${item.folder}" -> ${files.length} images...`);

  const mediaUrls = [];
  let processedCount = 0;

  for (const fileName of files) {
    try {
      const filePath = path.join(folderPath, fileName);
      const timeStamp = Date.now();
      const uuid = randomUUID();
      const base = safeBaseName(fileName);
      const key = `uploads/${timeStamp}-${uuid}-${base}.webp`;
      const localDest = path.join(__dirname, '../public/uploads', key);
      const vpsDest = `/srv/papaya-media/${key}`;

      fs.mkdirSync(path.dirname(localDest), { recursive: true });

      await sharp(filePath)
        .rotate()
        .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 65, effort: 4 })
        .toFile(localDest);

      await new Promise((res, rej) => {
        sftp.fastPut(localDest, vpsDest, (err) => err ? rej(err) : res());
      });

      const url = `/media/${key}`;
      mediaUrls.push(url);
      processedCount++;
      process.stdout.write(`.`);
    } catch (e) {
      console.log(`\nSkipping unparseable image "${fileName}": ${e.message}`);
    }
  }

  console.log(`\nProcessed ${processedCount}/${files.length} valid images for ${item.title}`);

  if (mediaUrls.length > 0) {
    const updateJs = `
      const fetch = globalThis.fetch || require("node-fetch");
      async function run() {
        const patchRes = await fetch("http://localhost:3000/api/stays/${item.id}", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: "${mediaUrls[0]}", images: ${JSON.stringify(mediaUrls)} })
        });
        console.log("PATCH status:", patchRes.status);
      }
      run();
    `;

    const updateResult = await new Promise((resolve) => {
      conn.exec(`su - papaya -c "cat << 'EOF' > /tmp/update_${item.id}.js\n${updateJs}\nEOF\nnode /tmp/update_${item.id}.js; rm -f /tmp/update_${item.id}.js"`, (err, stream) => {
        let out = '';
        stream.on('data', d => out += d);
        stream.on('close', () => resolve(out.trim()));
      });
    });

    console.log(`Updated DB on VPS for ${item.title}:`, updateResult);
  }

  conn.end();
}

main().catch(console.error);
