import seedLocations from "@/data/locations.json";

export type Location = {
  id: string;
  name: string;
  stayIds: string[];
};

const memoryStore: Record<string, Location> = {};
(seedLocations as Location[]).forEach(p => memoryStore[p.id] = p);

export async function readLocations(): Promise<Location[]> {
  return Object.values(memoryStore);
}

export async function getLocationById(id: string): Promise<Location | undefined> {
  return memoryStore[id];
}

export async function addLocation(location: Location): Promise<Location> {
  memoryStore[location.id] = location;
  return location;
}

export async function updateLocation(id: string, patch: Partial<Location>): Promise<Location> {
  const existing = memoryStore[id];
  if (!existing) throw new Error("Not found");
  const updated = { ...existing, ...patch };
  memoryStore[id] = updated;
  return updated;
}

export async function deleteLocation(id: string): Promise<void> {
  delete memoryStore[id];
}
