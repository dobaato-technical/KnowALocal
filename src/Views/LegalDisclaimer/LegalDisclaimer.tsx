"use client";

import dynamic from "next/dynamic";
import { legalDisclaimerData } from "./data/mock";

/* -------- Dynamic Imports -------- */

const Header = dynamic(() => import("@/components/common/navbar"), {
  ssr: true,
});

const LegalDisclaimerHero = dynamic(
  () => import("@/Views/LegalDisclaimer/components/LegalDisclaimerHero"),
  { ssr: false },
);

const LegalDisclaimerContent = dynamic(
  () => import("@/Views/LegalDisclaimer/components/LegalDisclaimerContent"),
  { ssr: false },
);

const Footer = dynamic(() => import("@/components/common/footer"), {
  ssr: true,
});

export default function LegalDisclaimer() {
  return (
    <main className="overflow-x-hidden">
      <Header />
      <LegalDisclaimerHero />
      <LegalDisclaimerContent data={legalDisclaimerData} />
      <Footer />
    </main>
  );
}
