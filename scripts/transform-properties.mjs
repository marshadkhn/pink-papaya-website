import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const parsed = JSON.parse(
  readFileSync(path.join(__dirname, "parsed-properties.json"), "utf-8")
);

// ids in order matching properties 1-40, 42, 43 (#41 absent in source)
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

const collectionMap = {
  "Romantic Luxury Escapes": "romantic-jacuzzi-escapes",
  "Expansive Views": "expansive-views",
  "Walk to the Beach": "walk-to-beach",
};

const propertyTypeMap = {
  Villas: "villas",
  Apartments: "apartments",
};

function normalizeGuests(guests) {
  // collapse "2 +1 Guests" / "2+ 1 Guests" / "2 + 1Guests" / "2 + 1 Guests" -> "2+1 Guests"
  return guests
    .replace(/\s*\+\s*/g, "+")
    .replace(/(\d)Guests/, "$1 Guests")
    .replace(/\s+/g, " ")
    .trim();
}

function bedCountToBaths(bedsStr) {
  const m = bedsStr.match(/\d+/);
  const n = m ? parseInt(m[0], 10) : 1;
  return n === 1 ? "1 Bath" : `${n} Baths`;
}

function dedupeNearby(places) {
  const seen = new Set();
  const out = [];
  for (const p of places) {
    if (!p.name) continue;
    const key = `${p.name}|${p.distance}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
  }
  return out;
}

if (parsed.length !== ids.length) {
  throw new Error(`Mismatch: ${parsed.length} parsed properties vs ${ids.length} ids`);
}

const stays = parsed.map((p, idx) => {
  const collectionNames = p.collection
    ? p.collection.split(",").map((c) => c.trim()).filter(Boolean)
    : [];
  const categories = collectionNames
    .map((name) => collectionMap[name])
    .filter(Boolean);

  const stay = {
    id: ids[idx],
    title: p.title,
    imageUrl: "/images/stay-view.png",
    images: [],
    area: bedCountToBaths(p.beds),
    bed: p.beds,
    guests: normalizeGuests(p.guests),
    propertyType: propertyTypeMap[p.propertyType] || "apartments",
    description: p.shortDescription,
    pricePerNight: p.price || "On Request",
    location: p.location,
    aboutContent: p.about,
    nearbyPlaces: dedupeNearby(p.nearbyPlaces),
    faqs: p.faqs,
  };

  if (categories.length > 0) {
    stay.category = categories[0];
    stay.categories = categories;
  }

  return stay;
});

writeFileSync(
  path.join(__dirname, "seed-stays-data.json"),
  JSON.stringify(stays, null, 2)
);

console.log(`Transformed ${stays.length} stays`);
for (const s of stays) {
  console.log(
    `${s.id} | area=${s.area} bed=${s.bed} guests=${s.guests} type=${s.propertyType} price=${s.pricePerNight} cats=${(s.categories || []).join(",")}`
  );
}
