"use client";

import { getFeaturedTours } from "@/api/tours/tours";
import type { TourPreview } from "@/api/types";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";

interface FooterProps {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  description?: string;
  socialLinks?: Array<{
    icon: React.ComponentType<{ className?: string }>;
    href: string;
    label: string;
  }>;
  contactInfo?: {
    email: string;
    phone: string;
    address?: string;
  };
}

const defaultSocialLinks: FooterProps["socialLinks"] = [
  {
    icon: FaFacebook as React.ComponentType<{ className?: string }>,
    href: "#",
    label: "Facebook",
  },
  {
    icon: FaInstagram as React.ComponentType<{ className?: string }>,
    href: "https://www.instagram.com/knowalocal?igsh=ODVtY3JuM3NkMmJw&utm_source=qr",
    label: "Instagram",
  },
];

export default function Footer({
  logo = {
    url: "/",
    src: "/Logo/logo.webp",
    alt: "Know A Local Logo",
    title: "Know A Local",
  },
  description = "Discover authentic travel experiences across Canada, guided by local knowledge, nature, and care.",
  socialLinks = defaultSocialLinks,
  contactInfo = {
    email: "knowalocaltours@gmail.com",
    phone: "902-774-0710",
    address: "Yarmouth, Nova Scotia",
  },
}: FooterProps) {
  const [featuredTours, setFeaturedTours] = useState<TourPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedTours = async () => {
      try {
        const response = await getFeaturedTours();
        const tours = response.data || [];
        // Show first 4 featured tours
        setFeaturedTours(tours.slice(0, 4));
      } catch (error) {
        console.error("Failed to load featured tours:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedTours();
  }, []);
  return (
    <footer className="bg-primary text-bg mx-auto max-w-7xl py-8 md:py-10 mb-8 mt-8 rounded-2xl">
      <div className=" px-4 md:px-8">
        {/* Mobile Layout - No Grid */}
        <div className="md:hidden space-y-4">
          {/* Logo + Description on Left, Social Icons on Right */}
          <div className="grid grid-cols-2 gap-4 items-start">
            {/* Logo + Description on Left */}
            <div className="flex flex-col gap-4">
              <Link href={logo.url} className="inline-block w-fit">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={100}
                  height={100}
                  className="h-auto w-20 object-contain"
                />
              </Link>
              <p className="text-sm leading-relaxed text-bg/90">
                {description}
              </p>
            </div>

            {/* Social Icons on Right */}
            <div className="flex flex-col items-end justify-start pt-2">
              <ul className="flex flex-row items-center gap-2">
                {socialLinks &&
                  socialLinks.map((social, idx) => {
                    const IconComponent = social.icon;
                    return (
                      <li
                        key={idx}
                        className="text-bg hover:text-accent transition-all cursor-pointer hover:scale-125"
                      >
                        <a href={social.href} aria-label={social.label}>
                          <IconComponent className="size-7 text-bg hover:text-accent " />
                        </a>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>

          {/* Company and Support Center side by side */}
          <div className="grid grid-cols-2 gap-6">
            {/* Company Section */}
            <div>
              <h3 className="mb-4 font-heading text-sm font-semibold text-bg">
                Company
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="relative text-xs text-bg/80 hover:text-accent transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-1/2"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/explore-all-tours"
                    className="relative text-xs text-bg/80 hover:text-accent transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-1/2"
                  >
                    Tours
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="relative text-xs text-bg/80 hover:text-accent transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-1/2"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact-us"
                    className="relative text-xs text-bg/80 hover:text-accent transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-1/2"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support Center */}
            <div>
              <h3 className="mb-4 font-heading text-sm font-semibold text-bg">
                Support Center
              </h3>
              <div className="space-y-2 text-xs text-bg/80">
                <div>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="relative text-xs text-bg/80 hover:text-accent transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-1/2 truncate"
                  >
                    {contactInfo.email}
                  </a>
                </div>
                <div>
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="relative text-xs text-bg/80 hover:text-accent transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-1/2"
                  >
                    {contactInfo.phone}
                  </a>
                </div>
                {contactInfo.address && (
                  <div>
                    <p className="relative text-xs text-bg/80 hover:text-accent transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-1/3 truncate">
                      {contactInfo.address}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Legal Information and Payment Cards side by side */}
          <div className="grid grid-cols-2 gap-6">
            {/* Legal Information */}
            <div>
              <h3 className="mb-4 font-heading text-sm font-semibold text-bg">
                Legal Information
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/privacy-policy"
                    className="relative text-xs text-bg/80 hover:text-accent transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-1/2"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-conditions"
                    className="relative text-xs text-bg/80 hover:text-accent transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-1/2"
                  >
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal-disclaimer"
                    className="relative text-xs text-bg/80 hover:text-accent transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-1/2"
                  >
                    Legal Disclaimer
                  </Link>
                </li>
              </ul>
            </div>

            {/* Payment Cards Section - Mobile */}
            <div>
              <h3 className="mb-3 font-heading text-sm font-semibold text-bg">
                We Accept
              </h3>
              <div className="flex gap-3 items-center flex-wrap">
                <Image
                  src="/payment-cards/visa.png"
                  alt="Visa"
                  width={40}
                  height={25}
                  className="h-6 w-auto object-contain"
                />
                <Image
                  src="/payment-cards/master-card.png"
                  alt="Mastercard"
                  width={40}
                  height={25}
                  className="h-6 w-auto object-contain"
                />
                <Image
                  src="/payment-cards/amex.png"
                  alt="American Express"
                  width={40}
                  height={25}
                  className="h-6 w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden md:grid grid-cols-5 gap-8 md:gap-12 lg:gap-16">
          {/* Desktop: Logo + Description + Social */}
          <div className="hidden md:flex flex-col gap-4">
            <Link href={logo.url} className="inline-block w-fit">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={100}
                height={100}
                className="h-auto w-20 object-contain"
              />
            </Link>
            <p className="text-sm leading-relaxed text-bg/90">{description}</p>
            <ul className="flex items-center gap-4">
              {socialLinks &&
                socialLinks.map((social, idx) => {
                  const IconComponent = social.icon;
                  return (
                    <li
                      key={idx}
                      className="text-bg hover:text-accent transition-all cursor-pointer hover:scale-125"
                    >
                      <a href={social.href} aria-label={social.label}>
                        <IconComponent className="size-7 text-bg hover:text-accent " />
                      </a>
                    </li>
                  );
                })}
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="hidden md:block mb-4 font-heading text-lg font-semibold text-bg">
              Company
            </h3>
            <ul className="hidden md:block space-y-3">
              <li>
                <Link
                  href="/about"
                  className="relative text-sm text-bg/80 hover:text-accent transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-1/2"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/explore-all-tours"
                  className="relative text-sm text-bg/80 hover:text-accent transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-1/2"
                >
                  Tours
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="relative text-sm text-bg/80 hover:text-accent transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-1/2"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className="relative text-sm text-bg/80 hover:text-accent transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-1/2"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Featured Tours Section */}
          <div>
            <h3 className="hidden md:block mb-4 font-heading text-lg font-semibold text-bg">
              Featured Tours
            </h3>
            <ul className="hidden md:block space-y-3">
              {isLoading ? (
                <li className="text-sm text-bg/60">Loading tours...</li>
              ) : featuredTours.length > 0 ? (
                featuredTours.map((tour) => (
                  <li key={tour._id}>
                    <Link
                      href={`/tour-details/${tour.slug.current}`}
                      className="relative text-sm text-bg/80 hover:text-accent transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-1/2"
                    >
                      {tour.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-sm text-bg/60">No featured tours</li>
              )}
            </ul>
          </div>

          {/* Support Center */}
          <div>
            <h3 className="hidden md:block mb-4 font-heading text-lg font-semibold text-bg">
              Support Center
            </h3>
            <div className="hidden md:block space-y-3 text-sm text-bg/80">
              <div>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="relative text-sm text-bg/80 hover:text-accent transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-1/2"
                >
                  {contactInfo.email}
                </a>
              </div>
              <div>
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="relative text-sm text-bg/80 hover:text-accent transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-1/2"
                >
                  {contactInfo.phone}
                </a>
              </div>
              {contactInfo.address && (
                <div>
                  <p className="relative text-sm text-bg/80 hover:text-accent transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-1/3">
                    {contactInfo.address}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Legal Information with Image */}
          <div className="flex flex-col gap-3">
            <div>
              <h3 className="hidden md:block mb-4 font-heading text-lg font-semibold text-bg">
                Legal Information
              </h3>
              <ul className="hidden md:block space-y-3">
                <li>
                  <Link
                    href="/privacy-policy"
                    className="relative text-sm text-bg/80 hover:text-accent transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-1/2"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-conditions"
                    className="relative text-sm text-bg/80 hover:text-accent transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-1/2"
                  >
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal-disclaimer"
                    className="relative text-sm text-bg/80 hover:text-accent transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-1/2"
                  >
                    Legal Disclaimer
                  </Link>
                </li>
              </ul>
            </div>
            {/* Payment Cards Section */}
            <div>
              <h3 className="text-sm md:text-base mt-12 pl-8 font-semibold text-bg mb-4">
                We Accept
              </h3>
              <div className="flex gap-2 items-center flex-wrap">
                <Image
                  src="/payment-cards/visa.png"
                  alt="Visa"
                  width={48}
                  height={32}
                  className="h-8 w-auto object-contain"
                />
                <Image
                  src="/payment-cards/master-card.png"
                  alt="Mastercard"
                  width={48}
                  height={32}
                  className="h-8 w-auto object-contain"
                />
                <Image
                  src="/payment-cards/amex.png"
                  alt="American Express"
                  width={48}
                  height={32}
                  className="h-8 w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Copyright */}
        <div className="mt-2 md:mt-4 border-t border-bg/20 pt-2 md:pt-4">
          <p className="text-center text-xs text-bg/70 flex items-center justify-center gap-2 flex-wrap">
            <span>
              © {new Date().getFullYear()} Know A Local. All rights reserved.
            </span>
            <span>|</span>
            <span className="text-xs text-bg/70">Crafted by</span>
            <Link
              href="https://dobaato.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center transition-all cursor-pointer hover:opacity-100"
            >
              <Image
                src="/Logo/Final_Black-nobg.png"
                alt="Dobaato"
                width={100}
                height={34}
                className="h-5 w-auto object-contain opacity-70"
              />
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
