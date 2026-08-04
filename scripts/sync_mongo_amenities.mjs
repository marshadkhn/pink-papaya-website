import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

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
const seedStaysData = JSON.parse(fs.readFileSync(path.join(__dirname, "seed-stays-data.json"), "utf-8"));

async function main() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(uri);
  console.log("Connected successfully to MongoDB.");

  const StaySchema = new mongoose.Schema({ id: String, amenities: [String] }, { collection: "stays", strict: false });
  const Stay = mongoose.models.Stay || mongoose.model("Stay", StaySchema);

  let updatedCount = 0;
  for (const stay of seedStaysData) {
    if (stay.amenities && stay.amenities.length > 0) {
      const res = await Stay.updateOne(
        { id: stay.id },
        { $set: { amenities: stay.amenities } },
        { upsert: true }
      );
      updatedCount++;
    }
  }

  console.log(`Successfully updated MongoDB stays collection for all ${updatedCount} properties!`);
  await mongoose.disconnect();
}

main().catch(console.error);
