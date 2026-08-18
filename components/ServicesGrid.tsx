import Link from "next/link";
import Reveal from "./Reveal";
import ServiceCard from "./ServiceCard";
import SectionHeading from "./SectionHeading";
import { practiceAreas } from "@/content/practiceAreas";

export default function ServicesGrid({
  showTitle = true,
  showCTA = true,
}: {
  showTitle?: boolean;
  showCTA?: boolean;
}) {
  return (
    <section id="services" className="section-padding bg-cream">
      <div className="container-custom">
        {showTitle && (
          <SectionHeading
            eyebrow="במה אני יכול לעזור"
            title="תחומי"
            highlight="עיסוק"
            description="ליווי משפטי מקצועי ואישי בכל שלב, עם יחס אנושי ותשומת לב לפרטים."
          />
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {practiceAreas.map((area, index) => (
            <ServiceCard
              key={area.slug}
              slug={area.slug}
              title={area.name}
              description={area.excerpt}
              index={index}
            />
          ))}
        </div>

        {showCTA && (
          <Reveal className="mt-12 text-center">
            <Link href="/services" className="btn-outline">
              לכל תחומי העיסוק
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}
