/**
 * Bookings module types
 */

export interface SelectedSpecialty {
  name: string;
  price: number;
  description?: string;
}

export interface Booking {
  id: number;
  created_at: string;
  tour_id: number;
  date: string;
  shift_id: number;
  payment_info?: string;
  additional_info?: string;
  is_deleted?: boolean;
  booking_status?: "pending" | "confirmed" | "cancelled" | "completed";
  stripe_payment_intent_id?: string;
  stripe_checkout_session_id?: string;
  payment_status?: "pending" | "succeeded" | "failed" | "canceled";
  tour_price?: number;
  customer_email?: string;
  customer_name?: string;
  guest_number?: number;
  selected_specialties?: SelectedSpecialty[] | null;
}

export interface BookingWithDetails extends Booking {
  tourTitle?: string;
  shiftName?: string;
  shiftStartTime?: string;
  shiftEndTime?: string;
}
