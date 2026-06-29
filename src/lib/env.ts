import { z } from "zod";

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  AUTH_SECRET: z.string().min(24, "AUTH_SECRET must be at least 24 chars").optional(),
  MONGODB_URI: z.string().url().optional(),
  MONGODB_DB_NAME: z.string().min(1).default("pink-papaya"),
  NEXT_PUBLIC_CDN_BASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  MEDIA_DIR: z.string().min(1).optional(),
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
