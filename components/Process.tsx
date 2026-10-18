import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const steps = [
  {
    title: "שיחת היכרות",
    description: "שיחה קצרה להבנת הצורך - בלי עלות ובלי התחייבות.",
  },
  {
    title: "פגישת ייעוץ",
    description: "נפגשים, בוחנים את התיק ומסבירים את האפשרויות בפשטות.",
  },
  {
    title: "ליווי וטיפול",
    description: "עריכת מסמכים, ניהול משא ומתן וייצוג לאורך כל הדרך.",
  },
  {
    title: "סגירה בראש שקט",
    description: "חתימה, רישום הזכויות וזמינות גם אחרי העסקה.",
  },
];

export default function Process() {
  return (
    <section className="section-padding bg-cream">
      <div className="container-custom">
        <SectionHeading
          title="איך עובדים יחד"
          description="תהליך שקוף בארבעה שלבים, כדי שתדעו למה לצפות."
        />

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Reveal key={step.title} index={index} className="border-t border-line pt-5 text-right">
              <span className="mb-4 block font-heading text-sm font-medium text-primary" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mb-2 font-heading text-lg font-bold text-ink">{step.title}</h3>
              <p className="text-sm leading-relaxed text-ink-soft">{step.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
