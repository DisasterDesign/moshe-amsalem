"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll reveal, deliberately restrained.
 *
 * The previous implementation used framer-motion `whileInView` with staggered
 * per-index delays, which left whole sections sitting empty and faded for a
 * beat. This is a CSS transition driven by IntersectionObserver instead:
 * 350ms, 12px of travel, at most a token stagger, and it starts while the
 * element is still below the fold.
 *
 * Content is only hidden up-front when JS is running (`html.js`, set by the
 * inline script in the root layout), so a JS failure degrades to plain visible
 * text rather than a blank page. `prefers-reduced-motion` and the accessibility
 * widget's `a11y-reduce-motion` class both disable it in CSS.
 */

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Token stagger for grids. Capped at 3 steps so late cards never lag. */
  index?: number;
  as?: "div" | "section" | "article" | "li" | "header";
};

export default function Reveal({ children, className = "", index = 0, as = "div" }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      // Fire a little before the element scrolls into view, so the transition
      // has finished by the time the user is actually looking at it.
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Tag = as as React.ElementType;

  return (
    <Tag
      ref={ref}
      data-reveal=""
      data-revealed={shown ? "" : undefined}
      style={index ? { transitionDelay: `${Math.min(index, 3) * 60}ms` } : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}
