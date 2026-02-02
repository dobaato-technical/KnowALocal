"use client";

import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "../ui/Button";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Tours", href: "/tours" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-2">
      <motion.div
        className={`
          mx-auto flex items-center justify-between gap-8 rounded-full px-6 py-2
          transition-colors duration-300
          ${
            isScrolled
              ? "bg-bg/80 backdrop-blur-xl border border-dark/10 shadow-lg max-w-6xl"
              : "bg-transparent max-w-full"
          }
        `}
        animate={{
          maxWidth: isScrolled ? "72rem" : "100%",
        }}
        transition={{ type: "spring", stiffness: 120, damping: 22 }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/Logo/Ghumfare_Logo-removebg.png"
            alt="Ghumfare"
            width={72}
            height={72}
            className="object-contain"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`
                relative font-body text-sm transition-colors duration-200
                ${isScrolled ? "text-primary" : "text-bg"}
                hover:text-accent
                after:absolute after:left-0 after:-bottom-1
                after:h-[2px] after:w-0 after:bg-accent
                after:transition-all after:duration-300
                hover:after:w-full
              `}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:block">
          <Button variant="primary">Book a Tour</Button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen((v) => !v)}
          className={`md:hidden p-2 ${isScrolled ? "text-primary" : "text-bg"}`}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </motion.div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden mt-2 mx-4 rounded-xl bg-bg shadow-lg border border-dark/10"
        >
          <div className="flex flex-col p-6 gap-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-body text-sm text-primary hover:text-accent transition-colors"
              >
                {item.label}
              </Link>
            ))}

            <Button variant="primary" className="mt-4">
              Book a Tour
            </Button>
          </div>
        </motion.nav>
      )}
    </header>
  );
}
