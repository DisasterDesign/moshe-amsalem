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
    lat: 32.0694,
    lng: 34.7901,
  },

  hours: "א׳-ה׳: 09:00-18:00",

  social: {
    facebook: "https://www.facebook.com/moshiko.amsalem.7",
    instagram: "https://www.instagram.com/moshiko_amsalem",
  },

  googleProfileUrl: "https://maps.app.goo.gl/T2Azt3EGu4W1iXd49",
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

export const mapsEmbedUrl =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3381.2!2d34.7901!3d32.0694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d4b9b0c5f5b1b%3A0x0!2sMidtown%20Tower%2C%20Derech%20Menachem%20Begin%20144%2C%20Tel%20Aviv!5e0!3m2!1siw!2sil!4v1700000000000";

export const wazeUrl =
  "https://waze.com/ul?q=דרך%20מנחם%20בגין%20144%20תל%20אביב%20מגדל%20מידטאון&navigate=yes";
