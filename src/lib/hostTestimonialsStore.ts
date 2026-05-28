import seedData from "@/data/hostTestimonials.json";

export type HostTestimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
};

const memoryStore: Record<string, HostTestimonial> = {};
(seedData as HostTestimonial[]).forEach(p => memoryStore[p.id] = p);

export async function readHostTestimonials(): Promise<HostTestimonial[]> {
  return Object.values(memoryStore);
}

export async function getHostTestimonialById(id: string): Promise<HostTestimonial | undefined> {
  return memoryStore[id];
}

export async function addHostTestimonial(item: HostTestimonial): Promise<HostTestimonial> {
  memoryStore[item.id] = item;
  return item;
}

export async function updateHostTestimonial(id: string, patch: Partial<HostTestimonial>): Promise<HostTestimonial> {
  const existing = memoryStore[id];
  if (!existing) throw new Error("Not found");
  const updated = { ...existing, ...patch };
  memoryStore[id] = updated;
  return updated;
}

export async function deleteHostTestimonial(id: string): Promise<void> {
  delete memoryStore[id];
}
