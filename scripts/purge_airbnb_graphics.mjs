import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Known Airbnb illustration graphic IDs/patterns
const knownGraphicPatterns = [
  "ae3fe995-262f-44f1-a395-2192d45a6d88", // guide dog accessibility graphic
  "/user/",
  "/user_meta/",
  "avatar",
  "accessibility"
];

function isGraphicIllustration(url) {
  if (!url || typeof url !== "string") return true;
  const lower = url.toLowerCase();
  for (const pat of knownGraphicPatterns) {
    if (lower.includes(pat)) return true;
  }
  return false;
}

async function main() {
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
  console.log("Connecting to MongoDB to purge all Airbnb illustration graphics...");
  await mongoose.connect(uri);

  const StaySchema = new mongoose.Schema({}, { collection: "stays", strict: false });
  const Stay = mongoose.models.Stay || mongoose.model("Stay", StaySchema);

  const staysJsonPath = path.join(__dirname, "..", "src", "data", "stays.json");
  const seedStaysPath = path.join(__dirname, "seed-stays-data.json");

  let staysJson = fs.existsSync(staysJsonPath) ? JSON.parse(fs.readFileSync(staysJsonPath, "utf-8")) : [];
  let seedStays = fs.existsSync(seedStaysPath) ? JSON.parse(fs.readFileSync(seedStaysPath, "utf-8")) : [];

  const allDocs = await Stay.find({}).lean();
  let purgedTotal = 0;

  for (const doc of allDocs) {
    const rawImages = Array.isArray(doc.images) ? doc.images : [];
    const cleanImages = rawImages.filter(url => !isGraphicIllustration(url));

    const isMainGraphic = isGraphicIllustration(doc.imageUrl);
    const mainImage = isMainGraphic ? (cleanImages.length > 0 ? cleanImages[0] : "") : doc.imageUrl;

    if (rawImages.length !== cleanImages.length || isMainGraphic) {
      console.log(`Purged graphic illustrations from ${doc.title} (${doc.id}): ${rawImages.length} -> ${cleanImages.length} images.`);
      purgedTotal += (rawImages.length - cleanImages.length);

      await Stay.updateOne(
        { _id: doc._id },
        {
          $set: {
            imageUrl: mainImage,
            images: cleanImages
          }
        }
      );

      const jMatch = staysJson.find(s => s.id === doc.id || s.title === doc.title);
      if (jMatch) {
        jMatch.imageUrl = mainImage;
        jMatch.images = cleanImages;
      }

      const sMatch = seedStays.find(s => s.id === doc.id || s.title === doc.title);
      if (sMatch) {
        sMatch.imageUrl = mainImage;
        sMatch.images = cleanImages;
      }
    }
  }

  fs.writeFileSync(staysJsonPath, JSON.stringify(staysJson, null, 2));
  console.log(`Updated ${staysJsonPath}`);

  fs.writeFileSync(seedStaysPath, JSON.stringify(seedStays, null, 2));
  console.log(`Updated ${seedStaysPath}`);

  console.log(`\nPurged ${purgedTotal} graphic illustrations across all properties!`);
  await mongoose.disconnect();
}

main().catch(console.error);
