import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import mongoose from "mongoose";

const { Schema } = mongoose;

const NearbyPlaceSchema = new Schema(
  {
    name: { type: String, required: true },
    distance: { type: String, required: true },
  },
  { _id: false }
);

const FaqSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const StaySchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    area: { type: String, required: true },
    bed: { type: String, required: true },
    guests: { type: String, required: true },
    category: { type: String },
    categories: { type: [String], default: undefined },
    propertyType: { type: String },
    description: { type: String },
    pricePerNight: { type: String },
    images: { type: [String], default: undefined },
    amenities: { type: [String], default: undefined },
    location: { type: String },
    aboutContent: { type: String },
    locationMapUrl: { type: String },
    nearbyPlaces: { type: [NearbyPlaceSchema], default: undefined },
    faqs: { type: [FaqSchema], default: undefined },
    featuredOnHome: { type: Boolean },
  },
  { timestamps: true, collection: "stays" }
);

const Stay = mongoose.models.Stay || mongoose.model("Stay", StaySchema);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const stays = JSON.parse(
  readFileSync(path.join(__dirname, "seed-stays-data.json"), "utf-8")
);

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI not set");
  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB_NAME || undefined });

  let upserted = 0;
  for (const stay of stays) {
    await Stay.findOneAndUpdate(
      { id: stay.id },
      { $set: stay },
      { upsert: true, new: true }
    );
    upserted++;
    console.log(`Upserted: ${stay.id}`);
  }

  console.log(`Done. Upserted ${upserted} stays.`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
