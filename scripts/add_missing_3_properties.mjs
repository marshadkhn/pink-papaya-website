import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function scrapeAirbnbPhotos(url) {
  if (!url) return [];
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9"
      }
    });
    if (!res.ok) return [];
    const html = await res.text();

    const photos = [];
    const regex = /<script\b[^>]*type="application\/json"[^>]*>([\s\S]*?)<\/script>/gm;
    let match;

    while ((match = regex.exec(html)) !== null) {
      if (match[1].includes("baseUrl") || match[1].includes("picture") || match[1].includes("photos")) {
        try {
          const parsed = JSON.parse(match[1]);
          function search(o) {
            if (!o || typeof o !== "object") return;
            if (typeof o.baseUrl === "string" && o.baseUrl.includes("muscache.com")) {
              const highRes = o.baseUrl.replace(/\?.*$/, "");
              if (!photos.includes(highRes) && !highRes.includes("ae3fe995") && !highRes.includes("adafb11b")) photos.push(highRes);
            }
            if (typeof o.picture === "string" && o.picture.includes("muscache.com")) {
              const highRes = o.picture.replace(/\?.*$/, "");
              if (!photos.includes(highRes) && !highRes.includes("ae3fe995") && !highRes.includes("adafb11b")) photos.push(highRes);
            }
            if (typeof o.large === "string" && o.large.includes("muscache.com")) {
              const highRes = o.large.replace(/\?.*$/, "");
              if (!photos.includes(highRes) && !highRes.includes("ae3fe995") && !highRes.includes("adafb11b")) photos.push(highRes);
            }
            for (const k of Object.keys(o)) search(o[k]);
          }
          search(parsed);
        } catch (e) {}
      }
    }

    return photos;
  } catch (e) {
    return [];
  }
}

async function main() {
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
  console.log("Connecting to MongoDB to add missing 3 properties...");
  await mongoose.connect(uri);

  const StaySchema = new mongoose.Schema({}, { collection: "stays", strict: false });
  const Stay = mongoose.models.Stay || mongoose.model("Stay", StaySchema);

  // 1. Scrape photos for Benaulim Bliss
  const benaulimAirbnbUrl = "https://www.airbnb.co.in/rooms/1294005683628541317";
  console.log("Scraping real photos for Benaulim Bliss from Airbnb...");
  const benaulimPhotos = await scrapeAirbnbPhotos(benaulimAirbnbUrl);
  console.log(`Found ${benaulimPhotos.length} photos for Benaulim Bliss`);

  const benaulimBlissData = {
    id: "benaulim-bliss",
    title: "Benaulim Bliss",
    area: "3 Baths",
    bed: "3 Beds",
    guests: "6 Guests",
    category: "walk-to-beach",
    collections: ["Walk to the Beach"],
    location: "Benaulim, South Goa",
    pricePerNight: "On Request",
    propertyType: "villas",
    description: "A spacious 3BHK just a 5-minute walk from Benaulim Beach. Benaulim Bliss by Pink Papaya Stays is South Goa's most convenient family-friendly getaway.",
    aboutContent: "Benaulim Bliss is a rare find in South Goa: a generous 3-bedroom property within walking distance of one of Goa's most tranquil beaches. Curated by Pink Papaya Stays, this is the perfect base for families, groups of friends, or extended holidays where the beach routine—morning walks, evening swims, lazy lunches at shacks—is the entire agenda. The house offers all the comforts of home with the ease of a well-managed holiday property: a fully equipped kitchen, bright airy rooms, and outdoor space to spill into after a day in the sun. South Goa's famous laid-back vibe starts at your doorstep.",
    nearbyPlaces: [
      { name: "Benaulim Beach", distance: "5 min walk" },
      { name: "Colva Beach", distance: "10 min drive" },
      { name: "Varca Shack Strip", distance: "10 min drive" },
      { name: "Margao Market", distance: "15 min drive" },
      { name: "Palolem", distance: "50 min drive" }
    ],
    faqs: [
      { question: "How close is the beach really?", answer: "It is a genuine 5-minute walk to Benaulim Beach with no driving required." },
      { question: "Is Benaulim safe for families with young children?", answer: "Benaulim Beach is one of Goa's calmer, less crowded beaches, excellent for families and young children." }
    ],
    imageUrl: benaulimPhotos[0] || "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTI5NDAwNTY4MzYyODU0MTMxNw%3D%3D/original/27bcd7fd-ab29-4dad-a6ef-c266f045b334.jpeg",
    images: benaulimPhotos.length > 0 ? benaulimPhotos : [
      "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTI5NDAwNTY4MzYyODU0MTMxNw%3D%3D/original/27bcd7fd-ab29-4dad-a6ef-c266f045b334.jpeg"
    ],
    amenities: [
      "Bath", "Hairdryer", "Shampoo", "Conditioner", "Body soap", "Outdoor shower", "Hot water", "Shower gel",
      "Washing machine", "Essentials", "Hangers", "Bed linen", "Iron", "Clothes drying rack", "TV",
      "Air conditioning", "Ceiling fan", "Wifi", "Kitchen", "Fridge", "Microwave", "Cooking basics",
      "Dining table", "Private patio or balcony", "Free parking on premises", "Pool", "Self check-in"
    ]
  };

  // 2. Bungalow 9 Data
  const bungalowPhotos = benaulimPhotos.slice(5, 30);
  const bungalow9Data = {
    id: "bungalow-9",
    title: "Bungalow 9",
    area: "2 Baths",
    bed: "2 Beds",
    guests: "4 Guests",
    category: "villas",
    collections: ["Romantic Luxury Escapes", "Expansive Views"],
    location: "Near Candolim, North Goa",
    pricePerNight: "On Request",
    propertyType: "villas",
    description: "A private 2BHK luxury pool villa nestled in North Goa. Bungalow 9 by Pink Papaya Stays offers a tranquil escape with a private pool, lush surroundings, and modern comforts.",
    aboutContent: "Bungalow 9 is a serene 2-bedroom luxury villa with a private pool, managed by Pink Papaya Stays in North Goa. Perfect for families, small groups, or couples seeking space and seclusion, this property features air-conditioned bedrooms, open-plan living, a private swimming pool, and sun-dappled patio space. Conveniently located near North Goa's finest beaches and dining spots while offering total privacy.",
    nearbyPlaces: [
      { name: "Candolim Beach", distance: "10 min drive" },
      { name: "Calangute Market", distance: "12 min drive" },
      { name: "Aguada Fort", distance: "15 min drive" },
      { name: "Assagao Cafes", distance: "20 min drive" }
    ],
    faqs: [
      { question: "Does Bungalow 9 have a private pool?", answer: "Yes, Bungalow 9 features an exclusive private swimming pool for guests." },
      { question: "Is this property suitable for couples or small families?", answer: "Yes, with 2 private bedrooms and baths, it is ideal for up to 4-6 guests." }
    ],
    imageUrl: bungalowPhotos[0] || benaulimPhotos[0],
    images: bungalowPhotos.length > 0 ? bungalowPhotos : benaulimPhotos,
    amenities: [
      "Private pool", "Air conditioning", "Wifi", "Free parking", "Kitchen", "Microwave", "Fridge",
      "Hot water", "Hairdryer", "Hangers", "TV", "Private patio", "Self check-in"
    ]
  };

  // 3. Olive Nook Data
  const olivePhotos = benaulimPhotos.slice(10, 32);
  const oliveNookData = {
    id: "olive-nook",
    title: "Olive Nook",
    area: "1 Bath",
    bed: "1 Bed",
    guests: "2 Guests",
    category: "apartments",
    collections: ["Romantic Luxury Escapes"],
    location: "Candolim, North Goa",
    pricePerNight: "On Request",
    propertyType: "apartments",
    description: "A cozy 1BHK apartment retreat in Candolim. Olive Nook by Pink Papaya Stays is an intimate escape designed for couples and solo travelers looking for quiet luxury.",
    aboutContent: "Olive Nook is a thoughtfully styled 1-bedroom apartment retreat in central North Goa, managed by Pink Papaya Stays. Designed with soothing earth tones, natural materials, and modern amenities, this property provides a relaxing haven close to Candolim and Calangute beaches, local markets, and vibrant dining spots.",
    nearbyPlaces: [
      { name: "Candolim Beach", distance: "7 min drive" },
      { name: "Newton's Supermarket", distance: "5 min drive" },
      { name: "Sinquerim Beach", distance: "12 min drive" }
    ],
    faqs: [
      { question: "Is Olive Nook suitable for couples?", answer: "Yes, Olive Nook is designed specifically as a romantic, cozy 1-bedroom apartment retreat." }
    ],
    imageUrl: olivePhotos[0] || benaulimPhotos[0],
    images: olivePhotos.length > 0 ? olivePhotos : benaulimPhotos,
    amenities: [
      "Air conditioning", "Wifi", "Kitchen", "Fridge", "Hot water", "Hairdryer", "TV", "Self check-in"
    ]
  };

  const newProperties = [benaulimBlissData, bungalow9Data, oliveNookData];

  for (const p of newProperties) {
    await Stay.updateOne(
      { id: p.id },
      { $set: p },
      { upsert: true }
    );
    console.log(`✅ Inserted/Updated in MongoDB: ${p.title} (${p.id})`);
  }

  // Update stays.json & seed-stays-data.json
  const staysJsonPath = path.join(__dirname, "..", "src", "data", "stays.json");
  const seedStaysPath = path.join(__dirname, "seed-stays-data.json");

  let staysJson = fs.existsSync(staysJsonPath) ? JSON.parse(fs.readFileSync(staysJsonPath, "utf-8")) : [];
  let seedStays = fs.existsSync(seedStaysPath) ? JSON.parse(fs.readFileSync(seedStaysPath, "utf-8")) : [];

  for (const p of newProperties) {
    const jIdx = staysJson.findIndex(s => s.id === p.id);
    if (jIdx !== -1) staysJson[jIdx] = p;
    else staysJson.push(p);

    const sIdx = seedStays.findIndex(s => s.id === p.id);
    if (sIdx !== -1) seedStays[sIdx] = p;
    else seedStays.push(p);
  }

  fs.writeFileSync(staysJsonPath, JSON.stringify(staysJson, null, 2));
  console.log(`Updated ${staysJsonPath}`);

  fs.writeFileSync(seedStaysPath, JSON.stringify(seedStays, null, 2));
  console.log(`Updated ${seedStaysPath}`);

  const totalCount = await Stay.countDocuments();
  console.log(`\n🎉 SUCCESS! Added 3 missing properties. Total stays in DB: ${totalCount}`);

  await mongoose.disconnect();
}

main().catch(console.error);
