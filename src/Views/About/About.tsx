"use client";

import Footer from "@/components/common/footer";
import Header from "@/components/common/navbar";
import CTAPlanJourney from "@/components/molecules/CTA-PlanJourney";
import AboutHero from "./components/AboutHero";
import CtaSection from "./components/CtaSection";
import FoundersStory from "./components/FoundersStory";
import OurImpact from "./components/OurImpact";
import OurValues from "./components/OurValues";
import Testimonials from "./components/Testimonials";
import WhyChooseUs from "./components/WhyChooseUs";

export default function About() {
  return (
    <main>
      <Header />
      <AboutHero />
      <FoundersStory />
      <OurValues />
      <CTAPlanJourney />
      <WhyChooseUs />
      <OurImpact />
      <Testimonials />
      <CtaSection />
      <Footer />
    </main>
  );
}
