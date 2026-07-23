/**
 * GET /api/reviews
 *
 * Live Google reviews for the office, proxied through a Cloudflare Pages Function
 * so the API key never reaches the browser.
 *
 * Refresh cadence: cached for 24h (daily) in the Cloudflare edge cache.
 * Pass ?refresh=1 to bypass the cache manually.
 *
 * Required env (Cloudflare Pages → Settings → Environment variables):
 *   GOOGLE_PLACES_API_KEY  - Google Cloud API key with "Places API (New)" enabled
 * Optional env:
 *   GOOGLE_PLACE_ID        - exact place id. If missing, it is resolved once via Text Search.
 *   GOOGLE_PLACE_QUERY     - text used to resolve the place when GOOGLE_PLACE_ID is absent
 *
 * On any failure this returns { ok: false } with HTTP 200 so the frontend can
 * quietly fall back to its bundled copy of the reviews.
 */

const DEFAULT_QUERY = "משה אמסלם - משרד עורכי דין, דרך מנחם בגין 144, תל אביב";
const CACHE_SECONDS = 86400; // 24h - daily refresh
const MIN_RATING = 4; // only surface strong reviews on the site

const DETAILS_FIELDS = "id,rating,userRatingCount,googleMapsUri,reviews";
const SEARCH_FIELDS =
  "places.id,places.rating,places.userRatingCount,places.googleMapsUri,places.reviews";

function jsonResponse(payload, status = 200, cacheSeconds = 0) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": cacheSeconds
        ? `public, max-age=${cacheSeconds}, s-maxage=${cacheSeconds}`
        : "no-store",
    },
  });
}

function normalizeReview(review) {
  const author = review.authorAttribution || {};
  return {
    id: review.name || `${author.displayName || "anon"}-${review.publishTime || ""}`,
    author: author.displayName || "לקוח",
    authorPhoto: author.photoUri || "",
    authorUri: author.uri || "",
    rating: typeof review.rating === "number" ? review.rating : 5,
    text: (review.originalText?.text || review.text?.text || "").trim(),
    relativeTime: review.relativePublishTimeDescription || "",
    publishTime: review.publishTime || "",
    reviewUri: review.googleMapsUri || "",
  };
}

async function fetchPlaceById(placeId, apiKey) {
  const url =
    `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}` +
    `?languageCode=he&regionCode=IL`;
  const res = await fetch(url, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": DETAILS_FIELDS,
    },
  });
  if (!res.ok) throw new Error(`places details ${res.status}: ${await res.text()}`);
  return res.json();
}

async function fetchPlaceByQuery(query, apiKey) {
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": SEARCH_FIELDS,
    },
    body: JSON.stringify({
      textQuery: query,
      languageCode: "he",
      regionCode: "IL",
      maxResultCount: 1,
    }),
  });
  if (!res.ok) throw new Error(`places search ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const place = data.places && data.places[0];
  if (!place) throw new Error("place not found for query");
  return place;
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const bypassCache = url.searchParams.get("refresh") === "1";

  const cache = caches.default;
  const cacheKey = new Request(`${url.origin}/api/reviews`, { method: "GET" });

  if (!bypassCache) {
    const hit = await cache.match(cacheKey);
    if (hit) return hit;
  }

  const apiKey = env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return jsonResponse({ ok: false, reason: "missing_api_key" });
  }

  try {
    const placeId = env.GOOGLE_PLACE_ID;
    const place = placeId
      ? await fetchPlaceById(placeId, apiKey)
      : await fetchPlaceByQuery(env.GOOGLE_PLACE_QUERY || DEFAULT_QUERY, apiKey);

    const resolvedId = place.id || placeId || "";
    const reviews = (place.reviews || [])
      .map(normalizeReview)
      .filter((r) => r.rating >= MIN_RATING && r.text.length > 0);

    const payload = {
      ok: true,
      rating: typeof place.rating === "number" ? place.rating : null,
      total: typeof place.userRatingCount === "number" ? place.userRatingCount : null,
      reviews,
      profileUrl: place.googleMapsUri || "",
      writeReviewUrl: resolvedId
        ? `https://search.google.com/local/writereview?placeid=${encodeURIComponent(resolvedId)}`
        : "",
      updatedAt: new Date().toISOString(),
    };

    const response = jsonResponse(payload, 200, CACHE_SECONDS);
    context.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (error) {
    return jsonResponse({ ok: false, reason: "fetch_failed", detail: String(error) });
  }
}
