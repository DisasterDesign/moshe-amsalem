"use client";

import { useEffect, useRef, useState } from "react";
import { Accessibility, RotateCcw, X } from "lucide-react";
import Link from "next/link";

/**
 * Adapted from the canonical `a11y-widget` primitive.
 * Deviations (logged in DECISIONS.md): the primitive's `brand-*` classes were
 * remapped to this project's tokens, the emoji trigger was replaced with an SVG
 * icon (the brief bans emoji site-wide), and readable-font / highlight-links /
 * big-cursor toggles were added for a fuller IS 5568 AA control set.
 */

type State = {
  textSize: "default" | "large" | "larger";
  highContrast: boolean;
  reduceMotion: boolean;
  readableFont: boolean;
  highlightLinks: boolean;
  bigCursor: boolean;
};

const DEFAULT: State = {
  textSize: "default",
  highContrast: false,
  reduceMotion: false,
  readableFont: false,
  highlightLinks: false,
  bigCursor: false,
};

const STORAGE_KEY = "a11y-prefs";

function applyState(state: State) {
  const html = document.documentElement;
  html.classList.toggle("a11y-large-text", state.textSize === "large");
  html.classList.toggle("a11y-larger-text", state.textSize === "larger");
  html.classList.toggle("a11y-high-contrast", state.highContrast);
  html.classList.toggle("a11y-reduce-motion", state.reduceMotion);
  html.classList.toggle("a11y-readable-font", state.readableFont);
  html.classList.toggle("a11y-highlight-links", state.highlightLinks);
  html.classList.toggle("a11y-big-cursor", state.bigCursor);
}

const TOGGLES: { key: keyof State; label: string }[] = [
  { key: "highContrast", label: "ניגודיות גבוהה" },
  { key: "readableFont", label: "גופן קריא" },
  { key: "highlightLinks", label: "הדגשת קישורים" },
  { key: "reduceMotion", label: "עצירת אנימציות" },
  { key: "bigCursor", label: "סמן עכבר גדול" },
];

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<State>(DEFAULT);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: State = { ...DEFAULT, ...JSON.parse(raw) };
        setState(parsed);
        applyState(parsed);
      }
    } catch {
      /* first visit, or storage blocked */
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    // Close on outside click too, so this panel and the reviews panel can never
    // both be open and stacked on top of each other on a narrow screen.
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const id = setTimeout(() => document.addEventListener("mousedown", onClick), 0);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(id);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const update = (patch: Partial<State>) => {
    setState((prev) => {
      const next = { ...prev, ...patch };
      applyState(next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* storage blocked - the change still applies for this session */
      }
      return next;
    });
  };

  const reset = () => {
    setState(DEFAULT);
    applyState(DEFAULT);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* nothing to clear */
    }
  };

  return (
    <div ref={rootRef} className="contents">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="פתיחת תפריט נגישות"
        aria-expanded={open}
        aria-controls="a11y-panel"
        style={{ bottom: "calc(1.25rem + var(--floating-offset, 0px))" }}
        className="fixed right-5 z-[60] flex h-12 w-12 items-center justify-center
                   rounded-full bg-dark text-white shadow-xl shadow-dark/25
                   transition-all duration-300 hover:bg-primary hover:-translate-y-0.5
                   focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2"
      >
        <Accessibility size={24} aria-hidden="true" />
      </button>

      {open && (
        <div
          id="a11y-panel"
          role="dialog"
          aria-label="הגדרות נגישות"
          aria-modal="false"
          style={{
            bottom: "calc(5rem + var(--floating-offset, 0px))",
            maxHeight: "calc(100dvh - 7rem - var(--floating-offset, 0px))",
          }}
          className="fixed right-5 z-[60] w-[19rem] max-w-[calc(100vw-2.5rem)] overflow-y-auto
                     rounded-2xl border border-line bg-white p-5 shadow-2xl shadow-dark/25"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold text-ink">נגישות</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="סגירת תפריט נגישות"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-cream-soft hover:text-ink"
            >
              <X size={18} />
            </button>
          </div>

          <fieldset className="mb-4">
            <legend className="mb-2 text-sm font-medium text-ink">גודל טקסט</legend>
            <div className="flex gap-2">
              {(
                [
                  { v: "default", label: "רגיל" },
                  { v: "large", label: "גדול" },
                  { v: "larger", label: "גדול מאוד" },
                ] as const
              ).map((o) => (
                <button
                  key={o.v}
                  type="button"
                  onClick={() => update({ textSize: o.v })}
                  aria-pressed={state.textSize === o.v}
                  className={`flex-1 rounded-lg border px-2 py-2 text-xs transition-colors ${
                    state.textSize === o.v
                      ? "border-primary bg-primary/10 font-semibold text-primary"
                      : "border-line text-ink-soft hover:border-primary/40"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="space-y-1">
            {TOGGLES.map((t) => {
              const active = state[t.key] as boolean;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => update({ [t.key]: !active } as Partial<State>)}
                  aria-pressed={active}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    active ? "bg-primary/10 font-semibold text-primary" : "text-ink-soft hover:bg-cream-soft"
                  }`}
                >
                  <span>{t.label}</span>
                  <span
                    aria-hidden="true"
                    className={`relative h-5 w-9 flex-none rounded-full transition-colors ${
                      active ? "bg-primary" : "bg-line"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
                        active ? "start-[1.125rem]" : "start-0.5"
                      }`}
                    />
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
            <button
              type="button"
              onClick={reset}
              className="flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-primary"
            >
              <RotateCcw size={13} />
              איפוס הגדרות
            </button>
            <Link
              href="/legal/accessibility"
              className="text-xs font-medium text-primary underline underline-offset-2"
            >
              הצהרת נגישות
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
