"use client";

import dynamic from "next/dynamic";

/* ---------------- Dynamic Imports ---------------- */

const Header = dynamic(() => import("@/components/common/navbar"), {
  ssr: true,
});

const Hero = dynamic(() => import("@/Views/LandingPage/components/hero"), {
  ssr: false,
});

const About = dynamic(
  () => import("@/Views/LandingPage/components/AboutCompany"),
  {
    ssr: false,
  },
);

const Tours = dynamic(() => import("@/Views/LandingPage/components/Tour"), {
  ssr: false,
});

const CTAPlanJourney = dynamic(
  () => import("@/components/molecules/CTA-PlanJourney"),
  { ssr: false },
);

const CTALocalExpert = dynamic(
  () => import("@/components/molecules/CTA-localexp"),
  { ssr: false },
);

const Footer = dynamic(() => import("@/components/common/footer"), {
  ssr: true,
});

/* ---------------- Page ---------------- */

export default function LandingPage() {
  return (
    <main className="relative">
      <Header />

      <section className="snap-start">
        <Hero />
      </section>

      <section className="snap-start  section ">
        <About />
      </section>

      <section className="snap-start ">
        <CTAPlanJourney />
      </section>

      <section className="snap-start  section ">
        <Tours />
      </section>

      <section className="snap-start  section ">
        <CTALocalExpert />
      </section>

      <section className="snap-start  section ">
        <Footer />
      </section>
    </main>
  );
}
