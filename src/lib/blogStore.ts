import { posts as seedPosts } from "@/data/blog";
import { addItem, deleteItem, getItemById, readCollection, updateItem } from "@/lib/contentStore";

export type BlogPost = typeof seedPosts[number];
const COLLECTION = "blog";

export async function readPosts(): Promise<BlogPost[]> {
  return readCollection(COLLECTION, seedPosts, 300);
}

export async function getPostById(id: string): Promise<BlogPost | undefined> {
  return getItemById(COLLECTION, id, seedPosts);
}

export async function addPost(post: BlogPost): Promise<BlogPost> {
  return addItem(COLLECTION, post);
}

export async function updatePost(id: string, patch: Partial<BlogPost>): Promise<BlogPost> {
  return updateItem(COLLECTION, id, patch);
}

export async function deletePost(id: string): Promise<void> {
  return deleteItem(COLLECTION, id);
}
