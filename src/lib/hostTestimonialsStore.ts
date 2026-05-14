import seedData from "@/data/hostTestimonials.json";
import { addItem, deleteItem, getItemById, readCollection, updateItem } from "@/lib/contentStore";

export type HostTestimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
};

const COLLECTION = "hostTestimonials";

export async function readHostTestimonials(): Promise<HostTestimonial[]> {
  return readCollection(COLLECTION, seedData as HostTestimonial[], 300);
}

export async function getHostTestimonialById(id: string): Promise<HostTestimonial | undefined> {
  return getItemById(COLLECTION, id, seedData as HostTestimonial[]);
}

export async function addHostTestimonial(item: HostTestimonial): Promise<HostTestimonial> {
  return addItem(COLLECTION, item);
}

export async function updateHostTestimonial(id: string, patch: Partial<HostTestimonial>): Promise<HostTestimonial> {
  return updateItem(COLLECTION, id, patch);
}

export async function deleteHostTestimonial(id: string): Promise<void> {
  return deleteItem(COLLECTION, id);
}
