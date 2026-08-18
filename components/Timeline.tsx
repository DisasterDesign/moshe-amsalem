import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { dealTimeline } from "@/content/home";

/**
 * The five stages of a residential transaction.
 * Each stage carries a `risk` line - what tends to go wrong here without
 * counsel - which is the part of this section the client singled out.
 */
export default function Timeline() {
  return (
    <section id="timeline" className="section-padding scroll-mt-28 bg-cream-soft">
      <div className="container-custom">
        <SectionHeading
          eyebrow="שלב אחרי שלב"
          title="ציר הזמן של"
          highlight="עסקת נדל״ן"
          description="חמישה שלבים מהרגע שמצאתם נכס ועד שהמפתח והרישום אצלכם. בכל שלב מסומן גם מה עלול להשתבש בלי ליווי משפטי."
        />

        <ol className="relative mx-auto max-w-4xl">
          {/* Spine */}
          <span
            aria-hidden="true"
            className="absolute right-6 top-4 hidden h-[calc(100%-2rem)] w-px bg-line md:block"
          />

          {dealTimeline.map((stage, i) => (
            <li key={stage.title} className="relative md:pr-20">
              <Reveal index={i} className="block pb-10">
                {/* Step number */}
                <span
                  aria-hidden="true"
                  className="absolute right-0 top-0 hidden h-12 w-12 items-center justify-center
                             rounded-full border-4 border-cream bg-primary font-heading text-lg
                             font-bold text-white md:flex"
                >
                  {i + 1}
                </span>

                <div className="rounded-2xl border border-line bg-white p-6 shadow-sm md:p-7">
                  <div className="mb-3 flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 flex-none items-center justify-center rounded-full
                                 bg-primary font-heading text-sm font-bold text-white md:hidden"
                    >
                      {i + 1}
                    </span>
                    <h3 className="font-heading text-xl font-bold text-ink">
                      <span className="sr-only-focusable">שלב {i + 1}: </span>
                      {stage.title}
                    </h3>
                  </div>

                  <p className="mb-3 font-medium text-primary">{stage.summary}</p>
                  <p className="leading-relaxed text-ink-soft">{stage.detail}</p>

                  <div className="mt-5 flex items-start gap-3 rounded-xl border-r-4 border-gold bg-gold/10 p-4">
                    <AlertTriangle
                      size={18}
                      className="mt-0.5 flex-none text-gold"
                      aria-hidden="true"
                    />
                    <p className="text-sm leading-relaxed text-ink-soft">
                      <span className="font-bold text-ink">בלי ליווי משפטי: </span>
                      {stage.risk}
                    </p>
                  </div>

                  {stage.article && (
                    <Link
                      href={`/articles/${stage.article}`}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                    >
                      למאמר המלא בנושא
                      <ArrowLeft size={15} aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
