import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, UserCheck } from "lucide-react";
import CTASection from "@/components/CTASection";
import FAQAccordion from "@/components/FAQAccordion";
import HomeContact from "@/components/HomeContact";
import MidPageCta from "@/components/MidPageCta";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { BreadcrumbsJsonLd, FaqJsonLd, ServiceJsonLd } from "@/components/JsonLd";
import { iconFor } from "@/components/practiceIcons";
import { getPracticeArea, practiceAreas } from "@/content/practiceAreas";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return practiceAreas.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const area = getPracticeArea(params.slug);
  if (!area) return {};
  return buildMetadata({
    title: area.metaTitle,
    description: area.metaDescription,
    path: `/services/${area.slug}`,
  });
}

export default function PracticeAreaPage({ params }: { params: { slug: string } }) {
  const area = getPracticeArea(params.slug);
  if (!area) notFound();

  const Icon = iconFor(area.slug);
  const others = practiceAreas.filter((a) => a.slug !== area.slug);
  const crumbs = [
    { name: "תחומי עיסוק", href: "/services" },
    { name: area.name, href: `/services/${area.slug}` },
  ];

  return (
    <>
      <PageHero title={area.title} subtitle={area.tagline} crumbs={crumbs} />

      {/* Intro */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:gap-12">
            <Reveal className="hidden lg:block">
              <div
                className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10"
                aria-hidden="true"
              >
                <Icon className="h-12 w-12 text-primary" />
              </div>
            </Reveal>

            <Reveal>
              <div className="max-w-3xl space-y-5">
                {area.intro.map((p) => (
                  <p key={p.slice(0, 24)} className="text-body">
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* What the work covers */}
      <section className="section-padding bg-cream-soft">
        <div className="container-custom">
          <SectionHeading
            eyebrow="מה כולל הליווי"
            title="מה אני עושה"
            highlight="בפועל"
            align="start"
          />

          <div className="grid gap-5 md:grid-cols-2">
            {area.includes.map((item, i) => (
              <Reveal
                key={item.title}
                index={i}
                className="flex gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm"
              >
                <span
                  className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-primary/10"
                  aria-hidden="true"
                >
                  <Check className="h-4 w-4 text-primary" strokeWidth={3} />
                </span>
                <div>
                  <h3 className="mb-1.5 font-heading text-lg font-bold text-ink">{item.title}</h3>
                  <p className="leading-relaxed text-ink-soft">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Who it is for */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <SectionHeading title="למי זה" highlight="מתאים" align="start" />

          <ul className="grid gap-4 md:grid-cols-2">
            {area.forWhom.map((item, i) => (
              <Reveal
                as="li"
                key={item}
                index={i}
                className="flex items-start gap-4 rounded-2xl border-r-4 border-gold bg-cream-soft p-5"
              >
                <UserCheck className="mt-0.5 h-5 w-5 flex-none text-gold" aria-hidden="true" />
                <span className="leading-relaxed text-ink-soft">{item}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <MidPageCta
        title={`שאלה על ${area.name}?`}
        description="אפשר לשלוח הודעה קצרה בוואטסאפ, להתקשר, או להשאיר פרטים ואחזור אליכם. שיחת היכרות ראשונה ללא עלות."
        source={`טופס אמצע עמוד - ${area.name}`}
        idPrefix={`area-${area.slug}`}
      />

      {/* FAQ */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <SectionHeading
            eyebrow={area.name}
            title="שאלות"
            highlight="נפוצות בתחום"
          />
          <FAQAccordion items={area.faq} />
        </div>
      </section>

      {/* Other areas */}
      <section className="section-padding bg-cream-soft">
        <div className="container-custom">
          <SectionHeading title="תחומי עיסוק" highlight="נוספים" />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {others.map((other, i) => {
              const OtherIcon = iconFor(other.slug);
              return (
                <Reveal key={other.slug} index={i} className="h-full">
                  <Link
                    href={`/services/${other.slug}`}
                    className="group flex h-full flex-col items-center gap-3 rounded-2xl border border-line bg-white p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                  >
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary"
                      aria-hidden="true"
                    >
                      <OtherIcon className="h-6 w-6 text-primary transition-colors group-hover:text-white" />
                    </span>
                    <span className="font-heading text-sm font-bold text-ink transition-colors group-hover:text-primary">
                      {other.name}
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>

          <Reveal className="mt-10 text-center">
            <Link href="/services" className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline">
              לכל תחומי העיסוק
              <ArrowLeft size={16} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>

      <CTASection />
      <HomeContact source={`טופס תחום - ${area.name}`} />

      <ServiceJsonLd name={area.title} description={area.metaDescription} slug={area.slug} />
      <FaqJsonLd items={area.faq} />
      <BreadcrumbsJsonLd items={crumbs} />
    </>
  );
}
