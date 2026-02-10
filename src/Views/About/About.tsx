"use client";

import Footer from "@/components/common/footer";
import Header from "@/components/common/navbar";
import AboutHero from "./components/AboutHero";
import AboutUs from "./components/AboutUs";
import CtaSection from "./components/CtaSection";
import FoundersStory from "./components/FoundersStory";
import OurImpact from "./components/OurImpact";
import OurValues from "./components/OurValues";
import WhyChooseUs from "./components/WhyChooseUs";

export default function About() {
  return (
    <main>
      <Header />
      <AboutHero />
      <AboutUs />
      <FoundersStory />
      <OurValues />
      <CtaSection />
      <WhyChooseUs />
      <OurImpact />
      <Footer />
    </main>
  );
}
