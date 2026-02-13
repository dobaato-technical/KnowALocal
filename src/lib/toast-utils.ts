/**
 * Toast Notification Utility
 * Wrapper for shadcn/ui toast component with common message patterns
 */

import { toast } from "sonner";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastOptions {
  duration?: number;
  description?: string;
}

/**
 * Show a toast notification
 */
export function showToast(
  message: string,
  type: ToastType = "info",
  options: ToastOptions = {},
) {
  const { duration = 4000, description } = options;

  const toastConfig = {
    duration,
    description,
  };

  switch (type) {
    case "success":
      toast.success(message, toastConfig);
      break;
    case "error":
      toast.error(message, toastConfig);
      break;
    case "warning":
      toast.warning(message, toastConfig);
      break;
    case "info":
    default:
      toast.info(message, toastConfig);
      break;
  }
}

/**
 * Availability check feedback
 */
export function showAvailabilityToast(available: boolean, message?: string) {
  if (available) {
    showToast(message || "Slot is available!", "success", { duration: 3000 });
  } else {
    showToast(message || "This slot is already booked", "error", {
      duration: 4000,
    });
  }
}

/**
 * Booking success notification
 */
export function showBookingSuccessToast(bookingId?: string) {
  showToast("Booking confirmed! 🎉", "success", {
    duration: 5000,
    description: "Confirmation email has been sent to your email address.",
  });
}

/**
 * Booking error notification
 */
export function showBookingErrorToast(error: string) {
  showToast("Booking failed", "error", {
    duration: 5000,
    description: error,
  });
}

/**
 * Loading state toast (often used with a promise)
 */
export function showLoadingToast(message: string) {
  return toast.loading(message, { duration: Infinity });
}

/**
 * Update a loading toast to success
 */
export function updateToastSuccess(
  toastId: string | number,
  message: string,
  description?: string,
) {
  toast.success(message, {
    id: toastId,
    duration: 4000,
    description,
  });
}

/**
 * Update a loading toast to error
 */
export function updateToastError(
  toastId: string | number,
  message: string,
  description?: string,
) {
  toast.error(message, {
    id: toastId,
    duration: 5000,
    description,
  });
}

/**
 * Dismiss a specific toast
 */
export function dismissToast(toastId: string | number) {
  toast.dismiss(toastId);
}

/**
 * Dismiss all toasts
 */
export function dismissAllToasts() {
  toast.dismiss();
}
