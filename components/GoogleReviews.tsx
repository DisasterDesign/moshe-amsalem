"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Star, ChevronRight, ChevronLeft, PenLine } from "lucide-react";

/**
 * Live Google reviews.
 *
 * Data comes from /api/reviews (Cloudflare Pages Function -> Google Places API,
 * cached 24h). Until that function has an API key configured, the component
 * renders the bundled snapshot below so the section is never empty or wrong.
 * Snapshot taken July 2026: 5.0, 5 reviews.
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

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
}

function GoogleG({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
      <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
      <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z" />
      <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" />
    </svg>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <span className="flex text-gold" aria-label={`${value} כוכבים`}>
      {[...Array(Math.max(1, Math.round(value)))].map((_, i) => (
        <Star key={i} size={16} className="fill-current" />
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

  useEffect(() => {
    let cancelled = false;
    fetch("/api/reviews")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data || !data.ok) return;
        if (Array.isArray(data.reviews) && data.reviews.length > 0) {
          setReviews(data.reviews);
        }
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

  const scroll = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  return (
    <section className="section-padding bg-cream-soft overflow-hidden">
      <div className="container-custom">
        {/* Summary bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-col items-center gap-5 rounded-2xl border border-line bg-white p-6 text-center md:flex-row md:justify-between md:text-right"
        >
          <div className="flex items-center gap-4">
            <GoogleG className="h-10 w-10" />
            <div>
              <div className="font-heading text-lg font-bold text-ink">ביקורות Google</div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-2xl font-bold text-ink">{rating.toFixed(1)}</span>
                <Stars value={rating} />
                <span className="text-sm text-ink-muted">({total} ביקורות)</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={writeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              <PenLine size={18} />
              כתבו ביקורת בגוגל
            </a>
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline text-center"
            >
              לכל הביקורות
            </a>
          </div>
        </motion.div>

        {/* Carousel */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-ink-muted">מתעדכן אוטומטית מגוגל</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label="הביקורת הקודמת"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink transition-colors hover:bg-primary hover:text-white"
            >
              <ChevronRight size={18} />
            </button>
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label="הביקורת הבאה"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink transition-colors hover:bg-primary hover:text-white"
            >
              <ChevronLeft size={18} />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {reviews.map((r) => (
            <article
              key={r.id}
              className="flex w-[320px] flex-none snap-start flex-col rounded-2xl border border-line bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center gap-3">
                {r.authorPhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={r.authorPhoto}
                    alt=""
                    className="h-11 w-11 rounded-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                    {initialsOf(r.author)}
                  </div>
                )}
                <div className="min-w-0">
                  {r.authorUri ? (
                    <a
                      href={r.authorUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block truncate font-semibold text-ink hover:text-primary"
                    >
                      {r.author}
                    </a>
                  ) : (
                    <div className="truncate font-semibold text-ink">{r.author}</div>
                  )}
                  <div className="text-xs text-ink-muted">{r.relativeTime}</div>
                </div>
                <GoogleG className="ms-auto h-5 w-5 flex-none" />
              </div>

              <div className="mb-3">
                <Stars value={r.rating} />
              </div>

              <p className="text-ink-soft text-sm leading-relaxed">{r.text}</p>

              {r.reviewUri && (
                <a
                  href={r.reviewUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 text-xs font-medium text-primary hover:underline"
                >
                  צפייה בגוגל
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
