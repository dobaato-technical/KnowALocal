/**
 * Bookings module types
 */

export interface Booking {
  id: number;
  created_at: string;
  tour_id: number;
  date: string;
  shift_id: number;
  payment_info: string;
  status?: string;
  additional_info: string;
  is_deleted?: boolean;
  // Booking status (primary status field)
  booking_status?: "pending" | "confirmed" | "cancelled" | "completed";
  // Stripe payment fields
  stripe_payment_intent_id?: string;
  stripe_checkout_session_id?: string;
  payment_status?: "pending" | "succeeded" | "failed" | "canceled";
  tour_price?: number;
  customer_email?: string;
  customer_name?: string;
  expires_at?: string;
}

export interface BookingWithDetails extends Booking {
  tourTitle?: string;
  shiftName?: string;
  shiftStartTime?: string;
  shiftEndTime?: string;
}

/**
 * Stripe Payment Intent Response
 */
export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  bookingId: number;
  amount: number;
  currency: string;
}

/**
 * Payment confirmation request
 */
export interface ConfirmPaymentRequest {
  bookingId: number;
  paymentIntentId: string;
  customerEmail: string;
  customerName: string;
}
