import seedCollections from "@/data/collections.json";

export type Collection = {
  id: string;
  name: string;
  description?: string;
};

const memoryStore: Record<string, Collection> = {};
(seedCollections as Collection[]).forEach(p => memoryStore[p.id] = p);

export async function readCollections(): Promise<Collection[]> {
  return Object.values(memoryStore);
}

export async function getCollectionById(id: string): Promise<Collection | undefined> {
  return memoryStore[id];
}

export async function addCollection(col: Collection): Promise<Collection> {
  memoryStore[col.id] = col;
  return col;
}

export async function updateCollection(id: string, patch: Partial<Collection>): Promise<Collection> {
  const existing = memoryStore[id];
  if (!existing) throw new Error("Not found");
  const updated = { ...existing, ...patch };
  memoryStore[id] = updated;
  return updated;
}

export async function deleteCollection(id: string): Promise<void> {
  delete memoryStore[id];
}
