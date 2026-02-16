"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { Calendar, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function BookingSidebar({ tour }: any) {
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  useEffect(() => {
    if (showCalendarModal) {
      // Inject custom CSS for Cal.com styling
      const styleId = "cal-theme-styles";
      if (!document.getElementById(styleId)) {
        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = `
          /* Cal.com Theme via CSS Variables */
          :root, [data-cal-namespace="know-a-local"] {
            --cal-brand: #d69850;
            --cal-brand-text-color: #ffffff;
            --cal-bg-default: #335358;
            --cal-text-emphasis: #335358;
          }
        `;
        document.head.appendChild(style);
      }

      (async function () {
        const cal = await getCalApi({ namespace: "know-a-local" });
        cal("ui", {
          hideEventTypeDetails: false,
          layout: "month_view",
          theme: "light",
        });
      })();
    }
  }, [showCalendarModal]);

  return (
    <>
      {/* Floating Button */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(214, 152, 80, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(214, 152, 80, 0);
          }
        }
        .floating-btn {
          animation: pulse-glow 2s infinite;
        }
      `}</style>
      <button
        onClick={() => setShowCalendarModal(true)}
        className="floating-btn fixed bottom-20 md:bottom-8 right-4 md:right-8 z-40 px-6 md:px-8 py-3 md:py-4 rounded-2xl bg-accent text-neutral-light font-bold text-sm md:text-base shadow-2xl hover:shadow-3xl hover:scale-110 active:scale-95 transition-all flex items-center gap-3 border-2 border-accent/50 backdrop-blur-sm hover:border-white"
      >
        <Calendar className="w-5 md:w-6 h-5 md:h-6 animate-pulse" />
        <span>Book Now</span>
      </button>

      {/* Cal.com Calendar Modal */}
      {showCalendarModal && (
        <>
          {/* Modal Overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setShowCalendarModal(false)}
          />
          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-accent rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#bcd2c2]/30">
              <h2 className="text-lg font-bold text-primary">
                {tour?.title ? `Book: ${tour.title}` : "Book Your Tour"}
              </h2>
              <button
                onClick={() => setShowCalendarModal(false)}
                className="text-[#335358] hover:text-[#774738] transition-colors p-1 hover:bg-[#f8f1dd] rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cal.com Calendar Embed */}
            <div className="flex-1 overflow-y-auto">
              <Cal
                namespace="know-a-local"
                calLink="know-a-local-okxsgd/know-a-local"
                style={{
                  width: "100%",
                  height: "100%",
                  overflow: "scroll",
                }}
                config={{
                  layout: "month_view",
                  useSlotsViewOnSmallScreen: "true",
                }}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
