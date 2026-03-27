import { stays as seedStays } from "@/data/stays";
import { addItem, deleteItem, getItemById, readCollection, updateItem } from "@/lib/contentStore";

export type Stay = typeof seedStays[number];
const COLLECTION = "stays";

export async function readStays(): Promise<Stay[]> {
  return readCollection(COLLECTION, seedStays, 180);
}

export async function getStayById(id: string): Promise<Stay | undefined> {
  return getItemById(COLLECTION, id, seedStays);
}

export async function addStay(stay: Stay): Promise<Stay> {
  return addItem(COLLECTION, stay);
}

export async function updateStay(id: string, patch: Partial<Stay>): Promise<Stay> {
  return updateItem(COLLECTION, id, patch);
}

export async function deleteStay(id: string): Promise<void> {
  return deleteItem(COLLECTION, id);
}
