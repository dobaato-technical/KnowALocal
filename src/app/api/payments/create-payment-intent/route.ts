/**
 * Create Stripe Payment Intent
 * POST /api/payments/create-payment-intent
 *
 * Creates a temporary booking and Stripe payment intent
 * Returns client secret for Stripe Elements checkout
 */

import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

interface CreatePaymentIntentRequest {
  tour_id: number;
  shift_id: number;
  date: string;
  customer_email: string;
  customer_name: string;
  tour_price: number;
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

    const body: CreatePaymentIntentRequest = await request.json();
    const {
      tour_id,
      shift_id,
      date,
      customer_email,
      customer_name,
      tour_price,
    } = body;

    // Validate input
    if (!tour_id || !shift_id || !date || !customer_email || !tour_price) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 },
      );
    }

    // 1️⃣ Check availability (similar logic to edge function)
    const { data: existingBookings, error: checkError } = await supabase
      .from("bookings")
      .select("*")
      .eq("tour_id", tour_id)
      .eq("date", date)
      .in("booking_status", ["confirmed", "pending"])
      .gt("expires_at", new Date().toISOString());

    if (checkError) {
      console.error("Availability check error:", checkError);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to check availability",
        },
        { status: 500 },
      );
    }

    if (existingBookings && existingBookings.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Slot not available",
        },
        { status: 400 },
      );
    }

    // 2️⃣ Create temporary booking with pending status
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minute expiry

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        tour_id,
        shift_id,
        date,
        booking_status: "pending",
        payment_status: "pending",
        customer_email,
        customer_name,
        tour_price,
        expires_at: expiresAt.toISOString(),
        payment_info: "",
        additional_info: "",
        is_deleted: false,
      })
      .select()
      .single();

    if (bookingError || !booking) {
      console.error("Booking creation error:", bookingError);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create booking",
        },
        { status: 500 },
      );
    }

    // 3️⃣ Create Stripe payment intent
    // Convert price to cents (tour_price is in dollars)
    const amountInCents = Math.round(tour_price * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      metadata: {
        booking_id: booking.id.toString(),
        tour_id: tour_id.toString(),
        date,
      },
      receipt_email: customer_email,
    });

    // 4️⃣ Update booking with payment intent ID
    const { error: updateError } = await supabase
      .from("bookings")
      .update({
        stripe_payment_intent_id: paymentIntent.id,
      })
      .eq("id", booking.id);

    if (updateError) {
      console.error("Update booking error:", updateError);
      // Clean up: cancel the payment intent
      await stripe.paymentIntents.cancel(paymentIntent.id);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to process booking",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        bookingId: booking.id,
        amount: tour_price,
        currency: "usd",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Payment intent creation error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create payment intent",
      },
      { status: 500 },
    );
  }
}
