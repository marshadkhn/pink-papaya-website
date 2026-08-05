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

  let completeCount = 0;

  for (let i = 0; i < docs.length; i++) {
    const d = docs[i];
    const imgCount = Array.isArray(d.images) ? d.images.length : 0;
    const isMainValid = typeof d.imageUrl === "string" && d.imageUrl.trim() !== "";
    const hasNearby = Array.isArray(d.nearbyPlaces) && d.nearbyPlaces.length > 0;
    const hasFaqs = Array.isArray(d.faqs) && d.faqs.length > 0;
    const hasAmenities = Array.isArray(d.amenities) && d.amenities.length > 0;
    const hasAbout = typeof d.aboutContent === "string" && d.aboutContent.trim().length > 10;
    const hasDesc = typeof d.description === "string" && d.description.trim().length > 10;
    const hasLocation = typeof d.location === "string" && d.location.trim().length > 0;
    const hasBed = typeof d.bed === "string" && d.bed.trim().length > 0;
    const hasGuests = typeof d.guests === "string" && d.guests.trim().length > 0;

    let photoType = "No photo";
    if (d.imageUrl) {
      if (d.imageUrl.startsWith("/media/uploads/")) {
        photoType = "Uploaded Property WebP Gallery";
      } else if (d.imageUrl.includes("muscache.com")) {
        photoType = "Real Airbnb Listing Photo";
      } else {
        photoType = "Custom URL";
      }
    }

    const isFullyComplete = isMainValid && imgCount > 0 && hasLocation && hasBed && hasGuests && hasDesc && hasAbout && hasNearby && hasFaqs && hasAmenities;

    if (isFullyComplete) completeCount++;

    console.log(`${i + 1}. ${d.title} (ID: ${d.id})`);
    console.log(`   - Main Image: ${isMainValid ? "OK" : "MISSING"} (${photoType})`);
    console.log(`   - Total Photos: ${imgCount} photos`);
    console.log(`   - Specs: Bed="${d.bed || ""}", Guests="${d.guests || ""}", Location="${d.location || ""}"`);
    console.log(`   - Text Content: ShortDesc=${hasDesc ? "YES" : "NO"}, About=${hasAbout ? "YES" : "NO"}`);
    console.log(`   - Structured Arrays: NearbyPlaces=${d.nearbyPlaces ? d.nearbyPlaces.length : 0}, FAQs=${d.faqs ? d.faqs.length : 0}, Amenities=${d.amenities ? d.amenities.length : 0}`);
    console.log(`   - Status: ${isFullyComplete ? "100% COMPLETE" : "INCOMPLETE"}`);
    console.log("------------------------------------------------------------------");
  }

  console.log(`\nSUMMARY: ${completeCount}/${docs.length} properties are 100% COMPLETE with full photos, text, and amenities.`);
  await mongoose.disconnect();
}

main().catch(console.error);
