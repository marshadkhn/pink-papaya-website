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

async function main() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(uri);

  const StaySchema = new mongoose.Schema({ id: String, title: String, amenities: [String] }, { collection: "stays", strict: false });
  const Stay = mongoose.models.Stay || mongoose.model("Stay", StaySchema);

  if (mongoose.isValidObjectId("6a48e43be33cf0e0fc8e0597")) {
    const docById = await Stay.findById("6a48e43be33cf0e0fc8e0597").lean();
    console.log("Doc by ObjectId 6a48e43be33cf0e0fc8e0597:", docById);
  }

  const allDocs = await Stay.find({}).lean();
  console.log(`Total Stays in MongoDB: ${allDocs.length}`);
  
  const sempreDocs = allDocs.filter(s => s.id === "sempre" || (s.title && s.title.toLowerCase().includes("sempre")));
  console.log("Sempre documents found in MongoDB:");
  sempreDocs.forEach(s => {
    console.log(`- _id: ${s._id}, id: ${s.id}, title: ${s.title}, amenitiesCount: ${s.amenities ? s.amenities.length : 0}`);
  });

  await mongoose.disconnect();
}

main().catch(console.error);
