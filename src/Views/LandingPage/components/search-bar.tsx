"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface SearchBarProps {}

export function SearchBar({}: SearchBarProps) {
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
    <div className="w-full">
      <div className="w-full max-w-4xl mx-auto flex items-center justify-center">
        <button
          onClick={() => setShowCalendarModal(true)}
          className="w-full sm:w-64 h-12 sm:h-14 inline-flex items-center justify-center gap-2 font-bold rounded-xl text-sm sm:text-base tracking-wide transition-all bg-accent text-neutral-light hover:opacity-90 active:opacity-75"
        >
          Check Availability
        </button>
      </div>

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
              <h2 className="text-lg font-bold text-primary">Book Your Tour</h2>
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
    </div>
  );
}
