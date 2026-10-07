import type { MetadataRoute } from "next";
import { articles } from "@/content/articles";
import { practiceAreas } from "@/content/practiceAreas";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

const BASE = siteConfig.url.replace(/\/$/, "");

/**
 * `lastModified` only where it is true. Stamping the build time on every URL
 * teaches Google that this site's lastmod is noise - and then it ignores the
 * real article dates too. Static pages simply omit it.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const top: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/about`, changeFrequency: "yearly", priority: 0.8 },
    { url: `${BASE}/services`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/timeline`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${BASE}/articles`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/projects`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/contact`, changeFrequency: "yearly", priority: 0.7 },
  ];

  const areas: MetadataRoute.Sitemap = practiceAreas.map((a) => ({
    url: `${BASE}/services/${a.slug}`,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const posts: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE}/articles/${a.slug}`,
    lastModified: new Date(a.date),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  const legal: MetadataRoute.Sitemap = ["privacy", "terms", "accessibility"].map((slug) => ({
    url: `${BASE}/legal/${slug}`,
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  return [...top, ...areas, ...posts, ...legal];
}
