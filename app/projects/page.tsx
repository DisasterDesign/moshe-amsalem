import Link from "next/link";
import { Building, MapPin, Users } from "lucide-react";
import CTASection from "@/components/CTASection";
import HomeContact from "@/components/HomeContact";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { BreadcrumbsJsonLd } from "@/components/JsonLd";
import { projects, projectsArePending } from "@/content/projects";
import { isPending } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "פרויקטים - התחדשות עירונית | עו״ד משה אמסלם",
  description:
    "פרויקטים של פינוי-בינוי ותמ״א 38 שבהם ליוויתי בעלי דירות, משלב ההתארגנות ועד קבלת המפתח.",
  path: "/projects",
});

const crumbs = [{ name: "פרויקטים", href: "/projects" }];

/** Renders client data, or a dashed placeholder chip while it is still pending. */
function Field({ value }: { value: string }) {
  return isPending(value) ? <span className="pending-value">{value}</span> : <>{value}</>;
}

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        title="פרויקטים"
        highlight="בהתחדשות עירונית"
        subtitle="ליווי בעלי דירות בפרויקטים של פינוי-בינוי ותמ״א 38, משלב ההתארגנות ועד קבלת המפתח."
        crumbs={crumbs}
      />

      <section className="section-padding bg-cream">
        <div className="container-custom">
          {projectsArePending && (
            <Reveal className="mx-auto mb-10 max-w-3xl rounded-2xl border border-dashed border-gold bg-gold/10 p-5 text-center">
              <p className="text-sm leading-relaxed text-ink-soft">
                <span className="font-bold text-ink">לתשומת לב: </span>
                פרטי הפרויקטים טרם התקבלו. השדות למטה הם שלד ממתין - יש להחליף אותם
                בשמות, בערים ובנתונים האמיתיים בקובץ
                <code className="mx-1 rounded bg-white px-1.5 py-0.5 text-xs">content/projects.ts</code>
                לפני העלייה לאוויר.
              </p>
            </Reveal>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <Reveal
                as="article"
                key={i}
                index={i}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
              >
                <div className="relative flex aspect-[16/10] items-center justify-center bg-gradient-to-bl from-[#2A6072] to-[#153243]">
                  <Building className="h-14 w-14 text-white/25" aria-hidden="true" />
                  <span className="absolute bottom-3 right-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-primary">
                    {project.type}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h2 className="mb-3 font-heading text-lg font-bold text-ink">
                    <Field value={project.name} />
                  </h2>

                  <ul className="mb-4 space-y-2 text-sm text-ink-soft">
                    <li className="flex items-center gap-2">
                      <MapPin size={15} className="flex-none text-primary" aria-hidden="true" />
                      <Field value={project.city} />
                    </li>
                    <li className="flex items-center gap-2">
                      <Users size={15} className="flex-none text-primary" aria-hidden="true" />
                      <Field value={project.units} />
                    </li>
                    <li className="flex items-center gap-2">
                      <Building size={15} className="flex-none text-primary" aria-hidden="true" />
                      <Field value={project.status} />
                    </li>
                  </ul>

                  <p className="flex-1 text-sm leading-relaxed text-ink-soft">
                    <Field value={project.note} />
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-cream-soft">
        <div className="container-custom">
          <SectionHeading
            title="דיירים שמתארגנים"
            highlight="לפרויקט?"
            description="ליווי בעלי דירות בהתחדשות עירונית מתחיל הרבה לפני החתימה מול היזם. אפשר לקרוא על התהליך המלא בעמוד הייעודי."
          />
          <Reveal className="text-center">
            <Link href="/services/urban-renewal" className="btn-outline">
              לעמוד התחדשות עירונית
            </Link>
          </Reveal>
        </div>
      </section>

      <CTASection />
      <HomeContact source="טופס עמוד פרויקטים" />

      <BreadcrumbsJsonLd items={crumbs} />
    </>
  );
}
