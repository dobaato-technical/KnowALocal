/**
 * Confirm Payment
 * POST /api/payments/confirm-payment
 *
 * Confirms the booking after successful Stripe payment
 * Updates booking status to confirmed and payment status to succeeded
 */

import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

interface ConfirmPaymentRequest {
  bookingId: number;
  paymentIntentId: string;
  customerEmail: string;
}

// Initialize Stripe with server-side secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

// Initialize Supabase with service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
);

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "Stripe configuration is missing",
        },
        { status: 500 },
      );
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "Supabase configuration is missing",
        },
        { status: 500 },
      );
    }

    const body: ConfirmPaymentRequest = await request.json();
    const { bookingId, paymentIntentId, customerEmail } = body;

    // Validate input
    if (!bookingId || !paymentIntentId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 },
      );
    }

    // 1️⃣ Verify payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (!paymentIntent) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment intent not found",
        },
        { status: 404 },
      );
    }

    // Check if payment was successful
    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json(
        {
          success: false,
          error: `Payment not completed. Status: ${paymentIntent.status}`,
        },
        { status: 400 },
      );
    }

    // 2️⃣ Get the booking
    const { data: booking, error: getError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (getError || !booking) {
      console.error("Booking not found:", getError);
      return NextResponse.json(
        {
          success: false,
          error: "Booking not found",
        },
        { status: 404 },
      );
    }

    // Verify the booking belongs to this payment intent
    if (booking.stripe_payment_intent_id !== paymentIntentId) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment intent does not match booking",
        },
        { status: 400 },
      );
    }

    // 3️⃣ Update booking status to confirmed
    const { data: updatedBooking, error: updateError } = await supabase
      .from("bookings")
      .update({
        status: "confirmed",
        payment_status: "succeeded",
        payment_info: JSON.stringify({
          stripe_payment_intent_id: paymentIntentId,
          charged_amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          timestamp: new Date().toISOString(),
        }),
      })
      .eq("id", bookingId)
      .select()
      .single();

    if (updateError) {
      console.error("Booking update error:", updateError);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to confirm booking",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        booking: updatedBooking,
        message: "Payment confirmed and booking confirmed",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Payment confirmation error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to confirm payment",
      },
      { status: 500 },
    );
  }
}
