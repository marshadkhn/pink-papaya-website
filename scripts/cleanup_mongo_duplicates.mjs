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
const seedData = JSON.parse(fs.readFileSync(path.join(__dirname, "seed-stays-data.json"), "utf-8"));

async function main() {
  console.log("Connecting to MongoDB for duplicate cleanup and amenities sync...");
  await mongoose.connect(uri);

  const StaySchema = new mongoose.Schema({ id: String, title: String, amenities: [String] }, { collection: "stays", strict: false });
  const Stay = mongoose.models.Stay || mongoose.model("Stay", StaySchema);

  const allDocs = await Stay.find({}).lean();
  console.log(`Total Stay Documents in MongoDB before sync: ${allDocs.length}`);

  let updatedCount = 0;

  for (const seedStay of seedData) {
    const stayId = seedStay.id;
    const stayTitle = seedStay.title;
    const amenities = seedStay.amenities || [];

    // Find all matching documents in MongoDB by id or title
    const matches = allDocs.filter(d => d.id === stayId || (d.title && d.title.toLowerCase().trim() === stayTitle.toLowerCase().trim()));

    for (const match of matches) {
      await Stay.updateOne(
        { _id: match._id },
        { 
          $set: { 
            id: stayId, 
            amenities: amenities 
          } 
        }
      );
      updatedCount++;
    }
  }

  console.log(`Successfully updated ${updatedCount} MongoDB documents with valid id & amenities!`);

  // Verify document with _id 6a48e43be33cf0e0fc8e0597
  const fixedDoc = await Stay.findById("6a48e43be33cf0e0fc8e0597").lean();
  console.log("\nVerified Document 6a48e43be33cf0e0fc8e0597 after update:");
  console.log(`- Title: ${fixedDoc.title}`);
  console.log(`- ID: ${fixedDoc.id}`);
  console.log(`- Amenities Count: ${fixedDoc.amenities ? fixedDoc.amenities.length : 0}`);

  await mongoose.disconnect();
}

main().catch(console.error);
