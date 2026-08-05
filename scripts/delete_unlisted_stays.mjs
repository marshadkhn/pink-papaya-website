import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const t = line.trim();
    if (t && !t.startsWith("#") && t.includes("=")) {
      const [k, ...v] = t.split("=");
      process.env[k.trim()] = v.join("=").trim();
    }
  }
}

const uri = process.env.MONGODB_URI || "mongodb+srv://pink-papaya:c3Nr2vYQZfJJuiFz@pinkpapaya.ohd1bmr.mongodb.net/pink-papaya?appName=pinkpapaya";

const TO_DELETE = [
  "benaulim-house",
  "bougainvillea-suite",
  "gulmohar-suite",
  "magnolia-suite",
  "marigold-suite"
];

async function main() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(uri);

  const StaySchema = new mongoose.Schema({}, { collection: "stays", strict: false });
  const Stay = mongoose.models.Stay || mongoose.model("Stay", StaySchema);

  for (const id of TO_DELETE) {
    const doc = await Stay.findOne({ id });
    if (doc) {
      await Stay.deleteOne({ _id: doc._id });
      console.log(`✅ Deleted: "${doc.title}" (${id})`);
    } else {
      console.log(`⚠️  Not found in DB: ${id}`);
    }
  }

  // Also remove from stays.json
  const staysJsonPath = path.join(__dirname, "..", "src", "data", "stays.json");
  if (fs.existsSync(staysJsonPath)) {
    let staysJson = JSON.parse(fs.readFileSync(staysJsonPath, "utf-8"));
    if (Array.isArray(staysJson)) {
      const before = staysJson.length;
      staysJson = staysJson.filter(s => !TO_DELETE.includes(s.id));
      fs.writeFileSync(staysJsonPath, JSON.stringify(staysJson, null, 2));
      console.log(`\nstays.json: removed ${before - staysJson.length} entries`);
    }
  }

  // Also remove from seed-stays-data.json
  const seedPath = path.join(__dirname, "seed-stays-data.json");
  if (fs.existsSync(seedPath)) {
    let seed = JSON.parse(fs.readFileSync(seedPath, "utf-8"));
    if (Array.isArray(seed)) {
      const before = seed.length;
      seed = seed.filter(s => !TO_DELETE.includes(s.id));
      fs.writeFileSync(seedPath, JSON.stringify(seed, null, 2));
      console.log(`seed-stays-data.json: removed ${before - seed.length} entries`);
    }
  }

  const remaining = await Stay.countDocuments();
  console.log(`\nDone! ${remaining} properties remain in database.`);
  await mongoose.disconnect();
}

main().catch(console.error);
