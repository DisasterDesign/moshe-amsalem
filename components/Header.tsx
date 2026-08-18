"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { navLinks } from "@/config/nav";
import { siteConfig } from "@/config/site";

/**
 * Sticky full-width top header. Replaces the fixed right-hand sidebar: the
 * sidebar ate 288px of every viewport and pushed the content off-centre, and it
 * had no room to grow as the site gained pages.
 *
 * Compresses on scroll (h-24 -> h-16) and keeps the phone number and the
 * meeting CTA reachable at every scroll position.
 */
export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileSubOpen, setMobileSubOpen] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Route change closes everything.
  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
    setMobileSubOpen(null);
  }, [pathname]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenDropdown(null);
      setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  const openNow = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(label);
  };

  // Small grace period so the pointer can travel from the trigger to the panel.
  const closeSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 120);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-white/10 bg-dark/95 shadow-lg shadow-dark/20 backdrop-blur-md"
          : "border-transparent bg-dark"
      }`}
    >
      <div className="container-custom">
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            scrolled ? "h-16" : "h-20 md:h-24"
          }`}
        >
          {/* Brand - right in RTL */}
          <Link href="/" className="flex flex-shrink-0 items-center gap-3" aria-label="לעמוד הבית">
            <Image
              src="/sinbol.svg"
              alt=""
              width={56}
              height={56}
              priority
              className={`rounded-lg transition-all duration-300 ${
                scrolled ? "h-9 w-9" : "h-11 w-11 md:h-12 md:w-12"
              }`}
            />
            <span className="leading-tight">
              <span className="block font-heading font-bold text-white md:text-lg">
                {siteConfig.name}
              </span>
              <span
                className={`block text-gold transition-all duration-300 ${
                  scrolled ? "hidden" : "hidden text-xs sm:block"
                }`}
              >
                {siteConfig.role}
              </span>
            </span>
          </Link>

          {/* Desktop nav - centre */}
          <nav aria-label="ניווט ראשי" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);

                if (!link.children) {
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        className={`relative rounded-lg px-3 py-2 text-[15px] transition-colors duration-200 ${
                          active ? "text-gold" : "text-light-secondary hover:text-white"
                        }`}
                      >
                        {link.label}
                        {active && (
                          <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gold" />
                        )}
                      </Link>
                    </li>
                  );
                }

                const open = openDropdown === link.label;
                return (
                  <li
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => openNow(link.label)}
                    onMouseLeave={closeSoon}
                  >
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-haspopup="true"
                      onClick={() => setOpenDropdown(open ? null : link.label)}
                      className={`flex items-center gap-1 rounded-lg px-3 py-2 text-[15px] transition-colors duration-200 ${
                        active ? "text-gold" : "text-light-secondary hover:text-white"
                      }`}
                    >
                      {link.label}
                      <ChevronDown
                        size={15}
                        className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                      />
                    </button>

                    <div
                      className={`absolute right-0 top-full w-72 pt-3 transition-all duration-200 ${
                        open
                          ? "pointer-events-auto translate-y-0 opacity-100"
                          : "pointer-events-none -translate-y-1 opacity-0"
                      }`}
                    >
                      <ul className="overflow-hidden rounded-xl border border-line bg-white py-2 shadow-2xl shadow-dark/25">
                        <li>
                          <Link
                            href={link.href}
                            className="block border-b border-line px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5"
                          >
                            כל תחומי העיסוק
                          </Link>
                        </li>
                        {link.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className="block px-4 py-2.5 text-sm text-ink-soft transition-colors hover:bg-primary/5 hover:text-primary"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Actions - left in RTL */}
          <div className="flex items-center gap-2 md:gap-3">
            <a
              href={`tel:${siteConfig.phone}`}
              className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-light-secondary transition-colors hover:text-gold md:flex"
            >
              <Phone size={16} />
              <span dir="ltr">{siteConfig.phone}</span>
            </a>

            <Link
              href="/contact"
              className="hidden rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-dark transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-light sm:block"
            >
              קביעת פגישה
            </Link>

            <a
              href={`tel:${siteConfig.phone}`}
              aria-label={`חיוג ל${siteConfig.phone}`}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white md:hidden"
            >
              <Phone size={18} />
            </a>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? "סגירת התפריט" : "פתיחת התפריט"}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-white lg:hidden"
            >
              {mobileOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        className={`overflow-hidden border-t border-white/10 bg-dark transition-[max-height] duration-300 lg:hidden ${
          mobileOpen ? "max-h-[80vh] overflow-y-auto" : "max-h-0"
        }`}
      >
        <nav aria-label="ניווט נייד" className="container-custom py-4">
          <ul className="space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);

              if (!link.children) {
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`block rounded-lg px-4 py-3 transition-colors ${
                        active ? "bg-white/10 text-gold" : "text-light-secondary hover:bg-white/5"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              }

              const subOpen = mobileSubOpen === link.label;
              return (
                <li key={link.href}>
                  <div className="flex items-center">
                    <Link
                      href={link.href}
                      className={`flex-1 rounded-lg px-4 py-3 transition-colors ${
                        active ? "bg-white/10 text-gold" : "text-light-secondary hover:bg-white/5"
                      }`}
                    >
                      {link.label}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setMobileSubOpen(subOpen ? null : link.label)}
                      aria-expanded={subOpen}
                      aria-label={subOpen ? "סגירת תת-תפריט" : "פתיחת תת-תפריט"}
                      className="flex h-11 w-11 items-center justify-center rounded-lg text-light-secondary"
                    >
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-200 ${subOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  </div>
                  <ul
                    className={`overflow-hidden transition-[max-height] duration-300 ${
                      subOpen ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    {link.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="block rounded-lg py-2.5 pr-8 text-sm text-light-tertiary transition-colors hover:text-white"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
            <a
              href={`tel:${siteConfig.phone}`}
              className="flex items-center gap-3 px-4 text-light-secondary"
            >
              <Phone size={16} />
              <span dir="ltr">{siteConfig.phone}</span>
            </a>
            <Link
              href="/contact"
              className="block rounded-lg bg-gold px-6 py-3 text-center font-semibold text-dark"
            >
              קביעת פגישה
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
