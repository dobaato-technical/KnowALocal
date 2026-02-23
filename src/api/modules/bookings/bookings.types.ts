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
  status: string;
  additional_info: string;
  is_deleted?: boolean;
}

export interface BookingWithDetails extends Booking {
  tourTitle?: string;
  shiftName?: string;
  shiftStartTime?: string;
  shiftEndTime?: string;
}
