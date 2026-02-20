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

// Types
export type { ApiResponse, Tour, TourPreview } from "./types";
