"use client";

// This Client Component wrapper lets us use ssr: false for below-fold sections,
// which would be a build error if declared directly in the Server Component (LandingPage.tsx).
import dynamic from "next/dynamic";

const CTALocalExpert = dynamic(
  () => import("@/components/molecules/CTA-localexp"),
  { ssr: false },
);

const ParnterCompanies = dynamic(
  () => import("@/Views/LandingPage/components/ParnterCompanies"),
  { ssr: false },
);

const TestimonialSlider = dynamic(
  () => import("@/Views/LandingPage/components/Testimonial"),
  { ssr: false },
);

const FAQ = dynamic(() => import("@/Views/LandingPage/components/FAQ"), {
  ssr: false,
});

const Footer = dynamic(() => import("@/components/common/footer"), {
  ssr: false,
});

export default function BelowFoldSections() {
  return (
    <>
      <section>
        <CTALocalExpert />
      </section>

      <section>
        <ParnterCompanies />
      </section>

      <section id="faq" className="section scroll-mt-24">
        <FAQ />
      </section>

      <section>
        <TestimonialSlider />
      </section>

      <section>
        <Footer />
      </section>
    </>
  );
}
