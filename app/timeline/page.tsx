import CTASection from "@/components/CTASection";
import PageHero from "@/components/PageHero";
import Timeline from "@/components/Timeline";
import { BreadcrumbsJsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "שלבי עסקת נדל״ן - המדריך המלא | עו״ד משה אמסלם",
  description:
    "חמשת שלבי עסקת הנדל״ן - בדיקות ומשא ומתן, זיכרון דברים, משכנתא ובדיקות מעמיקות, חתימת חוזה מחייב ורישום ומסירה - ומה עלול להשתבש בכל שלב בלי ליווי משפטי.",
  path: "/timeline",
});

const crumbs = [{ name: "שלבי עסקה", href: "/timeline" }];

export default function TimelinePage() {
  return (
    <>
      <PageHero
        title="שלבי"
        highlight="עסקת נדל״ן"
        subtitle="מהרגע שמצאתם נכס ועד שהמפתח והרישום אצלכם - חמישה שלבים, מה קורה בכל אחד מהם ומה חשוב לבדוק לפני שממשיכים הלאה."
        crumbs={crumbs}
      />

      <Timeline />
      <CTASection />

      <BreadcrumbsJsonLd items={crumbs} />
    </>
  );
}
