import { getS3Client } from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { env } from "@/lib/env";

export async function GET(req: Request, props: { params: Promise<{ key: string[] }> }) {
  const params = await props.params;
  const key = params.key.join("/");
  const client = getS3Client();
  
  try {
    const command = new GetObjectCommand({
      Bucket: env.AWS_S3_BUCKET,
      Key: key,
    });
    const response = await client.send(command);
    if (!response.Body) {
      return new Response("Not found", { status: 404 });
    }
    
    return new Response(response.Body.transformToWebStream() as any, {
      headers: {
        "Content-Type": response.ContentType || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return new Response("Not found", { status: 404 });
  }
}
