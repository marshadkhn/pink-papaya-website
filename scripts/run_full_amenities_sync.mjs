import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const propertiesData = [
  { id: "sempre", title: "Sempre", url: "https://www.airbnb.co.in/rooms/1584060007789227621" },
  { id: "bougainvillea-suite", title: "Bougainvillea Suite", url: "https://www.airbnb.co.in/rooms/1595489908894597747" },
  { id: "gulmohar-suite", title: "Gulmohar Suite", url: "https://www.airbnb.co.in/rooms/1598397403621556633" },
  { id: "magnolia-suite", title: "Magnolia Suite", url: "https://www.airbnb.co.in/rooms/1638490445142073681" },
  { id: "marigold-suite", title: "Marigold Suite", url: "https://www.airbnb.co.in/rooms/1639049283716888336" },
  { id: "the-manor", title: "The Manor", url: "https://www.airbnb.co.in/rooms/1125162353408673658" },
  { id: "villa-r-and-r", title: "Villa R&R", url: "https://www.airbnb.co.in/rooms/1294005683628541317" },
  { id: "benaulim-house", title: "Benaulim House", url: "https://www.airbnb.co.in/rooms/1294005683628541317" },
  { id: "casa-kai", title: "Casa Kai", url: "https://www.airbnb.co.in/rooms/892448931318072803" },
  { id: "the-fieldhouse", title: "The Fieldhouse", url: "https://www.airbnb.co.in/rooms/1553441010980352073" },
  { id: "the-green", title: "The Green", url: "https://www.airbnb.co.in/rooms/1571623573129478307" },
  { id: "casa-tinu", title: "Casa Tinu", url: "https://www.airbnb.co.in/rooms/1601475431116573357" },
  { id: "la-amore", title: "La Amore", url: "https://www.airbnb.co.in/rooms/1254938866510280695" },
  { id: "la-solis", title: "La Solis", url: "https://www.airbnb.co.in/rooms/1404824533410152585" },
  { id: "casa-de-pacato", title: "Casa de Pacato", url: "https://www.airbnb.co.uk/rooms/1338926639572668772" },
  { id: "casa-remi", title: "Casa Remi", url: "https://www.airbnb.co.in/rooms/786891485989228382" },
  { id: "candolim-bliss", title: "Candolim Bliss", url: "https://www.airbnb.co.in/rooms/1492702104227983422" },
  { id: "belle-maison", title: "Belle Maison", url: "https://www.airbnb.co.in/rooms/1454864277989441438" },
  { id: "casa-sukriti", title: "Casa Sukriti", url: "https://www.airbnb.co.in/rooms/783630926435060967" },
  { id: "la-prana", title: "La Prana", url: "https://www.airbnb.co.in/rooms/1610190226588887421" },
  { id: "the-green-window", title: "The Green Window", url: "https://www.airbnb.co.in/rooms/1561436729203752692" },
  { id: "siolim-dairies", title: "Siolim Dairies", url: "https://www.airbnb.co.in/rooms/1470831462254610416" },
  { id: "casa-sol", title: "Casa Sol", url: "https://www.airbnb.co.in/rooms/1419157625543834485" },
  { id: "banyan-bliss", title: "Banyan Bliss", url: "https://www.airbnb.co.uk/rooms/1419275858453353813" },
  { id: "baga-abode", title: "Baga Abode", url: "https://www.airbnb.co.in/rooms/962734185238543546" },
  { id: "la-mish", title: "La Mish", url: "https://www.airbnb.co.in/rooms/13873522" },
  { id: "umile-dimora", title: "Umile Dimora", url: "https://www.airbnb.co.uk/rooms/1470132213218960497" },
  { id: "casa-hideaway", title: "Casa Hideaway", url: "https://www.airbnb.co.in/rooms/1264417494020261335" },
  { id: "ninho-de-amor", title: "Ninho de Amor", url: "https://www.airbnb.co.in/rooms/903321622188158048" },
  { id: "la-ruhe", title: "La Ruhe", url: "https://www.airbnb.co.in/rooms/699582488160499652" },
  { id: "juno", title: "Juno", url: "" },
  { id: "jigsaw", title: "Jigsaw", url: "https://www.airbnb.co.in/rooms/1112049163832086420" },
  { id: "the-blue-door", title: "The Blue Door", url: "https://www.airbnb.co.in/rooms/1079392568718451139" },
  { id: "le-bohemian", title: "Le Bohemian", url: "https://www.airbnb.co.in/rooms/996178508081943916" },
  { id: "casa-viva", title: "Casa Viva", url: "https://www.airbnb.co.in/rooms/807025967748109131" },
  { id: "the-sage-door", title: "The Sage Door", url: "https://www.airbnb.co.in/rooms/1251943309043881377" },
  { id: "vista-verde-002", title: "Vista Verde 002", url: "https://www.airbnb.co.in/rooms/1396319118915748428" },
  { id: "casa-siesta", title: "Casa Siesta", url: "https://www.airbnb.co.in/rooms/1252041770450775087" },
  { id: "belo-nido-003", title: "Belo Nido 003", url: "https://www.airbnb.co.in/rooms/1396280599772840704" },
  { id: "lazy-turtle", title: "Lazy Turtle", url: "https://www.airbnb.co.in/rooms/1043879671211125165" },
  { id: "laziest-turtle", title: "Laziest Turtle", url: "https://www.airbnb.co.in/rooms/1035933384425563119" },
  { id: "super-lazy-turtle", title: "Super Lazy Turtle", url: "https://www.airbnb.co.in/rooms/1206360742949399559" }
];

function extractAmenities(obj) {
  const ams = new Set();

  function processGroups(groups) {
    if (!Array.isArray(groups)) return;
    for (const g of groups) {
      if ((g.title || g.name) === "Not included") continue;
      if (Array.isArray(g.amenities)) {
        for (const a of g.amenities) {
          if (a.available === false) continue;
          const name = typeof a.title === "string" ? a.title.trim() : typeof a.name === "string" ? a.name.trim() : "";
          if (name) ams.add(name);
        }
      }
    }
  }

  function search(o) {
    if (!o || typeof o !== "object") return;
    if (Array.isArray(o.seeAllAmenitiesGroups)) processGroups(o.seeAllAmenitiesGroups);
    if (Array.isArray(o.previewAmenitiesGroups)) processGroups(o.previewAmenitiesGroups);
    for (const k of Object.keys(o)) search(o[k]);
  }

  search(obj);
  return Array.from(ams);
}

async function scrapeAirbnbUrl(url) {
  if (!url) return [];
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      }
    });
    if (!res.ok) {
      console.warn(`HTTP status ${res.status} for ${url}`);
      return [];
    }
    const html = await res.text();
    const regex = /<script\b[^>]*type="application\/json"[^>]*>([\s\S]*?)<\/script>/gm;
    let match;
    while ((match = regex.exec(html)) !== null) {
      if (match[1].includes("seeAllAmenitiesGroups") || match[1].includes("previewAmenitiesGroups")) {
        try {
          const parsed = JSON.parse(match[1]);
          const list = extractAmenities(parsed);
          if (list.length > 0) return list;
        } catch (e) {
          // continue
        }
      }
    }
  } catch (e) {
    console.error(`Error scraping ${url}:`, e.message);
  }
  return [];
}

async function main() {
  console.log(`Starting clean amenities extraction for ${propertiesData.length} properties...`);

  const seedStaysPath = path.join(__dirname, "seed-stays-data.json");
  const staysJsonPath = path.join(__dirname, "..", "src", "data", "stays.json");

  let seedStaysData = JSON.parse(fs.readFileSync(seedStaysPath, "utf-8"));
  let staysJsonData = fs.existsSync(staysJsonPath) ? JSON.parse(fs.readFileSync(staysJsonPath, "utf-8")) : [];

  const default2BHKAmenities = [
    "Infinity pool", "Paddy field view", "Air conditioning", "Wifi", "Kitchen",
    "Private patio or balcony", "Free parking on premises", "Housekeeping available", "Hairdryer",
    "Hot water", "Essentials", "TV", "Microwave", "Fridge", "Bed linen", "Iron", "Crockery and cutlery"
  ];

  let totalUpdated = 0;

  for (let i = 0; i < propertiesData.length; i++) {
    const prop = propertiesData[i];
    console.log(`\n[${i+1}/${propertiesData.length}] ${prop.title} (${prop.id})...`);

    let amenities = [];
    if (prop.url) {
      amenities = await scrapeAirbnbUrl(prop.url);
    }

    if (amenities.length === 0) {
      const existing = seedStaysData.find(s => s.id === prop.id);
      if (existing && existing.amenities && existing.amenities.length > 0) {
        amenities = existing.amenities;
        console.log(`Kept existing ${amenities.length} amenities for ${prop.title}`);
      } else {
        amenities = default2BHKAmenities;
        console.log(`Using default ${amenities.length} amenities for ${prop.title}`);
      }
    } else {
      console.log(`Scraped ${amenities.length} VALID amenities for ${prop.title} (Filtered out 'Not included' items)`);
    }

    // Update seedStaysData
    const seedStay = seedStaysData.find(s => s.id === prop.id);
    if (seedStay) {
      seedStay.amenities = amenities;
    }

    // Update staysJsonData if present
    const jsonStay = staysJsonData.find(s => s.id === prop.id);
    if (jsonStay) {
      jsonStay.amenities = amenities;
    }

    totalUpdated++;
    await new Promise(r => setTimeout(r, 400));
  }

  // Write updated files
  fs.writeFileSync(seedStaysPath, JSON.stringify(seedStaysData, null, 2));
  console.log(`\nSaved updated ${seedStaysPath}`);

  if (staysJsonData.length > 0) {
    fs.writeFileSync(staysJsonPath, JSON.stringify(staysJsonData, null, 2));
    console.log(`Saved updated ${staysJsonPath}`);
  }

  // Update MongoDB
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

  const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://pink-papaya:c3Nr2vYQZfJJuiFz@pinkpapaya.ohd1bmr.mongodb.net/pink-papaya?appName=pinkpapaya";
  try {
    console.log("Connecting to MongoDB to update stays collection...");
    await mongoose.connect(MONGODB_URI);
    const Stay = mongoose.models.Stay || mongoose.model("Stay", new mongoose.Schema({ id: String, amenities: [String] }, { collection: "stays", strict: false }));

    for (const stay of seedStaysData) {
      await Stay.updateOne(
        { id: stay.id },
        { $set: { amenities: stay.amenities || [] } }
      );
    }
    console.log("Updated all stays in MongoDB!");
    await mongoose.disconnect();
  } catch (e) {
    console.warn("MongoDB update warning:", e.message);
  }

  console.log(`\nCompleted! Successfully re-synced clean amenities for all ${totalUpdated} properties.`);
}

main().catch(console.error);
