import { randomUUID } from "crypto";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import { env } from "@/lib/env";
import getLogger from "@/lib/logger";

const logger = getLogger("Media");

const MAX_DIMENSION = 1200;
const WEBP_QUALITY = 65;

function getMediaDir() {
  return env.MEDIA_DIR || path.join(process.cwd(), "public", "uploads");
}

function getPublicBaseUrl() {
  if (env.NEXT_PUBLIC_CDN_BASE_URL) {
    return env.NEXT_PUBLIC_CDN_BASE_URL;
  }

  return "/media";
}

function safeBaseName(fileName: string) {
  const base = path.basename(fileName, path.extname(fileName));
  return base.toLowerCase().replace(/[^a-z0-9-_]/g, "-").slice(0, 60) || "file";
}

export async function uploadPublicAsset(input: {
  bytes: Buffer;
  fileName: string;
  contentType: string;
  folder?: string;
}) {
  const folder = input.folder ?? "uploads";
  const isImage = input.contentType.startsWith("image/");

  const baseName = `${Date.now()}-${randomUUID()}-${safeBaseName(input.fileName)}`;
  const ext = isImage ? "webp" : path.extname(input.fileName).toLowerCase().replace(/[^a-z0-9.]/g, "") || "";
  const key = `${folder}/${baseName}${isImage ? ".webp" : ext}`;

  const mediaDir = getMediaDir();
  const destPath = path.join(mediaDir, key);
  await fs.mkdir(path.dirname(destPath), { recursive: true });

  if (isImage) {
    await sharp(input.bytes)
      .rotate()
      .resize({
        width: MAX_DIMENSION,
        height: MAX_DIMENSION,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY, effort: 6, smartSubsample: true })
      .withMetadata({})
      .toFile(destPath);
  } else {
    await fs.writeFile(destPath, input.bytes);
  }

  logger.info("Saved asset to local media storage", { key, mediaDir });

  const url = `${getPublicBaseUrl()}/${key}`;
  return { key, url };
}

export async function deletePublicAsset(input: { key: string }) {
  const mediaDir = getMediaDir();
  const filePath = path.join(mediaDir, input.key);

  try {
    await fs.unlink(filePath);
    logger.info("Deleted asset from local media storage", { key: input.key });
  } catch (error: any) {
    if (error?.code !== "ENOENT") {
      throw error;
    }
  }
}
