import { z } from "zod";

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  AUTH_SECRET: z.string().min(24, "AUTH_SECRET must be at least 24 chars").optional(),
  MONGODB_URI: z.string().url().optional(),
  MONGODB_DB_NAME: z.string().min(1).default("pink-papaya"),
  AWS_REGION: z.string().min(1).optional(),
  AWS_ACCESS_KEY_ID: z.string().min(1).optional(),
  AWS_SECRET_ACCESS_KEY: z.string().min(1).optional(),
  AWS_S3_BUCKET: z.string().min(1).optional(),
  AWS_S3_PUBLIC_BASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_CDN_BASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
});

const parsed = serverEnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment variables. Check server logs for details.");
}

export const env = parsed.data;

export function requireEnv(name: keyof typeof env): string {
  const value = env[name];
  if (!value || typeof value !== "string") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function assertMongoConfigured() {
  if (!env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured");
  }
}

export function assertAwsConfigured() {
  const required = ["AWS_REGION", "AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "AWS_S3_BUCKET"] as const;
  for (const key of required) {
    if (!env[key]) {
      throw new Error(`${key} is not configured`);
    }
  }
}
