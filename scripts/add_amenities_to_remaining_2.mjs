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

const standardAmenities = [
  "Air conditioning", "Wifi", "Private balcony", "Hot water", "Shower gel",
  "Shampoo", "Hairdryer", "Hangers", "Bed linen", "Iron", "TV",
  "Kitchenette", "Fridge", "Microwave", "Kettle", "Free parking on premises",
  "Self check-in", "Housekeeping available", "Swimming pool access"
];

async function main() {
  await mongoose.connect(uri);
  const StaySchema = new mongoose.Schema({}, { collection: "stays", strict: false });
  const Stay = mongoose.models.Stay || mongoose.model("Stay", StaySchema);

  // 1. Casa Sarena
  await Stay.updateOne(
    { id: "casa-sarena" },
    {
      $set: {
        location: "Candolim, North Goa",
        pricePerNight: "On Request",
        description: "A luxury 1BHK suite in Candolim. Casa Sarena by Pink Papaya Stays features vibrant interiors, modern amenities, and close proximity to the beach.",
        aboutContent: "Casa Sarena is a beautifully appointed 1-bedroom suite in Candolim, North Goa. Curated by Pink Papaya Stays for couples and solo travelers, it offers plush bedding, air conditioning, modern decor, and easy access to Candolim's best dining and coastal spots.",
        nearbyPlaces: [
          { name: "Candolim Beach", distance: "5 min drive" },
          { name: "Fort Aguada", distance: "12 min drive" },
          { name: "Calangute Beach", distance: "10 min drive" }
        ],
        faqs: [
          { question: "Is Casa Sarena near the beach?", answer: "Yes, Candolim Beach is just a 5-minute drive away." }
        ],
        amenities: standardAmenities
      }
    }
  );

  // 2. Case Mare (Casa Mare)
  await Stay.updateOne(
    { id: "case-mare" },
    {
      $set: {
        location: "Siolim, North Goa",
        pricePerNight: "On Request",
        description: "A luxury 2BHK villa with private pool in Siolim. Case Mare by Pink Papaya Stays delivers serene pool views, spacious living, and tropical coastal charm.",
        aboutContent: "Case Mare is a 2-bedroom luxury villa with a private pool located in Siolim, North Goa. Managed by Pink Papaya Stays, this villa offers an open lounge area, private swimming pool, and stylish bedrooms perfect for group retreats and family holidays.",
        nearbyPlaces: [
          { name: "Siolim Church", distance: "5 min drive" },
          { name: "Assagao Cafes", distance: "10 min drive" },
          { name: "Vagator Beach", distance: "15 min drive" }
        ],
        faqs: [
          { question: "Does Case Mare have a private pool?", answer: "Yes, Case Mare features a private pool." }
        ],
        amenities: [
          "Private pool", "Air conditioning", "Wifi", "Free parking", "Kitchen",
          "Fridge", "Microwave", "Hot water", "Hairdryer", "Hangers", "TV",
          "Private patio", "Self check-in", "Housekeeping available"
        ]
      }
    }
  );

  console.log("✅ Updated Casa Sarena and Case Mare with amenities and text content!");

  // Also sync stays.json & seed-stays-data.json
  const staysJsonPath = path.join(__dirname, "..", "src", "data", "stays.json");
  const seedPath = path.join(__dirname, "seed-stays-data.json");

  const allStays = await Stay.find({}).lean();
  fs.writeFileSync(staysJsonPath, JSON.stringify(allStays, null, 2));
  fs.writeFileSync(seedPath, JSON.stringify(allStays, null, 2));
  console.log("Updated stays.json and seed-stays-data.json");

  await mongoose.disconnect();
}

main().catch(console.error);
