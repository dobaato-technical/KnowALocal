/**
 * Booking Utility Functions
 * Helper functions for date formatting, timezone handling, and API calls
 */

/**
 * Format a date for display (e.g., "Feb 14, 2026 - 2:30 PM")
 */
export function formatDateTimeForDisplay(
  isoString: string,
  timezone: string = "Asia/Kathmandu",
): string {
  try {
    const date = new Date(isoString);

    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return formatter.format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return isoString;
  }
}

/**
 * Format a date for calendar display (e.g., "Monday, Feb 14")
 */
export function formatDateForCalendar(
  isoString: string,
  timezone: string = "Asia/Kathmandu",
): string {
  try {
    const date = new Date(isoString);

    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      weekday: "long",
      month: "short",
      day: "numeric",
    });

    return formatter.format(date);
  } catch (error) {
    console.error("Error formatting calendar date:", error);
    return isoString;
  }
}

/**
 * Format time only (e.g., "2:30 PM")
 */
export function formatTimeOnly(
  isoString: string,
  timezone: string = "Asia/Kathmandu",
): string {
  try {
    const date = new Date(isoString);

    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return formatter.format(date);
  } catch (error) {
    console.error("Error formatting time:", error);
    return isoString;
  }
}

/**
 * ❌ Cal.com API integration disabled
 * Check availability through the server API
 */
// export async function checkAvailability(
//   eventTypeId: string,
//   startTime: string,
//   duration: string = "30",
// ): Promise<{
//   available: boolean;
//   message: string;
// }> {
//   try {
//     const params = new URLSearchParams({
//       eventTypeId,
//       startTime,
//       duration,
//     });
//
//     const response = await fetch(`/api/cal/availability?${params}`, {
//       method: "GET",
//     });
//
//     if (!response.ok) {
//       throw new Error("Failed to check availability");
//     }
//
//     const data = await response.json();
//
//     return {
//       available: data.available === true,
//       message: data.message || "Unable to check availability",
//     };
//   } catch (error) {
//     console.error("Availability check error:", error);
//     return {
//       available: false,
//       message:
//         error instanceof Error ? error.message : "Failed to check availability",
//     };
//   }
// }

/**
 * ❌ Cal.com API integration disabled
 * Create a booking through the server API
 */
// export async function createBooking(
//   eventTypeId: string,
//   startTime: string,
//   attendeeEmail: string,
//   attendeeName: string,
//   timezone: string = "Asia/Kathmandu",
//   metadata?: Record<string, any>,
// ): Promise<{
//   success: boolean;
//   bookingId?: string;
//   confirmationUrl?: string;
//   message?: string;
//   error?: string;
// }> {
//   try {
//     const response = await fetch("/api/cal/booking", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         eventTypeId,
//         startTime,
//         attendeeEmail,
//         attendeeName,
//         timezone,
//         metadata,
//       }),
//     });
//
//     const data = await response.json();
//
//     if (!response.ok) {
//       throw new Error(data.error || "Failed to create booking");
//     }
//
//     return data;
//   } catch (error) {
//     console.error("Booking creation error:", error);
//     return {
//       success: false,
//       error:
//         error instanceof Error ? error.message : "Failed to create booking",
//     };
//   }
// }

/**
 * Get current date in Kathmandu timezone as ISO string
 */
export function getCurrentDateInKathmandu(): Date {
  const now = new Date();
  const kathmandutTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kathmandu" }),
  );
  return kathmandutTime;
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate booking form data
 */
export function validateBookingForm(
  attendeeName: string,
  attendeeEmail: string,
  selectedDateTime: string | null,
): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!attendeeName || attendeeName.trim().length === 0) {
    errors.name = "Name is required";
  }

  if (!attendeeEmail || !isValidEmail(attendeeEmail)) {
    errors.email = "Valid email is required";
  }

  if (!selectedDateTime) {
    errors.dateTime = "Please select a date and time";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
