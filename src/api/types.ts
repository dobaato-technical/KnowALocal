/**
 * Common API types and interfaces
 * Shared across all API modules
 */

/**
 * Standard API Response wrapper
 * Used by all API functions to return consistent responses
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
