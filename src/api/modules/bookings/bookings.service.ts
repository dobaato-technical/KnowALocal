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
 * Fetches all bookings from Supabase
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

    const bookingsWithDetails: BookingWithDetails[] = [];

    for (const booking of data || []) {
      const { data: tourData } = await supabase
        .from("tours")
        .select("title")
        .eq("id", booking.tour_id)
        .single();

      const { data: shiftData } = await supabase
        .from("Shifts")
        .select("name, start_time, end_time")
        .eq("id", booking.shift_id)
        .single();

      bookingsWithDetails.push({
        ...booking,
        tourTitle: tourData?.title || "Unknown Tour",
        shiftName: shiftData?.name || "Unknown Shift",
        shiftStartTime: shiftData?.start_time || undefined,
        shiftEndTime: shiftData?.end_time || undefined,
      });
    }

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

    const { data: tourData } = await supabase
      .from("tours")
      .select("title")
      .eq("id", data.tour_id)
      .single();

    const { data: shiftData } = await supabase
      .from("Shifts")
      .select("name, start_time, end_time")
      .eq("id", data.shift_id)
      .single();

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

    console.log("Date is available, proceeding with booking creation");

    const { data, error } = await supabase
      .from("bookings")
      .insert([
        {
          tour_id: booking.tour_id,
          date: booking.date,
          shift_id: booking.shift_id,
          payment_info: booking.payment_info,
          status: booking.status,
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
 * Check if a shift has available slots for a date
 * @param date - Date in YYYY-MM-DD format
 * @param shiftId - Shift ID
 * @param maxBookings - Maximum bookings allowed per shift (default: 5)
 * @returns API response with available slots info
 */
export async function checkShiftSlotAvailability(
  date: string,
  shiftId: number,
  maxBookings: number = 5,
): Promise<
  ApiResponse<{
    hasSlots: boolean;
    bookedCount: number;
    availableSlots: number;
    bookings: Booking[];
  }>
> {
  try {
    const bookingsResponse = await getBookingsForDateAndShift(date, shiftId);

    if (!bookingsResponse.success) {
      return {
        success: false,
        message: "Failed to check slot availability",
        error: "CHECK_ERROR",
        data: {
          hasSlots: false,
          bookedCount: 0,
          availableSlots: 0,
          bookings: [],
        },
      };
    }

    const bookings = bookingsResponse.data || [];
    const bookedCount = bookings.length;
    const availableSlots = Math.max(0, maxBookings - bookedCount);
    const hasSlots = availableSlots > 0;

    return {
      success: true,
      message: hasSlots ? "Slots available" : "No slots available",
      data: {
        hasSlots,
        bookedCount,
        availableSlots,
        bookings,
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
        bookedCount: 0,
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
