import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mdPath = path.join(__dirname, "..", "PinkPapayaStays_Properties Content.md");
const raw = readFileSync(mdPath, "utf-8");

// Unescape markdown backslash-escapes like \. \+ \! \& \-
function unescapeMd(s) {
  return s.replace(/\\([.+!&\-_*[\]()])/g, "$1").trim();
}

// Split into property blocks by top-level headers "# **N\. Title**"
const headerRe = /^# \*\*(\d+)\\?\.\s*(.+?)\*\*\s*$/gm;
const matches = [...raw.matchAll(headerRe)];

const blocks = [];
for (let i = 0; i < matches.length; i++) {
  const start = matches[i].index;
  const end = i + 1 < matches.length ? matches[i + 1].index : raw.length;
  const num = parseInt(matches[i][1], 10);
  const title = unescapeMd(matches[i][2]);
  const body = raw.slice(start, end);
  blocks.push({ num, title, body });
}

function getField(body, label) {
  const re = new RegExp(`\\*\\*${label}:?\\*\\*\\s*(.+)`);
  const m = body.match(re);
  return m ? unescapeMd(m[1]) : "";
}

function getSection(body, startLabel, endLabels) {
  const startRe = new RegExp(`\\*\\*${startLabel}\\*\\*\\s*\\n+`);
  const startMatch = body.match(startRe);
  if (!startMatch) return "";
  const startIdx = startMatch.index + startMatch[0].length;

  let endIdx = body.length;
  for (const label of endLabels) {
    const endRe = new RegExp(`\\*\\*${label}`);
    const endMatch = body.slice(startIdx).match(endRe);
    if (endMatch) {
      const idx = startIdx + endMatch.index;
      if (idx < endIdx) endIdx = idx;
    }
  }
  return body.slice(startIdx, endIdx).trim();
}

function parseNearbyPlaces(text) {
  const lines = text.split("\n").map((l) => l.trim()).filter((l) => l.startsWith("*"));
  const places = [];
  for (let line of lines) {
    line = unescapeMd(line.replace(/^\*\s*/, ""));
    if (!line) continue;
    const m = line.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
    if (m) {
      places.push({ name: m[1].trim(), distance: m[2].trim() });
    } else {
      places.push({ name: line, distance: "" });
    }
  }
  return places;
}

function parseFaqs(text) {
  const faqs = [];
  const re = /\*\*Q:\s*(.+?)\*\*\s*\n+A:\s*(.+?)(?=\n\*\*Q:|\n#|$)/gs;
  let m;
  while ((m = re.exec(text)) !== null) {
    faqs.push({
      question: unescapeMd(m[1].trim()),
      answer: unescapeMd(m[2].trim().replace(/\n+/g, " ")),
    });
  }
  return faqs;
}

function cleanParagraph(text) {
  return unescapeMd(text.trim().replace(/\n+/g, " "));
}

const properties = blocks.map(({ num, title, body }) => {
  const area = getField(body, "Area");
  const beds = getField(body, "Beds?");
  const guests = getField(body, "Guests?");
  const location = getField(body, "Location");
  const price = getField(body, "Price per Night");
  const collection = getField(body, "Collection");
  const propertyType = getField(body, "Property Type");

  const shortDescription = cleanParagraph(
    getSection(body, "Short Description", ["About", "Nearby Places", "FAQs"])
  );
  const about = cleanParagraph(
    getSection(body, "About", ["Nearby Places", "FAQs"])
  );
  const nearbyText = getSection(body, "Nearby Places", ["FAQs"]);
  const faqsText = getSection(body, "FAQs", []);

  return {
    num,
    title,
    area,
    beds,
    guests,
    location,
    price,
    collection,
    propertyType,
    shortDescription,
    about,
    nearbyPlaces: parseNearbyPlaces(nearbyText),
    faqs: parseFaqs(faqsText),
  };
});

writeFileSync(
  path.join(__dirname, "parsed-properties.json"),
  JSON.stringify(properties, null, 2)
);

console.log(`Parsed ${properties.length} properties`);
for (const p of properties) {
  console.log(
    `#${p.num} ${p.title} | beds=${p.beds} guests=${p.guests} price=${p.price} | collection=${p.collection} | type=${p.propertyType} | nearby=${p.nearbyPlaces.length} faqs=${p.faqs.length} | shortDesc=${p.shortDescription.length}ch about=${p.about.length}ch`
  );
}
