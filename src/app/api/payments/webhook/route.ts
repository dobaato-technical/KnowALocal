import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return Response.json(
      { error: "Missing stripe-signature header" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Initialize Supabase with service role key for server-side operations
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  );

  try {
    // Handle checkout completion
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // Extract booking ID from metadata
      const bookingId = session.metadata?.booking_id;
      if (!bookingId) {
        console.error("No booking ID in session metadata");
        return Response.json({ error: "No booking ID found" }, { status: 400 });
      }

      // Retrieve payment intent to confirm payment succeeded
      if (session.payment_intent) {
        const paymentIntent = await stripe.paymentIntents.retrieve(
          session.payment_intent as string,
        );

        // Only confirm booking if payment status is succeeded
        if (paymentIntent.status === "succeeded") {
          // Update booking status to confirmed and mark payment as succeeded
          const { error: updateError } = await supabase
            .from("bookings")
            .update({
              booking_status: "confirmed",
              payment_status: "succeeded",
              stripe_payment_intent_id: paymentIntent.id,
            })
            .eq("id", bookingId);

          if (updateError) {
            console.error("Failed to update booking:", updateError);
            // Return 500 so Stripe retries this webhook
            return Response.json(
              { error: "Failed to update booking" },
              { status: 500 },
            );
          }

          console.log(`Booking ${bookingId} confirmed after payment`);
        }
      }
    }

    // Handle payment intent failed
    if (event.type === "charge.failed") {
      const charge = event.data.object as Stripe.Charge;
      const metadata = charge.metadata;

      if (metadata?.booking_id) {
        // Mark payment as failed
        await supabase
          .from("bookings")
          .update({
            payment_status: "failed",
          })
          .eq("id", metadata.booking_id);

        console.log(
          `Payment failed for booking ${metadata.booking_id}: ${charge.failure_message}`,
        );
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return Response.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
