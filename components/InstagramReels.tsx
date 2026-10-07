"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Pause,
  Play,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import SectionHeading from "./SectionHeading";
import { useInstagramReels, type Reel } from "@/lib/reels";

/**
 * The office's own Instagram Reels on the home page: a horizontal row of
 * poster cards, and a full-screen vertical viewer that scrolls reel by reel.
 *
 * Data comes from `useInstagramReels` (one request to `/api/reels` per page
 * load). Until the endpoint returns at least one reel - no token configured,
 * token expired, network failure - this renders nothing at all: no heading, no
 * placeholder, no error.
 *
 * Playback: muted + playsInline so iOS Safari lets it autoplay. Visitors who
 * asked for reduced motion (OS setting or the site's accessibility widget) get
 * a play button instead of autoplay.
 */

// Layout effect on the client (measure before paint), plain effect on the server.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    document.documentElement.classList.contains("a11y-reduce-motion")
  );
}

/** Short, single-line caption for labels. Cut by code point so emoji stay whole. */
function excerpt(text: string, max = 80) {
  const chars = Array.from(text.replace(/\s+/g, " ").trim());
  return chars.length > max ? `${chars.slice(0, max).join("").trimEnd()}…` : chars.join("");
}

function errorName(err: unknown) {
  return err && typeof err === "object" && "name" in err ? String(err.name) : "";
}

const ARROW_BUTTON =
  "flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink transition-colors hover:bg-primary hover:text-white aria-disabled:cursor-default aria-disabled:opacity-40 aria-disabled:hover:bg-white aria-disabled:hover:text-ink";

const VIEWER_BUTTON =
  "pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/75 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black aria-disabled:cursor-default aria-disabled:opacity-40";

/* ───────────────────────────── Viewer ───────────────────────────── */

function ReelsViewer({
  reels,
  startIndex,
  onClosed,
}: {
  reels: Reel[];
  startIndex: number;
  onClosed: () => void;
}) {
  const count = reels.length;
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Read once per opening. The viewer is only mounted on the client, after a click.
  const [reduced] = useState(prefersReducedMotion);
  const [active, setActive] = useState(startIndex);
  const [muted, setMuted] = useState(true);
  // True when the active slide is paused and should show the play affordance.
  const [showPlay, setShowPlay] = useState(reduced);
  const [failed, setFailed] = useState<Record<string, true>>({});

  const activeRef = useRef(startIndex);
  const mutedRef = useRef(true);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  // Open as a modal, jump straight to the chosen reel, lock the page behind it
  // and track which slide is on screen.
  useEffect(() => {
    const dialog = dialogRef.current;
    const scroller = scrollerRef.current;
    if (!dialog || !scroller) return;

    const html = document.documentElement;
    html.classList.add("overflow-hidden");
    if (!dialog.open) dialog.showModal();
    // Start on the close button. Left to itself, Chrome puts initial focus on
    // the unlabeled scroller (a keyboard-focusable scroll container).
    closeRef.current?.focus();

    // Instant, not smooth: the viewer opens on the reel that was tapped.
    const start = slideRefs.current[startIndex];
    if (start) scroller.scrollTop = start.offsetTop;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.6) continue;
          const index = Number((entry.target as HTMLElement).dataset.index);
          if (Number.isInteger(index)) setActive(index);
        }
      },
      { root: scroller, threshold: 0.6 },
    );
    slideRefs.current.forEach((slide) => slide && observer.observe(slide));

    const videos = videoRefs.current;
    return () => {
      observer.disconnect();
      videos.forEach((v) => v?.pause());
      html.classList.remove("overflow-hidden");
    };
  }, [startIndex]);

  const startPlayback = useCallback((v: HTMLVideoElement) => {
    const isActive = () => videoRefs.current[activeRef.current] === v;
    v.muted = mutedRef.current;
    let attempt: Promise<void> | undefined;
    try {
      attempt = v.play();
    } catch {
      attempt = undefined;
    }
    if (!attempt) return;
    attempt.catch((err: unknown) => {
      const name = errorName(err);
      // Paused again before it started - normal while scrolling past.
      if (name === "AbortError") return;
      // iOS Safari only allows sound after a tap on that very element. Fall back
      // to muted playback for everything rather than a frozen frame.
      if (name === "NotAllowedError" && !v.muted) {
        mutedRef.current = true;
        videoRefs.current.forEach((other) => {
          if (other) other.muted = true;
        });
        setMuted(true);
        v.play().catch(() => {
          if (isActive()) setShowPlay(true);
        });
        return;
      }
      if (isActive()) setShowPlay(true);
    });
  }, []);

  // Exactly one reel plays: the one on screen. Everything else is paused.
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (v && i !== active && !v.paused) v.pause();
    });
    const v = videoRefs.current[active];
    if (!v) return;
    if (reduced) {
      setShowPlay(v.paused);
      return;
    }
    setShowPlay(false);
    startPlayback(v);
  }, [active, reduced, startPlayback]);

  const scrollToIndex = useCallback(
    (index: number) => {
      const scroller = scrollerRef.current;
      const slide = slideRefs.current[index];
      if (!scroller || !slide) return;
      scroller.scrollTo({ top: slide.offsetTop, behavior: reduced ? "auto" : "smooth" });
    },
    [reduced],
  );

  // Derived from the scroll position rather than `active`, so a second key
  // press during a smooth scroll does not skip a reel or bounce back.
  const step = useCallback(
    (delta: 1 | -1) => {
      const scroller = scrollerRef.current;
      if (!scroller || scroller.clientHeight === 0) return;
      const pos = scroller.scrollTop / scroller.clientHeight;
      const target = delta > 0 ? Math.floor(pos + 0.05) + 1 : Math.ceil(pos - 0.05) - 1;
      scrollToIndex(Math.max(0, Math.min(count - 1, target)));
    },
    [count, scrollToIndex],
  );

  // On window, not the dialog: after a tap on a video, focus can sit on <body>.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        step(1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        step(-1);
      } else if (e.key === "Home") {
        e.preventDefault();
        scrollToIndex(0);
      } else if (e.key === "End") {
        e.preventDefault();
        scrollToIndex(count - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count, step, scrollToIndex]);

  const togglePlay = () => {
    const v = videoRefs.current[active];
    if (!v) return;
    if (v.paused) startPlayback(v);
    else v.pause();
  };

  const toggleMute = () => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    // Set on the elements inside the tap itself - iOS only honours an unmute there.
    videoRefs.current.forEach((v) => {
      if (v) v.muted = next;
    });
    setMuted(next);
  };

  // The native "close" event is queued as a task, and Chrome holds it back in a
  // hidden page. Both the X and Esc (the "cancel" event, which fires
  // synchronously) tear down right away instead of waiting for it; onClosed is
  // idempotent, so the late event is harmless.
  const close = () => {
    dialogRef.current?.close();
    onClosed();
  };
  const onCancel = (e: React.SyntheticEvent<HTMLDialogElement>) => {
    e.preventDefault();
    close();
  };

  const current = reels[active] ?? reels[0];
  const currentFailed = Boolean(current && failed[current.id]);

  return (
    <dialog
      ref={dialogRef}
      aria-label="סרטונים מהאינסטגרם"
      onClose={onClosed}
      onCancel={onCancel}
      className="fixed inset-0 m-0 h-[100dvh] max-h-none w-screen max-w-none overflow-hidden border-0 bg-black p-0 text-white backdrop:bg-black"
    >
      {/* Vertical reel scroller */}
      <div
        ref={scrollerRef}
        tabIndex={-1}
        className="relative h-full snap-y snap-mandatory overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {reels.map((r, i) => {
          const isFailed = Boolean(failed[r.id]);
          return (
            <div
              key={r.id}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              data-index={i}
              className="relative flex h-full w-full snap-start snap-always items-center justify-center"
            >
              {isFailed ? (
                <div className="flex flex-col items-center gap-4 px-6 text-center">
                  <p className="text-lg font-medium">הסרטון לא נטען</p>
                  <a
                    href={r.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center rounded-full border border-white/40 px-5 text-sm font-medium transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  >
                    לצפייה באינסטגרם
                  </a>
                </div>
              ) : (
                <>
                  <video
                    ref={(el) => {
                      videoRefs.current[i] = el;
                    }}
                    src={r.videoUrl}
                    poster={r.posterUrl || undefined}
                    muted={muted}
                    playsInline
                    loop
                    preload={i === active || i === active + 1 ? "metadata" : "none"}
                    aria-label={r.caption ? excerpt(r.caption) : "סרטון מאינסטגרם"}
                    onClick={() => {
                      if (i === active) togglePlay();
                    }}
                    onPlay={() => {
                      if (i === active) setShowPlay(false);
                    }}
                    onPause={() => {
                      if (i === active) setShowPlay(true);
                    }}
                    onError={() =>
                      setFailed((prev) => (prev[r.id] ? prev : { ...prev, [r.id]: true }))
                    }
                    className="h-full max-h-[100dvh] w-auto max-w-full object-contain"
                  />
                  {i === active && showPlay && (
                    // Decorative: the tap lands on the video underneath, keyboard
                    // users have the play/pause button in the top bar.
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 flex items-center justify-center"
                    >
                      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black/50">
                        <Play size={30} className="translate-x-0.5 fill-current" />
                      </span>
                    </span>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Top bar: close at the start (right in RTL), sound and playback at the end */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between gap-2 bg-gradient-to-b from-black/50 to-transparent p-3 pb-10 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="סגירה"
          className={VIEWER_BUTTON}
        >
          <X size={22} aria-hidden="true" />
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={togglePlay}
            aria-disabled={currentFailed}
            aria-label={showPlay ? "הפעלת הסרטון" : "השהיית הסרטון"}
            className={VIEWER_BUTTON}
          >
            {showPlay ? (
              <Play size={20} className="fill-current" aria-hidden="true" />
            ) : (
              <Pause size={20} className="fill-current" aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "הפעלת הקול" : "השתקה"}
            className={VIEWER_BUTTON}
          >
            {muted ? (
              <VolumeX size={20} aria-hidden="true" />
            ) : (
              <Volume2 size={20} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Previous / next reel (desktop) */}
      {count > 1 && (
        <div className="pointer-events-none absolute end-4 top-1/2 hidden -translate-y-1/2 flex-col gap-3 md:flex">
          <button
            type="button"
            onClick={() => {
              if (active > 0) step(-1);
            }}
            aria-disabled={active === 0}
            aria-label="הסרטון הקודם"
            className={VIEWER_BUTTON}
          >
            <ChevronUp size={22} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => {
              if (active < count - 1) step(1);
            }}
            aria-disabled={active === count - 1}
            aria-label="הסרטון הבא"
            className={VIEWER_BUTTON}
          >
            <ChevronDown size={22} aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Caption and link for the reel on screen */}
      {current && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/70 via-70% to-transparent px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-16">
          <div className="mx-auto max-w-xl">
            {current.caption && (
              <p className="line-clamp-3 whitespace-pre-line text-sm leading-relaxed text-white">
                {current.caption}
              </p>
            )}
            <a
              href={current.permalink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => videoRefs.current[active]?.pause()}
              className="pointer-events-auto mt-2 inline-flex min-h-11 items-center gap-2 rounded-full text-sm font-semibold text-white underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              לצפייה באינסטגרם
              <ArrowLeft size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {`סרטון ${active + 1} מתוך ${count}`}
      </p>
    </dialog>
  );
}

/* ───────────────────────────── Section ───────────────────────────── */

export default function InstagramReels() {
  const { reels, username, profileUrl } = useInstagramReels();

  const scrollerRef = useRef<HTMLUListElement | null>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const openedFromRef = useRef(0);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [edges, setEdges] = useState({ overflow: false, atStart: true, atEnd: true });

  const measure = useCallback(() => {
    const el = scrollerRef.current;
    if (!el || el.clientWidth === 0) return;
    // RTL scrollLeft runs from 0 down to negative values; abs() covers both directions.
    const x = Math.abs(el.scrollLeft);
    const next = {
      overflow: el.scrollWidth - el.clientWidth > 2,
      atStart: x <= 2,
      atEnd: x + el.clientWidth >= el.scrollWidth - 2,
    };
    setEdges((prev) =>
      prev.overflow === next.overflow && prev.atStart === next.atStart && prev.atEnd === next.atEnd
        ? prev
        : next,
    );
  }, []);

  // Before paint, so the arrows never pop in after the section has appeared.
  useIsomorphicLayoutEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, reels]);

  /** dir 1 = next (towards the end, i.e. left in RTL), -1 = previous. One page at a time. */
  const scrollCards = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    const first = el?.firstElementChild as HTMLElement | null | undefined;
    if (!el || !first) return;
    const style = getComputedStyle(el);
    const gap = parseFloat(style.columnGap) || 0;
    const inner = el.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    const stepWidth = first.getBoundingClientRect().width + gap;
    if (stepWidth <= 0) return;
    const perView = Math.max(1, Math.floor((inner + gap) / stepWidth + 0.01));
    const sign = style.direction === "rtl" ? -1 : 1;
    el.scrollBy({
      left: sign * dir * perView * stepWidth,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  const openViewer = (index: number) => {
    // No <dialog> (Safari/iOS before 15.4) or no IntersectionObserver: the
    // viewer can't run, so open the reel on Instagram. Inside the click, so
    // popup blockers allow it.
    if (typeof HTMLDialogElement === "undefined" || typeof IntersectionObserver === "undefined") {
      window.open(reels[index].permalink, "_blank", "noopener,noreferrer");
      return;
    }
    openedFromRef.current = index;
    setViewerIndex(index);
  };

  const handleClosed = useCallback(() => {
    setViewerIndex(null);
    cardRefs.current[openedFromRef.current]?.focus({ preventScroll: true });
  }, []);

  if (reels.length === 0) return null;

  return (
    <section className="section-padding overflow-hidden bg-cream-soft">
      <div className="container-custom">
        <SectionHeading
          title="מהאינסטגרם"
          description="סרטונים קצרים מהעמוד שלי באינסטגרם."
        />

        {/* Carousel. Negative margin + padding keeps focus rings from being clipped. */}
        <ul
          ref={scrollerRef}
          onScroll={measure}
          aria-label="סרטונים מהאינסטגרם"
          className={`-mx-2 flex snap-x snap-mandatory scroll-px-2 gap-5 overflow-x-auto px-2 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            edges.overflow ? "" : "justify-center"
          }`}
        >
          {reels.map((r, i) => (
            <li
              key={r.id}
              className="w-[62%] flex-none snap-start sm:w-[calc(33.333%-14px)] lg:w-[calc(25%-15px)]"
            >
              <button
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                type="button"
                onClick={() => openViewer(i)}
                aria-label={r.caption ? `צפייה בסרטון: ${excerpt(r.caption)}` : "צפייה בסרטון"}
                className="relative block aspect-[9/16] w-full overflow-hidden rounded-2xl bg-dark shadow-sm"
              >
                {r.posterUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={r.posterUrl}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      // Expired poster URL: fall back to the plain dark block.
                      e.currentTarget.style.visibility = "hidden";
                    }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}

                <span
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/45 text-white">
                    <Play size={24} className="translate-x-0.5 fill-current" />
                  </span>
                </span>

                {r.caption && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/60 via-70% to-transparent px-4 pb-4 pt-12 text-right"
                  >
                    <span className="line-clamp-2 text-sm leading-snug text-white">
                      {r.caption}
                    </span>
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>

        <div
          className={`mt-8 flex flex-col items-center gap-5 sm:flex-row ${
            edges.overflow ? "sm:justify-between" : "sm:justify-center"
          }`}
        >
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-medium text-ink-soft transition-colors hover:text-primary"
          >
            לעמוד באינסטגרם
            <span dir="ltr">@{username}</span>
            <ArrowLeft size={17} aria-hidden="true" />
          </a>

          {/* Arrows (RTL: right = previous) */}
          {edges.overflow && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  if (!edges.atStart) scrollCards(-1);
                }}
                aria-disabled={edges.atStart}
                aria-label="הסרטונים הקודמים"
                className={ARROW_BUTTON}
              >
                <ChevronRight size={20} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!edges.atEnd) scrollCards(1);
                }}
                aria-disabled={edges.atEnd}
                aria-label="הסרטונים הבאים"
                className={ARROW_BUTTON}
              >
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>

      {viewerIndex !== null && (
        <ReelsViewer reels={reels} startIndex={viewerIndex} onClosed={handleClosed} />
      )}
    </section>
  );
}
