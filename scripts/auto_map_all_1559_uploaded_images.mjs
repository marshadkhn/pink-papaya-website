import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env");

if (fs.existsSync(envPath)) {
  const envText = fs.readFileSync(envPath, "utf-8");
  for (const line of envText.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [key, ...vals] = trimmed.split("=");
      process.env[key.trim()] = vals.join("=").trim();
    }
  }
}

const uri = process.env.MONGODB_URI || "mongodb+srv://pink-papaya:c3Nr2vYQZfJJuiFz@pinkpapaya.ohd1bmr.mongodb.net/pink-papaya?appName=pinkpapaya";

const localUploadsDir = path.join(__dirname, "..", "public", "uploads", "uploads");

// Mappings of folders/prefixes to stay IDs
const folderToStayMap = {
  "belle masion": "belle-maison",
  "belo nido": "belo-nido-003",
  "candolim bliss": "candolim-bliss",
  "casa de pactao": "casa-de-pacato",
  "casa sarena": "casa-sarena",
  "case mare": "case-mare",
  "jigsaw": "jigsaw",
  "juno": "juno",
  "la mish": "la-mish",
  "la prana": "la-prana",
  "laziest turtle": "laziest-turtle",
  "lazy turtle": "lazy-turtle",
  "the blue door": "the-blue-door",
  "the green": "the-green",
  "the green window": "the-green-window",
  "umile dimora": "umile-dimora",
  "vista verde": "vista-verde-002"
};

const imagesRootDir = path.join(__dirname, "..", "property-images");

async function main() {
  console.log("Connecting to MongoDB to map and restore all real property images...");
  await mongoose.connect(uri);

  const StaySchema = new mongoose.Schema({}, { collection: "stays", strict: false });
  const Stay = mongoose.models.Stay || mongoose.model("Stay", StaySchema);

  const allUploadedFiles = fs.existsSync(localUploadsDir) ? fs.readdirSync(localUploadsDir) : [];
  console.log(`Total local WebP uploaded files: ${allUploadedFiles.length}`);

  const stayImageMap = {};

  // 1. Map from property-images folders
  for (const [folderName, stayId] of Object.entries(folderToStayMap)) {
    const fPath = path.join(imagesRootDir, folderName);
    if (!fs.existsSync(fPath)) continue;

    const files = fs.readdirSync(fPath).filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f));
    const matchedUrls = [];

    for (const srcFile of files) {
      const base = path.basename(srcFile, path.extname(srcFile)).toLowerCase().replace(/[^a-z0-9-_]/g, '-').slice(0, 60);
      const found = allUploadedFiles.find(uf => uf.endsWith(`-${base}.webp`));
      if (found) {
        matchedUrls.push(`/media/uploads/${found}`);
      }
    }

    if (matchedUrls.length > 0) {
      stayImageMap[stayId] = matchedUrls;
      console.log(`Mapped folder "${folderName}" (${stayId}): ${matchedUrls.length} uploaded WebP images`);
    }
  }

  // 2. Map remaining files by filename patterns
  const unmappedFiles = allUploadedFiles.map(f => `/media/uploads/${f}`);

  const allStays = await Stay.find({}).lean();
  let updatedCount = 0;

  for (const stay of allStays) {
    const stayId = stay.id;
    let mappedImages = stayImageMap[stayId] || [];

    if (mappedImages.length === 0) {
      if (Array.isArray(stay.images) && stay.images.length > 0 && stay.images[0].startsWith("/media/uploads/")) {
        mappedImages = stay.images;
      } else {
        const normId = (stayId || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        const normTitle = (stay.title || "").toLowerCase().replace(/[^a-z0-9]/g, "");

        const matched = unmappedFiles.filter(url => {
          const lower = url.toLowerCase();
          return (normId.length > 3 && lower.includes(normId)) || (normTitle.length > 3 && lower.includes(normTitle));
        });

        if (matched.length > 0) {
          mappedImages = matched;
          console.log(`Matched by title/slug keyword for ${stay.title} (${stayId}): ${matched.length} images`);
        }
      }
    }

    if (mappedImages.length > 0) {
      const mainImage = mappedImages[0];
      await Stay.updateOne(
        { _id: stay._id },
        {
          $set: {
            imageUrl: mainImage,
            images: mappedImages
          }
        }
      );
      updatedCount++;
    }
  }

  console.log(`\nUpdated ${updatedCount}/${allStays.length} stays in MongoDB with real uploaded images!`);

  // Update stays.json & seed-stays-data.json
  const staysJsonPath = path.join(__dirname, "..", "src", "data", "stays.json");
  const seedStaysPath = path.join(__dirname, "seed-stays-data.json");

  let staysJson = fs.existsSync(staysJsonPath) ? JSON.parse(fs.readFileSync(staysJsonPath, "utf-8")) : [];
  let seedStays = fs.existsSync(seedStaysPath) ? JSON.parse(fs.readFileSync(seedStaysPath, "utf-8")) : [];

  const finalStays = await Stay.find({}).lean();

  for (const s of finalStays) {
    if (!s.imageUrl || !s.images) continue;

    if (Array.isArray(staysJson)) {
      const jMatch = staysJson.find(item => item.id === s.id || item.title === s.title);
      if (jMatch) {
        jMatch.imageUrl = s.imageUrl;
        jMatch.images = s.images;
      }
    }

    if (Array.isArray(seedStays)) {
      const seedMatch = seedStays.find(item => item.id === s.id || item.title === s.title);
      if (seedMatch) {
        seedMatch.imageUrl = s.imageUrl;
        seedMatch.images = s.images;
      }
    }
  }

  if (Array.isArray(staysJson) && staysJson.length > 0) {
    fs.writeFileSync(staysJsonPath, JSON.stringify(staysJson, null, 2));
    console.log(`Updated ${staysJsonPath}`);
  }

  if (Array.isArray(seedStays) && seedStays.length > 0) {
    fs.writeFileSync(seedStaysPath, JSON.stringify(seedStays, null, 2));
    console.log(`Updated ${seedStaysPath}`);
  }

  await mongoose.disconnect();
}

main().catch(console.error);
