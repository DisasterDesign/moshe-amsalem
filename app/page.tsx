import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ArticleCard from "@/components/ArticleCard";
import Counters from "@/components/Counters";
import CTASection from "@/components/CTASection";
import FAQAccordion from "@/components/FAQAccordion";
import GoogleReviews from "@/components/GoogleReviews";
import Hero from "@/components/Hero";
import HomeContact from "@/components/HomeContact";
import Process from "@/components/Process";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import ServicesGrid from "@/components/ServicesGrid";
import { FaqJsonLd } from "@/components/JsonLd";
import { articles } from "@/content/articles";
import { homeFaq } from "@/content/home";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "עורך דין משה אמסלם, תל אביב | מקרקעין והתחדשות עירונית",
  description:
    "עורך דין משה אמסלם, מגדל מידטאון תל אביב: ליווי משפטי אישי בעסקאות מקרקעין, פינוי-בינוי ותמ״א 38, צוואות וירושות והסכמי ממון. שיחת ייעוץ ראשונה ללא התחייבות.",
  path: "/",
});

export default function Home() {
  const latest = articles.slice(0, 3);

  return (
    <>
      <Hero />
      <Counters />
      <ServicesGrid />
      <Process />

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

      <GoogleReviews />

      {/* FAQ */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <SectionHeading
            title="שאלות נפוצות"
            description="התשובות לשאלות שאני נשאל הכי הרבה. לא מצאתם את שלכם? אפשר פשוט לשאול."
          />
          <FAQAccordion items={homeFaq} />
        </div>
      </section>

      {/* Latest articles */}
      <section className="section-padding bg-cream-soft">
        <div className="container-custom">
          <SectionHeading
            title="מאמרים אחרונים"
            description="מדריכים קצרים על הדברים שכדאי לדעת לפני שחותמים."
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latest.map((article, i) => (
              <Reveal key={article.slug} index={i} className="h-full">
                <ArticleCard article={article} />
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12 text-center">
            <Link href="/articles" className="btn-outline inline-flex items-center gap-2">
              לכל המאמרים
              <ArrowLeft size={17} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>

      <CTASection />
      <HomeContact source="טופס עמוד הבית" />

      <FaqJsonLd items={homeFaq} />
    </>
  );
}
