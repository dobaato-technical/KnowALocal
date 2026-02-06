"use client";

import dynamic from "next/dynamic";
import FAQ from "./components/FAQ";

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

const TestimonialSlider = dynamic(
  () => import("@/Views/LandingPage/components/Testimonial"),
  {
    ssr: true,
  },
);

/* ---------------- Page ---------------- */

export default function LandingPage() {
  return (
    <main className="relative">
      <Header />

      <section>
        <Hero />
      </section>

      {/* <section>
        <SearchBar />
      </section> */}

      <section className="section">
        <About />
      </section>

      <section>
        <CTAPlanJourney />
      </section>

      <section className="section">
        <Tours />
      </section>

      <section>
        <CTALocalExpert />
      </section>

      <section className="section">
        <FAQ />
      </section>

      <section>
        <TestimonialSlider />
      </section>

      {/* <section className="section">
        <CTANewsletter />
      </section> */}
      <section>
        <Footer />
      </section>
    </main>
  );
}
