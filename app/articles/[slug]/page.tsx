import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Info } from "lucide-react";
import ArticleCard from "@/components/ArticleCard";
import HomeContact from "@/components/HomeContact";
import MidPageCta from "@/components/MidPageCta";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { ArticleJsonLd, BreadcrumbsJsonLd } from "@/components/JsonLd";
import { articles, getArticle } from "@/content/articles";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug);
  if (!article) return {};
  return buildMetadata({
    title: article.metaTitle,
    description: article.metaDescription,
    path: `/articles/${article.slug}`,
    type: "article",
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("he-IL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug);
  if (!article) notFound();

  const related = articles.filter((a) => a.slug !== article.slug).slice(0, 3);
  const crumbs = [
    { name: "מאמרים", href: "/articles" },
    { name: article.title, href: `/articles/${article.slug}` },
  ];

  return (
    <>
      <PageHero title={article.title} crumbs={crumbs} />

      <article className="section-padding bg-cream">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl">
            {/* Meta strip */}
            <div className="mb-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-line pb-6 text-sm text-ink-muted">
              <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">
                {article.category}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} aria-hidden="true" />
                <time dateTime={article.date}>{formatDate(article.date)}</time>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} aria-hidden="true" />
                {article.readingMinutes} דקות קריאה
              </span>
            </div>

            {/* Body */}
            <div className="prose-legal">
              {article.blocks.map((block, i) => {
                if (block.type === "h2") {
                  return <h2 key={i}>{block.text}</h2>;
                }
                if (block.type === "ul") {
                  return (
                    <ul key={i}>
                      {block.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  );
                }
                if (block.type === "callout") {
                  return (
                    <aside
                      key={i}
                      className="my-6 flex items-start gap-3 rounded-2xl border-r-4 border-gold bg-gold/10 p-5"
                    >
                      <Info size={19} className="mt-0.5 flex-none text-gold" aria-hidden="true" />
                      <p className="!mb-0 leading-relaxed text-ink-soft">{block.text}</p>
                    </aside>
                  );
                }
                return <p key={i}>{block.text}</p>;
              })}
            </div>

            {/* Disclaimer */}
            <p className="mt-10 rounded-2xl border border-line bg-cream-soft p-5 text-sm leading-relaxed text-ink-muted">
              המידע במאמר זה כללי בלבד ואינו מהווה ייעוץ משפטי או תחליף לו. כל מקרה
              נבחן לגופו, ואין להסתמך על האמור כאן בלי לקבל ייעוץ פרטני המתאים
              לנסיבות שלכם.
            </p>
          </div>
        </div>
      </article>

      <MidPageCta
        title="רוצים לדבר על המקרה שלכם?"
        description="שיחת היכרות קצרה בוואטסאפ או בטלפון, בלי עלות ובלי התחייבות."
        source={`טופס מאמר - ${article.title}`}
        idPrefix={`article-${article.slug}`}
      />

      {/* Related */}
      <section className="section-padding bg-cream-soft">
        <div className="container-custom">
          <SectionHeading title="מאמרים" highlight="נוספים" />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {related.map((a, i) => (
              <Reveal key={a.slug} index={i} className="h-full">
                <ArticleCard article={a} />
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

      <HomeContact source={`טופס מאמר - ${article.title}`} />

      <ArticleJsonLd
        title={article.title}
        description={article.metaDescription}
        slug={article.slug}
        date={article.date}
      />
      <BreadcrumbsJsonLd items={crumbs} />
    </>
  );
}
