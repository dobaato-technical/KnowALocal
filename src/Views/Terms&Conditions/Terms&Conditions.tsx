"use client";

import dynamic from "next/dynamic";
import { termsAndConditionsData } from "./data/mock";

/* -------- Dynamic Imports -------- */

const Header = dynamic(() => import("@/components/common/navbar"), {
  ssr: true,
});

const TCHero = dynamic(
  () => import("@/Views/Terms&Conditions/components/TCHero"),
  {
    ssr: false,
  },
);

const TCContent = dynamic(
  () => import("@/Views/Terms&Conditions/components/TCContent"),
  {
    ssr: false,
  },
);

const Footer = dynamic(() => import("@/components/common/footer"), {
  ssr: true,
});

export default function TermsAndConditions() {
  return (
    <main className="overflow-x-hidden">
      <Header />
      <TCHero />
      <TCContent data={termsAndConditionsData} />
      <Footer />
    </main>
  );
}
