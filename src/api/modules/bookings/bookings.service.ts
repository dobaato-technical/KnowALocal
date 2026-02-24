/**
 * Bookings API Service
 * Handles all booking-related API calls
 */

import { ApiResponse } from "@/api/types";
import { supabase } from "@/lib/supabase";
import { getAvailabilityByDate } from "../availability/availability.service";
import type { Booking, BookingWithDetails } from "./bookings.types";

/**
 * Get all bookings
 * Fetches all bookings from Supabase with tour and shift details
 * OPTIMIZED: Fetches all tours and shifts in parallel batches instead of N+1 queries
 * Before: 1 + (N * 2) calls | After: 3 calls
 * @returns API response with array of bookings
 */
export async function getAllBookings(): Promise<
  ApiResponse<BookingWithDetails[]>
> {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("is_deleted", false)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return {
        success: false,
        message: "Failed to fetch bookings",
        error: "FETCH_ERROR",
        data: [],
      };
    }

    if (!data || data.length === 0) {
      return {
        success: true,
        message: "Bookings fetched successfully",
        data: [],
      };
    }

    // Extract unique tour and shift IDs
    const tourIds = [...new Set((data || []).map((b) => b.tour_id))];
    const shiftIds = [...new Set((data || []).map((b) => b.shift_id))];

    // Fetch all tours and shifts in parallel (2 calls instead of N calls)
    const [toursResponse, shiftsResponse] = await Promise.all([
      tourIds.length > 0
        ? supabase.from("tours").select("id, title").in("id", tourIds)
        : Promise.resolve({ data: [], error: null }),
      shiftIds.length > 0
        ? supabase
            .from("Shifts")
            .select("id, name, start_time, end_time")
            .in("id", shiftIds)
        : Promise.resolve({ data: [], error: null }),
    ]);

    // Create lookup maps for O(1) access
    const tourMap = new Map(
      (toursResponse.data || []).map((t) => [t.id, t.title]),
    );
    const shiftMap = new Map(
      (shiftsResponse.data || []).map((s) => [
        s.id,
        { name: s.name, startTime: s.start_time, endTime: s.end_time },
      ]),
    );

    // Merge booking data with tour and shift details
    const bookingsWithDetails: BookingWithDetails[] = data.map((booking) => {
      const shift = shiftMap.get(booking.shift_id);
      return {
        ...booking,
        tourTitle: tourMap.get(booking.tour_id) || "Unknown Tour",
        shiftName: shift?.name || "Unknown Shift",
        shiftStartTime: shift?.startTime || undefined,
        shiftEndTime: shift?.endTime || undefined,
      };
    });

    return {
      success: true,
      message: "Bookings fetched successfully",
      data: bookingsWithDetails,
    };
  } catch (error) {
    console.error("Bookings API error:", error);
    return {
      success: false,
      message: "Failed to fetch bookings",
      error: "FETCH_ERROR",
      data: [],
    };
  }
}

/**
 * Get booking by ID
 * OPTIMIZED: Batches tour and shift queries in parallel
 * @param bookingId - ID of the booking
 * @returns API response with booking details
 */
export async function getBookingById(
  bookingId: number,
): Promise<ApiResponse<BookingWithDetails | null>> {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .eq("is_deleted", false)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return {
        success: false,
        message: "Failed to fetch booking",
        error: "FETCH_ERROR",
        data: null,
      };
    }

    // Fetch tour and shift details in parallel
    const [toursResponse, shiftsResponse] = await Promise.all([
      supabase.from("tours").select("title").eq("id", data.tour_id).single(),
      supabase
        .from("Shifts")
        .select("name, start_time, end_time")
        .eq("id", data.shift_id)
        .single(),
    ]);

    const tourData = toursResponse.data;
    const shiftData = shiftsResponse.data;

    return {
      success: true,
      message: "Booking fetched successfully",
      data: {
        ...data,
        tourTitle: tourData?.title || "Unknown Tour",
        shiftName: shiftData?.name || "Unknown Shift",
        shiftStartTime: shiftData?.start_time || undefined,
        shiftEndTime: shiftData?.end_time || undefined,
      },
    };
  } catch (error) {
    console.error("Bookings API error:", error);
    return {
      success: false,
      message: "Failed to fetch booking",
      error: "FETCH_ERROR",
      data: null,
    };
  }
}

/**
 * Update booking status
 * @param bookingId - ID of the booking
 * @param status - New status value
 * @returns API response with updated booking
 */
export async function updateBookingStatus(
  bookingId: number,
  status: string,
): Promise<ApiResponse<Booking | null>> {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", bookingId)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return {
        success: false,
        message: "Failed to update booking",
        error: "UPDATE_ERROR",
        data: null,
      };
    }

    return {
      success: true,
      message: "Booking updated successfully",
      data,
    };
  } catch (error) {
    console.error("Bookings API error:", error);
    return {
      success: false,
      message: "Failed to update booking",
      error: "UPDATE_ERROR",
      data: null,
    };
  }
}

/**
 * Check if a date is available for booking
 * @param date - Date in YYYY-MM-DD format
 * @returns API response with availability status
 */
export async function checkDateAvailability(
  date: string,
): Promise<ApiResponse<{ isAvailable: boolean; reason?: string }>> {
  try {
    const availabilityResponse = await getAvailabilityByDate(date);

    if (!availabilityResponse.success || !availabilityResponse.data) {
      return {
        success: true,
        message: "Date is available",
        data: { isAvailable: true },
      };
    }

    const availability = availabilityResponse.data;

    if (availability.avaibality === true) {
      return {
        success: true,
        message: "Date is not available",
        data: {
          isAvailable: false,
          reason: availability.reason,
        },
      };
    }

    return {
      success: true,
      message: "Date is available",
      data: { isAvailable: true },
    };
  } catch (error) {
    console.error("Bookings API error:", error);
    return {
      success: false,
      message: "Failed to check date availability",
      error: "CHECK_ERROR",
      data: { isAvailable: false },
    };
  }
}

/**
 * Check for booking conflicts using single-slot logic
 * Mirrors edge function conflict rules:
 * - If checking whole_day: unavailable if ANY booking exists (whole_day or hourly)
 * - If checking hourly: unavailable if whole_day exists OR this specific shift already booked
 * - Hourly shifts are independent of each other (only blocked by whole_day)
 * @param date - Date in YYYY-MM-DD format
 * @param shiftId - Shift ID to check
 * @returns API response with conflict info
 */
export async function checkShiftConflicts(
  date: string,
  shiftId: number,
): Promise<
  ApiResponse<{
    hasConflict: boolean;
    reason?: string;
    conflictingBooking?: Booking;
  }>
> {
  try {
    // Get the shift info to check type
    const { data: shift, error: shiftError } = await supabase
      .from("Shifts")
      .select("type, is_active")
      .eq("id", shiftId)
      .single();

    if (shiftError || !shift) {
      return {
        success: false,
        message: "Failed to fetch shift info",
        error: "SHIFT_NOT_FOUND",
        data: { hasConflict: true, reason: "Invalid shift" },
      };
    }

    if (!shift.is_active) {
      return {
        success: true,
        message: "Shift is inactive",
        data: { hasConflict: true, reason: "Shift is inactive" },
      };
    }

    // Check if there's a whole day booking
    const wholeDayResponse = await getWholeDayBookingsForDate(date);
    const hasWholeDayBooked =
      wholeDayResponse.success &&
      wholeDayResponse.data &&
      wholeDayResponse.data.length > 0;

    // If checking whole day
    if (shift.type === "whole_day") {
      // Whole day cannot be booked if ANY booking exists (whole_day or hourly)
      const { data: allBookings, error: bookingsError } = await supabase
        .from("bookings")
        .select("*")
        .eq("date", date)
        .eq("is_deleted", false)
        .in("status", ["pending", "confirmed"])
        .limit(1);

      if (bookingsError) {
        return {
          success: false,
          message: "Failed to check bookings",
          error: "CHECK_ERROR",
          data: { hasConflict: true },
        };
      }

      if (allBookings && allBookings.length > 0) {
        return {
          success: true,
          message: "Cannot book whole day - existing bookings found",
          data: {
            hasConflict: true,
            reason: "CONFLICT_WITH_EXISTING_BOOKING",
            conflictingBooking: allBookings[0],
          },
        };
      }
    }

    // If checking hourly
    if (shift.type === "hourly") {
      // Hourly cannot be booked if ANY booking exists on that date (whole day or hourly)
      const { data: anyBookings, error: anyBookingsError } = await supabase
        .from("bookings")
        .select("*")
        .eq("date", date)
        .eq("is_deleted", false)
        .in("status", ["pending", "confirmed"])
        .limit(1);

      if (anyBookingsError) {
        return {
          success: false,
          message: "Failed to check bookings",
          error: "CHECK_ERROR",
          data: { hasConflict: true },
        };
      }

      if (anyBookings && anyBookings.length > 0) {
        return {
          success: true,
          message: "Cannot book this date - already has a booking",
          data: {
            hasConflict: true,
            reason: "DATE_ALREADY_BOOKED",
            conflictingBooking: anyBookings[0],
          },
        };
      }
    }

    return {
      success: true,
      message: "No conflicts found",
      data: { hasConflict: false },
    };
  } catch (error) {
    console.error("Bookings API error:", error);
    return {
      success: false,
      message: "Failed to check conflicts",
      error: "CHECK_ERROR",
      data: { hasConflict: true },
    };
  }
}

/**
 * Create a new booking
 * @param booking - Booking data to create
 * @returns API response with created booking
 */
export async function createBooking(
  booking: Omit<Booking, "id" | "created_at" | "is_deleted">,
): Promise<ApiResponse<Booking | null>> {
  try {
    console.log("=== createBooking START ===");
    console.log("Checking date availability for:", booking.date);

    const availabilityCheck = await checkDateAvailability(booking.date);

    if (
      !availabilityCheck.success ||
      !availabilityCheck.data ||
      !availabilityCheck.data.isAvailable
    ) {
      console.error(
        "Date not available:",
        availabilityCheck.data?.reason || "Unknown reason",
      );
      return {
        success: false,
        message: `Booking cannot be created: ${availabilityCheck.data?.reason || "Date is not available"}`,
        error: "UNAVAILABLE_DATE",
        data: null,
      };
    }

    console.log("Date is available, checking for shift conflicts");

    // Check for shift conflicts (single-slot logic)
    const conflictCheck = await checkShiftConflicts(
      booking.date,
      booking.shift_id,
    );

    if (!conflictCheck.success || conflictCheck.data?.hasConflict) {
      console.error("Shift conflict detected:", conflictCheck.data?.reason);
      const reasonMap: Record<string, string> = {
        CONFLICT_WITH_EXISTING_BOOKING:
          "Cannot book whole day - another booking already exists for this date",
        DATE_ALREADY_BOOKED:
          "This date is no longer available - a booking already exists",
        INVALID_SHIFT: "Invalid shift selected",
      };
      return {
        success: false,
        message:
          reasonMap[conflictCheck.data?.reason || ""] ||
          "This time slot is not available",
        error: "SHIFT_CONFLICT",
        data: null,
      };
    }

    console.log("No conflicts found, creating booking");

    const { data, error } = await supabase
      .from("bookings")
      .insert([
        {
          tour_id: booking.tour_id,
          date: booking.date,
          shift_id: booking.shift_id,
          payment_info: booking.payment_info,
          booking_status: booking.booking_status || booking.status,
          additional_info: booking.additional_info,
          is_deleted: false,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return {
        success: false,
        message: "Failed to create booking",
        error: "CREATE_ERROR",
        data: null,
      };
    }

    return {
      success: true,
      message: "Booking created successfully",
      data,
    };
  } catch (error) {
    console.error("Bookings API error:", error);
    return {
      success: false,
      message: "Failed to create booking",
      error: "CREATE_ERROR",
      data: null,
    };
  }
}

/**
 * Delete booking (soft delete)
 * Marks booking as deleted instead of removing from database
 * @param bookingId - ID of the booking
 * @returns API response
 */
export async function deleteBooking(
  bookingId: number,
): Promise<ApiResponse<null>> {
  try {
    const { error } = await supabase
      .from("bookings")
      .update({ is_deleted: true })
      .eq("id", bookingId);

    if (error) {
      console.error("Supabase error:", error);
      return {
        success: false,
        message: "Failed to delete booking",
        error: "DELETE_ERROR",
        data: null,
      };
    }

    return {
      success: true,
      message: "Booking deleted successfully",
      data: null,
    };
  } catch (error) {
    console.error("Bookings API error:", error);
    return {
      success: false,
      message: "Failed to delete booking",
      error: "DELETE_ERROR",
      data: null,
    };
  }
}

/**
 * Get all bookings for a specific date and shift
 * @param date - Date in YYYY-MM-DD format
 * @param shiftId - Shift ID
 * @returns API response with array of bookings
 */
export async function getBookingsForDateAndShift(
  date: string,
  shiftId: number,
): Promise<ApiResponse<Booking[]>> {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("date", date)
      .eq("shift_id", shiftId)
      .eq("is_deleted", false)
      .in("status", ["pending", "confirmed"]);

    if (error) {
      console.error("Supabase error:", error);
      return {
        success: false,
        message: "Failed to fetch bookings for shift",
        error: "FETCH_ERROR",
        data: [],
      };
    }

    return {
      success: true,
      message: "Bookings fetched successfully",
      data: data || [],
    };
  } catch (error) {
    console.error("Bookings API error:", error);
    return {
      success: false,
      message: "Failed to fetch bookings for shift",
      error: "FETCH_ERROR",
      data: [],
    };
  }
}

/**
 * Check if a shift has available slots for a date (single-slot model)
 * Updated to use single-slot availability with conflict rules
 * @param date - Date in YYYY-MM-DD format
 * @param shiftId - Shift ID
 * @returns API response with availability info
 */
export async function checkShiftSlotAvailability(
  date: string,
  shiftId: number,
): Promise<
  ApiResponse<{
    hasSlots: boolean;
    bookedCount: number;
    availableSlots: number;
    bookings: Booking[];
  }>
> {
  try {
    // Check for conflicts using the new single-slot logic
    const conflictCheck = await checkShiftConflicts(date, shiftId);

    if (!conflictCheck.success) {
      return {
        success: false,
        message: "Failed to check slot availability",
        error: "CHECK_ERROR",
        data: {
          hasSlots: false,
          bookedCount: 1, // Treat as full if we can't check
          availableSlots: 0,
          bookings: [],
        },
      };
    }

    // If there's a conflict, shift is full (0 available)
    if (conflictCheck.data?.hasConflict) {
      return {
        success: true,
        message: "No slots available",
        data: {
          hasSlots: false,
          bookedCount: 1,
          availableSlots: 0,
          bookings: conflictCheck.data?.conflictingBooking
            ? [conflictCheck.data.conflictingBooking]
            : [],
        },
      };
    }

    // No conflicts, shift has available slot
    return {
      success: true,
      message: "Slot available",
      data: {
        hasSlots: true,
        bookedCount: 0,
        availableSlots: 1,
        bookings: [],
      },
    };
  } catch (error) {
    console.error("Bookings API error:", error);
    return {
      success: false,
      message: "Failed to check slot availability",
      error: "CHECK_ERROR",
      data: {
        hasSlots: false,
        bookedCount: 1,
        availableSlots: 0,
        bookings: [],
      },
    };
  }
}

/**
 * Check if there's a whole day booking for a specific date
 * @param date - Date in YYYY-MM-DD format
 * @returns API response with whole day booking info
 */
export async function getWholeDayBookingsForDate(
  date: string,
): Promise<ApiResponse<Booking[]>> {
  try {
    const { data: wholeShifts, error: shiftError } = await supabase
      .from("Shifts")
      .select("id")
      .eq("type", "whole_day")
      .eq("is_active", true);

    if (shiftError) {
      console.error("Supabase error:", shiftError);
      return {
        success: false,
        message: "Failed to fetch whole day shifts",
        error: "FETCH_ERROR",
        data: [],
      };
    }

    if (!wholeShifts || wholeShifts.length === 0) {
      return {
        success: true,
        message: "No whole day books found",
        data: [],
      };
    }

    const wholeShiftIds = wholeShifts.map((s) => s.id);

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("date", date)
      .in("shift_id", wholeShiftIds)
      .eq("is_deleted", false)
      .in("status", ["pending", "confirmed"]);

    if (error) {
      console.error("Supabase error:", error);
      return {
        success: false,
        message: "Failed to fetch whole day bookings",
        error: "FETCH_ERROR",
        data: [],
      };
    }

    return {
      success: true,
      message: "Whole day bookings fetched successfully",
      data: data || [],
    };
  } catch (error) {
    console.error("Bookings API error:", error);
    return {
      success: false,
      message: "Failed to fetch whole day bookings",
      error: "FETCH_ERROR",
      data: [],
    };
  }
}

/**
 * Get other shifts that should be disabled for a date (when whole day is already booked)
 * @param date - Date in YYYY-MM-DD format
 * @returns API response with disabled shift IDs
 */
export async function getDisabledShiftsForDate(
  date: string,
): Promise<ApiResponse<number[]>> {
  try {
    const wholeDayResponse = await getWholeDayBookingsForDate(date);

    if (
      !wholeDayResponse.success ||
      !wholeDayResponse.data ||
      wholeDayResponse.data.length === 0
    ) {
      return {
        success: true,
        message: "No disabled shifts",
        data: [],
      };
    }

    const { data: otherShifts, error } = await supabase
      .from("Shifts")
      .select("id")
      .eq("type", "hourly")
      .eq("is_active", true);

    if (error) {
      console.error("Supabase error:", error);
      return {
        success: false,
        message: "Failed to fetch other shifts",
        error: "FETCH_ERROR",
        data: [],
      };
    }

    const disabledShiftIds = (otherShifts || []).map((s) => s.id);

    return {
      success: true,
      message: "Disabled shifts fetched successfully",
      data: disabledShiftIds,
    };
  } catch (error) {
    console.error("Bookings API error:", error);
    return {
      success: false,
      message: "Failed to get disabled shifts",
      error: "CHECK_ERROR",
      data: [],
    };
  }
}
