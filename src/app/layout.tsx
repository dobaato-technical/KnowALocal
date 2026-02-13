import ScrollProgressBar from "@/components/common/ScrollProgressBar";
import Providers from "@/lib/providers";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Merriweather, Roboto_Slab } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const robotoSlab = Roboto_Slab({
  variable: "--ff-heading",
  subsets: ["latin"],
  weight: "400",
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
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
          ${geistSans.variable}
          ${geistMono.variable}
          ${robotoSlab.variable}
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
          <ScrollProgressBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
