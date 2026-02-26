"use client";

import { motion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "../ui/button";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Tours", href: "/explore-all-tours" },
  { label: "FAQ", href: "/#faq" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Set initial state based on current scroll position
    setIsScrolled(window.scrollY > 40);

    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0  z-50 px-2 md:px-8 py-1 md:py-2">
      <motion.div
        className={`
          mx-auto flex items-center justify-between gap-4 md:gap-8 rounded-2xl px-3 md:px-6 py-1.5 md:py-2
          transition-colors duration-300
          ${
            isScrolled
              ? "bg-bg/50 backdrop-blur-xl border border-dark/10 shadow-lg max-w-[78rem]"
              : "bg-transparent max-w-full"
          }
        `}
        animate={{
          maxWidth: isScrolled ? "78rem" : "100%",
        }}
        transition={{ type: "spring", stiffness: 120, damping: 22 }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <Image
            src="/Logo/logo.webp"
            alt="Know A Local Logo"
            width={100}
            height={100}
            className="object-contain w-16 h-16 md:w-24 md:h-24"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-12">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`
                relative font-body text-lg transition-colors duration-200
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
        <div className="hidden md:flex items-center gap-6">
          <motion.div
            whileHover="hover"
            initial="initial"
            className="inline-block"
          >
            <Link href="/contact-us">
              <Button variant="primary" className="flex items-center gap-2">
                <motion.div
                  variants={{
                    initial: { rotate: 0 },
                    hover: { rotate: 15 },
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <Phone size={20} />
                </motion.div>
                Get In Touch
              </Button>
            </Link>
          </motion.div>
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

            <Link href="/contact-us" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full">
                Book a Tour
              </Button>
            </Link>
          </div>
        </motion.nav>
      )}
    </header>
  );
}
