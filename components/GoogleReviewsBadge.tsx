"use client";

import { useEffect, useRef, useState } from "react";
import { Star, X } from "lucide-react";
import GoogleGlyph from "./GoogleGlyph";
import { useGoogleReviews } from "@/lib/reviews";

/**
 * Floating Google rating badge that expands into the live reviews.
 * Sits above the WhatsApp button in the bottom-left stack.
 */
export default function GoogleReviewsBadge() {
  const { rating, total, reviews, profileUrl } = useGoogleReviews();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    // Deferred so the click that opened the panel does not immediately close it.
    const id = setTimeout(() => document.addEventListener("mousedown", onClick), 0);

    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(id);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div ref={panelRef} className="contents">
      {open && (
        <div
          role="dialog"
          aria-label="ביקורות גוגל"
          style={{ bottom: "calc(10rem + var(--floating-offset, 0px))" }}
          className="fixed left-5 z-[55] w-[21rem] max-w-[calc(100vw-2.5rem)]
                     overflow-hidden rounded-2xl border border-line bg-white shadow-2xl shadow-dark/25"
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <div className="flex items-center gap-2.5">
              <GoogleGlyph />
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-heading text-lg font-bold text-ink">
                    {rating.toFixed(1)}
                  </span>
                  <span className="flex text-gold" aria-hidden="true">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} className="fill-current" />
                    ))}
                  </span>
                </div>
                <span className="text-xs text-ink-muted">{total} ביקורות בגוגל</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="סגירת ביקורות גוגל"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-cream-soft hover:text-ink"
            >
              <X size={17} />
            </button>
          </div>

          <ul className="max-h-72 space-y-3 overflow-y-auto px-4 py-3">
            {reviews.map((r) => (
              <li key={r.id} className="rounded-xl bg-cream-soft p-3">
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="flex text-gold" aria-hidden="true">
                    {[...Array(Math.round(r.rating))].map((_, i) => (
                      <Star key={i} size={11} className="fill-current" />
                    ))}
                  </span>
                  <span className="text-xs font-bold text-ink">{r.author}</span>
                  <span className="text-[11px] text-ink-muted">{r.relativeTime}</span>
                </div>
                <p className="line-clamp-4 text-[13px] leading-relaxed text-ink-soft">{r.text}</p>
              </li>
            ))}
          </ul>

          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block border-t border-line py-3 text-center text-sm font-semibold text-primary hover:bg-primary/5"
          >
            לכל הביקורות בגוגל
          </a>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={`דירוג ${rating.toFixed(1)} מתוך 5 בגוגל על סמך ${total} ביקורות. לחצו לפתיחה`}
        style={{ bottom: "calc(5.25rem + var(--floating-offset, 0px))" }}
        className="fixed left-4 z-[55] flex items-center gap-2 rounded-full
                   border border-line bg-white py-2 pl-3 pr-2.5 shadow-xl shadow-dark/15
                   sm:left-5 sm:gap-2.5 sm:py-2.5 sm:pl-4 sm:pr-3
                   transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl
                   focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
      >
        <GoogleGlyph className="h-6 w-6" />
        <span className="leading-tight text-right">
          <span className="flex items-center gap-1">
            <span className="font-heading text-sm font-bold text-ink">{rating.toFixed(1)}</span>
            <span className="flex text-gold" aria-hidden="true">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={10} className="fill-current" />
              ))}
            </span>
          </span>
          <span className="hidden text-[10px] text-ink-muted sm:block">{total} ביקורות</span>
        </span>
      </button>
    </div>
  );
}
