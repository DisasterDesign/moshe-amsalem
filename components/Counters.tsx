"use client";

import { useEffect, useRef, useState } from "react";
import { Building2, FileSignature, Star, Wallet } from "lucide-react";
import { useGoogleReviews } from "@/lib/reviews";
import { PENDING } from "@/config/site";

/**
 * Stat strip under the hero.
 *
 * Only the Google rating is a real number today - it comes from the live
 * reviews endpoint. The transaction counts are still with the client, so they
 * render as visible `[מספר - לקבל ממשה]` chips rather than invented figures.
 * Fill them in at `PENDING` in config/site.ts and they start counting up.
 */

type Stat = {
  icon: typeof Star;
  /** Numeric value, or null when still pending. */
  value: number | null;
  pending: string;
  suffix?: string;
  decimals?: number;
  label: string;
};

function useCountUp(target: number | null, decimals: number, active: boolean) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active || target === null) return;

    const reduced =
      typeof window !== "undefined" &&
      (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        document.documentElement.classList.contains("a11y-reduce-motion"));

    if (reduced) {
      setDisplay(target);
      return;
    }

    const duration = 1200;
    let raf = 0;
    let start: number | null = null;

    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      // easeOutCubic - fast start, gentle settle.
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Number((target * eased).toFixed(decimals)));
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, decimals, active]);

  return display;
}

function StatTile({ stat, active }: { stat: Stat; active: boolean }) {
  const decimals = stat.decimals ?? 0;
  const count = useCountUp(stat.value, decimals, active);
  const Icon = stat.icon;

  return (
    <div className="flex flex-col items-center gap-2 px-4 py-6 text-center">
      <Icon className="h-6 w-6 text-gold" aria-hidden="true" />
      {stat.value === null ? (
        <span className="pending-value" title="ממתין לנתון מהלקוח">
          {stat.pending}
        </span>
      ) : (
        <span className="font-heading text-3xl font-extrabold text-white md:text-4xl">
          {count.toLocaleString("he-IL", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })}
          {stat.suffix}
        </span>
      )}
      <span className="text-sm text-light-secondary">{stat.label}</span>
    </div>
  );
}

export default function Counters() {
  const { rating, total } = useGoogleReviews();
  const ref = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const stats: Stat[] = [
    {
      icon: FileSignature,
      value: null,
      pending: PENDING.dealsClosed,
      label: "עסקאות שלוויתי",
    },
    {
      icon: Wallet,
      value: null,
      pending: PENDING.dealsValueMillions,
      label: "מיליון ₪ שווי עסקאות מצטבר",
    },
    {
      icon: Star,
      value: rating,
      pending: "",
      decimals: 1,
      label: `דירוג גוגל · ${total} ביקורות`,
    },
    {
      icon: Building2,
      value: null,
      pending: PENDING.urbanRenewalProjects,
      label: "פרויקטי התחדשות עירונית",
    },
  ];

  return (
    <section ref={ref} className="bg-dark" aria-label="נתוני המשרד">
      <div className="container-custom">
        <div className="grid grid-cols-2 divide-x divide-x-reverse divide-white/10 lg:grid-cols-4">
          {stats.map((s) => (
            <StatTile key={s.label} stat={s} active={active} />
          ))}
        </div>
      </div>
    </section>
  );
}
