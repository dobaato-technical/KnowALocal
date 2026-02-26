/**
 * Authentication API Service
 * Handles all auth-related API calls
 */

import { ApiResponse } from "@/api/types";
import {
  loginAdmin as supabaseLogin,
  logoutAdmin as supabaseLogout,
} from "@/lib/supabase-auth";
import type { LoginCredentials, StoredSession, User } from "./auth.types";

// Session storage constants
const SESSION_STORAGE_KEY = "admin_session";
const TOKEN_STORAGE_KEY = "admin_token";
const SESSION_EXPIRY_DAYS = 7; // 7 days

/**
 * Store session in localStorage with 7-day expiry and set auth cookie for middleware
 */
function storeSession(user: User, token: string): void {
  if (typeof window === "undefined") return;

  const expiresAt = Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000; // 7 days in milliseconds

  const session: StoredSession = {
    user,
    token,
    expiresAt,
    createdAt: Date.now(),
  };

  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  localStorage.setItem(TOKEN_STORAGE_KEY, token);

  // Set a cookie so Next.js middleware can verify auth on admin routes
  document.cookie = `admin_authenticated=true; Path=/; Max-Age=${SESSION_EXPIRY_DAYS * 24 * 60 * 60}; SameSite=Lax`;
}

/**
 * Clear session from localStorage and remove auth cookie
 */
function clearSession(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(SESSION_STORAGE_KEY);
  localStorage.removeItem(TOKEN_STORAGE_KEY);

  // Clear the middleware auth cookie
  document.cookie = "admin_authenticated=; Path=/; Max-Age=0; SameSite=Lax";
}

/**
 * Get stored session from localStorage
 */
function getStoredSession(): StoredSession | null {
  if (typeof window === "undefined") return null;

  try {
    const sessionStr = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessionStr) return null;

    const session: StoredSession = JSON.parse(sessionStr);

    // Check if session has expired
    if (session.expiresAt && Date.now() > session.expiresAt) {
      clearSession();
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

/**
 * Login admin user
 * @param credentials - Email and password
 * @returns API response with user data
 */
export async function loginAdmin(
  credentials: LoginCredentials,
): Promise<ApiResponse<User>> {
  try {
    const result = await supabaseLogin(credentials);

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Login failed",
        error: result.error,
      };
    }

    // Store session locally with 7-day expiry
    const token = result.user?.id || ""; // Use user ID as token
    storeSession(result.user, token);

    return {
      success: true,
      message: result.message,
      data: result.user,
    };
  } catch (error) {
    console.error("Auth API error:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
      error: "UNKNOWN_ERROR",
    };
  }
}

/**
 * Logout admin user
 * Clears session immediately
 * @returns API response
 */
export async function logoutAdmin(): Promise<ApiResponse> {
  try {
    const result = await supabaseLogout();

    // Clear session from localStorage immediately
    clearSession();

    return {
      success: result.success,
      message: result.message,
    };
  } catch (error) {
    console.error("Auth API error:", error);
    // Clear session even on error
    clearSession();
    return {
      success: false,
      message: "An unexpected error occurred",
      error: "UNKNOWN_ERROR",
    };
  }
}

/**
 * Get current user session from localStorage
 * @returns API response with user data or null
 */
export function getStoredUserSession(): ApiResponse<User | null> {
  try {
    const session = getStoredSession();

    if (!session) {
      return {
        success: true,
        message: "No user session found",
        data: null,
      };
    }

    return {
      success: true,
      message: "User session retrieved successfully",
      data: session.user,
    };
  } catch (error) {
    console.error("Session retrieval error:", error);
    return {
      success: false,
      message: "Failed to retrieve session",
      error: "SESSION_ERROR",
      data: null,
    };
  }
}

/**
 * Check if a valid session exists
 * @returns true if valid session exists, false otherwise
 */
export function isSessionValid(): boolean {
  return getStoredSession() !== null;
}

/**
 * Get current user session
 * @returns API response with user data or null
 */
export async function getCurrentUser(): Promise<ApiResponse<User | null>> {
  try {
    // Import here to avoid circular dependencies
    const { supabase } = await import("@/lib/supabase");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: true,
        message: "No user logged in",
        data: null,
      };
    }

    return {
      success: true,
      message: "User fetched successfully",
      data: user as User,
    };
  } catch (error) {
    console.error("Auth API error:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
      error: "UNKNOWN_ERROR",
      data: null,
    };
  }
}
