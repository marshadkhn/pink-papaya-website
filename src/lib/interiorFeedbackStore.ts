import { interiorFeedback as seedFeedback } from "@/data/interiorFeedback";
import { addItem, deleteItem, getItemById, readCollection, updateItem } from "@/lib/contentStore";

export type InteriorFeedbackItem = typeof seedFeedback[number];
const COLLECTION = "interior-feedback";

export async function readInteriorFeedback(): Promise<InteriorFeedbackItem[]> {
  return readCollection(COLLECTION, seedFeedback, 300);
}

export async function getInteriorFeedbackById(id: string): Promise<InteriorFeedbackItem | undefined> {
  return getItemById(COLLECTION, id, seedFeedback);
}

export async function addInteriorFeedback(feedback: InteriorFeedbackItem): Promise<InteriorFeedbackItem> {
  return addItem(COLLECTION, feedback);
}

export async function updateInteriorFeedback(id: string, patch: Partial<InteriorFeedbackItem>): Promise<InteriorFeedbackItem> {
  return updateItem(COLLECTION, id, patch);
}

export async function deleteInteriorFeedback(id: string): Promise<void> {
  return deleteItem(COLLECTION, id);
}
