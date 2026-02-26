import ScrollProgressBarClient from "@/components/common/ScrollProgressBarClient";
import Providers from "@/lib/providers";
import type { Metadata } from "next";
import { Merriweather } from "next/font/google";
import "./globals.css";

// Only load Merriweather — it's the only font actively used via --font-merriweather CSS variable.
// Geist, Geist_Mono, Roboto_Slab were unused (body/heading fall back to Arial in globals.css).
const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["400", "700"], // 300 & 900 had minimal usage; trim to reduce font payload
  display: "swap",
});

export const metadata: Metadata = {
  title: "Know A Local",
  description: "Curated local travel experiences across Canada",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`
          ${merriweather.variable}
          antialiased
          min-h-screen
          overflow-y-scroll
          scroll-smooth
          bg-bg
          text-dark
        `}
      >
        <Providers>
          <ScrollProgressBarClient />
          {children}
        </Providers>
      </body>
    </html>
  );
}
