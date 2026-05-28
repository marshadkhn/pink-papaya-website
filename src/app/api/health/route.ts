import { NextResponse } from "next/server";
import { prisma } from "@/lib/cms/store";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      ok: true,
      database: "connected",
      s3Configured: Boolean(env.AWS_S3_BUCKET && env.AWS_REGION),
      nodeEnv: env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: error?.message ?? "Health check failed",
      },
      { status: 500 }
    );
  }
}
