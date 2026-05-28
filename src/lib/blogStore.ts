import { posts as seedPosts } from "@/data/blog";

export type BlogPost = typeof seedPosts[number];
const COLLECTION = "blog";

const memoryStore: Record<string, BlogPost> = {};
seedPosts.forEach(p => memoryStore[p.id] = p);

export async function readPosts(): Promise<BlogPost[]> {
  return Object.values(memoryStore);
}

export async function getPostById(id: string): Promise<BlogPost | undefined> {
  return memoryStore[id];
}

export async function addPost(post: BlogPost): Promise<BlogPost> {
  memoryStore[post.id] = post;
  return post;
}

export async function updatePost(id: string, patch: Partial<BlogPost>): Promise<BlogPost> {
  const existing = memoryStore[id];
  if (!existing) throw new Error("Not found");
  const updated = { ...existing, ...patch };
  memoryStore[id] = updated;
  return updated;
}

export async function deletePost(id: string): Promise<void> {
  delete memoryStore[id];
}
