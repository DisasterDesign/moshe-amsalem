"use client";

import { useEffect, useRef, useState } from "react";
import { useGoogleReviews } from "@/lib/reviews";
import { STATS } from "@/config/site";

/**
 * Stat strip under the hero.
 *
 * Deliberately quiet - a light hairline bar, no icons. The numbers carry
 * themselves; an icon over each one only added noise.
 *
 * Deal counts come from `STATS` in config/site.ts (client-supplied); the Google
 * rating is live from the reviews endpoint. A `null` value renders as a visible
 * pending chip instead of an invented figure.
 */

type Stat = {
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

  return (
    <div className="flex flex-col items-center gap-1.5 px-4 py-5 text-center">
      {stat.value === null ? (
        <span className="pending-value" title="ממתין לנתון מהלקוח">
          {stat.pending}
        </span>
      ) : (
        <span className="font-heading text-2xl font-extrabold text-ink md:text-3xl">
          {count.toLocaleString("he-IL", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })}
          {stat.suffix}
        </span>
      )}
      <span className="text-xs text-ink-muted md:text-sm">{stat.label}</span>
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
      value: STATS.dealsClosed,
      pending: "",
      suffix: "+",
      label: "עסקאות שליוויתי",
    },
    {
      value: STATS.dealsValueMillions,
      pending: "",
      label: "מיליון ₪ שווי עסקאות מצטבר",
    },
    {
      value: rating,
      pending: "",
      decimals: 1,
      label: `דירוג גוגל · ${total} ביקורות`,
    },
  ];

  return (
    <section ref={ref} className="border-y border-line bg-cream" aria-label="נתוני המשרד">
      <div className="container-custom">
        <div className="grid grid-cols-1 sm:grid-cols-3 sm:divide-x sm:divide-x-reverse sm:divide-line">
          {stats.map((s) => (
            <StatTile key={s.label} stat={s} active={active} />
          ))}
        </div>
      </div>
    </section>
  );
}
