import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

interface SelectedSpecialty {
  name: string;
  price: number;
  description?: string;
}

interface CheckoutRequest {
  tour_id: number;
  shift_id: number;
  date: string;
  tour_price: number;
  tour_title: string;
  customer_name: string;
  customer_email: string;
  guest_number: number;
  additional_info?: string;
  selected_specialties?: SelectedSpecialty[];
}

export async function POST(request: Request) {
  try {
    const body: CheckoutRequest = await request.json();
    const {
      tour_id,
      shift_id,
      date,
      tour_price,
      tour_title,
      customer_name,
      customer_email,
      guest_number,
      additional_info,
      selected_specialties,
    } = body;

    // Compute total price: base tour price + sum of valid specialty prices
    const validSpecialties: SelectedSpecialty[] = (
      selected_specialties || []
    ).filter(
      (s) =>
        s &&
        typeof s.name === "string" &&
        s.name.trim() &&
        typeof s.price === "number" &&
        s.price >= 0,
    );
    const specialtiesTotal = validSpecialties.reduce(
      (sum, s) => sum + s.price,
      0,
    );

    // Validate required fields
    if (
      !tour_id ||
      !shift_id ||
      !date ||
      !customer_name?.trim() ||
      !customer_email?.trim() ||
      !guest_number ||
      guest_number < 1
    ) {
      return Response.json(
        { error: "Missing or invalid booking details" },
        { status: 400 },
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    );

    // Fetch tour base price from DB (server-side — prevents client-side price manipulation)
    const { data: tourData, error: tourFetchError } = await supabase
      .from("tours")
      .select("price")
      .eq("id", tour_id)
      .single();

    if (tourFetchError || !tourData) {
      return Response.json({ error: "Tour not found" }, { status: 404 });
    }

    const tourBasePrice = tourData.price as number;
    // Specialties are charged per person — multiply each by guest_number server-side
    const specialtiesTotalPerHead = validSpecialties.reduce(
      (sum, s) => sum + s.price * guest_number,
      0,
    );
    const totalPrice = tourBasePrice + specialtiesTotalPerHead;

    // Validate shift exists and get its type
    const { data: shift, error: shiftError } = await supabase
      .from("Shifts")
      .select("id, name, type")
      .eq("id", shift_id)
      .single();

    if (shiftError || !shift) {
      console.error("Shift error:", shiftError);
      return Response.json({ error: "Shift not found" }, { status: 404 });
    }

    // Availability check:
    // whole_day shift — blocked if ANY booking exists on this date
    // hourly shift — blocked if (a) a whole_day booking exists OR (b) this shift is already booked
    if (shift.type === "whole_day") {
      const { data: anyBooking } = await supabase
        .from("bookings")
        .select("id")
        .eq("date", date)
        .eq("is_deleted", false)
        .eq("booking_status", "confirmed")
        .limit(1);

      if (anyBooking && anyBooking.length > 0) {
        return Response.json(
          {
            error:
              "This date already has a booking. Whole day cannot be booked.",
          },
          { status: 400 },
        );
      }
    } else {
      // Hourly: check if a whole_day shift is booked on this date
      const { data: wholeDayShifts } = await supabase
        .from("Shifts")
        .select("id")
        .eq("type", "whole_day")
        .eq("is_active", true);

      if (wholeDayShifts && wholeDayShifts.length > 0) {
        const wholeDayIds = wholeDayShifts.map((s: { id: number }) => s.id);
        const { data: wholeDayBooking } = await supabase
          .from("bookings")
          .select("id")
          .eq("date", date)
          .in("shift_id", wholeDayIds)
          .eq("is_deleted", false)
          .eq("booking_status", "confirmed")
          .limit(1);

        if (wholeDayBooking && wholeDayBooking.length > 0) {
          return Response.json(
            {
              error:
                "This date has a whole-day booking. No other shifts can be added.",
            },
            { status: 400 },
          );
        }
      }

      // Hourly: check if this specific shift is already booked
      const { data: shiftBooking } = await supabase
        .from("bookings")
        .select("id")
        .eq("shift_id", shift_id)
        .eq("date", date)
        .eq("is_deleted", false)
        .eq("booking_status", "confirmed")
        .limit(1);

      if (shiftBooking && shiftBooking.length > 0) {
        return Response.json(
          { error: "This shift is already fully booked" },
          { status: 400 },
        );
      }
    }

    // Create booking record with all customer info immediately
    const { data: newBooking, error: bookingInsertError } = await supabase
      .from("bookings")
      .insert({
        tour_id,
        shift_id,
        date,
        booking_status: "pending",
        payment_status: "pending",
        tour_price: tourBasePrice,
        total_price: totalPrice,
        customer_name: customer_name.trim(),
        customer_email: customer_email.trim().toLowerCase(),
        guest_number,
        additional_info: additional_info?.trim() || null,
        selected_specialties:
          validSpecialties.length > 0 ? validSpecialties : null,
        is_deleted: false,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (bookingInsertError || !newBooking) {
      console.error("Booking insert error:", bookingInsertError);
      return Response.json(
        { error: "Failed to create booking" },
        { status: 500 },
      );
    }

    // Build Stripe line items: base tour + one per specialty (quantity = guest count)
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: tour_title,
            description: `${tour_title} — ${date} | Guests: ${guest_number}`,
          },
          unit_amount: Math.round(tourBasePrice * 100),
        },
        quantity: 1,
      },
      ...validSpecialties
        .filter((s) => s.price > 0)
        .map((s) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: s.name,
              description: s.description || `Add-on for ${tour_title}`,
            },
            unit_amount: Math.round(s.price * 100),
          },
          // quantity = guest_number so Stripe shows per-person multiplication
          quantity: guest_number,
        })),
    ];

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customer_email.trim().toLowerCase(),
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/booking-success?bookingId=${newBooking.id}&tourId=${tour_id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/explore-all-tours`,
      line_items: lineItems,
      metadata: {
        booking_id: String(newBooking.id),
        tour_id: String(tour_id),
        shift_id: String(shift_id),
        date,
        guest_number: String(guest_number),
      },
    });

    // Store checkout session ID on the booking
    await supabase
      .from("bookings")
      .update({ stripe_checkout_session_id: checkoutSession.id })
      .eq("id", newBooking.id);

    return Response.json({
      url: checkoutSession.url,
      bookingId: newBooking.id,
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
