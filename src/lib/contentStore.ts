import { revalidateTag, unstable_cache } from "next/cache";
import mongoose, { Model, Schema } from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { env } from "@/lib/env";
import getLogger from "@/lib/logger";

const logger = getLogger("Content");

type ContentDoc<T> = {
  id: string;
  data: T;
  createdAt: Date;
  updatedAt: Date;
};

declare global {
  // Avoid repeated seed-check DB calls on every request in dev/prod.
  var __contentSeededCollections: Set<string> | undefined;
  var __contentSeedInFlight: Map<string, Promise<void>> | undefined;
}

const seededCollections = global.__contentSeededCollections ?? new Set<string>();
const seedInFlight = global.__contentSeedInFlight ?? new Map<string, Promise<void>>();

if (!global.__contentSeededCollections) global.__contentSeededCollections = seededCollections;
if (!global.__contentSeedInFlight) global.__contentSeedInFlight = seedInFlight;

function getModel<T>(collectionName: string): Model<ContentDoc<T>> {
  const modelName = `Content_${collectionName}`;

  if (mongoose.models[modelName]) {
    return mongoose.models[modelName] as Model<ContentDoc<T>>;
  }

  const schema = new Schema<ContentDoc<T>>(
    {
      id: { type: String, required: true, unique: true, index: true },
      data: { type: Schema.Types.Mixed, required: true },
    },
    {
      collection: collectionName,
      timestamps: true,
      versionKey: false,
    }
  );

  return mongoose.model<ContentDoc<T>>(modelName, schema);
}

async function ensureSeeded<T extends { id: string }>(collectionName: string, seedData: T[]) {
  if (!env.MONGODB_URI) {
    return;
  }

  if (seededCollections.has(collectionName)) {
    return;
  }

  const existing = seedInFlight.get(collectionName);
  if (existing) {
    await existing;
    return;
  }

  const work = (async () => {
    try {
      await connectToDatabase();
      const model = getModel<T>(collectionName);

      // Cheap existence check vs estimatedDocumentCount on every request.
      const hasAny = await model.exists({});
      if (hasAny || seedData.length === 0) {
        seededCollections.add(collectionName);
        return;
      }

      await model.insertMany(
        seedData.map((item) => ({
          id: item.id,
          data: item,
        }))
      );

      // Ensure any cached reads get refreshed after seeding.
      revalidateTag(collectionCacheTag(collectionName));

      seededCollections.add(collectionName);
    } catch (err: any) {
      logger.warn("Skipping DB seeding due to connection error", { error: err?.message ?? err });
    } finally {
      seedInFlight.delete(collectionName);
    }
  })();

  seedInFlight.set(collectionName, work);
  await work;
}

function listCacheKey(collectionName: string) {
  return `content:list:${collectionName}`;
}

function itemCacheTag(collectionName: string, id: string) {
  return `content:item:${collectionName}:${id}`;
}

function collectionCacheTag(collectionName: string) {
  return `content:collection:${collectionName}`;
}

export async function readCollection<T extends { id: string }>(
  collectionName: string,
  seedData: T[],
  revalidateSeconds = 180
): Promise<T[]> {
  if (!env.MONGODB_URI) {
    return [...seedData];
  }

  // Don't block the request on potentially expensive seeding.
  // If the DB is empty, we'll fall back to seed data and seed in the background.
  void ensureSeeded(collectionName, seedData);

  const cachedReader = unstable_cache(
    async () => {
      try {
        await connectToDatabase();
        const model = getModel<T>(collectionName);
        const docs = await model.find().select("id data -_id").sort({ updatedAt: -1 }).lean();

        // If collection is empty (common on first boot), render seed data immediately.
        if (docs.length === 0 && !seededCollections.has(collectionName)) {
          return [...seedData];
        }

        return docs.map((doc) => doc.data);
      } catch (err: any) {
        logger.warn("Failed to read collection from DB; falling back to seed data", { error: err?.message ?? err });
        return [...seedData];
      }
    },
    [listCacheKey(collectionName)],
    {
      revalidate: revalidateSeconds,
      tags: [collectionCacheTag(collectionName)],
    }
  );

  return (await cachedReader()) as T[];
}

export async function getItemById<T extends { id: string }>(
  collectionName: string,
  id: string,
  seedData: T[]
): Promise<T | undefined> {
  if (!env.MONGODB_URI) {
    return seedData.find((item) => item.id === id);
  }

  void ensureSeeded(collectionName, seedData);

  const cachedReader = unstable_cache(
    async () => {
      try {
        await connectToDatabase();
        const model = getModel<T>(collectionName);
        const doc = await model.findOne({ id }).select("id data -_id").lean();

        if (doc?.data) return doc.data;
        if (!seededCollections.has(collectionName)) {
          return seedData.find((item) => item.id === id);
        }
        return undefined;
      } catch (err: any) {
        logger.warn("Failed to read item from DB; falling back to seed data", { error: err?.message ?? err, id });
        return seedData.find((item) => item.id === id);
      }
    },
    [itemCacheTag(collectionName, id)],
    {
      revalidate: 300,
      tags: [itemCacheTag(collectionName, id), collectionCacheTag(collectionName)],
    }
  );

  return (await cachedReader()) as T | undefined;
}

export async function addItem<T extends { id: string }>(collectionName: string, item: T): Promise<T> {
  if (!env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured");
  }

  await connectToDatabase();
  const model = getModel<T>(collectionName);

  const exists = await model.exists({ id: item.id });
  if (exists) {
    throw new Error(`Item with id '${item.id}' already exists`);
  }

  await model.create({ id: item.id, data: item });
  revalidateTag(collectionCacheTag(collectionName));
  revalidateTag(itemCacheTag(collectionName, item.id));

  return item;
}

export async function updateItem<T extends { id: string }>(
  collectionName: string,
  id: string,
  patch: Partial<T>
): Promise<T> {
  if (!env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured");
  }

  await connectToDatabase();
  const model = getModel<T>(collectionName);

  const doc = await model.findOne({ id });
  if (!doc) {
    throw new Error("Item not found");
  }

  const next = { ...(doc.data as T), ...patch, id };
  doc.data = next;
  await doc.save();

  revalidateTag(collectionCacheTag(collectionName));
  revalidateTag(itemCacheTag(collectionName, id));

  return next;
}

export async function deleteItem(collectionName: string, id: string): Promise<void> {
  if (!env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured");
  }

  await connectToDatabase();
  const model = getModel(collectionName);

  await model.deleteOne({ id });
  revalidateTag(collectionCacheTag(collectionName));
  revalidateTag(itemCacheTag(collectionName, id));
}
