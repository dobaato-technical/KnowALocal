"use client";

import AvailabilityCheckPopup from "@/components/Calendar/AvailabilityCheckPopup";
import Button from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CTAPlanJourney() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/drive-images/Trout-Point-Lodge-Hot-Tub-DaveyandSky.jpg"
            alt="Luxury journey experience at Trout Point Lodge"
            fill
            className="object-cover"
            quality={100}
          />
          {/* Dark overlay gradient for optimal text readability on image */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/65 to-black/70" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto px-6 text-center">
          {/* Headline - uses h2 base styles from globals.css with accent highlight */}
          <h2 className="text-neutral-light">
            Plan Your Perfect{" "}
            <span className="block md:inline text-accent-color font-semibold">
              Canadian Journey
            </span>
          </h2>

          {/* Subheadline - uses design system text color for readability */}
          <p className="mt-6 text-lg md:text-xl text-neutral-light/90 max-w-2xl mx-auto leading-relaxed">
            From rugged coastlines to peaceful lakes, we design journeys that
            match your pace, passion, and curiosity.
          </p>

          {/* CTA Buttons - responsive sizing, no inline style overrides */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <Button
              variant="primary"
              size="md"
              className="w-full sm:w-auto"
              onClick={() => setShowPopup(true)}
            >
              Start Planning
            </Button>
            <Link href="/explore-all-tours" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="md"
                className="w-full border-2 border-neutral-light text-neutral-light hover:bg-neutral-light/10"
              >
                View Tours
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <AvailabilityCheckPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
      />
    </>
  );
}
