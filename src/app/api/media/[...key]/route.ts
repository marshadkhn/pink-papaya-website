import fs from "fs/promises";
import path from "path";
import { env } from "@/lib/env";

const CONTENT_TYPES: Record<string, string> = {
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

/**
 * Dev-only fallback for serving local media. In production, Nginx serves
 * /media/ directly from MEDIA_DIR and this route is never hit.
 */
export async function GET(req: Request, props: { params: Promise<{ key: string[] }> }) {
  const params = await props.params;
  const mediaDir = env.MEDIA_DIR || path.join(process.cwd(), "public", "uploads");
  const filePath = path.join(mediaDir, ...params.key);

  if (!filePath.startsWith(path.resolve(mediaDir))) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": CONTENT_TYPES[ext] || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
