"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Mail } from "lucide-react";

const navLinks = [
  { href: "/", label: "בית" },
  { href: "/about", label: "אודות" },
  { href: "/services", label: "שירותים" },
];

export default function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-dark-tertiary">
        <Link href="/" onClick={() => setIsMobileOpen(false)} className="block text-center">
          <Image
            src="/sinbol.svg"
            alt="MA"
            width={80}
            height={80}
            className="w-20 h-20 mx-auto mb-3"
            priority
          />
          <div className="text-light font-semibold text-lg">עו״ד משה אמסלם</div>
          <div className="text-primary text-sm">מקרקעין והתחדשות עירונית</div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6">
        <ul className="space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition-all duration-300 ease-out ${
                    isActive
                      ? "bg-primary/10 text-primary border-r-2 border-primary shadow-lg shadow-primary/10"
                      : "text-light-secondary hover:bg-dark-tertiary hover:text-light hover:translate-x-1 hover:shadow-md"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Contact Info */}
      <div className="p-6 border-t border-dark-tertiary">
        <div className="space-y-3 mb-6">
          <a
            href="tel:03-XXX-XXXX"
            className="flex items-center gap-3 text-light-tertiary hover:text-primary hover:translate-x-1 transition-all duration-300 text-sm"
          >
            <Phone size={16} className="hover:scale-110" />
            <span>03-XXX-XXXX</span>
          </a>
          <a
            href="mailto:office@ma-law.co.il"
            className="flex items-center gap-3 text-light-tertiary hover:text-primary hover:translate-x-1 transition-all duration-300 text-sm"
          >
            <Mail size={16} />
            <span>office@ma-law.co.il</span>
          </a>
        </div>

        {/* CTA Button */}
        <Link
          href="/contact"
          onClick={() => setIsMobileOpen(false)}
          className="btn-primary w-full text-center block"
        >
          צור קשר
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed right-0 top-0 h-screen w-72 bg-dark-secondary border-l border-dark-tertiary z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 right-0 left-0 h-16 bg-dark-secondary/95 backdrop-blur-md border-b border-dark-tertiary z-50 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/sinbol.svg"
            alt="MA"
            width={40}
            height={40}
            className="h-10 w-10"
            priority
          />
          <span className="text-light font-semibold">עו״ד משה אמסלם</span>
        </Link>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="text-light p-2"
          aria-label={isMobileOpen ? "סגור תפריט" : "פתח תפריט"}
        >
          {isMobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 bg-black/60 z-40"
              onClick={() => setIsMobileOpen(false)}
            />

            {/* Mobile Sidebar */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="md:hidden fixed right-0 top-0 h-screen w-72 bg-dark-secondary border-l border-dark-tertiary z-50"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
