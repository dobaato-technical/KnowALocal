import dynamic from "next/dynamic";
import FAQ from "./components/FAQ";

/* ---------------- Dynamic Imports ---------------- */

const Header = dynamic(() => import("@/components/common/navbar"), {
  ssr: true,
});

const Hero = dynamic(() => import("@/Views/LandingPage/components/hero"), {
  ssr: true, // LCP element - must SSR for fast Lighthouse score
});

const About = dynamic(
  () => import("@/Views/LandingPage/components/AboutCompany"),
  {
    ssr: true,
  },
);

const Tours = dynamic(() => import("@/Views/LandingPage/components/Tour"), {
  ssr: true,
});

const CTAPlanJourney = dynamic(
  () => import("@/components/molecules/CTA-PlanJourney"),
  { ssr: true },
);

const CTALocalExpert = dynamic(
  () => import("@/components/molecules/CTA-localexp"),
  { ssr: true },
);

const Footer = dynamic(() => import("@/components/common/footer"), {
  ssr: true,
});

const ParnterCompanies = dynamic(
  () => import("@/Views/LandingPage/components/ParnterCompanies"),
  {
    ssr: true,
  },
);

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

      <section id="about" className="section scroll-mt-24">
        <About />
      </section>

      <section>
        <CTAPlanJourney />
      </section>

      <section id="tours" className="section scroll-mt-24">
        <Tours />
      </section>

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

      {/* <section className="section">
        <CTANewsletter />
      </section> */}

      <section>
        <Footer />
      </section>
    </main>
  );
}
