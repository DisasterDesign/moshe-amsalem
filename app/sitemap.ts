import type { MetadataRoute } from "next";
import { articles } from "@/content/articles";
import { practiceAreas } from "@/content/practiceAreas";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

const BASE = siteConfig.url.replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const top: MetadataRoute.Sitemap = (
    [
      { url: BASE, changeFrequency: "monthly", priority: 1 },
      { url: `${BASE}/about`, changeFrequency: "yearly", priority: 0.8 },
      { url: `${BASE}/services`, changeFrequency: "monthly", priority: 0.9 },
      { url: `${BASE}/articles`, changeFrequency: "weekly", priority: 0.8 },
      { url: `${BASE}/projects`, changeFrequency: "monthly", priority: 0.6 },
      { url: `${BASE}/contact`, changeFrequency: "yearly", priority: 0.7 },
    ] as const
  ).map((e) => ({ ...e, lastModified: now }));

  const areas: MetadataRoute.Sitemap = practiceAreas.map((a) => ({
    url: `${BASE}/services/${a.slug}`,
    lastModified: now,
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
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  return [...top, ...areas, ...posts, ...legal];
}
