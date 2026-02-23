/**
 * API Barrel Exports
 * Import all API functions and types from this single file
 *
 * Module Structure:
 * - modules/auth/     - Authentication API
 * - modules/tours/    - Tours API (including image upload)
 * - modules/availability/ - Availability API
 * - modules/bookings/ - Bookings API
 * - modules/shifts/   - Shifts API
 *
 * Usage:
 * import { loginAdmin, getToursPreview } from "@/api"
 * import type { Tour, Booking } from "@/api"
 */

// Shared types
export type { ApiResponse } from "./types";

// Auth Module
export {
  getCurrentUser,
  getStoredUserSession,
  isSessionValid,
  loginAdmin,
  logoutAdmin,
} from "./modules/auth";
export type { LoginCredentials, User } from "./modules/auth";

// Tours Module
export {
  createTourWithImages,
  deleteTour,
  deleteTourWithImages,
  getAllTours,
  getFeaturedTours,
  getTourById,
  getTourBySlug,
  getToursPreview,
  updateTourWithImages,
} from "./modules/tours";
export type {
  CreateTourWithImagesInput,
  Tour,
  TourPreview,
  UpdateTourWithImagesInput,
} from "./modules/tours";

// Availability Module
export {
  getAllAvailability,
  getAvailabilityByDate,
  getUnavailableDatesForMonth,
  setAvailable,
  setUnavailable,
  toggleAvailability,
} from "./modules/availability";
export type { Availability } from "./modules/availability";

// Bookings Module
export {
  checkDateAvailability,
  checkShiftSlotAvailability,
  createBooking,
  deleteBooking,
  getAllBookings,
  getBookingById,
  getBookingsForDateAndShift,
  getDisabledShiftsForDate,
  getWholeDayBookingsForDate,
  updateBookingStatus,
} from "./modules/bookings";
export type { Booking, BookingWithDetails } from "./modules/bookings";

// Shifts Module
export {
  createShift,
  deleteShift,
  getAllShifts,
  updateShift,
} from "./modules/shifts";
export type { Shift } from "./modules/shifts";
