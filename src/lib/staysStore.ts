import { stays as seedStays } from "@/data/stays";
import { addItem, deleteItem, getItemById, readCollection, updateItem } from "@/lib/contentStore";

export type Stay = typeof seedStays[number];
const COLLECTION = "stays";

export async function readStays(filters?: { category?: string; location?: string; guests?: string }): Promise<Stay[]> {
  const all = await readCollection(COLLECTION, seedStays, 180);
  if (!filters) return all;

  return all.filter((stay) => {
    if (filters.category && stay.category !== filters.category) return false;
    
    // Guests filter: match if stay.guests >= requested guests
    if (filters.guests) {
      const requestedGuests = parseInt(filters.guests, 10);
      const stayGuestsMatch = (stay.guests || "").match(/\d+/);
      const stayGuests = stayGuestsMatch ? parseInt(stayGuestsMatch[0], 10) : 0;
      if (stayGuests < requestedGuests) return false;
    }

    // Location is handled by the caller/grid usually because it needs the locations mapping,
    // but we can support a direct match on the stay.location string if needed.
    // However, the current UI uses location IDs that map to stayIds.
    // So we'll skip location filtering here and let the grid handle it or pass stayIds.
    
    return true;
  });
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
