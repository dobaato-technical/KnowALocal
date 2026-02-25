/**
 * Image Upload API Route
 * Handles image uploads for hero and gallery images
 * POST /api/upload - Upload single image
 */

import { uploadImageAdmin, validateImage } from "@/lib/supabase-storage";
import { NextRequest, NextResponse } from "next/server";

/**
 * Validate request authorization
 * In production, add proper authentication
 */
function isAuthorized(request: NextRequest): boolean {
  // TODO: Add proper authentication here
  // Example: Check JWT token, session, API key, etc.
  // For now, we'll allow all requests but recommend adding auth in production
  const authHeader = request.headers.get("authorization");
  // You can add proper auth validation here
  return true;
}

/**
 * POST handler for image upload
 */
export async function POST(request: NextRequest) {
  try {
    // Validate authorization
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // Parse form data
    let formData;
    try {
      formData = await request.formData();
    } catch (error) {
      console.error("Form data parse error:", error);
      return NextResponse.json(
        { success: false, message: "Invalid form data" },
        { status: 400 },
      );
    }

    const file = formData.get("file");
    const folder = formData.get("folder") as string;

    // Validate required fields
    if (!file) {
      console.error("File validation failed: no file provided");
      return NextResponse.json(
        {
          success: false,
          message: "File is required",
        },
        { status: 400 },
      );
    }

    if (!(file instanceof File)) {
      console.error("File validation failed:", {
        fileExists: !!file,
        type: typeof file,
        constructor: (file as any)?.constructor?.name,
      });
      return NextResponse.json(
        {
          success: false,
          message: "File must be a valid file object",
        },
        { status: 400 },
      );
    }

    if (!folder || !["hero", "gallery"].includes(folder)) {
      console.error("Folder validation failed:", { folder });
      return NextResponse.json(
        {
          success: false,
          message: 'Folder must be either "hero" or "gallery"',
        },
        { status: 400 },
      );
    }

    // Validate file using the storage utility
    const validation = validateImage(file);
    if (!validation.valid) {
      console.error("Image validation failed:", { error: validation.error });
      return NextResponse.json(
        { success: false, message: validation.error },
        { status: 400 },
      );
    }

    // Upload image using admin client (bypasses RLS policies)
    const uploadResult = await uploadImageAdmin(
      file,
      folder as "hero" | "gallery",
    );

    if (!uploadResult.success) {
      console.error("Upload failed:", uploadResult);
      return NextResponse.json(uploadResult, { status: 500 });
    }

    return NextResponse.json(uploadResult, { status: 200 });
  } catch (error) {
    console.error("=== UPLOAD ERROR ===", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * OPTIONS handler for CORS preflight
 */
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json(
    { message: "Method allowed" },
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    },
  );
}
