/**
 * Bookings API
 * Handles all booking-related API calls
 */

import { supabase } from "@/lib/supabase";
import { ApiResponse } from "../types";

export interface Booking {
  id: number;
  created_at: string;
  tour_id: number;
  date: string;
  shift_id: number;
  payment_info: string;
  status: string;
  additional_info: string;
}

export interface BookingWithDetails extends Booking {
  tourTitle?: string;
  shiftName?: string;
}

/**
 * Get all bookings
 * Fetches all bookings from Supabase
 * @returns API response with array of bookings
 */
export async function getAllBookings(): Promise<ApiResponse<BookingWithDetails[]>> {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
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

    // Fetch tour and shift details for each booking
    const bookingsWithDetails: BookingWithDetails[] = [];
    
    for (const booking of data || []) {
      // Get tour details
      const { data: tourData } = await supabase
        .from("tours")
        .select("title")
        .eq("id", booking.tour_id)
        .single();

      // Get shift details
      const { data: shiftData } = await supabase
        .from("Shifts")
        .select("name")
        .eq("id", booking.shift_id)
        .single();

      bookingsWithDetails.push({
        ...booking,
        tourTitle: tourData?.title || "Unknown Tour",
        shiftName: shiftData?.name || "Unknown Shift",
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
export async function getBookingById(bookingId: number): Promise<ApiResponse<BookingWithDetails | null>> {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
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

    // Get tour details
    const { data: tourData } = await supabase
      .from("tours")
      .select("title")
      .eq("id", data.tour_id)
      .single();

    // Get shift details
    const { data: shiftData } = await supabase
      .from("Shifts")
      .select("name")
      .eq("id", data.shift_id)
      .single();

    return {
      success: true,
      message: "Booking fetched successfully",
      data: {
        ...data,
        tourTitle: tourData?.title || "Unknown Tour",
        shiftName: shiftData?.name || "Unknown Shift",
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
  status: string
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
 * Delete booking
 * @param bookingId - ID of the booking
 * @returns API response
 */
export async function deleteBooking(bookingId: number): Promise<ApiResponse<null>> {
  try {
    const { error } = await supabase
      .from("bookings")
      .delete()
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

export type { ApiResponse };
