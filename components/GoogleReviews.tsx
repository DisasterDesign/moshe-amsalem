"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

/**
 * Live Google reviews - same architecture as fuzionwebz.com:
 * the browser calls /api/reviews (Cloudflare Pages Function -> Google Places API,
 * cached 24h) and renders rating + total count + the returned review texts.
 *
 * Google's API returns at most ~5 review bodies, so the total count is shown
 * separately from the number of quotes on screen.
 *
 * Until GOOGLE_PLACES_API_KEY is set on the Pages project the component renders
 * the bundled snapshot below, so the section is never empty or wrong.
 * Snapshot: July 2026, 5.0, 5 reviews.
 */

type Review = {
  id: string;
  author: string;
  authorPhoto?: string;
  authorUri?: string;
  rating: number;
  text: string;
  relativeTime: string;
  reviewUri?: string;
};

const FALLBACK_RATING = 5.0;
const FALLBACK_TOTAL = 5;

const FALLBACK_REVIEWS: Review[] = [
  {
    id: "shalo",
    author: "שלו אלימלך",
    rating: 5,
    relativeTime: "לפני 3 חודשים",
    text: "אני רוצה להמליץ בחום על עורך הדין משה אמסלם. קיבלתי ממנו שירות מקצועי, יסודי ואמין לאורך כל הדרך. הוא היה זמין לכל שאלה, הסביר כל שלב בצורה ברורה ונתן לי תחושת ביטחון מלאה בתהליך.",
  },
  {
    id: "efrat",
    author: "Efrat Shoshana",
    rating: 5,
    relativeTime: "לפני חודשיים",
    text: "זכות גדולה לעבוד עם עורך דין משה אמסלם. עברנו יחד כמה עסקאות והוא תמיד היה שם בשבילי – זמין, קשוב ומנוסה מאוד. הוא הופך כל תהליך מורכב לפשוט ורגוע בזכות האדיבות והאכפתיות שלו. מי שמחפש ליווי צמוד ומקצועי, זה הכתובת. תודה על הכל!",
  },
  {
    id: "miki",
    author: "miki hai",
    rating: 5,
    relativeTime: "לפני 3 ימים",
    text: "מושיקו ליווה אותי בעסקת רכישה של דירה, מקצועי מאוד, מענה בכל שעות היום. בזכות מושיקו קבלתי חיים חדשים מעבר לעזרה במכירת דירה.",
  },
  {
    id: "neve",
    author: "נווה לוצקי",
    rating: 5,
    relativeTime: "לפני חודשיים",
    text: "מושיקו ליווה אותי בעסקת רכישה של דירה, מקצועי מאוד, זמין ונעים. ממליץ בחום!",
  },
  {
    id: "yossi",
    author: "Yossi Parienti",
    rating: 5,
    relativeTime: "לפני 4 חודשים",
    text: "היה לי איתו כמה וכמה עבודות עורך דין נאמן מאוד יסודי מאוד בקיצור מומלץ",
  },
];

const PROFILE_URL = "https://maps.app.goo.gl/T2Azt3EGu4W1iXd49";
// Opens Google's "write a review" dialog straight from the office listing.
const WRITE_REVIEW_URL =
  "https://www.google.com/maps/place//data=!4m3!3m2!1s0xac559dd818e0d573:0xfd1367a8b9dff4b1!12e1";

function initialOf(name: string) {
  return (name.trim()[0] || "?").toUpperCase();
}

function Stars({ size = 16 }: { size?: number }) {
  return (
    <span className="flex justify-center gap-0.5 text-gold" aria-hidden="true">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={size} className="fill-current" />
      ))}
    </span>
  );
}

export default function GoogleReviews() {
  const [rating, setRating] = useState<number>(FALLBACK_RATING);
  const [total, setTotal] = useState<number>(FALLBACK_TOTAL);
  const [reviews, setReviews] = useState<Review[]>(FALLBACK_REVIEWS);
  const [profileUrl, setProfileUrl] = useState<string>(PROFILE_URL);
  const [writeUrl, setWriteUrl] = useState<string>(WRITE_REVIEW_URL);

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/reviews")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data || !data.ok) return;
        if (Array.isArray(data.reviews) && data.reviews.length > 0) setReviews(data.reviews);
        if (typeof data.rating === "number") setRating(data.rating);
        if (typeof data.total === "number") setTotal(data.total);
        if (data.profileUrl) setProfileUrl(data.profileUrl);
        if (data.writeReviewUrl) setWriteUrl(data.writeReviewUrl);
      })
      .catch(() => {
        /* keep the bundled snapshot */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const recalc = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const pages = Math.max(1, Math.round(el.scrollWidth / el.clientWidth));
    setPageCount(pages);
    setPage(Math.round(Math.abs(el.scrollLeft) / el.clientWidth));
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
    <section className="section-padding bg-cream-soft overflow-hidden">
      <div className="container-custom">
        {/* Heading + rating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h2 className="heading-lg text-ink">
            לקוחות <span className="text-primary">ממליצים</span>
          </h2>

          <div className="mt-5 flex items-center justify-center gap-4">
            <span className="font-heading text-4xl font-extrabold text-ink">
              {rating.toFixed(1)}
            </span>
            <span className="text-right">
              <Stars size={18} />
              <span className="mt-1 block text-sm text-ink-muted">
                {total} ביקורות בגוגל
              </span>
            </span>
          </div>
        </motion.div>

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
              <Stars />

              <p className="mt-4 flex-1 text-ink-soft leading-relaxed">
                &ldquo;{r.text}&rdquo;
              </p>

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
            עבדנו יחד? כתבו לנו ביקורת
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
