import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mdPath = path.join(__dirname, "..", "PinkPapayaStays_Properties Content.md");

const ids = [
  "sempre",
  "bougainvillea-suite",
  "gulmohar-suite",
  "magnolia-suite",
  "marigold-suite",
  "the-manor",
  "villa-r-and-r",
  "benaulim-house",
  "casa-kai",
  "the-fieldhouse",
  "the-green",
  "casa-tinu",
  "la-amore",
  "la-solis",
  "casa-de-pacato",
  "casa-remi",
  "candolim-bliss",
  "belle-maison",
  "casa-sukriti",
  "la-prana",
  "the-green-window",
  "siolim-dairies",
  "casa-sol",
  "banyan-bliss",
  "baga-abode",
  "la-mish",
  "umile-dimora",
  "casa-hideaway",
  "ninho-de-amor",
  "la-ruhe",
  "juno",
  "jigsaw",
  "the-blue-door",
  "le-bohemian",
  "casa-viva",
  "the-sage-door",
  "vista-verde-002",
  "casa-siesta",
  "belo-nido-003",
  "lazy-turtle",
  "laziest-turtle",
  "super-lazy-turtle",
];

// Helper to clean markdown formatting
function unescapeMd(s) {
  return s.replace(/\\([.+!&\-_*[\]()])/g, "$1").trim();
}

// Split into property blocks
function parseMDProperties() {
  const raw = fs.readFileSync(mdPath, "utf-8");
  const headerRe = /^# \*\*(\d+)\\?\.\s*(.+?)\*\*\s*$/gm;
  const matches = [...raw.matchAll(headerRe)];
  
  const properties = [];
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index;
    const end = i + 1 < matches.length ? matches[i + 1].index : raw.length;
    const num = parseInt(matches[i][1], 10);
    const title = unescapeMd(matches[i][2]);
    const body = raw.slice(start, end);
    
    // Find the Airbnb link under Amenities
    const amenitiesMatch = body.match(/\*\*Amenities\*\*\s*\n+\s*\[(https:\/\/www\.airbnb\.[a-z.]+\/rooms\/\d+[^\]]*)\]/i);
    const url = amenitiesMatch ? unescapeMd(amenitiesMatch[1]) : "";
    
    properties.push({ num, title, url });
  }
  return properties;
}

function extractAmenities(parsedJson) {
  const amenitiesSet = new Set();
  
  function searchObj(obj) {
    if (!obj || typeof obj !== "object") return;
    
    if (obj.seeAllAmenitiesGroups && Array.isArray(obj.seeAllAmenitiesGroups)) {
      for (const group of obj.seeAllAmenitiesGroups) {
        if (group && Array.isArray(group.amenities)) {
          for (const am of group.amenities) {
            if (am && am.title) {
              amenitiesSet.add(am.title.trim());
            } else if (am && am.name) {
              amenitiesSet.add(am.name.trim());
            }
          }
        }
      }
    }
    
    if (obj.previewAmenitiesGroups && Array.isArray(obj.previewAmenitiesGroups)) {
      for (const group of obj.previewAmenitiesGroups) {
        if (group && Array.isArray(group.amenities)) {
          for (const am of group.amenities) {
            if (am && am.title) {
              amenitiesSet.add(am.title.trim());
            } else if (am && am.name) {
              amenitiesSet.add(am.name.trim());
            }
          }
        }
      }
    }
    
    for (const key of Object.keys(obj)) {
      searchObj(obj[key]);
    }
  }
  
  searchObj(parsedJson);
  return Array.from(amenitiesSet);
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
      console.error(`Failed to fetch ${url}. Status: ${res.status}`);
      return [];
    }
    
    const html = await res.text();
    const regex = /<script\b[^>]*type="application\/json"[^>]*>([\s\S]*?)<\/script>/gm;
    let match;
    
    while ((match = regex.exec(html)) !== null) {
      const content = match[1];
      if (content.includes("niobeClientData")) {
        const parsed = JSON.parse(content);
        return extractAmenities(parsed);
      }
    }
  } catch (e) {
    console.error(`Error scraping ${url}:`, e);
  }
  
  return [];
}

async function main() {
  const mode = process.argv[2] || "dry-run";
  console.log(`Running in ${mode} mode`);
  
  const properties = parseMDProperties();
  console.log(`Parsed ${properties.length} properties from MD file.`);
  
  if (properties.length !== ids.length) {
    console.warn(`Warning: properties length (${properties.length}) does not match ids length (${ids.length})`);
  }
  
  const uri = "mongodb+srv://pink-papaya:pinkpapaya%40123@pinkpapaya.ohd1bmr.mongodb.net/?appName=pinkpapaya";
  const dbName = "pinkpapaya";
  
  if (mode === "update") {
    await mongoose.connect(uri, { dbName });
    console.log("Connected to MongoDB.");
  }
  
  const StaySchema = new mongoose.Schema(
    {
      id: String,
      title: String,
      amenities: [String],
    },
    { collection: "stays" }
  );
  
  const Stay = mongoose.models.Stay || mongoose.model("Stay", StaySchema);
  
  let seedStaysData = [];
  const seedStaysDataPath = path.join(__dirname, "seed-stays-data.json");
  if (mode === "update" && fs.existsSync(seedStaysDataPath)) {
    try {
      seedStaysData = JSON.parse(fs.readFileSync(seedStaysDataPath, "utf-8"));
      console.log(`Loaded ${seedStaysData.length} stays from seed-stays-data.json`);
    } catch (e) {
      console.error("Failed to load seed-stays-data.json:", e);
    }
  }

  for (let i = 0; i < properties.length; i++) {
    const prop = properties[i];
    const stayId = ids[i];
    
    if (!stayId) {
      console.error(`No stay ID found for index ${i} (${prop.title})`);
      continue;
    }
    
    console.log(`\n[${i+1}/${properties.length}] Processing ${prop.title} (ID: ${stayId})...`);
    
    if (!prop.url) {
      console.log(`No Airbnb URL for ${prop.title}`);
      continue;
    }
    
    console.log(`Airbnb URL: ${prop.url}`);
    
    // Scrape amenities
    const amenities = await scrapeAirbnbUrl(prop.url);
    console.log(`Found ${amenities.length} amenities:`, amenities.slice(0, 10));
    
    if (mode === "update" && amenities.length > 0) {
      const result = await Stay.updateOne(
        { id: stayId },
        { $set: { amenities } }
      );
      console.log(`Database update result:`, result);

      // Update seed file data in-memory
      const seedStay = seedStaysData.find((s) => s.id === stayId);
      if (seedStay) {
        seedStay.amenities = amenities;
        console.log(`Updated amenities for ${stayId} in seed data.`);
      }
    }
    
    // Wait a brief delay to avoid slamming Airbnb servers
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  
  if (mode === "update") {
    if (seedStaysData.length > 0) {
      try {
        fs.writeFileSync(seedStaysDataPath, JSON.stringify(seedStaysData, null, 2));
        console.log(`Saved updated seed-stays-data.json to ${seedStaysDataPath}`);
      } catch (e) {
        console.error("Failed to save seed-stays-data.json:", e);
      }
    }
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
  
  console.log("\nDone!");
}

main().catch(console.error);
