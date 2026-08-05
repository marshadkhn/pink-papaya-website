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
  
  console.log("=== COMPLETENESS REPORT FOR ALL WEBSITE PROPERTIES ===\n");

  const results = [];

  for (const doc of docs) {
    const checks = {
      title: !!(doc.title && doc.title.trim()),
      location: !!(doc.location && doc.location.trim()),
      area: !!(doc.area && doc.area.trim()),
      bed: !!(doc.bed && doc.bed.trim()),
      guests: !!(doc.guests && doc.guests.trim()),
      pricePerNight: !!(doc.pricePerNight && doc.pricePerNight.trim()),
      description: !!(doc.description && doc.description.length > 20),
      aboutContent: !!(doc.aboutContent && doc.aboutContent.length > 20),
      nearbyPlaces: Array.isArray(doc.nearbyPlaces) && doc.nearbyPlaces.length > 0,
      faqs: Array.isArray(doc.faqs) && doc.faqs.length > 0,
      images: Array.isArray(doc.images) && doc.images.length > 0,
      amenities: Array.isArray(doc.amenities) && doc.amenities.length > 0,
    };

    const totalChecks = Object.keys(checks).length;
    const passedChecks = Object.values(checks).filter(Boolean).length;
    const isComplete = passedChecks === totalChecks;
    const missing = Object.entries(checks).filter(([k, v]) => !v).map(([k]) => k);

    results.push({ title: doc.title, id: doc.id, passedChecks, totalChecks, isComplete, missing });
  }

  // Sort: complete first
  results.sort((a, b) => b.passedChecks - a.passedChecks);

  console.log("✅ FULLY COMPLETE (all info present):");
  const complete = results.filter(r => r.isComplete);
  complete.forEach(r => console.log(`   - ${r.title} (${r.id})`));

  console.log(`\n⚠️  INCOMPLETE (missing some info):`);
  const incomplete = results.filter(r => !r.isComplete);
  incomplete.forEach(r => {
    console.log(`   - ${r.title} (${r.id}) [${r.passedChecks}/${r.totalChecks}] — Missing: ${r.missing.join(", ")}`);
  });

  await mongoose.disconnect();
}

main().catch(console.error);
