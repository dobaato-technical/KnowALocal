"use client";

import {
  downloadBookingPdf,
  generateBookingPdf,
  loadLogoDataUrl,
} from "@/lib/generate-booking-pdf";
import { showToast } from "@/lib/toast-utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  CreditCard,
  Download,
  ExternalLink,
  FileText,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface BookingDetailsData {
  id: number;
  tour_id: number;
  shift_id: number;
  date: string;
  booking_status: string;
  payment_status: string;
  customer_name: string | null;
  customer_email: string | null;
  tour_price: number | null;
  guest_number: number | null;
  additional_info: string | null;
  payment_info: string | null;
  created_at: string;
  tour_title: string | null;
  shift_name: string | null;
  shift_start_time: string | null;
  shift_end_time: string | null;
  isConfirmed: boolean;
  selected_specialties: Array<{
    name: string;
    price: number;
    description?: string;
  }> | null;
}

export default function BookingSuccess() {
  const [open, setOpen] = useState(false);
  const [bookingData, setBookingData] = useState<{
    bookingId?: string;
    tourId?: string;
    sessionId?: string;
  } | null>(null);
  const [bookingDetails, setBookingDetails] =
    useState<BookingDetailsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    const bookingId = searchParams.get("bookingId");
    const tourId = searchParams.get("tourId");
    const sessionId = searchParams.get("session_id");

    setBookingData({
      bookingId: bookingId || undefined,
      tourId: tourId || undefined,
      sessionId: sessionId || undefined,
    });

    if (bookingId) {
      fetchBookingDetails(bookingId, sessionId || undefined);
    } else {
      setIsLoading(false);
    }

    const timer = setTimeout(() => setOpen(true), 300);
    return () => clearTimeout(timer);
  }, [searchParams]);

  const fetchBookingDetails = async (bookingId: string, sessionId?: string) => {
    try {
      setIsLoading(true);
      const url = sessionId
        ? `/api/payments/booking-details?bookingId=${bookingId}&session_id=${sessionId}`
        : `/api/payments/booking-details?bookingId=${bookingId}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setBookingDetails(data.booking);
      } else {
        setError(data.error || "Failed to fetch booking details");
      }
    } catch {
      setError("Failed to verify booking confirmation");
    } finally {
      setIsLoading(false);
    }
  };

  // Build PDF data object from booking details
  const buildPdfData = useCallback(() => {
    if (!bookingDetails) return null;
    let paymentBrand: string | null = null;
    let paymentLast4: string | null = null;
    let paymentExpMonth: number | null = null;
    let paymentExpYear: number | null = null;
    let paymentCurrency: string | null = null;
    let receiptUrl: string | null = null;
    if (bookingDetails.payment_info) {
      try {
        const pi = JSON.parse(bookingDetails.payment_info);
        paymentBrand = pi.brand ?? null;
        paymentLast4 = pi.last4 ?? null;
        paymentExpMonth = pi.exp_month ?? null;
        paymentExpYear = pi.exp_year ?? null;
        paymentCurrency = pi.currency ?? null;
        receiptUrl = pi.receipt_url ?? null;
      } catch {
        /* ignore */
      }
    }
    return {
      bookingId: bookingDetails.id,
      customerName: bookingDetails.customer_name,
      customerEmail: bookingDetails.customer_email,
      tourTitle: bookingDetails.tour_title,
      date: bookingDetails.date,
      shiftName: bookingDetails.shift_name,
      shiftStartTime: bookingDetails.shift_start_time,
      shiftEndTime: bookingDetails.shift_end_time,
      guestNumber: bookingDetails.guest_number,
      tourPrice: bookingDetails.tour_price,
      additionalInfo: bookingDetails.additional_info,
      selectedSpecialties: bookingDetails.selected_specialties ?? undefined,
      paymentBrand,
      paymentLast4,
      paymentExpMonth,
      paymentExpYear,
      paymentCurrency,
      receiptUrl,
    };
  }, [bookingDetails]);

  const handleDownloadPdf = async () => {
    const pdfData = buildPdfData();
    if (!pdfData) return;
    await downloadBookingPdf(pdfData);
  };

  const handleSendEmail = async () => {
    if (!bookingDetails?.customer_email) {
      showToast("No email address found for this booking", "error");
      return;
    }
    const pdfData = buildPdfData();
    if (!pdfData) return;

    try {
      setIsSendingEmail(true);
      // Load logo so it embeds in the PDF as well
      const logoDataUrl = await loadLogoDataUrl();
      const blob = generateBookingPdf({ ...pdfData, logoDataUrl });
      // Convert to base64
      const arrayBuffer = await blob.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          "",
        ),
      );

      // Build shift time display string
      const shiftTime =
        bookingDetails.shift_start_time && bookingDetails.shift_end_time
          ? `${bookingDetails.shift_start_time} – ${bookingDetails.shift_end_time}`
          : undefined;

      // Parse payment info for email
      let paymentBrand: string | undefined;
      let paymentLast4: string | undefined;
      let paymentExpMonth: number | undefined;
      let paymentExpYear: number | undefined;
      let paymentCurrency: string | undefined;
      let receiptUrl: string | undefined;
      if (bookingDetails.payment_info) {
        try {
          const pi = JSON.parse(bookingDetails.payment_info);
          paymentBrand = pi.brand ?? undefined;
          paymentLast4 = pi.last4 ?? undefined;
          paymentExpMonth = pi.exp_month ?? undefined;
          paymentExpYear = pi.exp_year ?? undefined;
          paymentCurrency = pi.currency ?? undefined;
          receiptUrl = pi.receipt_url ?? undefined;
        } catch {
          /* ignore */
        }
      }

      const response = await fetch("/api/payments/send-confirmation-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: bookingDetails.customer_email,
          customerName: bookingDetails.customer_name,
          bookingId: bookingDetails.id,
          tourTitle: bookingDetails.tour_title,
          date: bookingDetails.date,
          shiftName: bookingDetails.shift_name,
          shiftTime,
          guestNumber: bookingDetails.guest_number,
          tourPrice: bookingDetails.tour_price,
          selectedSpecialties: bookingDetails.selected_specialties ?? undefined,
          paymentBrand,
          paymentLast4,
          paymentExpMonth,
          paymentExpYear,
          paymentCurrency,
          receiptUrl,
          pdfBase64: base64,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setEmailSent(true);
        showToast("Confirmation email sent!", "success");
      } else {
        showToast(data.error || "Failed to send email", "error");
      }
    } catch {
      showToast("Could not send email. Please try again.", "error");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const formattedDate = bookingDetails?.date
    ? new Date(bookingDetails.date + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  /* ── Payment info helper ── */
  const parsedPayment = (() => {
    if (!bookingDetails?.payment_info) return null;
    try {
      const pi = JSON.parse(bookingDetails.payment_info);
      return pi;
    } catch {
      return null;
    }
  })();

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      {/* ── Top nav bar ── */}
      <div className="border-b border-slate-100 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary transition-colors no-underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="max-w-3xl mx-auto px-4 py-10 pb-16"
          >
            {isLoading ? (
              /* ─── Loading ─── */
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center py-24 px-6">
                <Loader2 className="w-8 h-8 animate-spin text-accent mb-4" />
                <p className="text-sm text-slate-500 font-medium">
                  Verifying your booking…
                </p>
              </div>
            ) : error ? (
              /* ─── Error state ─── */
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="bg-red-50 px-8 py-10 text-center border-b border-red-100">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm mb-4">
                    <AlertCircle className="text-red-500 w-8 h-8" />
                  </div>
                  <h1 className="text-2xl font-bold text-slate-800">
                    Unable to Verify Booking
                  </h1>
                  <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
                    {error}
                  </p>
                </div>
                <div className="px-8 py-6 space-y-4">
                  {bookingData?.bookingId && (
                    <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <CreditCard className="w-5 h-5 text-slate-400 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">
                          Booking Reference
                        </p>
                        <p className="text-sm font-bold text-slate-700 mt-0.5">
                          #{bookingData.bookingId}
                        </p>
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-slate-400 text-center leading-relaxed">
                    Your payment was received. Please check your email for
                    confirmation, or contact our support team.
                  </p>
                  <Link
                    href="/"
                    className="w-full bg-primary hover:bg-primary/90 text-white py-3.5 rounded-xl font-semibold text-center transition block text-sm no-underline"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            ) : bookingDetails?.isConfirmed ? (
              /* ─── Confirmed ─── */
              <div className="space-y-4">
                {/* ── Hero card ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  {/* Green header band */}
                  <div className="bg-linear-to-br from-emerald-500 to-emerald-600 px-8 pt-10 pb-8 text-center relative overflow-hidden">
                    {/* subtle decorative rings */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-2 border-white" />
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-white" />
                    </div>
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        delay: 0.2,
                        type: "spring",
                        stiffness: 200,
                      }}
                      className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-5"
                    >
                      <CheckCircle className="w-10 h-10 text-white" />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                    >
                      <p className="text-emerald-100 text-sm font-medium tracking-wide uppercase mb-1">
                        Payment Successful
                      </p>
                      <h1 className="text-3xl font-bold text-white">
                        Booking Confirmed!
                      </h1>
                      {bookingDetails.customer_name && (
                        <p className="mt-2 text-emerald-100 text-sm">
                          Great news,{" "}
                          {bookingDetails.customer_name.split(" ")[0]}! Your
                          adventure awaits.
                        </p>
                      )}
                    </motion.div>
                  </div>

                  {/* Booking reference pill */}
                  <div className="flex items-center justify-center -mt-5 px-6 relative z-10">
                    <div className="bg-white border border-slate-200 shadow-md rounded-full px-6 py-2.5 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Booking Reference
                      </span>
                      <span className="text-base font-bold text-primary">
                        #{bookingDetails.id}
                      </span>
                    </div>
                  </div>

                  {/* Tour name summary */}
                  {bookingDetails.tour_title && (
                    <div className="px-6 pt-5 pb-2 text-center">
                      <p className="text-lg font-bold text-slate-800 leading-tight">
                        {bookingDetails.tour_title}
                      </p>
                      <div className="flex items-center justify-center gap-4 mt-2 text-sm text-slate-400">
                        {formattedDate && (
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {formattedDate}
                          </span>
                        )}
                        {bookingDetails.guest_number != null && (
                          <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" />
                            {bookingDetails.guest_number}{" "}
                            {bookingDetails.guest_number === 1
                              ? "guest"
                              : "guests"}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="h-px bg-slate-100 mx-6 mt-4" />

                  {/* ── Details rows ── */}
                  <div className="px-6 py-5 space-y-0 divide-y divide-slate-50">
                    <InfoRow
                      icon={<MapPin className="w-4 h-4" />}
                      label="Tour"
                      value={bookingDetails.tour_title ?? "—"}
                    />
                    {formattedDate && (
                      <InfoRow
                        icon={<Calendar className="w-4 h-4" />}
                        label="Date"
                        value={formattedDate}
                      />
                    )}
                    {bookingDetails.shift_name && (
                      <InfoRow
                        icon={<Clock className="w-4 h-4" />}
                        label="Session"
                        value={
                          bookingDetails.shift_start_time &&
                          bookingDetails.shift_end_time
                            ? `${bookingDetails.shift_name} · ${bookingDetails.shift_start_time} – ${bookingDetails.shift_end_time}`
                            : bookingDetails.shift_name
                        }
                      />
                    )}
                    {bookingDetails.guest_number != null && (
                      <InfoRow
                        icon={<Users className="w-4 h-4" />}
                        label="Guests"
                        value={`${bookingDetails.guest_number} ${bookingDetails.guest_number === 1 ? "person" : "people"}`}
                      />
                    )}
                    {bookingDetails.customer_name && (
                      <InfoRow
                        icon={<Mail className="w-4 h-4" />}
                        label="Name"
                        value={bookingDetails.customer_name}
                      />
                    )}
                    {bookingDetails.customer_email && (
                      <InfoRow
                        icon={<Mail className="w-4 h-4" />}
                        label="Email"
                        value={bookingDetails.customer_email}
                      />
                    )}
                    {bookingDetails.additional_info && (
                      <InfoRow
                        icon={<FileText className="w-4 h-4" />}
                        label="Special Requests"
                        value={bookingDetails.additional_info}
                      />
                    )}
                    {/* Add-ons */}
                    {bookingDetails.selected_specialties &&
                    bookingDetails.selected_specialties.length > 0 ? (
                      <div className="py-3.5 last:pb-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-slate-400">
                            <Sparkles className="w-4 h-4" />
                          </span>
                          <span className="text-sm text-slate-500">
                            Add-ons
                          </span>
                        </div>
                        <div className="ml-7 space-y-1.5">
                          {bookingDetails.selected_specialties.map((s) => (
                            <div
                              key={s.name}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="text-slate-700 font-medium">
                                {s.name}
                              </span>
                              <span className="font-semibold text-emerald-600">
                                {s.price > 0 ? `+$${s.price}` : "Free"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <InfoRow
                        icon={<Sparkles className="w-4 h-4" />}
                        label="Add-ons"
                        value="None selected"
                        valueClassName="text-sm text-slate-400 text-right"
                      />
                    )}
                  </div>
                </div>

                {/* ── Payment summary card ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                      Payment Summary
                    </h2>
                  </div>
                  <div className="px-6 py-4 space-y-0 divide-y divide-slate-50">
                    {bookingDetails.tour_price != null && (
                      <InfoRow
                        icon={<CreditCard className="w-4 h-4" />}
                        label="Amount Paid"
                        value={`$${bookingDetails.tour_price.toFixed(2)}`}
                        valueClassName="text-base font-extrabold text-emerald-600"
                      />
                    )}
                    {parsedPayment?.brand && parsedPayment?.last4 && (
                      <InfoRow
                        icon={<CreditCard className="w-4 h-4" />}
                        label="Card"
                        value={`${parsedPayment.brand.charAt(0).toUpperCase() + parsedPayment.brand.slice(1)} •••• ${parsedPayment.last4}${parsedPayment.exp_month && parsedPayment.exp_year ? ` · Exp ${String(parsedPayment.exp_month).padStart(2, "0")}/${parsedPayment.exp_year}` : ""}`}
                      />
                    )}
                    <InfoRow
                      icon={<CheckCircle className="w-4 h-4" />}
                      label="Status"
                      value="Paid & Confirmed"
                      valueClassName="font-bold text-emerald-600"
                    />
                    {parsedPayment?.receipt_url && (
                      <div className="flex items-center justify-between py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400">
                            <FileText className="w-4 h-4" />
                          </span>
                          <span className="text-sm text-slate-500">
                            Receipt
                          </span>
                        </div>
                        <a
                          href={parsedPayment.receipt_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-semibold text-primary flex items-center gap-1 hover:text-accent transition-colors no-underline"
                        >
                          View Stripe Receipt
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Get your confirmation card ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-accent" />
                    <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                      Your Confirmation
                    </h2>
                  </div>
                  <div className="px-6 py-5 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={handleDownloadPdf}
                        className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:border-accent hover:text-accent hover:bg-accent/5 transition-all"
                      >
                        <Download className="w-4 h-4" />
                        Download PDF
                      </button>
                      <button
                        onClick={handleSendEmail}
                        disabled={isSendingEmail || emailSent}
                        className="flex items-center justify-center gap-2 py-3 px-4 bg-accent text-white rounded-xl text-sm font-semibold hover:bg-accent/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {isSendingEmail ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : emailSent ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        {isSendingEmail
                          ? "Sending…"
                          : emailSent
                            ? "Email Sent!"
                            : "Email PDF"}
                      </button>
                    </div>
                    {bookingDetails.customer_email && (
                      <p className="text-xs text-slate-400 text-center">
                        {emailSent
                          ? `✓ Sent to ${bookingDetails.customer_email}`
                          : `PDF will be sent to ${bookingDetails.customer_email}`}
                      </p>
                    )}
                  </div>
                </div>

                {/* ── What happens next card ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                      What Happens Next
                    </h2>
                  </div>
                  <div className="px-6 py-5">
                    <ol className="space-y-4">
                      {[
                        {
                          step: "1",
                          title: "Confirmation Email",
                          desc: "A confirmation email with your booking details will be sent to your inbox.",
                          color: "bg-emerald-100 text-emerald-700",
                        },
                        {
                          step: "2",
                          title: "Meet Your Local Guide",
                          desc: "Your guide will reach out before the tour date with meeting point details.",
                          color: "bg-blue-100 text-blue-700",
                        },
                        {
                          step: "3",
                          title: "Enjoy Your Experience",
                          desc: "Show up on the day — your guide will take care of the rest!",
                          color: "bg-amber-100 text-amber-700",
                        },
                      ].map(({ step, title, desc, color }) => (
                        <li key={step} className="flex items-start gap-4">
                          <span
                            className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${color}`}
                          >
                            {step}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-slate-700">
                              {title}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                              {desc}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* ── Action buttons ── */}
                <div className="space-y-3 pt-1">
                  {bookingData?.tourId && (
                    <Link
                      href={`/tour-details/${bookingData.tourId}`}
                      className="w-full bg-primary hover:bg-primary/90 active:scale-[0.99] text-white py-3.5 rounded-xl font-semibold text-center flex items-center justify-center gap-2 transition text-sm no-underline"
                    >
                      View Tour Details
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                  <a
                    href="https://wa.me/977XXXXXXXXXX"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full border border-emerald-200 bg-emerald-50 text-emerald-700 py-3.5 rounded-xl font-semibold text-center flex items-center justify-center gap-2 hover:bg-emerald-100 transition text-sm no-underline"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Contact Guide on WhatsApp
                  </a>
                  <Link
                    href="/explore-all-tours"
                    className="w-full border border-slate-200 text-slate-500 py-3.5 rounded-xl font-semibold text-center hover:bg-slate-50 transition block text-sm no-underline"
                  >
                    Explore More Tours
                  </Link>
                </div>
              </div>
            ) : (
              /* ─── Pending state ─── */
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="bg-amber-50 px-8 py-10 text-center border-b border-amber-100">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm mb-4">
                    <AlertCircle className="text-amber-500 w-8 h-8" />
                  </div>
                  <h1 className="text-2xl font-bold text-slate-800">
                    Payment Processing
                  </h1>
                  <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
                    Your payment is being processed. This usually takes just a
                    moment. Please check your email for confirmation.
                  </p>
                </div>
                <div className="px-8 py-6 space-y-4">
                  {bookingData?.bookingId && (
                    <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <CreditCard className="w-5 h-5 text-slate-400 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">
                          Booking Reference
                        </p>
                        <p className="text-sm font-bold text-slate-700 mt-0.5">
                          #{bookingData.bookingId}
                        </p>
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-slate-400 text-center leading-relaxed">
                    Please save your booking reference. If the page does not
                    update, check your inbox or contact support.
                  </p>
                  <Link
                    href="/"
                    className="w-full bg-primary hover:bg-primary/90 text-white py-3.5 rounded-xl font-semibold text-center transition block text-sm no-underline"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Info row component ─────────────────────────────────────────── */
function InfoRow({
  icon,
  label,
  value,
  valueClassName,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-slate-400">{icon}</span>
        <span className="text-sm text-slate-500">{label}</span>
      </div>
      <span
        className={
          valueClassName ??
          "text-sm font-semibold text-slate-800 text-right leading-snug max-w-[55%]"
        }
      >
        {value}
      </span>
    </div>
  );
}
