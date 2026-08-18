import LegalPageView from "@/components/LegalPageView";
import { BreadcrumbsJsonLd } from "@/components/JsonLd";
import { privacyPolicy as page } from "@/content/legal";
import { buildMetadata } from "@/lib/seo";

const PATH = "/legal/privacy";

export const metadata = buildMetadata({
  title: `${page.title} - עו״ד משה אמסלם`,
  description: page.metaDescription,
  path: PATH,
});

export default function Page() {
  return (
    <>
      <LegalPageView page={page} href={PATH} />
      <BreadcrumbsJsonLd items={[{ name: page.title, href: PATH }]} />
    </>
  );
}
