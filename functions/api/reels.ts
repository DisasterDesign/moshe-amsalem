/**
 * GET /api/reels
 *
 * The office's own Instagram Reels (@amsalem_law) for the home page, proxied
 * through a Cloudflare Pages Function so the access token never reaches the browser.
 * Source: "Instagram API with Instagram Login" (https://graph.instagram.com,
 * permission instagram_business_basic).
 *
 * Required secret (Cloudflare Pages → Settings → Variables and Secrets, type "Secret"):
 *   INSTAGRAM_ACCESS_TOKEN - long-lived Instagram user token (valid 60 days, refreshable).
 *                            It is the on/off switch: while it is empty this answers
 *                            { ok: false, reason: "missing_token" } without reading KV,
 *                            and the home page section stays hidden.
 *                            Secrets apply on the NEXT deployment - redeploy after pasting.
 * KV binding (Settings → Bindings) - PRODUCTION ONLY:
 *   IG_KV - holds the live token as it gets refreshed, ONE RECORD PER SECRET:
 *           key "ig_token:<seedHash>" (seedHash = first 16 hex chars of SHA-256 of the secret),
 *           value { token, seedHash, setAt, refreshedAt, expiresAt } (ms epoch numbers;
 *           refreshedAt and expiresAt stay null until the first successful refresh).
 *           Every write carries expirationTtl 90 days and each refresh rewrites it, so
 *           records of a replaced or deleted secret expire by themselves.
 *           Never bind the same namespace to Preview: a preview deployment would refresh
 *           (rotate) the production token behind production's back.
 *           Without IG_KV the function still works from the secret alone, but it cannot
 *           persist refreshes, so the token dies 60 days after it was generated.
 *
 * Token lifecycle:
 *   - The first request that sees a secret writes its record (the seed) with setAt = now,
 *     refreshedAt = null, expiresAt = null. When the pasted token was issued is unknown,
 *     so the seed never claims it is fresh.
 *   - On a cache miss a refresh (refresh_access_token) is due 25 hours after the seed
 *     (Instagram refuses to refresh tokens younger than 24 hours), then 7 days after each
 *     successful refresh. expiresAt comes from the refresh response (expires_in).
 *     A failed refresh keeps the current token, writes nothing and is retried on a later
 *     cache miss.
 *   - Older deployments (still reachable at <hash>.<project>.pages.dev) and dashboard
 *     rollbacks that carry an older secret only ever read and write that secret's own
 *     record, so they can never overwrite the current one.
 *   - Refresh rides on page traffic (no cron). If /api/reels gets no cache-missing request
 *     for ~53 days in a row, the token can lapse. Paste a freshly generated token: an old
 *     one may lapse before its first refresh is due.
 *   - When the token dies (owner changed the Instagram password, removed the app, or it
 *     lapsed) the endpoint answers reason "token_invalid" and the section hides itself.
 *     Fix: the owner generates a new long-lived token, the operator pastes it as
 *     INSTAGRAM_ACCESS_TOKEN and redeploys. The new secret starts its own record.
 *   - To switch the feature off, delete the secret and redeploy. Nothing to clean in KV.
 *     The edge cache may keep serving the last good response for up to 1 hour.
 *
 * Cache policy (caches.default is per Cloudflare data center):
 *   - Success is stored in the edge cache under one fixed key for
 *     min(1h, seconds until the earliest Instagram CDN URL expires minus 6h), floor 5 min.
 *     Instagram CDN URLs carry their expiry in the "oe" query param (hex unix seconds).
 *   - Browsers always get max-age=300, so they never hold soon-to-expire media URLs.
 *   - Upstream failures (token_invalid, fetch_failed) are remembered in the edge cache for
 *     5 min under a separate key tied to the current seedHash. While that entry exists the
 *     same failure is answered without calling Instagram (at most one round of Graph calls
 *     per data center every 5 min). A newly pasted secret skips it at once.
 *   - Browsers get no-store for every failure and for ?status=1. missing_token needs no
 *     upstream call and is never cached.
 *   - There is deliberately NO cache-bypass parameter (a public bypass lets anyone burn
 *     the Instagram rate limit).
 *
 * GET /api/reels?status=1 - cheap health check computed from env + KV only (it never calls
 * Instagram and never returns the token; it may write the seed record for a new secret):
 *   { ok: true, configured, kv, source: "kv" | "env" | "none", tokenSetAt, refreshedAt, expiresAt }
 *
 * On any failure this returns exactly { ok: false, reason } with HTTP 200 so the frontend
 * can quietly hide the section. reason: "missing_token" | "token_invalid" | "fetch_failed".
 * Failure details (scrubbed of the token and of any URL) go only to the function log:
 *   npx wrangler pages deployment tail --project-name <project>
 */

const GRAPH = "https://graph.instagram.com";
const KV_KEY_PREFIX = "ig_token:"; // + seedHash: one record per secret
const KV_TTL_SECONDS = 90 * 24 * 60 * 60; // orphaned records (retired secrets) expire by themselves

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
const FIRST_REFRESH_AFTER_MS = 25 * HOUR_MS; // Instagram refuses to refresh tokens younger than 24h
const REFRESH_AFTER_MS = 7 * DAY_MS;

const MEDIA_LIMIT = 50;
const MAX_REELS = 12;
const CAPTION_MAX = 300;

const BROWSER_MAX_AGE = 300; // 5 min
const EDGE_MAX_TTL = 3600; // 1h
const EDGE_MIN_TTL = 300; // 5 min
const EXPIRY_MARGIN_SECONDS = 6 * 60 * 60; // drop cached copies 6h before media URLs expire
const NEG_TTL = 300; // remember an upstream failure for 5 min (per data center)

const FETCH_TIMEOUT_MS = 8000;

// Some fields may not exist on Instagram Login (Graph answers error code 100,
// "nonexisting field"). Try the richest set first and fall back on code 100 only.
// media_product_type is documented as Facebook-Login-only, so it is dropped before
// media_audio_type: the MUSIC filter below keeps working whenever possible.
// Meta's IG Media reference (Aug 2026) marks media_product_type and caption as
// Facebook-Login-only, and media_audio_type is new (Jun 2026). Any of the three
// may come back as "nonexisting field" (code 100), so the sets walk down from
// all three optional fields, dropping one at a time: whichever single field is
// rejected, the next working set still carries the other two.
//   C = caption, P = media_product_type, A = media_audio_type
const BASE_FIELDS = "id,media_type,media_url,thumbnail_url,permalink,timestamp";
const FIELD_SETS = [
  ["caption", "media_product_type", "media_audio_type"], // C P A
  ["caption", "media_audio_type"], //                       C A   (P rejected)
  ["caption", "media_product_type"], //                     C P   (A rejected)
  ["media_product_type", "media_audio_type"], //            P A   (C rejected)
  ["media_audio_type"], //                                  A
  ["caption"], //                                           C
  [], //                                                    base only
].map((extra) => [BASE_FIELDS, ...extra].join(","));

function jsonResponse(payload, status = 200, cacheSeconds = 0) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": cacheSeconds ? `public, max-age=${cacheSeconds}` : "no-store",
    },
  });
}

// The public body is exactly { ok: false, reason }. Diagnostics go to the function log
// (wrangler pages deployment tail) and must already be scrubbed by the caller.
function fail(reason, detail = "") {
  if (detail) console.error(`[reels] ${reason}: ${detail}`);
  return jsonResponse({ ok: false, reason });
}

// Never let the token or an upstream URL reach a log line, even inside an error message.
function scrub(text, secrets) {
  let out = String(text || "");
  for (const secret of secrets) {
    if (secret) out = out.split(secret).join("[token]");
  }
  return out
    .replace(/https?:\/\/\S+/gi, "[url]")
    // a partial token (Graph may echo a prefix) is still part of the secret
    .replace(/[A-Za-z0-9_\-.%]{12,}/g, (m) => (secrets.some((s) => s && s.includes(m)) ? "[token]" : m))
    .replace(/[A-Za-z0-9_\-.%]{40,}/g, "[redacted]")
    .slice(0, 160);
}

function timeoutSignal() {
  return typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function"
    ? AbortSignal.timeout(FETCH_TIMEOUT_MS)
    : undefined;
}

async function graphGet(path, params, token) {
  const qs = new URLSearchParams({ ...params, access_token: token });
  let res;
  try {
    res = await fetch(`${GRAPH}${path}?${qs}`, { signal: timeoutSignal() });
  } catch (error) {
    return { ok: false, code: null, detail: `network: ${(error && error.name) || "error"}` };
  }
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  if (res.ok && data && !data.error) return { ok: true, data };
  const err = (data && data.error) || {};
  const code = Number(err.code) || null;
  return {
    ok: false,
    code,
    detail: `graph ${res.status}${code ? ` code ${code}` : ""}: ${err.message || "no message"}`,
  };
}

async function hashToken(token) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
}

// The secret is read once per request. seedHash names its KV record and its negative-cache key.
async function readSecret(env) {
  const token = String(env.INSTAGRAM_ACCESS_TOKEN || "").trim();
  return { token, seedHash: token ? await hashToken(token) : "" };
}

async function readRecord(kv, key) {
  const raw = await kv.get(key); // throws when KV itself is unavailable - caller handles
  if (!raw) return null;
  try {
    const rec = JSON.parse(raw);
    if (rec && typeof rec.token === "string" && rec.token) return rec;
  } catch {
    // corrupt record: treated as absent and reseeded from the secret
  }
  return null;
}

async function writeRecord(kv, key, rec) {
  try {
    await kv.put(key, JSON.stringify(rec), { expirationTtl: KV_TTL_SECONDS });
  } catch {
    // KV write failed: the token in hand is still valid, carry on
  }
}

async function refreshToken(token) {
  const r = await graphGet("/refresh_access_token", { grant_type: "ig_refresh_token" }, token);
  if (!r.ok) return { ok: false, detail: r.detail };
  if (typeof r.data.access_token !== "string" || !r.data.access_token) {
    return { ok: false, detail: "refresh answered without access_token" };
  }
  const expiresIn = Number(r.data.expires_in);
  return {
    ok: true,
    token: r.data.access_token,
    expiresInMs: Number.isFinite(expiresIn) && expiresIn > 0 ? expiresIn * 1000 : null,
  };
}

// The seed waits 25h (issue time unknown, Instagram refuses tokens younger than 24h);
// after a successful refresh the next one is due 7 days later.
function refreshDue(rec, now) {
  const refreshedAt = Number(rec.refreshedAt) || 0;
  if (refreshedAt) return now - refreshedAt > REFRESH_AFTER_MS;
  return now - (Number(rec.setAt) || 0) > FIRST_REFRESH_AFTER_MS;
}

/**
 * Returns { token, rec, source, secrets }. token is "" when the secret is empty; KV is then
 * not read at all (the secret is the on/off switch). Each secret owns the KV record
 * "ig_token:<seedHash>", so a deployment carrying an older secret never touches the current
 * record. allowRefresh=false (status checks) never calls Instagram.
 */
async function resolveToken(env, secret, now, allowRefresh) {
  if (!secret.token) return { token: "", rec: null, source: "none", secrets: [] };

  const key = `${KV_KEY_PREFIX}${secret.seedHash}`;
  let kv = env.IG_KV || null;
  let rec = null;

  if (kv) {
    try {
      rec = await readRecord(kv, key);
    } catch {
      // KV unreachable: run from the secret alone and write nothing, so a refreshed
      // token in KV is never overwritten by the seed because of a blip.
      kv = null;
    }
  }

  if (!kv) return { token: secret.token, rec: null, source: "env", secrets: [secret.token] };

  if (!rec) {
    // Seed: when this token was issued is unknown, so it is not marked as fresh.
    rec = { token: secret.token, seedHash: secret.seedHash, setAt: now, refreshedAt: null, expiresAt: null };
    await writeRecord(kv, key, rec);
  }

  const secrets = [secret.token, rec.token];
  if (allowRefresh && refreshDue(rec, now)) {
    const fresh = await refreshToken(rec.token);
    if (fresh.ok) {
      rec = {
        ...rec,
        token: fresh.token,
        refreshedAt: now,
        expiresAt: fresh.expiresInMs ? now + fresh.expiresInMs : null,
      };
      secrets.push(fresh.token);
      await writeRecord(kv, key, rec);
    } else {
      // Keep the current token and write nothing; retried on a later cache miss.
      console.error(`[reels] refresh failed: ${scrub(fresh.detail, secrets)}`);
    }
  }

  return { token: rec.token, rec, source: "kv", secrets };
}

async function fetchMedia(token) {
  let last = null;
  for (const fields of FIELD_SETS) {
    const r = await graphGet("/me/media", { fields, limit: String(MEDIA_LIMIT) }, token);
    if (r.ok) return r;
    last = r;
    if (r.code !== 100) break; // any other error (190 token, 4/17/32 rate limit...) stops here
  }
  return last;
}

function isPublishableReel(m) {
  if (!m || !m.id || m.media_type !== "VIDEO") return false;
  // Fallback field sets may not return media_product_type; only filter on it when present.
  if (m.media_product_type && m.media_product_type !== "REELS") return false;
  // Instagram omits media_url for media with copyrighted material - nothing to play.
  if (typeof m.media_url !== "string" || !m.media_url) return false;
  // Reels set to licensed music from Instagram's library may only be played inside
  // Instagram. Republishing them on a law firm's own website would be a copyright
  // problem, so they are left out entirely (original audio / voice-over is fine).
  if (m.media_audio_type === "MUSIC") return false;
  return true;
}

function trimCaption(raw) {
  // The client's site uses a plain hyphen only, never an em/en dash.
  const text = (typeof raw === "string" ? raw : "").replace(/[\u2013\u2014]/g, "-").trim();
  if (text.length <= CAPTION_MAX) return text;
  let out = "";
  for (const ch of text) {
    // iterate by code point so an emoji is never cut in half
    if (out.length + ch.length > CAPTION_MAX - 1) break;
    out += ch;
  }
  return `${out.trimEnd()}…`;
}

function toIso(value) {
  // Instagram sends "2026-10-01T12:00:00+0000"
  const ms = Date.parse(String(value || ""));
  return Number.isFinite(ms) ? new Date(ms).toISOString() : String(value || "");
}

function isoOrNull(ms) {
  const n = Number(ms);
  return ms != null && Number.isFinite(n) && n > 0 ? new Date(n).toISOString() : null;
}

function normalizeReel(m, profileUrl) {
  return {
    id: String(m.id),
    permalink: typeof m.permalink === "string" && m.permalink ? m.permalink : profileUrl,
    videoUrl: m.media_url,
    posterUrl: typeof m.thumbnail_url === "string" ? m.thumbnail_url : "",
    caption: trimCaption(m.caption),
    timestamp: toIso(m.timestamp),
  };
}

// Earliest "oe" (hex unix seconds) across the returned CDN URLs, or null when absent.
function earliestMediaExpiry(reels) {
  let earliest = Infinity;
  for (const reel of reels) {
    for (const u of [reel.videoUrl, reel.posterUrl]) {
      if (!u) continue;
      try {
        const oe = new URL(u).searchParams.get("oe");
        if (oe && /^[0-9a-f]+$/i.test(oe)) {
          const seconds = parseInt(oe, 16);
          if (seconds > 0 && seconds < earliest) earliest = seconds;
        }
      } catch {
        // not a URL - ignore
      }
    }
  }
  return earliest === Infinity ? null : earliest;
}

function edgeTtlSeconds(reels, now) {
  const expiry = earliestMediaExpiry(reels);
  if (expiry === null) return EDGE_MAX_TTL;
  const secondsLeft = expiry - Math.floor(now / 1000) - EXPIRY_MARGIN_SECONDS;
  return Math.max(EDGE_MIN_TTL, Math.min(EDGE_MAX_TTL, secondsLeft));
}

async function statusResponse(env, now) {
  const t = await resolveToken(env, await readSecret(env), now, false);
  const rec = t.rec;
  return jsonResponse({
    ok: true,
    configured: Boolean(t.token),
    kv: Boolean(env.IG_KV),
    source: t.source,
    tokenSetAt: isoOrNull(rec && rec.setAt),
    refreshedAt: isoOrNull(rec && rec.refreshedAt),
    expiresAt: isoOrNull(rec && rec.expiresAt),
  });
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const now = Date.now();

  try {
    if (url.searchParams.get("status") === "1") return await statusResponse(env, now);

    const cache = caches.default;
    const cacheKey = new Request(`${url.origin}/api/reels`, { method: "GET" });

    let hit = null;
    try {
      hit = await cache.match(cacheKey);
    } catch {
      hit = null;
    }
    if (hit) {
      // The edge copy carries the long edge TTL; browsers only get 5 minutes.
      const headers = new Headers(hit.headers);
      headers.set("Cache-Control", `public, max-age=${BROWSER_MAX_AGE}`);
      return new Response(hit.body, { status: hit.status, headers });
    }

    // The secret is the on/off switch: without it nothing else (KV, Instagram) is touched.
    const secret = await readSecret(env);
    if (!secret.token) return fail("missing_token");

    // A recent upstream failure for this secret is answered from the edge cache without
    // calling Instagram. Separate key from the success copy; a query string, not a #fragment
    // (Cache API matching ignores fragments). A new secret means a new key.
    const negKey = new Request(`${url.origin}/api/reels/__fail?s=${secret.seedHash}`, { method: "GET" });
    let neg = null;
    try {
      neg = await cache.match(negKey);
    } catch {
      neg = null;
    }
    if (neg) {
      const headers = new Headers(neg.headers);
      headers.set("Cache-Control", "no-store");
      return new Response(neg.body, { status: 200, headers });
    }
    const failCached = (reason, detail) => {
      context.waitUntil(cache.put(negKey, jsonResponse({ ok: false, reason }, 200, NEG_TTL)).catch(() => {}));
      return fail(reason, detail); // no-store to the browser
    };

    const t = await resolveToken(env, secret, now, true);

    const [me, media] = await Promise.all([
      graphGet("/me", { fields: "username" }, t.token),
      fetchMedia(t.token),
    ]);

    const errors = [me, media].filter((r) => !r.ok);
    if (errors.length) {
      const err = errors.find((r) => r.code === 190) || errors[0];
      return failCached(err.code === 190 ? "token_invalid" : "fetch_failed", scrub(err.detail, t.secrets));
    }

    const username = typeof me.data.username === "string" ? me.data.username.trim() : "";
    if (!username) return failCached("fetch_failed", "no username");
    const profileUrl = `https://www.instagram.com/${encodeURIComponent(username)}/`;

    const items = Array.isArray(media.data.data) ? media.data.data : [];
    const reels = items
      .filter(isPublishableReel)
      .slice(0, MAX_REELS)
      .map((m) => normalizeReel(m, profileUrl));

    const payload = {
      ok: true,
      username,
      profileUrl,
      reels,
      updatedAt: new Date(now).toISOString(),
    };

    const edgeTtl = edgeTtlSeconds(reels, now);
    const edgeCopy = jsonResponse(payload, 200, edgeTtl);
    context.waitUntil(cache.put(cacheKey, edgeCopy).catch(() => {}));
    return jsonResponse(payload, 200, BROWSER_MAX_AGE);
  } catch (error) {
    const secretToken = String((env && env.INSTAGRAM_ACCESS_TOKEN) || "").trim();
    return fail("fetch_failed", scrub(`${(error && error.name) || "error"}: ${(error && error.message) || ""}`, [secretToken]));
  }
}
