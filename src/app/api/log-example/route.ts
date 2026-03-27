import { NextResponse } from "next/server";
import getLogger from "@/lib/logger";
import { env } from "@/lib/env";

const logger = getLogger("API");

export const dynamic = "force-dynamic";

async function handleRequest(req: Request) {
  const start = Date.now();
  const method = req.method;
  const url = new URL(req.url);
  try {
    logger.info("Incoming request", { method, route: url.pathname });

    // example payload behaviour
    const response = { ok: true, message: "Log example", time: new Date().toISOString(), nodeEnv: env.NODE_ENV };

    const duration = Date.now() - start;
    logger.info("Request handled", { method, route: url.pathname, status: 200, durationMs: duration });

    return NextResponse.json(response);
  } catch (err: any) {
    const duration = Date.now() - start;
    logger.error("Request error", { method, route: url.pathname, durationMs: duration, error: err?.message, stack: err?.stack });
    return NextResponse.json({ ok: false, error: err?.message ?? "unknown" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  return handleRequest(req);
}

export async function POST(req: Request) {
  return handleRequest(req);
}
