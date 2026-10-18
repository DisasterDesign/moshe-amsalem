"use client";

import { siteConfig } from "@/config/site";
import snapshot from "@/content/googleReviews.json";

export type Review = {
  id: string;
  author: string;
  authorPhoto?: string;
  authorUri?: string;
  rating: number;
  /** A faithful excerpt; the complete review remains available on Google. */
  text: string;
  relativeTime?: string;
  reviewUri?: string;
};

export type ReviewsState = {
  rating: number;
  total: number;
  reviews: Review[];
  profileUrl: string;
  writeUrl: string;
  live: boolean;
};

export const PROFILE_URL = siteConfig.googleProfileUrl;
export const WRITE_REVIEW_URL =
  "https://www.google.com/maps/place//data=!4m3!3m2!1s0xac559dd818e0d573:0xfd1367a8b9dff4b1!12e1";

const MANUAL_REVIEWS: ReviewsState = {
  rating: snapshot.rating,
  total: snapshot.total,
  reviews: snapshot.reviews,
  profileUrl: PROFILE_URL,
  writeUrl: WRITE_REVIEW_URL,
  live: false,
};

/**
 * The complete, manually checked Google snapshot is the current public source.
 * Keep this consumer API stable for the counters and review components.
 * Do not fetch the Places endpoint here: its five-review selection would
 * replace the eight verified reviews and their editorial ordering.
 * Automatic updates can be re-enabled explicitly when the full feed is ready.
 */
export function useGoogleReviews(): ReviewsState {
  return MANUAL_REVIEWS;
}
