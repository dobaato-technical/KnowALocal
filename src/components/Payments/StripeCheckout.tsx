"use client";

import type { TourPreview } from "@/api";
import Button from "@/components/ui/button";
import { showToast } from "@/lib/toast-utils";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface StripeCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (bookingId: number) => void;
  bookingData: {
    tour_id: number;
    shift_id: number;
    date: string;
    tour_price: number;
    tour?: TourPreview;
  };
}

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
);

function CheckoutForm({
  isOpen,
  onClose,
  onSuccess,
  bookingData,
}: Omit<StripeCheckoutProps, "children">) {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [step, setStep] = useState<"form" | "payment">("form");

  // Create payment intent when component opens
  useEffect(() => {
    if (!isOpen) return;

    const createPaymentIntent = async () => {
      try {
        setIsLoading(true);

        const response = await fetch("/api/payments/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tour_id: bookingData.tour_id,
            shift_id: bookingData.shift_id,
            date: bookingData.date,
            customer_email: customerEmail || "guest@example.com",
            customer_name: customerName || "Guest",
            tour_price: bookingData.tour_price,
          }),
        });

        const data = await response.json();

        if (!data.success) {
          showToast(data.error || "Failed to create booking", "error");
          setIsLoading(false);
          return;
        }

        setClientSecret(data.clientSecret);
        setBookingId(data.bookingId);
        setIsLoading(false);
      } catch (error) {
        console.error("Payment intent error:", error);
        showToast("Failed to initialize payment", "error");
        setIsLoading(false);
      }
    };

    // Only create if we have customer info
    if (customerName && customerEmail && step === "payment") {
      createPaymentIntent();
    }
  }, [isOpen, step, customerName, customerEmail, bookingData]);

  const handleCustomerInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerEmail.trim()) {
      showToast("Please enter your name and email", "error");
      return;
    }

    // Basic email validation
    if (!customerEmail.includes("@")) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    setStep("payment");
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret || !bookingId) {
      showToast("Payment system not ready", "error");
      return;
    }

    setIsLoading(true);

    try {
      // Confirm payment with Stripe
      const { error: confirmError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              name: customerName,
              email: customerEmail,
            },
          },
        });

      if (confirmError) {
        showToast(confirmError.message || "Payment failed", "error");
        setIsLoading(false);
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        // Confirm booking with our backend
        const confirmResponse = await fetch("/api/payments/confirm-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingId,
            paymentIntentId: paymentIntent.id,
            customerEmail,
          }),
        });

        const confirmData = await confirmResponse.json();

        if (confirmData.success) {
          showToast("Payment successful! Booking confirmed!", "success");
          setIsLoading(false);
          onSuccess(bookingId);
          onClose();
        } else {
          showToast(confirmData.error || "Failed to confirm booking", "error");
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      showToast(
        error instanceof Error ? error.message : "Payment processing failed",
        "error",
      );
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-h-96 w-full max-w-md overflow-y-auto rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Secure Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Booking Summary */}
        <div className="mb-6 rounded-lg bg-gray-50 p-4">
          <p className="text-sm text-gray-600">
            {bookingData.tour?.title || "Tour Booking"}
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Date: {new Date(bookingData.date).toLocaleDateString()}
          </p>
          <div className="mt-4 flex justify-between border-t border-gray-200 pt-4">
            <span className="font-semibold">Total Amount:</span>
            <span className="text-lg font-bold">
              ${bookingData.tour_price.toFixed(2)}
            </span>
          </div>
        </div>

        {step === "form" ? (
          <form onSubmit={handleCustomerInfoSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="John Doe"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="john@example.com"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Continue to Payment"
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handlePayment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Card Details
              </label>
              <div className="mt-2 rounded-lg border border-gray-300 p-3">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#424770",
                        "::placeholder": {
                          color: "#aab7c4",
                        },
                      },
                      invalid: {
                        color: "#9e2146",
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep("form")}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
                disabled={isLoading}
              >
                Back
              </button>
              <Button
                type="submit"
                disabled={isLoading || !stripe}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay $${bookingData.tour_price.toFixed(2)}`
                )}
              </Button>
            </div>
          </form>
        )}

        <p className="mt-4 text-xs text-gray-500">
          💳 Your payment information is secure and processed by Stripe
        </p>
      </div>
    </div>
  );
}

export default function StripeCheckout(props: StripeCheckoutProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
}
