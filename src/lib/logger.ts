type EnvShape = Record<string, unknown>;

function isDev() {
  return process.env.NODE_ENV !== "production";
}

function maskValue(v: unknown) {
  if (v == null) return "<null>";
  const s = String(v);
  if (s.length <= 8) return "****";
  return `${s.slice(0, 4)}...${s.slice(-4)}`;
}

function formatLog(prefix: string, level: string, message: string, meta?: Record<string, unknown>) {
  const payload: Record<string, unknown> = {
    ts: new Date().toISOString(),
    level,
    prefix,
    msg: message,
  };
  if (meta) payload.meta = meta;

  if (isDev()) {
    // readable console output in development
    console.log(`[${prefix}] ${level.toUpperCase()} - ${message}`, meta ?? "");
  } else {
    // structured JSON in production
    try {
      console.log(JSON.stringify(payload));
    } catch (e) {
      console.log(payload);
    }
  }
}

export function getLogger(prefix = "APP") {
  return {
    info: (message: string, meta?: Record<string, unknown>) => formatLog(prefix, "info", message, meta),
    warn: (message: string, meta?: Record<string, unknown>) => formatLog(prefix, "warn", message, meta),
    error: (message: string, meta?: Record<string, unknown>) => formatLog(prefix, "error", message, meta),
    debug: (message: string, meta?: Record<string, unknown>) => {
      if (isDev()) formatLog(prefix, "debug", message, meta);
    },
  };
}

function pick(obj: EnvShape, keys: string[]) {
  const out: Record<string, unknown> = {};
  for (const k of keys) {
    if (k in obj) out[k] = (obj as any)[k];
  }
  return out;
}

export function logEnvironment(envObj: EnvShape) {
  const logger = getLogger("ENV");

  const mongodbKeys = ["MONGODB_URI", "MONGODB_DB_NAME", "MONGODB_DB"];
  const awsKeys = ["AWS_REGION", "AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "AWS_S3_BUCKET", "AWS_S3_PUBLIC_BASE_URL"];

  const publicKeys: string[] = Object.keys(envObj).filter((k) => k.startsWith("NEXT_PUBLIC_"));

  const safe = (obj: EnvShape) => {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      // mask sensitive-looking keys
      if (/KEY|SECRET|PASSWORD|TOKEN|URI|AUTH|ACCESS/i.test(k)) {
        out[k] = maskValue(v);
      } else {
        out[k] = v;
      }
    }
    return out;
  };

  logger.info("Environment variables summary", {
    mongodb: safe(pick(envObj, mongodbKeys)),
    aws: safe(pick(envObj, awsKeys)),
    public: pick(envObj, publicKeys),
  });

  // In dev, also dump everything masked
  if (isDev()) {
    logger.debug("Full masked env dump", safe(envObj));
  }
}

export default getLogger;
