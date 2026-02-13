/**
 * Cal.com API Type Definitions
 * Type-safe interfaces for Cal.com booking system
 */

/**
 * Availability Check Response
 */
export interface AvailabilityCheckResponse {
  available: boolean;
  availableSlots?: AvailableSlot[];
  message?: string;
  error?: string;
}

export interface AvailableSlot {
  time: string;
  available: boolean;
}

/**
 * Booking Request Payload
 */
export interface BookingRequest {
  eventTypeId: string;
  startTime: string;
  attendeeEmail: string;
  attendeeName: string;
  timezone?: string;
  metadata?: Record<string, any>;
}

/**
 * Booking Response
 */
export interface BookingResponse {
  success: boolean;
  bookingId?: string;
  confirmationUrl?: string;
  message?: string;
  error?: string;
}

/**
 * Booking State in Component
 */
export interface BookingState {
  selectedDateTime: string | null;
  attendeeName: string;
  attendeeEmail: string;
  isCheckingAvailability: boolean;
  isSlotAvailable: boolean | null;
  isConfirmingBooking: boolean;
  showBookingForm: boolean;
}

/**
 * Cal.com Event Response
 */
export interface CalComEvent {
  _id?: string;
  event_id?: string;
  id?: string;
  booking_url?: string;
  confirmationUrl?: string;
  slots?: CalComSlot[];
  [key: string]: any;
}

export interface CalComSlot {
  time: string;
  available: boolean;
}

/**
 * Form Validation Result
 */
export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

/**
 * Toast Configuration
 */
export interface ToastOptions {
  duration?: number;
  description?: string;
}

export type ToastType = "success" | "error" | "info" | "warning";
