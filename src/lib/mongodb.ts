import mongoose from "mongoose";
import { env, assertMongoConfigured } from "@/lib/env";
import getLogger from "@/lib/logger";

const logger = getLogger("DB");

declare global {
  var __mongooseConn: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

const cached = global.__mongooseConn ?? { conn: null, promise: null };

if (!global.__mongooseConn) {
  global.__mongooseConn = cached;
}

export async function connectToDatabase() {
  if (cached.conn) {
    logger.debug("Using cached mongoose connection");
    return cached.conn;
  }

  if (!cached.promise) {
    assertMongoConfigured();
    logger.info("Starting MongoDB connection", { dbName: env.MONGODB_DB_NAME });

    // In development, enable mongoose query logging only when explicitly requested
    if (env.NODE_ENV !== "production" && process.env.LOG_LEVEL === "debug") {
      mongoose.set("debug", function (coll, method, query, doc, options) {
        logger.debug("Mongoose query", { collection: coll, method, query, doc, options });
      });
    }

    cached.promise = mongoose.connect(env.MONGODB_URI!, {
      dbName: env.MONGODB_DB_NAME,
      maxPoolSize: 20,
      serverSelectionTimeoutMS: 5000,
    });
  }

  try {
    const conn = await cached.promise;

    // Multiple callers can await the same promise; only log once.
    if (!cached.conn) {
      cached.conn = conn;
      logger.info("MongoDB connected", { dbName: env.MONGODB_DB_NAME });
    }

    return cached.conn;
  } catch (err: any) {
    logger.error("MongoDB connection failed", { error: err?.message, stack: err?.stack });
    throw err;
  }
}
