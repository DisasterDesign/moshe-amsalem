import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

const BASE = siteConfig.url.replace(/\/$/, "");

/**
 * Per-page metadata with a canonical URL and matching Open Graph, so no two
 * pages ship the same title or description.
 */
export function buildMetadata({
  title,
  description,
  path,
  type = "website",
  image = "/og-image.jpg",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  image?: string;
}): Metadata {
  const url = `${BASE}${path === "/" ? "" : path}`;
  return {
    // `absolute` - every page here already carries the firm name, so the root
    // layout's "%s | עו״ד משה אמסלם" template would append it a second time.
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type,
      siteName: siteConfig.name,
      locale: "he_IL",
      // og-image.jpg really is 1200x630. Article covers passed in here are
      // 1600x900 - same 16:9 shape, and platforms scale to fit - so the
      // declared pair stays a faithful aspect hint either way.
      images: [{ url: `${BASE}${image}`, width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${BASE}${image}`],
    },
  };
}
