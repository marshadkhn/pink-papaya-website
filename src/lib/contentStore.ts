import { revalidateTag, unstable_cache } from "next/cache";
import mongoose, { Model, Schema } from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { env } from "@/lib/env";

type ContentDoc<T> = {
  id: string;
  data: T;
  createdAt: Date;
  updatedAt: Date;
};

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

  await connectToDatabase();
  const model = getModel<T>(collectionName);
  const count = await model.estimatedDocumentCount();
  if (count > 0 || seedData.length === 0) {
    return;
  }

  await model.insertMany(
    seedData.map((item) => ({
      id: item.id,
      data: item,
    }))
  );
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

  await ensureSeeded(collectionName, seedData);

  const cachedReader = unstable_cache(
    async () => {
      await connectToDatabase();
      const model = getModel<T>(collectionName);
      const docs = await model.find().select("id data -_id").sort({ updatedAt: -1 }).lean();
      return docs.map((doc) => doc.data);
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

  await ensureSeeded(collectionName, seedData);

  const cachedReader = unstable_cache(
    async () => {
      await connectToDatabase();
      const model = getModel<T>(collectionName);
      const doc = await model.findOne({ id }).select("id data -_id").lean();
      return doc?.data;
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
