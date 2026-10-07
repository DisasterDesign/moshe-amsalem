/**
 * Shared Instagram Reels state.
 *
 * `/api/reels` is a Cloudflare Pages Function that reads the office's own Reels
 * through the Instagram API, so the access token never reaches the browser.
 *
 * Unlike the Google reviews there is deliberately no bundled fallback: until
 * the token is configured (or whenever the endpoint fails) the hook returns an
 * empty list and the home page section renders nothing at all.
 *
 * Nothing is persisted to localStorage - Instagram media URLs are signed and
 * expire, so a stored copy would turn into broken players.
 */

"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";

export type Reel = {
  id: string;
  permalink: string;
  videoUrl: string;
  posterUrl: string;
  caption: string;
  timestamp: string;
};

export type ReelsState = {
  reels: Reel[];
  username: string;
  profileUrl: string;
};

const FALLBACK_PROFILE_URL: string = siteConfig.social.instagram;
const FALLBACK_USERNAME =
  FALLBACK_PROFILE_URL.replace(/\/+$/, "").split("/").pop() || "amsalem_law";

const EMPTY: ReelsState = {
  reels: [],
  username: FALLBACK_USERNAME,
  profileUrl: FALLBACK_PROFILE_URL,
};

const CAPTION_MAX = 300;

function isHttpsUrl(value: unknown): value is string {
  return typeof value === "string" && /^https:\/\//i.test(value);
}

function toReel(raw: unknown): Reel | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.id !== "string" || !r.id) return null;
  // Only https URLs ever reach src / href, whatever the endpoint sends.
  if (!isHttpsUrl(r.videoUrl) || !isHttpsUrl(r.permalink)) return null;
  return {
    id: r.id,
    permalink: r.permalink,
    videoUrl: r.videoUrl,
    posterUrl: isHttpsUrl(r.posterUrl) ? r.posterUrl : "",
    caption: typeof r.caption === "string" ? r.caption.trim().slice(0, CAPTION_MAX) : "",
    timestamp: typeof r.timestamp === "string" ? r.timestamp : "",
  };
}

function parse(data: unknown): ReelsState {
  if (!data || typeof data !== "object") return EMPTY;
  const d = data as Record<string, unknown>;
  if (d.ok !== true || !Array.isArray(d.reels)) return EMPTY;

  const reels = d.reels.map(toReel).filter((r): r is Reel => r !== null);
  if (reels.length === 0) return EMPTY;

  const username =
    typeof d.username === "string" && d.username.trim()
      ? d.username.trim().replace(/^@/, "")
      : FALLBACK_USERNAME;

  return {
    reels,
    username,
    profileUrl: isHttpsUrl(d.profileUrl) ? d.profileUrl : FALLBACK_PROFILE_URL,
  };
}

// One request per page load: every consumer shares this promise, and it is
// never reset, so a failure is not retried on remount either.
let resolved: ReelsState | null = null;
let request: Promise<ReelsState> | null = null;

function load(): Promise<ReelsState> {
  if (!request) {
    request = fetch("/api/reels", { headers: { Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then(parse)
      .catch(() => EMPTY)
      .then((state) => {
        resolved = state;
        return state;
      });
  }
  return request;
}

export function useInstagramReels(): ReelsState {
  const [state, setState] = useState<ReelsState>(resolved ?? EMPTY);

  useEffect(() => {
    let cancelled = false;
    load().then((next) => {
      if (!cancelled) setState(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
