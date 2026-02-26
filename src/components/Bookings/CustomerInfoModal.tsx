"use client";

import { type SelectedSpecialty, type Shift, type TourPreview } from "@/api";
import { showToast } from "@/lib/toast-utils";
import {
  ArrowLeft,
  Calendar,
  Clock,
  CreditCard,
  Loader2,
  MapPin,
  Plus,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

interface CustomerInfoModalProps {
  selectedDate: string;
  selectedShift: Shift;
  selectedTour: TourPreview;
  selectedSpecialties: SelectedSpecialty[];
  guestNumber: number;
  onClose: () => void;
  onBack: () => void;
}

export default function CustomerInfoModal({
  selectedDate,
  selectedShift,
  selectedTour,
  selectedSpecialties,
  guestNumber,
  onClose,
  onBack,
}: CustomerInfoModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Each add-on is charged per person — spec.price × guestNumber
  const specialtiesTotal = selectedSpecialties.reduce(
    (sum, s) => sum + (s.price || 0) * guestNumber,
    0,
  );
  const totalPrice = (selectedTour.basePrice || 0) + specialtiesTotal;

  const dateFormatted = new Date(selectedDate + "T00:00:00").toLocaleDateString(
    "en-US",
    {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );

  const handleProceedToPay = async () => {
    if (!customerName.trim()) {
      showToast("Please enter your full name", "error");
      return;
    }
    if (
      !customerEmail.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)
    ) {
      showToast("Please enter a valid email address", "error");
      return;
    }
    if (guestNumber < 1) {
      showToast("At least 1 guest is required", "error");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/payments/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tour_id: parseInt(selectedTour._id, 10),
          shift_id: selectedShift.id,
          date: selectedDate,
          tour_price: selectedTour.basePrice ?? 0,
          tour_title: selectedTour.title,
          customer_name: customerName.trim(),
          customer_email: customerEmail.trim(),
          guest_number: guestNumber,
          additional_info: additionalInfo.trim() || undefined,
          selected_specialties:
            selectedSpecialties.length > 0 ? selectedSpecialties : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initiate payment");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      showToast(
        error instanceof Error ? error.message : "Failed to proceed to payment",
        "error",
      );
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-60 bg-neutral-light rounded-2xl shadow-2xl w-[calc(100%-2rem)] max-w-xl max-h-[92vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-secondary/10 bg-white">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-1.5 hover:bg-neutral-medium/40 rounded-lg transition-colors text-primary"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-primary leading-tight">
                Complete Your Booking
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                Step 2 of 2 &mdash; Enter your details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-neutral-medium/40 rounded-lg transition-colors text-primary"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5">
          {/* Booking Summary — compact card */}
          <div className="bg-white rounded-xl border border-secondary/15 overflow-hidden">
            <div className="px-4 py-2.5 bg-primary/5 border-b border-secondary/10">
              <p className="text-xs font-bold text-primary uppercase tracking-wider">
                Booking Summary
              </p>
            </div>
            <div className="px-4 py-3 space-y-2.5">
              <SummaryRow
                icon={<MapPin className="w-4 h-4" />}
                label="Tour"
                value={selectedTour.title}
              />
              <SummaryRow
                icon={<Calendar className="w-4 h-4" />}
                label="Date"
                value={dateFormatted}
              />
              <SummaryRow
                icon={<Clock className="w-4 h-4" />}
                label="Shift"
                value={`${selectedShift.name} · ${selectedShift.startTime} – ${selectedShift.endTime}`}
              />
              <SummaryRow
                icon={<Users className="w-4 h-4" />}
                label="Guests"
                value={`${guestNumber} ${guestNumber === 1 ? "person" : "people"}`}
              />

              {/* Base price row */}
              <div className="flex items-center justify-between pt-2 border-t border-dashed border-secondary/15">
                <div className="flex items-center gap-2.5 text-secondary/60">
                  <CreditCard className="w-4 h-4" />
                  <span className="text-xs font-medium">Tour price</span>
                </div>
                <span className="text-sm font-semibold text-primary">
                  ${selectedTour.basePrice ?? 0}
                </span>
              </div>

              {/* Specialty add-ons — priced per person */}
              {selectedSpecialties.length > 0 && (
                <div className="space-y-1.5">
                  {selectedSpecialties.map((spec) => {
                    const lineTotal = spec.price * guestNumber;
                    return (
                      <div
                        key={spec.name}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2 text-secondary/60">
                          <Plus className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">
                            {spec.name}
                            {spec.price > 0 && guestNumber > 1 && (
                              <span className="ml-1 text-[10px] text-secondary/40">
                                ${spec.price} × {guestNumber}
                              </span>
                            )}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-secondary/80">
                          {spec.price > 0 ? `+$${lineTotal}` : "Free"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Total */}
              <div className="flex items-center justify-between pt-2 border-t border-dashed border-secondary/15">
                <span className="text-xs font-bold text-primary uppercase tracking-wide">
                  Total
                </span>
                <span className="text-base font-bold text-accent">
                  ${totalPrice}
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <p className="text-xs font-bold text-primary uppercase tracking-wider">
              Your Information
            </p>

            {/* Name + Email row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Full Name"
                required
                value={customerName}
                onChange={setCustomerName}
                placeholder="John Doe"
                type="text"
              />
              <FormField
                label="Email Address"
                required
                value={customerEmail}
                onChange={setCustomerEmail}
                placeholder="john@example.com"
                type="email"
              />
            </div>
            {/* Additional Info */}
            <div>
              <label className="block text-sm font-semibold text-primary mb-1.5">
                Special Requests{" "}
                <span className="text-text-muted font-normal">(optional)</span>
              </label>
              <textarea
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Dietary requirements, accessibility needs, questions for the guide..."
                rows={3}
                className="w-full px-4 py-2.5 border border-secondary/20 rounded-lg focus:border-accent focus:ring-1 focus:ring-accent/30 focus:outline-none bg-white text-neutral-dark placeholder:text-secondary/30 resize-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-secondary/10 bg-white">
          <button
            onClick={handleProceedToPay}
            disabled={isSubmitting}
            className="w-full py-3.5 bg-accent text-white font-bold rounded-xl hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-accent/20"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Redirecting to payment…
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                Proceed to Pay
                <span className="ml-1 opacity-80">— ${totalPrice}</span>
              </>
            )}
          </button>
          <p className="text-center text-xs text-text-muted mt-2.5">
            You&apos;ll be redirected to Stripe for secure payment
          </p>
        </div>
      </div>
    </>
  );
}

/* ─── Sub-components ──────────────────────────────────────────── */

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2.5 text-secondary/60 shrink-0">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <span className="text-sm font-semibold text-primary text-right truncate">
        {value}
      </span>
    </div>
  );
}

function FormField({
  label,
  required,
  value,
  onChange,
  placeholder,
  type,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  type: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-primary mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 border border-secondary/20 rounded-lg focus:border-accent focus:ring-1 focus:ring-accent/30 focus:outline-none bg-white text-neutral-dark placeholder:text-secondary/30 text-sm"
      />
    </div>
  );
}
