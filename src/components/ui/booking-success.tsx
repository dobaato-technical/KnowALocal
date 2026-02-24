"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  CheckCircle,
  CreditCard,
  Mail,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BookingSuccess() {
  const [open, setOpen] = useState(false);
  const [bookingData, setBookingData] = useState<{
    bookingId?: string;
    tourId?: string;
  } | null>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    const bookingId = searchParams.get("bookingId");
    const tourId = searchParams.get("tourId");

    if (bookingId || tourId) {
      setBookingData({
        bookingId: bookingId || undefined,
        tourId: tourId || undefined,
      });
    }

    const timer = setTimeout(() => setOpen(true), 300);
    return () => clearTimeout(timer);
  }, [searchParams]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f1dd] to-[#e6dbc3] overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0 backdrop-blur-sm bg-black/20" />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative z-10 bg-white w-[95%] max-w-lg rounded-3xl shadow-2xl p-8 md:p-10"
          >
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="text-green-600 w-12 h-12" />
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
              Payment Successful! 🎉
            </h1>

            {/* Description */}
            <p className="mt-4 text-center text-gray-600">
              Thank you for your booking! We've sent a confirmation email with
              all the details of your tour.
            </p>

            {/* Info Cards */}
            <div className="mt-6 space-y-3">
              {bookingData?.bookingId && (
                <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-xl border border-blue-200">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-blue-700">
                    <span className="font-semibold">Booking ID:</span>{" "}
                    {bookingData.bookingId}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                <Calendar className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">
                  Check your email for event date & time
                </span>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                <Mail className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">
                  Confirmation sent to your inbox
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex flex-col gap-3">
              <Link
                href="/"
                className="w-full bg-[#335358] hover:bg-[#274346] text-white py-3 rounded-xl font-medium text-center transition"
              >
                Back to Home
              </Link>

              {bookingData?.tourId && (
                <Link
                  href={`/tour-details/${bookingData.tourId}`}
                  className="w-full border border-[#335358] text-[#335358] py-3 rounded-xl font-medium text-center hover:bg-[#335358]/10 transition"
                >
                  View Tour Details
                </Link>
              )}

              <a
                href="https://wa.me/977XXXXXXXXXX"
                target="_blank"
                className="w-full border border-green-600 text-green-600 py-3 rounded-xl font-medium text-center flex items-center justify-center gap-2 hover:bg-green-50 transition"
              >
                <MessageCircle className="w-4 h-4" />
                Contact on WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
