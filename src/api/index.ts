/**
 * API Barrel Exports
 * Import all API functions from this single file
 *
 * Usage:
 * import { loginAdmin, getToursPreview } from "@/api"
 */

// Auth API
export {
  getCurrentUser,
  getStoredUserSession,
  isSessionValid,
  loginAdmin,
  logoutAdmin,
} from "./auth/auth";
export type { LoginCredentials, User } from "./auth/auth";

// Tours API
export {
  getAllTours,
  getFeaturedTours,
  getTourBySlug,
  getToursPreview,
} from "./tours/tours";

// Availability API
export {
  getAllAvailability,
  getAvailabilityByDate,
  getUnavailableDatesForMonth,
  setAvailable,
  setUnavailable,
  toggleAvailability,
} from "./availability/availability";
export type { Availability } from "./availability/availability";

// Bookings API
export {
  deleteBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
} from "./bookings/bookings";
export type { Booking, BookingWithDetails } from "./bookings/bookings";
