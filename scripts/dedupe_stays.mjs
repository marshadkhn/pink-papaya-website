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
  console.log("Connecting to MongoDB...");
  await mongoose.connect(uri);

  const StaySchema = new mongoose.Schema({ id: String, title: String, amenities: [String] }, { collection: "stays", strict: false });
  const Stay = mongoose.models.Stay || mongoose.model("Stay", StaySchema);

  const allDocs = await Stay.find({}).lean();
  console.log(`Total Stay Documents in MongoDB: ${allDocs.length}`);

  for (const seedStay of seedData) {
    const stayId = seedStay.id;
    const stayTitle = seedStay.title;
    const amenities = seedStay.amenities || [];

    // Find all docs matching stayId OR matching stayTitle
    const matches = allDocs.filter(d => d.id === stayId || (d.title && d.title.toLowerCase().trim() === stayTitle.toLowerCase().trim()));

    if (matches.length > 1) {
      console.log(`\nFound ${matches.length} duplicate documents for stay: ${stayTitle} (${stayId})`);
      // Keep doc with valid id === stayId OR doc with id ObjectId, remove others and ensure the remaining doc has full amenities
      const primaryDoc = matches.find(m => m.id === stayId) || matches[0];
      const otherDocs = matches.filter(m => m._id.toString() !== primaryDoc._id.toString());

      for (const d of otherDocs) {
        console.log(`Deleting duplicate doc _id: ${d._id}`);
        await Stay.deleteOne({ _id: d._id });
      }

      await Stay.updateOne(
        { _id: primaryDoc._id },
        { $set: { id: stayId, amenities: amenities } }
      );
      console.log(`Updated primary doc _id: ${primaryDoc._id} with id: ${stayId} & ${amenities.length} amenities.`);
    } else if (matches.length === 1) {
      await Stay.updateOne(
        { _id: matches[0]._id },
        { $set: { id: stayId, amenities: amenities } }
      );
    }
  }

  // Also handle any ObjectId queries in getStayById: if stay document by id has amenities, sync it.
  const checkSempre = await Stay.findOne({ id: "sempre" }).lean();
  console.log("\nFinal Sempre MongoDB Document:");
  console.log(`- _id: ${checkSempre._id}`);
  console.log(`- id: ${checkSempre.id}`);
  console.log(`- title: ${checkSempre.title}`);
  console.log(`- amenitiesCount: ${checkSempre.amenities ? checkSempre.amenities.length : 0}`);

  await mongoose.disconnect();
}

main().catch(console.error);
