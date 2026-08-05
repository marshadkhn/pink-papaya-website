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

async function main() {
  await mongoose.connect(uri);
  const StaySchema = new mongoose.Schema({}, { collection: "stays", strict: false });
  const Stay = mongoose.models.Stay || mongoose.model("Stay", StaySchema);

  const docs = await Stay.find({}).lean();
  console.log(`TOTAL STAYS IN DATABASE: ${docs.length}\n`);

  let zeroImages = [];
  let zeroAmenities = [];

  for (let i = 0; i < docs.length; i++) {
    const d = docs[i];
    const imgCount = Array.isArray(d.images) ? d.images.length : 0;
    const amenityCount = Array.isArray(d.amenities) ? d.amenities.length : 0;

    if (imgCount === 0) zeroImages.push(d.title);
    if (amenityCount === 0) zeroAmenities.push(d.title);

    console.log(`${i + 1}. ${d.title} (${d.id}): ${imgCount} photos | ${amenityCount} amenities`);
  }

  console.log("\n----------------------------------------------------");
  console.log(`Properties with 0 photos: ${zeroImages.length > 0 ? zeroImages.join(", ") : "NONE (All 42 have photos!)"}`);
  console.log(`Properties with 0 amenities: ${zeroAmenities.length > 0 ? zeroAmenities.join(", ") : "NONE (All 42 have amenities!)"}`);

  await mongoose.disconnect();
}

main().catch(console.error);
