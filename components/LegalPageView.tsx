import PageHero from "./PageHero";
import Reveal from "./Reveal";
import type { LegalPage } from "@/content/types";

export default function LegalPageView({
  page,
  href,
}: {
  page: LegalPage;
  href: string;
}) {
  return (
    <>
      <PageHero title={page.title} crumbs={[{ name: page.title, href }]} />

      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <p className="text-body border-r-4 border-primary pr-5">{page.intro}</p>
            </Reveal>

            <div className="prose-legal mt-4">
              {page.sections.map((section, i) => (
                <Reveal key={section.heading} index={i > 2 ? 3 : i}>
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map((p) => (
                    <p key={p.slice(0, 24)}>{p}</p>
                  ))}
                  {section.bullets && section.bullets.length > 0 && (
                    <ul>
                      {section.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  )}
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
