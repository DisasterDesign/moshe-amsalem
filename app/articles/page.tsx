import ArticleCard from "@/components/ArticleCard";
import CTASection from "@/components/CTASection";
import HomeContact from "@/components/HomeContact";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { BreadcrumbsJsonLd } from "@/components/JsonLd";
import { articles } from "@/content/articles";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "מאמרים ומדריכים - עו״ד משה אמסלם",
  description:
    "מדריכים על מס רכישה, קניית דירה יד שנייה ומקבלן, זכויות דיירים בפינוי-בינוי, ייפוי כוח מתמשך והסכם ממון. מידע שכדאי לדעת לפני שחותמים.",
  path: "/articles",
});

const crumbs = [{ name: "מאמרים", href: "/articles" }];

export default function ArticlesPage() {
  return (
    <>
      <PageHero
        title="מאמרים"
        highlight="ומדריכים"
        subtitle="מדריכים קצרים על הדברים שכדאי לדעת לפני שחותמים. המידע כאן כללי ואינו מהווה ייעוץ משפטי."
        crumbs={crumbs}
      />

      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, i) => (
              <Reveal key={article.slug} index={i} className="h-full">
                <ArticleCard article={article} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
      <HomeContact source="טופס עמוד מאמרים" />

      <BreadcrumbsJsonLd items={crumbs} />
    </>
  );
}
