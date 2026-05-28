import { interiorProjects as seedProjects } from "@/data/interior";

export type InteriorProject = typeof seedProjects[number];

const memoryStore: Record<string, InteriorProject> = {};
seedProjects.forEach(p => memoryStore[p.id] = p);

export async function readInteriorProjects(): Promise<InteriorProject[]> {
  return Object.values(memoryStore);
}

export async function getInteriorProjectById(id: string): Promise<InteriorProject | undefined> {
  return memoryStore[id];
}

export async function addInteriorProject(project: InteriorProject): Promise<InteriorProject> {
  memoryStore[project.id] = project;
  return project;
}

export async function updateInteriorProject(id: string, patch: Partial<InteriorProject>): Promise<InteriorProject> {
  const existing = memoryStore[id];
  if (!existing) throw new Error("Not found");
  const updated = { ...existing, ...patch };
  memoryStore[id] = updated;
  return updated;
}

export async function deleteInteriorProject(id: string): Promise<void> {
  delete memoryStore[id];
}
