/**
 * Bookings Module Barrel Export
 */

export {
  checkDateAvailability,
  checkShiftConflicts,
  checkShiftSlotAvailability,
  createBooking,
  deleteBooking,
  getAllBookings,
  getBookingById,
  getBookingsForDateAndShift,
  getDisabledShiftsForDate,
  getFullyBookedDatesForMonth,
  getWholeDayBookingsForDate,
  updateBookingStatus,
} from "./bookings.service";

export type {
  Booking,
  BookingWithDetails,
  SelectedSpecialty,
} from "./bookings.types";
