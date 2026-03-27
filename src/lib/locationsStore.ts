import seedLocations from "@/data/locations.json";
import { addItem, deleteItem, getItemById, readCollection, updateItem } from "@/lib/contentStore";

export type Location = {
  id: string;
  name: string;
  stayIds: string[];
};

const COLLECTION = "locations";

export async function readLocations(): Promise<Location[]> {
  return readCollection(COLLECTION, seedLocations as Location[], 300);
}

export async function getLocationById(id: string): Promise<Location | undefined> {
  return getItemById(COLLECTION, id, seedLocations as Location[]);
}

export async function addLocation(location: Location): Promise<Location> {
  return addItem(COLLECTION, location);
}

export async function updateLocation(id: string, patch: Partial<Location>): Promise<Location> {
  return updateItem(COLLECTION, id, patch);
}

export async function deleteLocation(id: string): Promise<void> {
  return deleteItem(COLLECTION, id);
}
