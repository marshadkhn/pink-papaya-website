import { interiorProjects as seedProjects } from "@/data/interior";
import { addItem, deleteItem, getItemById, readCollection, updateItem } from "@/lib/contentStore";

export type InteriorProject = typeof seedProjects[number];
const COLLECTION = "interior";

export async function readInteriorProjects(): Promise<InteriorProject[]> {
  return readCollection(COLLECTION, seedProjects, 300);
}

export async function getInteriorProjectById(id: string): Promise<InteriorProject | undefined> {
  return getItemById(COLLECTION, id, seedProjects);
}

export async function addInteriorProject(project: InteriorProject): Promise<InteriorProject> {
  return addItem(COLLECTION, project);
}

export async function updateInteriorProject(id: string, patch: Partial<InteriorProject>): Promise<InteriorProject> {
  return updateItem(COLLECTION, id, patch);
}

export async function deleteInteriorProject(id: string): Promise<void> {
  return deleteItem(COLLECTION, id);
}
