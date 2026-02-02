"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const tours = [
  { name: "Cape Forchu", href: "/tours/cape-forchu" },
  { name: "Smuggler Cove", href: "/tours/smuggler-cove" },
  { name: "Brier Island", href: "/tours/brier-island" },
  { name: "Lake Adventures", href: "/tours/lake-adventures" },
];

export default function Footer() {
  return (
    <footer className="bg-dark text-bg mt-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Left: Logo + Description */}
          <div>
            <Image
              src="/Logo/logo-removebg-preview.png"
              alt="Ghumfare"
              width={120}
              height={120}
              className="object-contain"
            />

            <p className="mt-4 text-sm leading-relaxed max-w-sm">
              Discover authentic travel experiences across Canada, guided by
              local knowledge, nature, and care.
            </p>
          </div>

          {/* Middle: Tours */}
          <div>
            <h4 className="font-heading text-lg mb-6">Tours</h4>

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
                      relative text-sm
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
          © {new Date().getFullYear()} Know A Local. All rights reserved.
          @Dobaato
        </div>
      </div>
    </footer>
  );
}
