import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();
    await mongoose.connection.db?.admin().ping();

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
