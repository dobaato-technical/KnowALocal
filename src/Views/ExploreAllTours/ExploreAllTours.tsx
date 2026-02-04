"use client";

import dynamic from "next/dynamic";
import ExploreHero from "./components/ExploreHero";
import ToursList from "./components/ToursList";

/* --------- Dynamic Imports --------- */
const Header = dynamic(() => import("@/components/common/navbar"), {
  ssr: true,
});

const Footer = dynamic(() => import("@/components/common/footer"), {
  ssr: true,
});

/* --------- Component --------- */
export default function ExploreAllTours() {
  return (
    <main className="relative bg-neutral-light">
      <Header />

      {/* Hero Section */}
      <ExploreHero />

      {/* Tours Section */}
      <ToursList />

      <Footer />
    </main>
  );
}
