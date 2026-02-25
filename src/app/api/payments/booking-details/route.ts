/**
 * Get Booking Details
 * GET /api/payments/booking-details?bookingId=123
 *
 * Retrieves full booking information including tour title and shift details
 */

import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get("bookingId");
    const sessionId = searchParams.get("session_id");

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: "Booking ID is required" },
        { status: 400 },
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    );

    // Fetch booking row
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select(
        "id, tour_id, shift_id, date, booking_status, payment_status, customer_name, customer_email, tour_price, guest_number, additional_info, payment_info, created_at, stripe_payment_intent_id, selected_specialties",
      )
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      console.error("Booking not found:", bookingError);
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 },
      );
    }

    // ── Stripe verification fallback ─────────────────────────────────────────
    // Webhooks don't fire in local dev (Stripe can't reach localhost).
    // If the booking is still pending AND we have a session_id, verify with
    // Stripe directly and update the DB so the success page shows correctly.
    if (
      sessionId &&
      (booking.booking_status !== "confirmed" ||
        booking.payment_status !== "succeeded")
    ) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
          expand: ["payment_intent", "payment_intent.latest_charge"],
        });

        if (session.payment_status === "paid") {
          const pi = session.payment_intent as Stripe.PaymentIntent | null;
          const charge = pi?.latest_charge as Stripe.Charge | null;
          const card = charge?.payment_method_details?.card;

          const paymentInfo = JSON.stringify({
            brand: card?.brand ?? null,
            last4: card?.last4 ?? null,
            exp_month: card?.exp_month ?? null,
            exp_year: card?.exp_year ?? null,
            amount: charge?.amount ?? null,
            currency: charge?.currency ?? null,
            receipt_url: charge?.receipt_url ?? null,
          });

          const updatePayload: Record<string, string | null> = {
            booking_status: "confirmed",
            payment_status: "succeeded",
            payment_info: paymentInfo,
          };
          if (pi?.id) updatePayload.stripe_payment_intent_id = pi.id;
          if (session.customer_details?.email && !booking.customer_email)
            updatePayload.customer_email = session.customer_details.email;
          if (session.customer_details?.name && !booking.customer_name)
            updatePayload.customer_name = session.customer_details.name;

          const { data: updated } = await supabase
            .from("bookings")
            .update(updatePayload)
            .eq("id", bookingId)
            .select(
              "id, tour_id, shift_id, date, booking_status, payment_status, customer_name, customer_email, tour_price, guest_number, additional_info, payment_info, created_at, stripe_payment_intent_id, selected_specialties",
            )
            .single();

          if (updated) {
            // Use the freshly updated row for the rest of the response
            Object.assign(booking, updated);
          }

          console.log(
            `Booking ${bookingId} confirmed via Stripe session fallback`,
          );
        }
      } catch (stripeErr) {
        // Non-fatal — log and continue with whatever is in the DB
        console.warn("Stripe session verification skipped:", stripeErr);
      }
    }
    // ─────────────────────────────────────────────────────────────────────────

    // Fetch tour title and shift details in parallel
    const [tourRes, shiftRes] = await Promise.all([
      supabase.from("tours").select("title").eq("id", booking.tour_id).single(),
      supabase
        .from("Shifts")
        .select("name, start_time, end_time")
        .eq("id", booking.shift_id)
        .single(),
    ]);

    return NextResponse.json(
      {
        success: true,
        booking: {
          id: booking.id,
          tour_id: booking.tour_id,
          shift_id: booking.shift_id,
          date: booking.date,
          booking_status: booking.booking_status,
          payment_status: booking.payment_status,
          customer_name: booking.customer_name,
          customer_email: booking.customer_email,
          tour_price: booking.tour_price,
          guest_number: booking.guest_number,
          additional_info: booking.additional_info,
          payment_info: booking.payment_info ?? null,
          created_at: booking.created_at,
          stripe_payment_intent_id: booking.stripe_payment_intent_id ?? null,
          selected_specialties: booking.selected_specialties ?? null,
          tour_title: tourRes.data?.title ?? null,
          shift_name: shiftRes.data?.name ?? null,
          shift_start_time: shiftRes.data?.start_time ?? null,
          shift_end_time: shiftRes.data?.end_time ?? null,
          isConfirmed:
            booking.booking_status === "confirmed" &&
            booking.payment_status === "succeeded",
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Booking details error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch booking details",
      },
      { status: 500 },
    );
  }
}
