import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, GraduationCap, MapPin, Navigation, Scale, ScrollText } from "lucide-react";
import CTASection from "@/components/CTASection";
import HomeContact from "@/components/HomeContact";
import MidPageCta from "@/components/MidPageCta";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import TestimonialsWhatsApp from "@/components/TestimonialsWhatsApp";
import { BreadcrumbsJsonLd } from "@/components/JsonLd";
import { aboutApproach, aboutPrinciples } from "@/content/home";
import { mapsEmbedUrl, siteConfig, wazeUrl } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "עורך דין משה אמסלם - אודות, השכלה והסמכות",
  description:
    "עורך דין משה אמסלם, תל אביב: תואר ראשון במשפטים מהמכללה למנהל וחבר לשכת עורכי הדין משנת 2021. מתמחה במקרקעין, התחדשות עירונית, צוואות וירושות והסכמי ממון.",
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

const certificates = [
  {
    title: "תעודת חברות בלשכת עורכי הדין",
    file: "/certificates/israel-bar-membership.pdf",
    image: "/certificates/israel-bar-membership.webp",
    alt: "תעודת קבלתו של משה אמסלם כחבר בלשכת עורכי הדין בישראל",
  },
  {
    title: "הסמכה לעריכת ייפוי כוח מתמשך",
    file: "/certificates/enduring-power-of-attorney.pdf",
    image: "/certificates/enduring-power-of-attorney.webp",
    alt: "תעודת ההסמכה של עורך דין משה אמסלם לעריכת ייפוי כוח מתמשך מטעם האפוטרופוס הכללי",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="עורך דין"
        highlight="משה אמסלם"
        subtitle="מקרקעין, התחדשות עירונית וליווי אישי לאורך כל הדרך - ממגדל מידטאון בתל אביב."
        crumbs={crumbs}
      />

      {/* Portrait + bio */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal className="overflow-hidden rounded-lg border border-line">
              <Image
                src="/moshe-amsalem.jpeg"
                alt="דיוקן של עורך דין משה אמסלם"
                width={600}
                height={750}
                className="aspect-[4/5] h-full w-full object-cover object-top"
                priority
              />
            </Reveal>

            <Reveal index={1}>
              <h2 className="heading-lg mb-6 text-ink">
                עו״ד משה אמסלם
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
                className="flex items-start gap-4 border-b border-line py-6"
              >
                <span
                  className="mt-0.5 flex-none"
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

          <div className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">
            {certificates.map((certificate) => (
              <a
                key={certificate.file}
                href={certificate.file}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${certificate.title} - פתיחת PDF בלשונית חדשה`}
                className="group overflow-hidden rounded-lg border border-line bg-white transition-colors hover:border-primary/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                <div className="aspect-[210/297] bg-white p-3">
                  <Image
                    src={certificate.image}
                    alt={certificate.alt}
                    width={991}
                    height={1400}
                    sizes="(max-width: 639px) calc(100vw - 48px), 372px"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="border-t border-line p-4 text-center">
                  <h3 className="font-heading font-bold text-ink">{certificate.title}</h3>
                  <p className="mt-1 text-sm text-primary group-hover:underline">
                    לצפייה בתעודה המלאה (PDF)
                  </p>
                </div>
              </a>
            ))}
          </div>
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
              {aboutPrinciples.map((value, index) => (
                <Reveal
                  key={value.title}
                  index={index}
                  className="border-t border-line pt-5 text-right"
                >
                  <h3 className="mb-2 font-heading text-lg font-bold text-ink">{value.title}</h3>
                  <p className="text-sm text-ink-soft">{value.description}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Client messages - the full set lives here, the home page shows one */}
      <TestimonialsWhatsApp />

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
            <Reveal className="aspect-video overflow-hidden rounded-lg border border-line">
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
                  className="mt-1 flex-shrink-0"
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
                  <p className="mt-2 text-ink-soft">{siteConfig.hours}</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
                <a
                  href={wazeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-3 rounded-md bg-[#33CCFF] px-8 py-4 text-lg font-bold text-dark transition-colors duration-200 hover:bg-[#28b8e8] sm:w-auto"
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
