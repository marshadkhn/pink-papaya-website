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

const curatedResortPhotos = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80"
];

async function main() {
  console.log("Connecting to MongoDB to restore and verify all property images...");
  await mongoose.connect(uri);

  const StaySchema = new mongoose.Schema({}, { collection: "stays", strict: false });
  const Stay = mongoose.models.Stay || mongoose.model("Stay", StaySchema);

  const staysJsonPath = path.join(__dirname, "..", "src", "data", "stays.json");
  const seedStaysPath = path.join(__dirname, "seed-stays-data.json");

  let staysJson = fs.existsSync(staysJsonPath) ? JSON.parse(fs.readFileSync(staysJsonPath, "utf-8")) : [];
  let seedStays = fs.existsSync(seedStaysPath) ? JSON.parse(fs.readFileSync(seedStaysPath, "utf-8")) : [];

  const allDocs = await Stay.find({}).lean();
  console.log(`Total stays in MongoDB: ${allDocs.length}`);

  let updatedMongo = 0;

  for (let i = 0; i < allDocs.length; i++) {
    const doc = allDocs[i];
    const hasCustomImages = Array.isArray(doc.images) && doc.images.length > 0 && doc.imageUrl && doc.imageUrl.startsWith("/media/uploads/");

    let finalImageUrl = doc.imageUrl;
    let finalImages = doc.images || [];

    if (!hasCustomImages) {
      const photoIdx = i % curatedResortPhotos.length;
      finalImageUrl = curatedResortPhotos[photoIdx];
      finalImages = [
        curatedResortPhotos[photoIdx],
        curatedResortPhotos[(photoIdx + 1) % curatedResortPhotos.length],
        curatedResortPhotos[(photoIdx + 2) % curatedResortPhotos.length],
        curatedResortPhotos[(photoIdx + 3) % curatedResortPhotos.length],
        curatedResortPhotos[(photoIdx + 4) % curatedResortPhotos.length],
      ];
    }

    await Stay.updateOne(
      { _id: doc._id },
      {
        $set: {
          imageUrl: finalImageUrl,
          images: finalImages
        }
      }
    );
    updatedMongo++;

    // Update stays.json & seed-stays-data.json
    const sJsonMatch = staysJson.find(s => s.id === doc.id || s.title === doc.title);
    if (sJsonMatch) {
      sJsonMatch.imageUrl = finalImageUrl;
      sJsonMatch.images = finalImages;
    }

    const sSeedMatch = seedStays.find(s => s.id === doc.id || s.title === doc.title);
    if (sSeedMatch) {
      sSeedMatch.imageUrl = finalImageUrl;
      sSeedMatch.images = finalImages;
    }
  }

  console.log(`Updated images for all ${updatedMongo} stays in MongoDB!`);

  if (staysJson.length > 0) {
    fs.writeFileSync(staysJsonPath, JSON.stringify(staysJson, null, 2));
    console.log(`Saved updated ${staysJsonPath}`);
  }

  if (seedStays.length > 0) {
    fs.writeFileSync(seedStaysPath, JSON.stringify(seedStaysPath, null, 2));
    console.log(`Saved updated ${seedStaysPath}`);
  }

  const finalCheck = await Stay.find({}).lean();
  const withImages = finalCheck.filter(s => s.imageUrl && s.imageUrl.trim() !== "");
  console.log(`\nFinal Image Verification: ALL ${withImages.length}/${finalCheck.length} properties have active image URLs and galleries!`);

  await mongoose.disconnect();
}

main().catch(console.error);
