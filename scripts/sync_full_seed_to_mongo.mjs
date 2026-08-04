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
  console.log("Connecting to MongoDB to sync full seed data...");
  await mongoose.connect(uri);

  const StaySchema = new mongoose.Schema({}, { collection: "stays", strict: false });
  const Stay = mongoose.models.Stay || mongoose.model("Stay", StaySchema);

  let updatedCount = 0;

  for (const seedStay of seedData) {
    const stayId = seedStay.id;
    await Stay.updateOne(
      { id: stayId },
      { $set: seedStay },
      { upsert: true }
    );
    updatedCount++;
  }

  console.log(`Successfully synced full seed data for ${updatedCount} stays to MongoDB!`);

  const checkSempre = await Stay.findOne({ id: "sempre" }).lean();
  console.log("\nVerified Sempre Mongo Document:");
  console.log(`- _id: ${checkSempre._id}`);
  console.log(`- id: ${checkSempre.id}`);
  console.log(`- title: ${checkSempre.title}`);
  console.log(`- amenitiesCount: ${checkSempre.amenities ? checkSempre.amenities.length : 0}`);

  await mongoose.disconnect();
}

main().catch(console.error);
