import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function isRealPropertyPhoto(url) {
  if (!url || typeof url !== "string") return false;

  // Filter out any Airbnb illustrations, avatars, user pictures, or non-property graphics
  const lower = url.toLowerCase();

  if (lower.includes("/user/") || lower.includes("/user_meta/") || lower.includes("avatar") || lower.includes("illustration") || lower.includes("graphic")) {
    return false;
  }

  // Must be a valid photo host
  if (lower.startsWith("/media/uploads/")) return true;
  if (lower.includes("muscache.com")) {
    // Check if it's a real photo (contains /Hosting- or /pictures/ or /original/)
    if (lower.includes("hosting-") || lower.includes("/pictures/") || lower.includes("original")) {
      return true;
    }
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
  console.log("Connecting to MongoDB to sanitize all property images...");
  await mongoose.connect(uri);

  const StaySchema = new mongoose.Schema({}, { collection: "stays", strict: false });
  const Stay = mongoose.models.Stay || mongoose.model("Stay", StaySchema);

  const staysJsonPath = path.join(__dirname, "..", "src", "data", "stays.json");
  const seedStaysPath = path.join(__dirname, "seed-stays-data.json");

  let staysJson = fs.existsSync(staysJsonPath) ? JSON.parse(fs.readFileSync(staysJsonPath, "utf-8")) : [];
  let seedStays = fs.existsSync(seedStaysPath) ? JSON.parse(fs.readFileSync(seedStaysPath, "utf-8")) : [];

  const allDocs = await Stay.find({}).lean();
  console.log(`Analyzing ${allDocs.length} stay documents in MongoDB...`);

  let sanitizedCount = 0;

  for (const doc of allDocs) {
    let rawImages = Array.isArray(doc.images) ? doc.images : [];
    let cleanImages = rawImages.filter(isRealPropertyPhoto);

    if (cleanImages.length === 0 && doc.imageUrl && isRealPropertyPhoto(doc.imageUrl)) {
      cleanImages = [doc.imageUrl];
    }

    if (cleanImages.length > 0) {
      const mainImage = cleanImages[0];

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

      sanitizedCount++;
      if (rawImages.length !== cleanImages.length || doc.imageUrl !== mainImage) {
        console.log(`Sanitized ${doc.title} (${doc.id}): removed ${rawImages.length - cleanImages.length} non-photo illustrations.`);
        console.log(`   New Main Image: ${mainImage}`);
      }
    }
  }

  fs.writeFileSync(staysJsonPath, JSON.stringify(staysJson, null, 2));
  console.log(`Updated ${staysJsonPath}`);

  fs.writeFileSync(seedStaysPath, JSON.stringify(seedStays, null, 2));
  console.log(`Updated ${seedStaysPath}`);

  console.log(`\nSanitation complete for ${sanitizedCount} properties!`);
  await mongoose.disconnect();
}

main().catch(console.error);
