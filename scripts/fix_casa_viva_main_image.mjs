import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
  await mongoose.connect(uri);

  const StaySchema = new mongoose.Schema({}, { collection: "stays", strict: false });
  const Stay = mongoose.models.Stay || mongoose.model("Stay", StaySchema);

  const staysJsonPath = path.join(__dirname, "..", "src", "data", "stays.json");
  const seedStaysPath = path.join(__dirname, "seed-stays-data.json");

  let staysJson = fs.existsSync(staysJsonPath) ? JSON.parse(fs.readFileSync(staysJsonPath, "utf-8")) : [];
  let seedStays = fs.existsSync(seedStaysPath) ? JSON.parse(fs.readFileSync(seedStaysPath, "utf-8")) : [];

  const allDocs = await Stay.find({}).lean();
  let fixCount = 0;

  for (const doc of allDocs) {
    const images = Array.isArray(doc.images) ? doc.images : [];
    // Remove any PNG illustration graphics or URLs containing 'ae3fe995'
    const realPhotos = images.filter(img => typeof img === "string" && !img.includes("ae3fe995") && !img.endsWith(".png") && !img.includes("user_meta") && !img.includes("illustration"));

    if (realPhotos.length > 0) {
      const newMain = realPhotos[0];

      await Stay.updateOne(
        { _id: doc._id },
        {
          $set: {
            imageUrl: newMain,
            images: realPhotos
          }
        }
      );

      const jMatch = staysJson.find(s => s.id === doc.id || s.title === doc.title);
      if (jMatch) {
        jMatch.imageUrl = newMain;
        jMatch.images = realPhotos;
      }

      const sMatch = seedStays.find(s => s.id === doc.id || s.title === doc.title);
      if (sMatch) {
        sMatch.imageUrl = newMain;
        sMatch.images = realPhotos;
      }

      if (doc.imageUrl !== newMain || images.length !== realPhotos.length) {
        console.log(`FIXED ${doc.title} (${doc.id}): New Main Image => ${newMain}`);
        fixCount++;
      }
    }
  }

  fs.writeFileSync(staysJsonPath, JSON.stringify(staysJson, null, 2));
  console.log(`Saved updated ${staysJsonPath}`);

  fs.writeFileSync(seedStaysPath, JSON.stringify(seedStays, null, 2));
  console.log(`Saved updated ${seedStaysPath}`);

  console.log(`\nCompleted fixing main images for ${fixCount} properties!`);
  await mongoose.disconnect();
}

main().catch(console.error);
