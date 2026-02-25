/**
 * Create Tour API Route
 * POST /api/tours/create
 * Creates a new tour in Supabase
 *
 * Security approach:
 * - Uses service role key on server (never exposed to browser) for insert
 * - Could also use authenticated user context if admin auth is implemented
 */

import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn("Service role key not configured");
      return NextResponse.json(
        {
          success: false,
          message: "Server configuration error",
        },
        { status: 500 },
      );
    }

    // Validate required fields
    if (!body.title || !body.basePrice) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: title and basePrice",
        },
        { status: 400 },
      );
    }

    // Use admin client to insert tour
    // In production, you could also add auth checks here:
    // const user = await request.json().user; // if passing from frontend
    // if (!user?.isAdmin) return 403;

    const supabaseAdmin = getSupabaseAdmin();

    const { data, error } = await supabaseAdmin
      .from("tours")
      .insert([
        {
          title: body.title,
          location: body.location || null,
          short_desc: body.description || "",
          long_desc: body.fullDescription || "",
          price: body.basePrice,
          duration: body.duration || "",
          difficulty: body.difficulty || "Easy",
          tour_type: body.tourType || "standard",
          rating: body.rating || 0,
          group_size: body.maxGroupSize?.toString() || null,
          featured: body.isFeatured || false,
          itinerary: body.itinerary || [],
          specialities: body.specialities || [],
          included: body.included || [],
          requirements: body.requirements || [],
          hero_image: body.hero_image || null,
          gallery_images: body.gallery_images || [],
          is_deleted: false,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create tour",
          error: error.message,
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Tour created successfully",
      data: data?.[0],
    });
  } catch (error) {
    console.error("Create tour route error:", error);
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
