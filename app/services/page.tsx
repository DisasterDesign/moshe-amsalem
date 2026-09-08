import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CTASection from "@/components/CTASection";
import HomeContact from "@/components/HomeContact";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import ServicesGrid from "@/components/ServicesGrid";
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

      {/* Quiet pointer to the full deal timeline, which lives on its own page. */}
      <section className="bg-cream pb-16 md:pb-24">
        <div className="container-custom text-center">
          <Reveal>
            <Link
              href="/timeline"
              className="inline-flex items-center gap-2 font-medium text-ink-soft transition-colors hover:text-primary"
            >
              איפה אתם בעסקה? מדריך השלבים המלא
              <ArrowLeft size={17} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>

      <CTASection />
      <HomeContact source="טופס עמוד תחומי עיסוק" />

      <BreadcrumbsJsonLd items={crumbs} />
    </>
  );
}
