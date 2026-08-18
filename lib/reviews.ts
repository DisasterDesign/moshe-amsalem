/**
 * Shared Google reviews state.
 *
 * `/api/reviews` is a Cloudflare Pages Function that proxies the Google Places
 * API and caches for 24h, so the key never reaches the browser. Both the
 * reviews section and the floating badge read through this hook, so the page
 * only ever makes one request.
 *
 * The bundled snapshot below is the fallback: if the function is unreachable or
 * the API key is not set on the Pages project, the UI still shows real numbers
 * rather than an empty shell. Snapshot taken July 2026 - 5.0, 5 reviews.
 */

"use client";

import { useEffect, useState } from "react";

export type Review = {
  id: string;
  author: string;
  authorPhoto?: string;
  authorUri?: string;
  rating: number;
  text: string;
  relativeTime: string;
  reviewUri?: string;
};

export const FALLBACK_RATING = 5.0;
export const FALLBACK_TOTAL = 5;

export const PROFILE_URL = "https://maps.app.goo.gl/T2Azt3EGu4W1iXd49";
// Opens Google's "write a review" dialog straight from the office listing.
export const WRITE_REVIEW_URL =
  "https://www.google.com/maps/place//data=!4m3!3m2!1s0xac559dd818e0d573:0xfd1367a8b9dff4b1!12e1";

export const FALLBACK_REVIEWS: Review[] = [
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
    text: "זכות גדולה לעבוד עם עורך דין משה אמסלם. עברנו יחד כמה עסקאות והוא תמיד היה שם בשבילי - זמין, קשוב ומנוסה מאוד. הוא הופך כל תהליך מורכב לפשוט ורגוע בזכות האדיבות והאכפתיות שלו. מי שמחפש ליווי צמוד ומקצועי, זה הכתובת. תודה על הכל!",
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

export type ReviewsState = {
  rating: number;
  total: number;
  reviews: Review[];
  profileUrl: string;
  writeUrl: string;
  /** True once the live fetch resolved; the UI does not gate rendering on it. */
  live: boolean;
};

const INITIAL: ReviewsState = {
  rating: FALLBACK_RATING,
  total: FALLBACK_TOTAL,
  reviews: FALLBACK_REVIEWS,
  profileUrl: PROFILE_URL,
  writeUrl: WRITE_REVIEW_URL,
  live: false,
};

// Module-level cache so a second consumer mounting later reuses the response
// instead of firing another request.
let cached: ReviewsState | null = null;
let inFlight: Promise<ReviewsState | null> | null = null;

async function load(): Promise<ReviewsState | null> {
  if (cached) return cached;
  if (inFlight) return inFlight;

  inFlight = fetch("/api/reviews")
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (!data || !data.ok) return null;
      const next: ReviewsState = {
        rating: typeof data.rating === "number" ? data.rating : FALLBACK_RATING,
        total: typeof data.total === "number" ? data.total : FALLBACK_TOTAL,
        reviews:
          Array.isArray(data.reviews) && data.reviews.length > 0
            ? (data.reviews as Review[])
            : FALLBACK_REVIEWS,
        profileUrl: data.profileUrl || PROFILE_URL,
        writeUrl: data.writeReviewUrl || WRITE_REVIEW_URL,
        live: true,
      };
      cached = next;
      return next;
    })
    .catch(() => null)
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

export function useGoogleReviews(): ReviewsState {
  const [state, setState] = useState<ReviewsState>(cached ?? INITIAL);

  useEffect(() => {
    let cancelled = false;
    load().then((next) => {
      if (!cancelled && next) setState(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
