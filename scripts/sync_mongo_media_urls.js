const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://pink-papaya:c3Nr2vYQZfJJuiFz@pinkpapaya.ohd1bmr.mongodb.net/pink-papaya?appName=pinkpapaya";

const localUploadsDir = path.join(__dirname, '../public/uploads/uploads');
const imagesRootDir = path.join(__dirname, '../property-images');

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

async function main() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB successfully!');

  const db = mongoose.connection.db;
  const staysColl = db.collection('stays');

  const allUploadedFiles = fs.readdirSync(localUploadsDir);
  console.log(`Total WebP files in uploads directory: ${allUploadedFiles.length}`);

  const report = [];

  for (const item of MAPPINGS) {
    const folderPath = path.join(imagesRootDir, item.folder);
    if (!fs.existsSync(folderPath)) continue;

    const sourceFiles = fs.readdirSync(folderPath)
      .filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f))
      .sort(naturalSort);

    const matchedUrls = [];

    for (const srcFile of sourceFiles) {
      const base = safeBaseName(srcFile);
      const found = allUploadedFiles.find(uf => uf.endsWith(`-${base}.webp`));
      if (found) {
        matchedUrls.push(`/media/uploads/${found}`);
      }
    }

    console.log(`Property "${item.title}" (${item.id}): Mapped ${matchedUrls.length} WebP images.`);

    if (matchedUrls.length > 0) {
      const imageUrl = matchedUrls[0];
      const images = matchedUrls;

      const res = await staysColl.updateOne(
        { $or: [{ id: item.id }, { title: item.title }] },
        {
          $set: {
            id: item.id,
            title: item.title,
            area: item.area,
            bed: item.bed,
            guests: item.guests,
            category: item.category,
            imageUrl: imageUrl,
            images: images
          }
        },
        { upsert: true }
      );

      report.push({
        Folder: item.folder,
        'Stay Title': item.title,
        'Stay ID': item.id,
        'Images Uploaded': images.length,
        'Main Image': imageUrl ? 'Set' : 'None',
        Status: res.modifiedCount || res.upsertedCount ? 'Success' : 'No change'
      });
    }
  }

  await mongoose.disconnect();

  console.log('\n================ FINAL VERIFIED MONGODB REPORT ================');
  console.table(report);
}

main().catch(console.error);
