"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

/**
 * Cookie consent bar.
 *
 * The site currently sets no analytics or advertising cookies - only functional
 * storage (accessibility preferences and this choice) plus what the embedded
 * Google Map sets. The banner records an explicit decision anyway, so the day a
 * pixel or GA4 is added it can be gated on `hasAnalyticsConsent()` instead of
 * retrofitting consent after the fact.
 *
 * Non-essential is off until accepted - never opt-out by default.
 */

const STORAGE_KEY = "cookie-consent";

export type ConsentValue = "all" | "essential";

export function hasAnalyticsConsent() {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === "all";
  } catch {
    return false;
  }
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      /* storage blocked - do not nag on every navigation */
    }
  }, []);

  // The banner is a full-width bar pinned to the bottom, so it would sit on top
  // of the WhatsApp and accessibility buttons. Publish its height as a custom
  // property and let those elements offset themselves by it.
  useEffect(() => {
    const root = document.documentElement;
    if (!visible) {
      root.style.removeProperty("--floating-offset");
      return;
    }
    const measure = () => {
      const h = barRef.current?.offsetHeight ?? 0;
      root.style.setProperty("--floating-offset", `${h}px`);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
      root.style.removeProperty("--floating-offset");
    };
  }, [visible]);

  const decide = (value: ConsentValue) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* choice still applies for this session */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      ref={barRef}
      role="dialog"
      aria-label="הודעה על שימוש בעוגיות"
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-white/10 bg-dark/97 backdrop-blur-md"
    >
      <div className="container-custom flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="flex items-start gap-3">
          <Cookie size={20} className="mt-0.5 flex-shrink-0 text-gold" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-light-secondary">
            האתר עושה שימוש בעוגיות הכרחיות לתפעולו ולשמירת העדפות הנגישות שלכם.
            מידע נוסף במסמך{" "}
            <Link
              href="/legal/privacy"
              className="font-medium text-gold underline underline-offset-2"
            >
              מדיניות הפרטיות
            </Link>
            .
          </p>
        </div>

        <div className="flex flex-shrink-0 gap-3">
          <button
            type="button"
            onClick={() => decide("essential")}
            className="flex-1 rounded-lg border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 md:flex-none"
          >
            הכרחיות בלבד
          </button>
          <button
            type="button"
            onClick={() => decide("all")}
            className="flex-1 rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-dark transition-colors hover:bg-gold-light md:flex-none"
          >
            אישור
          </button>
        </div>
      </div>
    </div>
  );
}
