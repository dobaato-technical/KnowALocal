/**
 * Update Tour API Route
 * PUT /api/tours/update
 * Updates an existing tour in Supabase
 *
 * Security approach:
 * - Uses service role key on server (never exposed to browser) for update
 */

import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    console.log("=== PUT /api/tours/update START ===");

    const body = await request.json();
    console.log("Request body:", body);

    const { tourId } = body;
    console.log("tourId extracted:", tourId);

    if (!tourId) {
      console.error("No tourId provided");
      return NextResponse.json(
        {
          success: false,
          message: "Tour ID is required",
        },
        { status: 400 },
      );
    }

    console.log("Updating tour with ID:", tourId);

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
    if (!body.title || body.basePrice === undefined) {
      console.error(
        "Missing required fields - title:",
        body.title,
        "basePrice:",
        body.basePrice,
      );
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: title and basePrice",
        },
        { status: 400 },
      );
    }

    console.log("All validations passed");

    const supabaseAdmin = getSupabaseAdmin();
    console.log("Supabase admin client initialized");

    const updateData = {
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
    };

    console.log("Update data:", updateData);

    const { data, error } = await supabaseAdmin
      .from("tours")
      .update(updateData)
      .eq("id", tourId)
      .select();

    console.log("Supabase update response - data:", data, "error:", error);

    if (error) {
      console.error("Supabase update error:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update tour",
          error: error.message,
        },
        { status: 400 },
      );
    }

    console.log("✅ Tour updated successfully:", tourId);
    console.log("Updated tour data:", data?.[0]);
    console.log("=== PUT /api/tours/update END (SUCCESS) ===");

    return NextResponse.json({
      success: true,
      message: "Tour updated successfully",
      data: data?.[0],
    });
  } catch (error) {
    console.error("Update tour route error:", error);
    console.log("=== PUT /api/tours/update END (ERROR) ===");
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update tour",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
