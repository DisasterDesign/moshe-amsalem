import Image from "next/image";
import Link from "next/link";
import { Award, BadgeCheck, GraduationCap, MapPin, Navigation, Scale, ScrollText } from "lucide-react";
import CTASection from "@/components/CTASection";
import HomeContact from "@/components/HomeContact";
import MidPageCta from "@/components/MidPageCta";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { BreadcrumbsJsonLd } from "@/components/JsonLd";
import { aboutApproach, aboutPrinciples } from "@/content/home";
import { mapsEmbedUrl, siteConfig, wazeUrl } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "אודות עו״ד משה אמסלם | מקרקעין והתחדשות עירונית",
  description:
    "עו״ד משה אמסלם, בעל תואר במשפטים מהמכללה למנהל וחבר לשכת עורכי הדין משנת 2021. מתמחה במקרקעין, התחדשות עירונית, צוואות וירושות והסכמי ממון.",
  path: "/about",
});

const crumbs = [{ name: "אודות", href: "/about" }];

const credentials = [
  {
    icon: GraduationCap,
    title: "תואר ראשון במשפטים (LLB)",
    detail: "המכללה למנהל, ראשון לציון",
  },
  {
    icon: BadgeCheck,
    title: "חבר לשכת עורכי הדין",
    detail: "משנת 2021",
  },
  {
    icon: ScrollText,
    title: "הסמכה לעריכת ייפוי כוח מתמשך",
    detail: "מטעם האפוטרופוס הכללי",
  },
  {
    icon: Scale,
    title: "התמחות במקרקעין והתחדשות עירונית",
    detail: "עסקאות מגורים ומסחר, פינוי-בינוי ותמ״א 38",
  },
];

const PRINCIPLE_ICONS = [Scale, Award, BadgeCheck, ScrollText];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="אודות"
        highlight="המשרד"
        subtitle="משרד עו״ד משה אמסלם - מקרקעין, התחדשות עירונית וליווי אישי לאורך כל הדרך."
        crumbs={crumbs}
      />

      {/* Portrait + bio */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal className="overflow-hidden rounded-2xl border border-line shadow-lg shadow-primary/5">
              <Image
                src="/moshe-amsalem.jpeg"
                alt="עו״ד משה אמסלם"
                width={600}
                height={750}
                className="aspect-[4/5] h-full w-full object-cover object-top"
                priority
              />
            </Reveal>

            <Reveal index={1}>
              <h2 className="heading-lg mb-6 text-ink">
                עו״ד <span className="text-primary">משה אמסלם</span>
              </h2>
              <div className="space-y-4 text-lg leading-relaxed text-ink-soft">
                <p>
                  עו״ד משה אמסלם בעל תואר ראשון במשפטים (LLB) מהמכללה למנהל בראשון
                  לציון, וחבר לשכת עורכי הדין משנת 2021.
                </p>
                <p>
                  עורך דין המתמחה בתחום המקרקעין וההתחדשות העירונית, בעריכה וליווי של
                  כל סוגי החוזים המסחריים, וכן בכל ענייני צוואות וירושות, לרבות ייפוי
                  כוח מתמשך.
                </p>
                <p>
                  המשרד מספק ליווי משפטי מקצועי ואישי בכל סוגי העסקאות במקרקעין, תוך
                  מתן תשומת לב לפרטים ומחויבות מלאה ללקוח.
                </p>
              </div>

              {/* Client-supplied personal story */}
              <div className="mt-8 rounded-2xl border border-dashed border-gold bg-gold/10 p-5">
                <h3 className="mb-2 font-heading font-bold text-ink">
                  למה בחרתי במקרקעין
                </h3>
                <p className="text-sm leading-relaxed text-ink-soft">
                  [סיפור אישי - לקבל ממשה. פסקה או שתיים בגוף ראשון: מה הביא אותך
                  לתחום המקרקעין, ומה גורם לך להישאר בו. זה החלק שהכי מבדל אתר של
                  עורך דין, ואי אפשר לכתוב אותו במקומך.]
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="section-padding bg-cream-soft">
        <div className="container-custom">
          <SectionHeading title="השכלה" highlight="והסמכות" />

          <div className="grid gap-5 md:grid-cols-2">
            {credentials.map((c, i) => (
              <Reveal
                key={c.title}
                index={i}
                className="flex items-start gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm"
              >
                <span
                  className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-primary/10"
                  aria-hidden="true"
                >
                  <c.icon className="h-6 w-6 text-primary" />
                </span>
                <div>
                  <h3 className="font-heading font-bold text-ink">{c.title}</h3>
                  <p className="mt-1 text-sm text-ink-soft">{c.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mx-auto mt-8 max-w-3xl rounded-2xl border border-dashed border-gold bg-gold/10 p-5 text-center">
            <p className="text-sm leading-relaxed text-ink-soft">
              <span className="font-bold text-ink">תעודות מצולמות: </span>
              [לקבל ממשה - סריקות של תעודת עורך דין, תעודת בוגר ותעודת ההסמכה לייפוי
              כוח מתמשך. יוצגו כגלריה קטנה במקום הבלוק הזה.]
            </p>
          </Reveal>
        </div>
      </section>

      {/* Approach */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <SectionHeading title={aboutApproach.heading} align="start" />

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <Reveal>
              <div className="space-y-4 text-lg leading-relaxed text-ink-soft">
                {aboutApproach.paragraphs.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-2">
              {aboutPrinciples.map((value, index) => {
                const Icon = PRINCIPLE_ICONS[index % PRINCIPLE_ICONS.length];
                return (
                  <Reveal
                    key={value.title}
                    index={index}
                    className="rounded-2xl border border-line bg-white p-6 text-center shadow-sm
                               transition-all duration-300 ease-out hover:-translate-y-1.5
                               hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
                  >
                    <span
                      className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10"
                      aria-hidden="true"
                    >
                      <Icon className="h-7 w-7 text-primary" />
                    </span>
                    <h3 className="mb-2 font-heading text-lg font-bold text-ink">{value.title}</h3>
                    <p className="text-sm text-ink-soft">{value.description}</p>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <MidPageCta
        title="רוצים לדבר איתי ישירות?"
        description="שיחת היכרות קצרה בוואטסאפ או בטלפון, כדי להבין מה נדרש ואיך אפשר לעזור."
        source="טופס אמצע עמוד - אודות"
        idPrefix="about"
      />

      {/* Office location */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <SectionHeading title="מיקום" highlight="המשרד" />

          <div className="grid items-center gap-8 lg:grid-cols-2">
            <Reveal className="aspect-video overflow-hidden rounded-2xl border border-line">
              <iframe
                src={mapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="מיקום המשרד במפת גוגל"
              />
            </Reveal>

            <Reveal index={1} className="text-center lg:text-right">
              <div className="mb-6 flex items-start justify-center gap-4 lg:justify-start">
                <span
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10"
                  aria-hidden="true"
                >
                  <MapPin className="h-6 w-6 text-primary" />
                </span>
                <div className="text-right">
                  <h3 className="mb-2 font-heading text-xl font-bold text-ink">כתובת המשרד</h3>
                  <p className="text-lg text-ink-soft">
                    {siteConfig.address.street}, {siteConfig.address.city}
                  </p>
                  <p className="text-lg text-ink-soft">{siteConfig.address.detail}</p>
                  <p className="mt-2 text-ink-muted">{siteConfig.hours}</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
                <a
                  href={wazeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-3 rounded-lg bg-[#33CCFF] px-8 py-4 text-lg font-bold text-dark transition-all duration-300 hover:scale-105 hover:bg-[#28b8e8] hover:shadow-lg sm:w-auto"
                >
                  <Navigation className="h-6 w-6" aria-hidden="true" />
                  נווטו עם Waze
                </a>
                <Link href="/contact" className="btn-outline w-full text-center sm:w-auto">
                  קביעת פגישה
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CTASection />
      <HomeContact source="טופס עמוד אודות" />

      <BreadcrumbsJsonLd items={crumbs} />
    </>
  );
}
