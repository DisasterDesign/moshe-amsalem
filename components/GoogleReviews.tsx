"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import GoogleGlyph from "./GoogleGlyph";
import Reveal from "./Reveal";
import { useGoogleReviews } from "@/lib/reviews";

/**
 * Live Google reviews carousel. Data comes from `useGoogleReviews`, which is
 * shared with the floating badge so the page fetches once and falls back to a
 * bundled snapshot when the endpoint is unavailable.
 */

function Stars({ size = 16, count = 5 }: { size?: number; count?: number }) {
  return (
    <span className="flex justify-center gap-0.5 text-gold" aria-hidden="true">
      {[...Array(count)].map((_, i) => (
        <Star key={i} size={size} className="fill-current" />
      ))}
    </span>
  );
}

function initialOf(name: string) {
  return (name.trim()[0] || "?").toUpperCase();
}

export default function GoogleReviews() {
  const { rating, total, reviews, profileUrl, writeUrl } = useGoogleReviews();

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const recalc = useCallback(() => {
    const el = scrollerRef.current;
    // clientWidth is 0 before the first layout pass. Dividing by it yields
    // Infinity, and Array(Infinity) throws RangeError - which used to take the
    // whole page down.
    if (!el || el.clientWidth === 0) return;
    const pages = Math.min(20, Math.max(1, Math.round(el.scrollWidth / el.clientWidth)));
    setPageCount(pages);
    setPage(Math.min(pages - 1, Math.round(Math.abs(el.scrollLeft) / el.clientWidth)));
  }, []);

  useEffect(() => {
    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, [recalc, reviews]);

  const goToPage = (index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const rtl = getComputedStyle(el).direction === "rtl";
    el.scrollTo({ left: (rtl ? -1 : 1) * index * el.clientWidth, behavior: "smooth" });
  };

  return (
    <section className="section-padding overflow-hidden bg-cream">
      <div className="container-custom">
        <Reveal className="mb-10 text-center">
          <h2 className="heading-lg text-ink">
            לקוחות <span className="text-primary">ממליצים</span>
          </h2>

          <div className="mt-5 flex items-center justify-center gap-4">
            <GoogleGlyph className="h-8 w-8" />
            <span className="font-heading text-4xl font-extrabold text-ink">
              {rating.toFixed(1)}
            </span>
            <span className="text-right">
              <Stars size={18} />
              <span className="mt-1 block text-sm text-ink-muted">{total} ביקורות בגוגל</span>
            </span>
          </div>
        </Reveal>

        {/* Carousel */}
        <div
          ref={scrollerRef}
          onScroll={recalc}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {reviews.map((r) => (
            <article
              key={r.id}
              className="flex w-[85%] flex-none snap-start flex-col rounded-2xl border border-line bg-white p-6 text-center shadow-sm sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
            >
              <Stars count={Math.round(r.rating)} />

              <p className="mt-4 flex-1 leading-relaxed text-ink-soft">&ldquo;{r.text}&rdquo;</p>

              <div className="mt-6 flex items-center justify-center gap-3">
                {r.authorPhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={r.authorPhoto}
                    alt=""
                    className="h-10 w-10 flex-none rounded-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                    {initialOf(r.author)}
                  </span>
                )}
                <span className="text-right">
                  {r.authorUri ? (
                    <a
                      href={r.authorUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block font-bold text-ink hover:text-primary"
                    >
                      {r.author}
                    </a>
                  ) : (
                    <span className="block font-bold text-ink">{r.author}</span>
                  )}
                  <span className="block text-xs text-ink-muted">{r.relativeTime}</span>
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination dots */}
        {pageCount > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            {[...Array(pageCount)].map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToPage(i)}
                aria-label={`עמוד ביקורות ${i + 1}`}
                aria-current={i === page}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === page ? "w-7 bg-primary" : "w-2 bg-line hover:bg-primary/40"
                }`}
              />
            ))}
          </div>
        )}

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={writeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full text-center sm:w-auto"
          >
            עבדנו יחד? כתבו לי ביקורת
          </a>
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline w-full text-center sm:w-auto"
          >
            לכל הביקורות בגוגל
          </a>
        </div>
      </div>
    </section>
  );
}
