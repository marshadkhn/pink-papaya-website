import seedPropertyTypes from "@/data/propertyTypes.json";

export type PropertyType = {
  id: string;
  name: string;
};

const memoryStore: Record<string, PropertyType> = {};
(seedPropertyTypes as PropertyType[]).forEach(p => memoryStore[p.id] = p);

export async function readPropertyTypes(): Promise<PropertyType[]> {
  return Object.values(memoryStore);
}

export async function getPropertyTypeById(id: string): Promise<PropertyType | undefined> {
  return memoryStore[id];
}

export async function addPropertyType(pt: PropertyType): Promise<PropertyType> {
  memoryStore[pt.id] = pt;
  return pt;
}

export async function updatePropertyType(id: string, patch: Partial<PropertyType>): Promise<PropertyType> {
  const existing = memoryStore[id];
  if (!existing) throw new Error("Not found");
  const updated = { ...existing, ...patch };
  memoryStore[id] = updated;
  return updated;
}

export async function deletePropertyType(id: string): Promise<void> {
  delete memoryStore[id];
}
