"use client";

import dynamic from "next/dynamic";
import { privacyPolicyData } from "./data/mock";

/* -------- Dynamic Imports -------- */

const Header = dynamic(() => import("@/components/common/navbar"), {
  ssr: true,
});

const PrivacyHero = dynamic(
  () => import("@/Views/PrivacyAndPolicy/components/PrivacyHero"),
  { ssr: false },
);

const PrivacyContent = dynamic(
  () => import("@/Views/PrivacyAndPolicy/components/PrivacyContent"),
  { ssr: false },
);

const Footer = dynamic(() => import("@/components/common/footer"), {
  ssr: true,
});

export default function PrivacyAndPolicy() {
  return (
    <main className="overflow-x-hidden">
      <Header />
      <PrivacyHero />
      <PrivacyContent data={privacyPolicyData} />
      <Footer />
    </main>
  );
}
