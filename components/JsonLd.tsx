import { siteConfig } from "@/config/site";

const BASE = siteConfig.url.replace(/\/$/, "");

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
        alternateName: siteConfig.name,
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
        areaServed: { "@type": "Country", name: "Israel" },
        knowsLanguage: ["he", "en"],
        sameAs: [siteConfig.social.facebook, siteConfig.social.instagram, siteConfig.googleProfileUrl],
        founder: { "@id": `${BASE}/#person` },
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
        inLanguage: "he-IL",
        publisher: { "@id": `${BASE}/#legalservice` },
      },
    ],
  };
  return <Script data={data} />;
}

export function BreadcrumbsJsonLd({ items }: { items: { name: string; href: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.href.startsWith("http") ? c.href : `${BASE}${c.href}`,
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
    areaServed: { "@type": "Country", name: "Israel" },
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
    author: { "@id": `${BASE}/#person` },
    publisher: { "@id": `${BASE}/#legalservice` },
  };
  return <Script data={data} />;
}
