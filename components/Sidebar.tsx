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
  { href: "/contact", label: "צור קשר" },
];

export default function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/" onClick={() => setIsMobileOpen(false)} className="block text-center">
          <Image
            src="/sinbol.svg"
            alt="MA"
            width={72}
            height={72}
            className="w-16 h-16 mx-auto mb-3 rounded-xl"
            priority
          />
          <div className="text-white font-heading font-bold text-lg">עו״ד משה אמסלם</div>
          <div className="text-gold text-sm">מקרקעין והתחדשות עירונית</div>
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
                      ? "bg-white/10 text-white border-r-2 border-gold"
                      : "text-light-secondary hover:bg-white/5 hover:text-white hover:translate-x-1"
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
      <div className="p-6 border-t border-white/10">
        <div className="space-y-3 mb-6">
          <a
            href="tel:052-4337633"
            className="flex items-center gap-3 text-light-secondary hover:text-gold hover:translate-x-1 transition-all duration-300 text-sm"
          >
            <Phone size={16} />
            <span>052-4337633</span>
          </a>
          <a
            href="mailto:moshe@ams-law.com"
            className="flex items-center gap-3 text-light-secondary hover:text-gold hover:translate-x-1 transition-all duration-300 text-sm"
          >
            <Mail size={16} />
            <span>moshe@ams-law.com</span>
          </a>
        </div>

        {/* CTA Button */}
        <Link
          href="/contact"
          onClick={() => setIsMobileOpen(false)}
          className="block w-full rounded-lg bg-gold px-6 py-3 text-center font-semibold text-dark
                     transition-all duration-300 hover:bg-gold-light hover:-translate-y-0.5"
        >
          קביעת פגישה
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed right-0 top-0 h-screen w-72 bg-dark border-l border-white/10 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 right-0 left-0 h-16 bg-dark/95 backdrop-blur-md border-b border-white/10 z-50 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/sinbol.svg"
            alt="MA"
            width={40}
            height={40}
            className="h-10 w-10 rounded-lg"
            priority
          />
          <span className="text-white font-heading font-bold">עו״ד משה אמסלם</span>
        </Link>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="text-white p-2"
          aria-label={isMobileOpen ? "סגור תפריט" : "פתח תפריט"}
        >
          {isMobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 bg-black/60 z-40"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="md:hidden fixed right-0 top-0 h-screen w-72 bg-dark border-l border-white/10 z-50"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
