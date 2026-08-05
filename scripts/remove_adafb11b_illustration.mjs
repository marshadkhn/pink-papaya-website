import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BAD_ILLUSTRATION_ID = "adafb11b-41e9-49d3-908e-049dfd6934b6";

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
    const rawImages = Array.isArray(doc.images) ? doc.images : [];
    const cleanImages = rawImages.filter(img => typeof img === "string" && !img.includes(BAD_ILLUSTRATION_ID) && !img.includes("ae3fe995") && !img.endsWith(".png"));

    let newMain = doc.imageUrl;
    if (newMain && (newMain.includes(BAD_ILLUSTRATION_ID) || newMain.includes("ae3fe995") || newMain.endsWith(".png"))) {
      newMain = cleanImages.length > 0 ? cleanImages[0] : "";
    }

    if (cleanImages.length > 0 && newMain) {
      await Stay.updateOne(
        { _id: doc._id },
        {
          $set: {
            imageUrl: newMain,
            images: cleanImages
          }
        }
      );

      const jMatch = staysJson.find(s => s.id === doc.id || s.title === doc.title);
      if (jMatch) {
        jMatch.imageUrl = newMain;
        jMatch.images = cleanImages;
      }

      const sMatch = seedStays.find(s => s.id === doc.id || s.title === doc.title);
      if (sMatch) {
        sMatch.imageUrl = newMain;
        sMatch.images = cleanImages;
      }

      if (rawImages.length !== cleanImages.length || doc.imageUrl !== newMain) {
        console.log(`REMOVED ILLUSTRATION FROM ${doc.title} (${doc.id}): New Main => ${newMain}`);
        fixCount++;
      }
    }
  }

  fs.writeFileSync(staysJsonPath, JSON.stringify(staysJson, null, 2));
  console.log(`Saved updated ${staysJsonPath}`);

  fs.writeFileSync(seedStaysPath, JSON.stringify(seedStays, null, 2));
  console.log(`Saved updated ${seedStaysPath}`);

  console.log(`\nRemoved bad illustration adafb11b from ${fixCount} properties!`);
  await mongoose.disconnect();
}

main().catch(console.error);
