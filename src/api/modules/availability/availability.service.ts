/**
 * Availability API Service
 * Handles all availability-related API calls
 */

import { ApiResponse } from "@/api/types";
import { supabase } from "@/lib/supabase";
import type { Availability } from "./availability.types";

/**
 * Get all availability records
 * @returns API response with array of availability records
 */
export async function getAllAvailability(): Promise<
  ApiResponse<Availability[]>
> {
  try {
    const { data, error } = await supabase
      .from("availability")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return {
        success: false,
        message: "Failed to fetch availability",
        error: "FETCH_ERROR",
        data: [],
      };
    }

    return {
      success: true,
      message: "Availability fetched successfully",
      data: data || [],
    };
  } catch (error) {
    console.error("Availability API error:", error);
    return {
      success: false,
      message: "Failed to fetch availability",
      error: "FETCH_ERROR",
      data: [],
    };
  }
}

/**
 * Get availability for a specific date
 * @param date - Date in YYYY-MM-DD format
 * @returns API response with availability record
 */
export async function getAvailabilityByDate(
  date: string,
): Promise<ApiResponse<Availability | null>> {
  try {
    const { data, error } = await supabase
      .from("availability")
      .select("*")
      .eq("date", date)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Supabase error:", error);
      return {
        success: false,
        message: "Failed to fetch availability",
        error: "FETCH_ERROR",
        data: null,
      };
    }

    return {
      success: true,
      message: "Availability fetched successfully",
      data: data || null,
    };
  } catch (error) {
    console.error("Availability API error:", error);
    return {
      success: false,
      message: "Failed to fetch availability",
      error: "FETCH_ERROR",
      data: null,
    };
  }
}

/**
 * Set a date as unavailable
 * @param date - Date in YYYY-MM-DD format
 * @param reason - Reason for unavailability
 * @returns API response
 */
export async function setUnavailable(
  date: string,
  reason: string = "Not available",
): Promise<ApiResponse<Availability | null>> {
  try {
    const existing = await getAvailabilityByDate(date);

    if (existing.data) {
      const { data, error } = await supabase
        .from("availability")
        .update({
          reason,
          avaibality: true,
        })
        .eq("date", date)
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        return {
          success: false,
          message: "Failed to update availability",
          error: "UPDATE_ERROR",
          data: null,
        };
      }

      return {
        success: true,
        message: "Date set as unavailable",
        data,
      };
    } else {
      const { data, error } = await supabase
        .from("availability")
        .insert([
          {
            date,
            reason,
            avaibality: true,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        return {
          success: false,
          message: "Failed to create availability",
          error: "CREATE_ERROR",
          data: null,
        };
      }

      return {
        success: true,
        message: "Date set as unavailable",
        data,
      };
    }
  } catch (error) {
    console.error("Availability API error:", error);
    return {
      success: false,
      message: "Failed to set unavailable",
      error: "ERROR",
      data: null,
    };
  }
}

/**
 * Set a date as available
 * @param date - Date in YYYY-MM-DD format
 * @returns API response
 */
export async function setAvailable(
  date: string,
): Promise<ApiResponse<Availability | null>> {
  try {
    const existing = await getAvailabilityByDate(date);

    if (existing.data) {
      const { data, error } = await supabase
        .from("availability")
        .update({
          avaibality: false,
          reason: "",
        })
        .eq("date", date)
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        return {
          success: false,
          message: "Failed to update availability",
          error: "UPDATE_ERROR",
          data: null,
        };
      }

      return {
        success: true,
        message: "Date set as available",
        data,
      };
    } else {
      const { data, error } = await supabase
        .from("availability")
        .insert([
          {
            date,
            reason: "",
            avaibality: false,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        return {
          success: false,
          message: "Failed to create availability",
          error: "CREATE_ERROR",
          data: null,
        };
      }

      return {
        success: true,
        message: "Date set as available",
        data,
      };
    }
  } catch (error) {
    console.error("Availability API error:", error);
    return {
      success: false,
      message: "Failed to set available",
      error: "ERROR",
      data: null,
    };
  }
}

/**
 * Get unavailable dates for a specific month
 * @param year - Year (e.g., 2026)
 * @param month - Month (1-12)
 * @returns API response with array of unavailable dates
 */
export async function getUnavailableDatesForMonth(
  year: number,
  month: number,
): Promise<ApiResponse<string[]>> {
  try {
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const lastDay = new Date(year, month, 0);
    const endDate = `${lastDay.getFullYear()}-${String(lastDay.getMonth() + 1).padStart(2, "0")}-${String(lastDay.getDate()).padStart(2, "0")}`;

    console.log(
      `Fetching unavailable dates for ${year}-${month}: ${startDate} to ${endDate}`,
    );

    const { data, error } = await supabase
      .from("availability")
      .select("date")
      .eq("avaibality", true)
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: true });

    if (error) {
      console.error("Supabase getUnavailableDatesForMonth error:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return {
        success: false,
        message: `Failed to fetch unavailable dates: ${error.message || "Unknown error"}`,
        error: "FETCH_ERROR",
        data: [],
      };
    }

    const dates = (data || []).map((row: any) => row.date);
    console.log(`Found ${dates.length} unavailable dates`);

    return {
      success: true,
      message: "Unavailable dates fetched successfully",
      data: dates,
    };
  } catch (error) {
    console.error(
      "Availability API error in getUnavailableDatesForMonth:",
      error,
    );
    return {
      success: false,
      message: `Failed to fetch unavailable dates: ${error instanceof Error ? error.message : "Unknown error"}`,
      error: "FETCH_ERROR",
      data: [],
    };
  }
}

/**
 * Toggle availability state for a date
 * @param date - Date in YYYY-MM-DD format
 * @returns API response with updated availability record
 */
export async function toggleAvailability(
  date: string,
): Promise<ApiResponse<Availability | null>> {
  try {
    const existing = await getAvailabilityByDate(date);

    if (!existing.data) {
      const { data, error } = await supabase
        .from("availability")
        .insert([
          {
            date,
            reason: "",
            avaibality: true,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        return {
          success: false,
          message: "Failed to create availability",
          error: "CREATE_ERROR",
          data: null,
        };
      }

      return {
        success: true,
        message: "Date toggled",
        data,
      };
    }

    const newAvailability = !existing.data.avaibality;
    const { data, error } = await supabase
      .from("availability")
      .update({
        avaibality: newAvailability,
      })
      .eq("date", date)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return {
        success: false,
        message: "Failed to update availability",
        error: "UPDATE_ERROR",
        data: null,
      };
    }

    return {
      success: true,
      message: newAvailability
        ? "Date set as unavailable"
        : "Date set as available",
      data,
    };
  } catch (error) {
    console.error("Availability API error:", error);
    return {
      success: false,
      message: "Failed to toggle availability",
      error: "ERROR",
      data: null,
    };
  }
}
