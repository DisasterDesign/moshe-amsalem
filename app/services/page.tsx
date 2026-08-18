import CTASection from "@/components/CTASection";
import HomeContact from "@/components/HomeContact";
import PageHero from "@/components/PageHero";
import ServicesGrid from "@/components/ServicesGrid";
import Timeline from "@/components/Timeline";
import { BreadcrumbsJsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "תחומי עיסוק - עו״ד משה אמסלם | מקרקעין, התחדשות עירונית, צוואות",
  description:
    "ששה תחומי עיסוק: עסקאות מקרקעין, שכירות, התחדשות עירונית, צוואות וירושות, הסכמי ממון וייפוי כוח מתמשך. ליווי משפטי אישי מתחילת התהליך ועד סופו.",
  path: "/services",
});

const crumbs = [{ name: "תחומי עיסוק", href: "/services" }];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="תחומי"
        highlight="עיסוק"
        subtitle="ליווי משפטי מקצועי ואישי במגוון תחומים - עם יחס אנושי ותשומת לב לפרטים. לכל תחום עמוד ייעודי עם פירוט מלא של התהליך."
        crumbs={crumbs}
      />

      <ServicesGrid showTitle={false} showCTA={false} />
      <Timeline />
      <CTASection />
      <HomeContact source="טופס עמוד תחומי עיסוק" />

      <BreadcrumbsJsonLd items={crumbs} />
    </>
  );
}
