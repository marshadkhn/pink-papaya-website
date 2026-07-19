import { stays as seedStays } from "@/data/stays";
import connectToDatabase from "@/lib/mongodb";
import { Stay as StayModel } from "@/lib/models/Stay";
import mongoose from "mongoose";

export type Stay = typeof seedStays[number];

let seedPromise: Promise<void> | null = null;

async function ensureSeeded() {
  if (!seedPromise) {
    seedPromise = (async () => {
      await connectToDatabase();
      const count = await StayModel.countDocuments();
      if (count === 0) {
        await StayModel.insertMany(seedStays);
      }
    })();
  }
  return seedPromise;
}

function toStay(doc: any): Stay {
  const { _id, __v, createdAt, updatedAt, ...rest } = doc;
  return {
    ...rest,
    id: rest.id || _id.toString(),
  } as Stay;
}

export async function readStays(filters?: { category?: string; location?: string; guests?: string }): Promise<Stay[]> {
  await ensureSeeded();

  const query: Record<string, unknown> = {};
  if (filters?.category) {
    query.$or = [{ category: filters.category }, { categories: filters.category }];
  }

  const docs = await StayModel.find(query).lean();
  let all = docs.map(toStay);

  if (filters?.guests) {
    const requestedGuests = parseInt(filters.guests, 10);
    all = all.filter((stay) => {
      const stayGuestsMatch = (stay.guests || "").match(/\d+/);
      const stayGuests = stayGuestsMatch ? parseInt(stayGuestsMatch[0], 10) : 0;
      return stayGuests >= requestedGuests;
    });
  }

  // Location is handled by the caller/grid usually because it needs the locations mapping,
  // but we can support a direct match on the stay.location string if needed.
  // However, the current UI uses location IDs that map to stayIds.
  // So we'll skip location filtering here and let the grid handle it or pass stayIds.

  return all;
}

export async function getStayById(id: string): Promise<Stay | undefined> {
  await ensureSeeded();
  let doc = await StayModel.findOne({ id }).lean();
  if (!doc && mongoose.isValidObjectId(id)) {
    doc = await StayModel.findById(id).lean();
  }
  return doc ? toStay(doc) : undefined;
}

export async function addStay(stay: Stay): Promise<Stay> {
  await ensureSeeded();
  const doc = await StayModel.findOneAndUpdate(
    { id: stay.id },
    { $set: stay },
    { upsert: true, new: true }
  ).lean();
  return toStay(doc!);
}

export async function updateStay(id: string, patch: Partial<Stay>): Promise<Stay> {
  await ensureSeeded();
  let query: any = { id };
  if (mongoose.isValidObjectId(id)) {
    const existing = await StayModel.findOne({ id }).lean();
    if (!existing) query = { _id: id };
  }
  const doc = await StayModel.findOneAndUpdate(
    query,
    { $set: patch },
    { new: true }
  ).lean();
  if (!doc) throw new Error("Not found");
  return toStay(doc);
}

export async function deleteStay(id: string): Promise<void> {
  await ensureSeeded();
  let query: any = { id };
  if (mongoose.isValidObjectId(id)) {
    const existing = await StayModel.findOne({ id }).lean();
    if (!existing) query = { _id: id };
  }
  await StayModel.deleteOne(query);
}
