/**
 * Get Booking Status
 * GET /api/payments/booking-status/[bookingId]
 *
 * Retrieves the current status of a booking including payment status
 */

import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> },
) {
  try {
    const { bookingId } = await params;

    // Validate input
    if (!bookingId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing booking ID",
        },
        { status: 400 },
      );
    }

    // Parse booking ID to number
    const id = parseInt(bookingId, 10);
    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid booking ID",
        },
        { status: 400 },
      );
    }

    // Get the booking
    const { data: booking, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !booking) {
      console.error("Booking not found:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Booking not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        booking: {
          id: booking.id,
          booking_status: booking.booking_status,
          payment_status: booking.payment_status,
          tour_price: booking.tour_price,
          date: booking.date,
          stripe_payment_intent_id: booking.stripe_payment_intent_id,
          customer_email: booking.customer_email,
          created_at: booking.created_at,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get booking status error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to get booking status",
      },
      { status: 500 },
    );
  }
}
