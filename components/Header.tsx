"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "בית" },
  { href: "/about", label: "אודות" },
  { href: "/services", label: "שירותים" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-dark/90 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.jpg"
              alt="עו״ד משה אמסלם"
              width={160}
              height={50}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-light hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/contact" className="btn-primary">
              צור קשר
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-light p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "סגור תפריט" : "פתח תפריט"}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? "max-h-80 pb-6" : "max-h-0"
          }`}
        >
          <div className="flex flex-col gap-4 pt-4 border-t border-dark-tertiary">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-light hover:text-primary transition-colors duration-200 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="btn-primary text-center mt-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              צור קשר
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
