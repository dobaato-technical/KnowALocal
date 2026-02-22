/**
 * Shifts API
 * Handles all shift-related API calls
 */

import { supabase } from "@/lib/supabase";
import { ApiResponse, Shift } from "../types";

// Re-export types for convenience
export type { ApiResponse, Shift };

/**
 * Get all shifts
 * Fetches all shifts from Supabase
 * @returns API response with array of shifts
 */
export async function getAllShifts(): Promise<ApiResponse<Shift[]>> {
  try {
    const { data, error } = await supabase
      .from("Shifts")
      .select("id, name, start_time, end_time, type, is_active, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return {
        success: false,
        message: "Failed to fetch shifts",
        error: "FETCH_ERROR",
        data: [],
      };
    }

    // Transform Supabase response to match Shift interface
    const shifts: Shift[] = (data || []).map((shift: any) => ({
      id: shift.id,
      name: shift.name || "N/A",
      startTime: shift.start_time || "00:00:00",
      endTime: shift.end_time || "00:00:00",
      type: shift.type || "hourly",
      isActive: shift.is_active || false,
      createdAt: shift.created_at,
    }));

    return {
      success: true,
      message: "Shifts fetched successfully",
      data: shifts,
    };
  } catch (error) {
    console.error("Shifts API error:", error);
    return {
      success: false,
      message: "Failed to fetch shifts",
      error: "FETCH_ERROR",
      data: [],
    };
  }
}

/**
 * Create a new shift
 * @param shift - Shift data to create
 * @returns API response with created shift
 */
export async function createShift(
  shift: Omit<Shift, "id" | "createdAt">,
): Promise<ApiResponse<Shift | null>> {
  try {
    const { data, error } = await supabase
      .from("Shifts")
      .insert([
        {
          name: shift.name,
          start_time: shift.startTime,
          end_time: shift.endTime,
          type: shift.type,
          is_active: shift.isActive,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return {
        success: false,
        message: "Failed to create shift",
        error: "CREATE_ERROR",
        data: null,
      };
    }

    const newShift: Shift = {
      id: data.id,
      name: data.name,
      startTime: data.start_time,
      endTime: data.end_time,
      type: data.type,
      isActive: data.is_active,
      createdAt: data.created_at,
    };

    return {
      success: true,
      message: "Shift created successfully",
      data: newShift,
    };
  } catch (error) {
    console.error("Shifts API error:", error);
    return {
      success: false,
      message: "Failed to create shift",
      error: "CREATE_ERROR",
      data: null,
    };
  }
}

/**
 * Update a shift
 * @param id - Shift ID
 * @param updates - Fields to update
 * @returns API response with updated shift
 */
export async function updateShift(
  id: number,
  updates: Partial<Omit<Shift, "id" | "createdAt">>,
): Promise<ApiResponse<Shift | null>> {
  try {
    const updateData: any = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.startTime !== undefined)
      updateData.start_time = updates.startTime;
    if (updates.endTime !== undefined) updateData.end_time = updates.endTime;
    if (updates.type !== undefined) updateData.type = updates.type;
    if (updates.isActive !== undefined) updateData.is_active = updates.isActive;

    const { data, error } = await supabase
      .from("Shifts")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return {
        success: false,
        message: "Failed to update shift",
        error: "UPDATE_ERROR",
        data: null,
      };
    }

    const updatedShift: Shift = {
      id: data.id,
      name: data.name,
      startTime: data.start_time,
      endTime: data.end_time,
      type: data.type,
      isActive: data.is_active,
      createdAt: data.created_at,
    };

    return {
      success: true,
      message: "Shift updated successfully",
      data: updatedShift,
    };
  } catch (error) {
    console.error("Shifts API error:", error);
    return {
      success: false,
      message: "Failed to update shift",
      error: "UPDATE_ERROR",
      data: null,
    };
  }
}

/**
 * Delete a shift
 * @param id - Shift ID
 * @returns API response
 */
export async function deleteShift(id: number): Promise<ApiResponse<null>> {
  try {
    const { error } = await supabase.from("Shifts").delete().eq("id", id);

    if (error) {
      console.error("Supabase error:", error);
      return {
        success: false,
        message: "Failed to delete shift",
        error: "DELETE_ERROR",
        data: null,
      };
    }

    return {
      success: true,
      message: "Shift deleted successfully",
      data: null,
    };
  } catch (error) {
    console.error("Shifts API error:", error);
    return {
      success: false,
      message: "Failed to delete shift",
      error: "DELETE_ERROR",
      data: null,
    };
  }
}
