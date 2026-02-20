import { supabase } from "./supabase";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: any;
  error?: string;
}

/**
 * Authenticate admin user with Supabase
 */
export async function loginAdmin(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  try {
    const { email, password } = credentials;

    // Validate inputs
    if (!email || !password) {
      return {
        success: false,
        message: "Email and password are required",
        error: "INVALID_INPUT",
      };
    }

    // Attempt login with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        message: error.message || "Invalid email or password",
        error: error.code || "AUTH_ERROR",
      };
    }

    if (!data.user) {
      return {
        success: false,
        message: "No user returned from authentication",
        error: "NO_USER",
      };
    }

    return {
      success: true,
      message: "Login successful",
      user: data.user,
    };
  } catch (err) {
    console.error("Login error:", err);
    return {
      success: false,
      message: "An unexpected error occurred during login",
      error: "UNKNOWN_ERROR",
    };
  }
}

/**
 * Logout admin user
 */
export async function logoutAdmin() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (err) {
    console.error("Logout error:", err);
    return {
      success: false,
      message: "Error during logout",
    };
  }
}

/**
 * Get current admin session
 */
export async function getCurrentAdminSession() {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session) {
      return null;
    }

    return session;
  } catch (err) {
    console.error("Session error:", err);
    return null;
  }
}
