import { siteConfig } from "@/config/site";

const BASE = siteConfig.url.replace(/\/$/, "");

/** The office serves clients across Israel from Tel Aviv. City first, so the local signal is explicit. */
const AREA_SERVED = [
  { "@type": "City", name: "תל אביב-יפו" },
  { "@type": "Country", name: "Israel" },
];

function Script({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Site-wide graph: the firm, the attorney, and the website. Emitted once in the root layout. */
export function OrganizationJsonLd({ areaNames }: { areaNames: string[] }) {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LegalService",
        "@id": `${BASE}/#legalservice`,
        name: siteConfig.legalName,
        // The full "עורך דין" form is how people search; the site's own copy
        // uses the abbreviation. Names only - no city or service keywords.
        alternateName: [siteConfig.name, "עורך דין משה אמסלם", "משרד עורכי דין משה אמסלם"],
        url: BASE,
        image: `${BASE}/moshe-amsalem.jpeg`,
        logo: `${BASE}/sinbol.svg`,
        telephone: siteConfig.phoneIntl,
        email: siteConfig.email,
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          streetAddress: siteConfig.address.street,
          addressLocality: siteConfig.address.city,
          addressRegion: "מחוז תל אביב",
          postalCode: siteConfig.address.postalCode,
          addressCountry: siteConfig.address.country,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: siteConfig.address.lat,
          longitude: siteConfig.address.lng,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
            opens: "09:00",
            closes: "18:00",
          },
        ],
        hasMap: siteConfig.googleProfileUrl,
        areaServed: AREA_SERVED,
        knowsLanguage: ["he", "en"],
        sameAs: [siteConfig.social.facebook, siteConfig.social.instagram, siteConfig.googleProfileUrl],
        founder: { "@id": `${BASE}/#person` },
        employee: { "@id": `${BASE}/#person` },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "תחומי עיסוק",
          itemListElement: areaNames.map((name) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name },
          })),
        },
      },
      {
        "@type": "Person",
        "@id": `${BASE}/#person`,
        name: "משה אמסלם",
        // Latin spelling and the "מושיקו" nickname wait for the client to confirm
        // he uses them publicly.
        alternateName: ["עו״ד משה אמסלם", "עורך דין משה אמסלם"],
        honorificPrefix: "עו״ד",
        jobTitle: "עורך דין",
        image: `${BASE}/moshe-amsalem.jpeg`,
        url: `${BASE}/about`,
        telephone: siteConfig.phoneIntl,
        email: siteConfig.email,
        worksFor: { "@id": `${BASE}/#legalservice` },
        memberOf: { "@type": "Organization", name: "לשכת עורכי הדין בישראל" },
        alumniOf: { "@type": "CollegeOrUniversity", name: "המכללה למנהל, ראשון לציון" },
        knowsAbout: areaNames,
        sameAs: [siteConfig.social.facebook, siteConfig.social.instagram],
      },
      {
        "@type": "WebSite",
        "@id": `${BASE}/#website`,
        url: BASE,
        name: siteConfig.name,
        alternateName: ["עורך דין משה אמסלם", siteConfig.legalName],
        inLanguage: "he-IL",
        publisher: { "@id": `${BASE}/#legalservice` },
      },
    ],
  };
  return <Script data={data} />;
}

/**
 * Mirrors the visible trail in PageHero, which always opens with "בית". Google
 * also needs at least two items, so a single-level page still qualifies.
 */
export function BreadcrumbsJsonLd({ items }: { items: { name: string; href: string }[] }) {
  const trail = [{ name: "בית", href: "/" }, ...items];
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.href.startsWith("http") ? c.href : c.href === "/" ? BASE : `${BASE}${c.href}`,
    })),
  };
  return <Script data={data} />;
}

export function FaqJsonLd({ items }: { items: { q: string; a: string }[] }) {
  if (items.length === 0) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return <Script data={data} />;
}

export function ServiceJsonLd({
  name,
  description,
  slug,
}: {
  name: string;
  description: string;
  slug: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType: name,
    url: `${BASE}/services/${slug}`,
    provider: { "@id": `${BASE}/#legalservice` },
    areaServed: AREA_SERVED,
  };
  return <Script data={data} />;
}

export function ArticleJsonLd({
  title,
  description,
  slug,
  date,
}: {
  title: string;
  description: string;
  slug: string;
  date: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    inLanguage: "he-IL",
    datePublished: date,
    dateModified: date,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE}/articles/${slug}` },
    author: { "@type": "Person", "@id": `${BASE}/#person`, name: "משה אמסלם", url: `${BASE}/about` },
    publisher: { "@id": `${BASE}/#legalservice` },
  };
  return <Script data={data} />;
}
