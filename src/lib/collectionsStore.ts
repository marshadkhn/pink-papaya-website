import seedCollections from "@/data/collections.json";
import { addItem, deleteItem, getItemById, readCollection, updateItem } from "@/lib/contentStore";

export type Collection = {
  id: string;
  name: string;
  description?: string;
};

const COLLECTION = "collections";

export async function readCollections(): Promise<Collection[]> {
  return readCollection(COLLECTION, seedCollections as Collection[], 300);
}

export async function getCollectionById(id: string): Promise<Collection | undefined> {
  return getItemById(COLLECTION, id, seedCollections as Collection[]);
}

export async function addCollection(col: Collection): Promise<Collection> {
  return addItem(COLLECTION, col);
}

export async function updateCollection(id: string, patch: Partial<Collection>): Promise<Collection> {
  return updateItem(COLLECTION, id, patch);
}

export async function deleteCollection(id: string): Promise<void> {
  return deleteItem(COLLECTION, id);
}
