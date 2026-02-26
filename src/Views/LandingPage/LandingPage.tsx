import BelowFoldSections from "@/Views/LandingPage/components/BelowFoldSections";
import dynamic from "next/dynamic";

/* ---------------- Dynamic Imports (above-fold, SSR) ---------------- */

const Header = dynamic(() => import("@/components/common/navbar"), {
  ssr: true,
});

const Hero = dynamic(() => import("@/Views/LandingPage/components/hero"), {
  ssr: true, // LCP element — keep SSR for fast Lighthouse score
});

const About = dynamic(
  () => import("@/Views/LandingPage/components/AboutCompany"),
  { ssr: true },
);

const Tours = dynamic(() => import("@/Views/LandingPage/components/Tour"), {
  ssr: true,
});

const CTAPlanJourney = dynamic(
  () => import("@/components/molecules/CTA-PlanJourney"),
  { ssr: true },
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

      {/* Below-fold sections deferred via BelowFoldSections (Client Component with ssr:false) */}
      <BelowFoldSections />
    </main>
  );
}
