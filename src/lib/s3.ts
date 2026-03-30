import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import path from "path";
import { assertAwsConfigured, env } from "@/lib/env";
import getLogger from "@/lib/logger";

const logger = getLogger("AWS");

declare global {
  var __s3Client: S3Client | undefined;
}

function getPublicBaseUrl() {
  if (env.NEXT_PUBLIC_CDN_BASE_URL) {
    return env.NEXT_PUBLIC_CDN_BASE_URL;
  }
  if (env.AWS_S3_PUBLIC_BASE_URL) {
    return env.AWS_S3_PUBLIC_BASE_URL;
  }

  assertAwsConfigured();
  return `https://${env.AWS_S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com`;
}

export function getS3Client() {
  if (global.__s3Client) {
    logger.debug("Using cached S3 client");
    return global.__s3Client;
  }

  assertAwsConfigured();

  global.__s3Client = new S3Client({
    region: env.AWS_REGION,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  logger.info("S3 client initialized", { bucket: env.AWS_S3_BUCKET, region: env.AWS_REGION });

  return global.__s3Client;
}

function safeExtension(fileName: string) {
  const ext = path.extname(fileName).toLowerCase().replace(/[^a-z0-9.]/g, "");
  if (!ext) return "";
  return ext.slice(0, 10);
}

export async function uploadPublicAsset(input: {
  bytes: Buffer;
  fileName: string;
  contentType: string;
  folder?: string;
}) {
  const client = getS3Client();
  const folder = input.folder ?? "uploads";
  const key = `${folder}/${Date.now()}-${randomUUID()}${safeExtension(input.fileName)}`;

  await client.send(
    new PutObjectCommand({
      Bucket: env.AWS_S3_BUCKET,
      Key: key,
      Body: input.bytes,
      ContentType: input.contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  logger.info("Uploaded asset to S3", { bucket: env.AWS_S3_BUCKET, key });

  const url = `${getPublicBaseUrl()}/${key}`;
  return { key, url };
}
