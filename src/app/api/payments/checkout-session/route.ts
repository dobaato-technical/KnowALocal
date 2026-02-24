import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

interface CheckoutRequest {
  tour_id: number;
  shift_id: number;
  date: string;
  tour_price: number;
  tour_title: string;
}

export async function POST(request: Request) {
  try {
    const body: CheckoutRequest = await request.json();
    const { tour_id, shift_id, date, tour_price, tour_title } = body;

    console.log("Checkout request received:", {
      tour_id,
      shift_id,
      date,
      tour_price,
      tour_title,
    });

    // Validate input
    if (!tour_id || !shift_id || !date || !tour_price || tour_price <= 0) {
      return Response.json(
        { error: "Missing or invalid booking details" },
        { status: 400 },
      );
    }

    // Initialize Supabase with service role key for server-side operations
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    );

    // Check shift availability
    const { data: bookings, error: bookingCheckError } = await supabase
      .from("bookings")
      .select("id")
      .eq("shift_id", shift_id)
      .eq("date", date)
      .eq("booking_status", "confirmed")
      .limit(1);

    if (bookingCheckError) {
      console.error("Booking check error:", bookingCheckError);
      return Response.json(
        { error: "Failed to check availability" },
        { status: 500 },
      );
    }

    // Get shift details (just validate it exists)
    const { data: shift, error: shiftError } = await supabase
      .from("Shifts")
      .select("id, name")
      .eq("id", shift_id)
      .single();

    if (shiftError || !shift) {
      console.error("Shift error:", shiftError);
      console.error("Shift ID queried:", shift_id);
      return Response.json({ error: "Shift not found" }, { status: 404 });
    }

    console.log("Shift found:", shift);

    // Check shift availability using conflict checking (built-in availability system)
    // Your system uses 1 slot per shift per day
    const { data: existingBooking, error: checkError } = await supabase
      .from("bookings")
      .select("id")
      .eq("shift_id", shift_id)
      .eq("date", date)
      .in("booking_status", ["confirmed", "pending"])
      .limit(1);

    if (checkError) {
      console.error("Availability check error:", checkError);
      return Response.json(
        { error: "Failed to check availability" },
        { status: 500 },
      );
    }

    // If there's already a confirmed/pending booking for this shift on this date, it's fully booked
    if (existingBooking && existingBooking.length > 0) {
      console.log(`Shift ${shift_id} on ${date} is fully booked`);
      return Response.json(
        { error: "This shift is fully booked" },
        { status: 400 },
      );
    }

    console.log(`Shift ${shift_id} on ${date} is available`);

    // Create temporary booking (status: pending - will be confirmed after payment)
    const { data: tempBooking, error: bookingInsertError } = await supabase
      .from("bookings")
      .insert({
        tour_id,
        shift_id,
        date,
        booking_status: "pending",
        tour_price: Math.round(tour_price * 100), // Store in cents
        payment_status: "pending",
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 min expiry
      })
      .select()
      .single();

    if (bookingInsertError || !tempBooking) {
      console.error("Booking insert error:", bookingInsertError);
      return Response.json(
        { error: "Failed to create booking" },
        { status: 500 },
      );
    }

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/booking-success?bookingId=${tempBooking.id}&tourId=${tour_id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/explore-all-tours`,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: tour_title,
              description: `${tour_title} - ${date}`,
            },
            unit_amount: Math.round(tour_price * 100), // In cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        booking_id: tempBooking.id,
        tour_id,
        shift_id,
        date,
      },
    });

    // Store checkout session ID on the booking for webhook verification
    await supabase
      .from("bookings")
      .update({
        stripe_checkout_session_id: checkoutSession.id,
      })
      .eq("id", tempBooking.id);

    return Response.json({
      url: checkoutSession.url,
      bookingId: tempBooking.id,
      sessionId: checkoutSession.id,
    });
  } catch (error) {
    console.error("Checkout session error:", error);

    if (error instanceof Stripe.errors.StripeError) {
      return Response.json(
        { error: `Stripe error: ${error.message}` },
        { status: 400 },
      );
    }

    return Response.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
