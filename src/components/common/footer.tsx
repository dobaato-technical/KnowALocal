"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
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
    href: "#",
    label: "Instagram",
  },
];

export default function Footer({
  logo = {
    url: "/",
    src: "/Logo/logo-removebg-preview.png",
    alt: "Know A Local Logo",
    title: "Know A Local",
  },
  description = "Discover authentic travel experiences across Canada, guided by local knowledge, nature, and care.",
  socialLinks = defaultSocialLinks,
  contactInfo = {
    email: "Knowalocaltours@gmail.com",
    phone: "902-774-0710",
    address: "Yarmouth, Nova Scotia",
  },
}: FooterProps) {
  return (
    <footer className="bg-primary text-bg mx-auto max-w-7xl py-12 md:py-16 mb-8 rounded-2xl">
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
                    href="#about"
                    className="relative text-xs text-bg/80 hover:text-accent transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-1/2"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#tours"
                    className="relative text-xs text-bg/80 hover:text-accent transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-1/2"
                  >
                    Tours
                  </Link>
                </li>
                <li>
                  <Link
                    href="#hero"
                    className="relative text-xs text-bg/80 hover:text-accent transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-1/2"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="#faq"
                    className="relative text-xs text-bg/80 hover:text-accent transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-1/2"
                  >
                    FAQ
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
                  href="/terms-and-conditions"
                  className="relative text-xs text-bg/80 hover:text-accent transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-1/2"
                >
                  Terms and Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden md:grid grid-cols-4 gap-8 md:gap-12 lg:gap-16">
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
                  href="#about"
                  className="relative text-sm text-bg/80 hover:text-accent transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-1/2"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#tours"
                  className="relative text-sm text-bg/80 hover:text-accent transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-1/2"
                >
                  Tours
                </Link>
              </li>
              <li>
                <Link
                  href="#hero"
                  className="relative text-sm text-bg/80 hover:text-accent transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-1/2"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="#faq"
                  className="relative text-sm text-bg/80 hover:text-accent transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-1/2"
                >
                  FAQ
                </Link>
              </li>
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

          {/* Legal Information */}
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
                  href="/terms-and-conditions"
                  className="relative text-sm text-bg/80 hover:text-accent transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-1/2"
                >
                  Terms and Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Copyright */}
        <div className="mt-4 md:mt-8 border-t border-bg/20 pt-3 md:pt-6">
          <p className="text-center text-xs text-bg/70">
            © {new Date().getFullYear()} Know A Local. All rights reserved.
            <span className="ml-2">
              |
              <Link
                href="https://dobaato.com"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-center text-xs text-bg/70 hover:text-accent transition-all cursor-pointer hover:scale-125"
              >
                Crafted by Dobaato
              </Link>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
