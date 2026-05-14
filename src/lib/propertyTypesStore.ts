import seedPropertyTypes from "@/data/propertyTypes.json";
import { addItem, deleteItem, getItemById, readCollection, updateItem } from "@/lib/contentStore";

export type PropertyType = {
  id: string;
  name: string;
};

const COLLECTION = "propertyTypes";

export async function readPropertyTypes(): Promise<PropertyType[]> {
  return readCollection(COLLECTION, seedPropertyTypes as PropertyType[], 300);
}

export async function getPropertyTypeById(id: string): Promise<PropertyType | undefined> {
  return getItemById(COLLECTION, id, seedPropertyTypes as PropertyType[]);
}

export async function addPropertyType(pt: PropertyType): Promise<PropertyType> {
  return addItem(COLLECTION, pt);
}

export async function updatePropertyType(id: string, patch: Partial<PropertyType>): Promise<PropertyType> {
  return updateItem(COLLECTION, id, patch);
}

export async function deletePropertyType(id: string): Promise<void> {
  return deleteItem(COLLECTION, id);
}
