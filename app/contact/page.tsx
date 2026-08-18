import HomeContact from "@/components/HomeContact";
import PageHero from "@/components/PageHero";
import { BreadcrumbsJsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "צור קשר - עו״ד משה אמסלם | מגדל מידטאון תל אביב",
  description:
    "יצירת קשר עם עו״ד משה אמסלם: טלפון 052-4337633, וואטסאפ, דוא״ל וטופס פנייה. המשרד בדרך מנחם בגין 144, מגדל מידטאון קומה 36, תל אביב.",
  path: "/contact",
});

const crumbs = [{ name: "צור קשר", href: "/contact" }];

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="צור"
        highlight="קשר"
        subtitle="נשמח לשמוע מכם ולסייע בכל שאלה או פנייה - בטלפון, בוואטסאפ, בדוא״ל או דרך הטופס."
        crumbs={crumbs}
      />

      <HomeContact source="טופס עמוד צור קשר" />

      <BreadcrumbsJsonLd items={crumbs} />
    </>
  );
}
