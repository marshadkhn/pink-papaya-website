import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedData = JSON.parse(fs.readFileSync(path.join(__dirname, "seed-stays-data.json"), "utf-8"));

const propertiesList = [
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

console.log(`TOTAL PROPERTIES IN DATASET: ${propertiesList.length}`);

const scrapedSuccess = [];
const pendingList = [];

for (const prop of propertiesList) {
  const found = seedData.find(s => s.id === prop.id);
  const count = found && found.amenities ? found.amenities.length : 0;
  if (prop.url && count > 20) {
    scrapedSuccess.push({ id: prop.id, title: prop.title, count, url: prop.url });
  } else {
    pendingList.push({ id: prop.id, title: prop.title, count, url: prop.url });
  }
}

console.log(`\n=== 1. SUCCESSFULLY UPDATED FROM AIRBNB (${scrapedSuccess.length} properties) ===`);
scrapedSuccess.forEach((p, idx) => {
  console.log(`${idx + 1}. ${p.title} (${p.id}) -> ${p.count} amenities`);
});

console.log(`\n=== 2. PENDING / FALLBACK PROPERTIES (${pendingList.length} properties) ===`);
pendingList.forEach((p, idx) => {
  console.log(`${idx + 1}. ${p.title} (${p.id}) -> ${p.count} amenities (Reason: ${p.url ? "Needs Airbnb URL verification" : "No Airbnb URL in PDF document"})`);
});
