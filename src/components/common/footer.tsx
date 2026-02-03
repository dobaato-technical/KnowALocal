"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const tours = [
  { name: "About", href: "#about" },
  { name: "Tours", href: "#tours" },
  { name: "FAQ", href: "#faq" },
  { name: "Home", href: "#hero" },
];

export default function Footer() {
  return (
    <footer className="bg-dark text-bg rounded-2xl">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
          {/* Left: Logo + Description */}
          <div className="col-span-2 md:col-span-1">
            <Image
              src="/Logo/logo-removebg-preview.png"
              alt="Know A Local Logo"
              width={120}
              height={120}
              className="object-contain"
            />

            <p className="mt-4 text-sm leading-relaxed max-w-sm">
              Discover authentic travel experiences across Canada, guided by
              local knowledge, nature, and care.
            </p>
          </div>

          {/* Middle: Navigation */}
          <div>
            <h4 className="font-heading text-lg mb-6">Navigation</h4>

            <ul className="space-y-4">
              {tours.map((tour) => (
                <motion.li
                  key={tour.name}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={tour.href}
                    className="
                      relative text-sm text-bg
                      after:absolute after:left-0 after:-bottom-1
                      after:h-[2px] after:w-0 after:bg-accent
                      after:transition-all after:duration-300
                      hover:after:w-full
                    "
                  >
                    {tour.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Right: Get in Touch */}
          <div>
            <h4 className="font-heading text-lg mb-6">Get In Touch</h4>

            <div className="space-y-4 text-sm">
              <p>Email: hello@knowitall.com</p>
              <p>Phone: +1 902 000 0000</p>
              <p>Location: Nova Scotia, Canada</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-6 border-t border-bg/20 text-sm text-center">
          © {new Date().getFullYear()} Know A Local. | Crafted by Dobaato |
        </div>
      </div>
    </footer>
  );
}
