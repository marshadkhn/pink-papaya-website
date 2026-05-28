import { interiorFeedback as seedFeedback } from "@/data/interiorFeedback";

export type InteriorFeedbackItem = typeof seedFeedback[number];

const memoryStore: Record<string, InteriorFeedbackItem> = {};
seedFeedback.forEach(p => memoryStore[p.id] = p);

export async function readInteriorFeedback(): Promise<InteriorFeedbackItem[]> {
  return Object.values(memoryStore);
}

export async function getInteriorFeedbackById(id: string): Promise<InteriorFeedbackItem | undefined> {
  return memoryStore[id];
}

export async function addInteriorFeedback(feedback: InteriorFeedbackItem): Promise<InteriorFeedbackItem> {
  memoryStore[feedback.id] = feedback;
  return feedback;
}

export async function updateInteriorFeedback(id: string, patch: Partial<InteriorFeedbackItem>): Promise<InteriorFeedbackItem> {
  const existing = memoryStore[id];
  if (!existing) throw new Error("Not found");
  const updated = { ...existing, ...patch };
  memoryStore[id] = updated;
  return updated;
}

export async function deleteInteriorFeedback(id: string): Promise<void> {
  delete memoryStore[id];
}
