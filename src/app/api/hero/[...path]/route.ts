import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy API route to serve hero images from Supabase Storage
 * GET /api/hero/[filename]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const resolvedParams = await params;
    const filePath = resolvedParams.path.join("/");

    if (!filePath) {
      return NextResponse.json(
        { error: "No file path provided" },
        { status: 400 },
      );
    }

    console.log(`📥 Fetching hero image: ${filePath}`);

    // Download the file from Supabase Storage
    const { data, error } = await supabase.storage
      .from("tours")
      .download(`hero/${filePath}`);

    if (error || !data) {
      console.error(`❌ Error downloading hero image: ${error?.message}`);
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Convert blob to buffer
    const buffer = await data.arrayBuffer();

    // Determine content type based on file extension
    const contentType = getContentType(filePath);

    // Return image with caching headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable", // Cache for 1 year
        "Content-Length": buffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("❌ Hero image API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 },
    );
  }
}

function getContentType(filePath: string): string {
  const ext = filePath.toLowerCase().split(".").pop();
  const contentTypes: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
  };
  return contentTypes[ext || "jpg"] || "image/jpeg";
}
