import { promises as fs } from "fs";
import path from "path";
import { stays as seedStays } from "@/data/stays";

export type Stay = typeof seedStays[number];

const dataDir = path.join(process.cwd(), "src", "data");
const jsonPath = path.join(dataDir, "stays.json");

async function ensureJsonFile() {
  try {
    await fs.access(jsonPath);
  } catch {
    // Seed from static data file
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(jsonPath, JSON.stringify(seedStays, null, 2), "utf8");
  }
}

export async function readStays(): Promise<Stay[]> {
  await ensureJsonFile();
  const raw = await fs.readFile(jsonPath, "utf8");
  return JSON.parse(raw);
}

export async function writeStays(next: Stay[]): Promise<void> {
  await fs.writeFile(jsonPath, JSON.stringify(next, null, 2), "utf8");
}

export async function getStayById(id: string): Promise<Stay | undefined> {
  const list = await readStays();
  return list.find((s) => s.id === id);
}

export async function addStay(stay: Stay): Promise<Stay> {
  const list = await readStays();
  if (list.find((s) => s.id === stay.id)) {
    throw new Error("Stay with this id already exists");
  }
  const next = [...list, stay];
  await writeStays(next);
  return stay;
}

export async function updateStay(id: string, patch: Partial<Stay>): Promise<Stay> {
  const list = await readStays();
  const idx = list.findIndex((s) => s.id === id);
  if (idx === -1) throw new Error("Stay not found");
  const updated = { ...list[idx], ...patch, id };
  list[idx] = updated as Stay;
  await writeStays(list);
  return updated as Stay;
}

export async function deleteStay(id: string): Promise<void> {
  const list = await readStays();
  const next = list.filter((s) => s.id !== id);
  await writeStays(next);
}
