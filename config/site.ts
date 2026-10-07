/**
 * Single source of truth for tenant-level facts: brand, contact, nav, and the
 * numbers that are still waiting on the client.
 *
 * Anything the client still owes us lives in `PENDING` below, so filling in the
 * real values is a one-file edit rather than a hunt across the codebase.
 */

export const siteConfig = {
  name: "עו״ד משה אמסלם",
  shortName: "משה אמסלם",
  role: "מקרקעין והתחדשות עירונית",
  legalName: "משה אמסלם - משרד עורכי דין",
  url: "https://ams-law.com",
  locale: "he-IL",

  phone: "052-4337633",
  phoneIntl: "+972524337633",
  whatsappNumber: "972524337633",
  email: "moshe@ams-law.com",

  address: {
    street: "דרך מנחם בגין 144",
    detail: "מגדל מידטאון, קומה 36",
    city: "תל אביב",
    country: "IL",
    postalCode: "6492102",
    // The Google Business Profile pin, so the schema, the map and Google's own
    // listing all describe the same point.
    lat: 32.0790855,
    lng: 34.7950554,
  },

  hours: "א׳-ה׳: 09:00-18:00",

  social: {
    facebook: "https://www.facebook.com/moshiko.amsalem.7",
    instagram: "https://www.instagram.com/amsalem_law",
  },

  // Canonical CID form, as returned by the Places API (`googleMapsUri`). The
  // maps.app.goo.gl share link 302s through tracking parameters.
  googleProfileUrl: "https://maps.google.com/?cid=18236033290523899057",
} as const;

/**
 * Placeholders the client still has to supply. Rendered visibly on the site as
 * `[... - לקבל ממשה]` so nothing fake ever ships, per the brief.
 */
export const STATS = {
  /** Supplied by the client, August 2026. */
  dealsClosed: 60,
  dealsValueMillions: 100,
} as const;

export const PENDING = {
  yearsExperience: "[מספר - לקבל ממשה]",
  accessibilityCoordinator: "[שם ופרטי רכז נגישות - לקבל ממשה]",
  privacyEmail: "[דוא״ל לפניות פרטיות - לקבל ממשה]",
} as const;

export function isPending(value: string) {
  return value.trim().startsWith("[");
}

export function waLink(message: string) {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const WA_MESSAGES = {
  general: "היי משה, הגעתי אליך דרך האתר ואשמח לקבל פרטים נוספים",
  consult: "היי משה, הגעתי אליך דרך האתר ואשמח לשיחת ייעוץ",
  meeting: "היי משה, אשמח לתאם פגישת ייעוץ",
} as const;

// Pinned to the Google Business Profile listing (feature id + coordinates), so
// the embed shows the office card rather than an anonymous point.
export const mapsEmbedUrl =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1690.6!2d34.7950554!3d32.0790855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xac559dd818e0d573%3A0xfd1367a8b9dff4b1!2s%D7%9E%D7%A9%D7%94%20%D7%90%D7%9E%D7%A1%D7%9C%D7%9D%20-%20%D7%9E%D7%A9%D7%A8%D7%93%20%D7%A2%D7%95%D7%A8%D7%9B%D7%99%20%D7%93%D7%99%D7%9F!5e0!3m2!1siw!2sil!4v1700000000000";

export const wazeUrl =
  "https://waze.com/ul?q=דרך%20מנחם%20בגין%20144%20תל%20אביב%20מגדל%20מידטאון&navigate=yes";
