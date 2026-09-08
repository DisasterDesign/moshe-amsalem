import { FileSignature, Handshake, KeyRound, MessageSquare } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const steps = [
  {
    icon: MessageSquare,
    title: "שיחת היכרות",
    description: "שיחה קצרה להבנת הצורך - בלי עלות ובלי התחייבות.",
  },
  {
    icon: Handshake,
    title: "פגישת ייעוץ",
    description: "נפגשים, בוחנים את התיק ומסבירים את האפשרויות בפשטות.",
  },
  {
    icon: FileSignature,
    title: "ליווי וטיפול",
    description: "עריכת מסמכים, ניהול משא ומתן וייצוג לאורך כל הדרך.",
  },
  {
    icon: KeyRound,
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
            <Reveal key={step.title} index={index} className="relative text-center">
              <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
                <step.icon className="h-7 w-7" aria-hidden="true" />
                <span
                  aria-hidden="true"
                  className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-gold text-sm font-bold text-dark"
                >
                  {index + 1}
                </span>
              </div>
              <h3 className="mb-2 font-heading text-lg font-bold text-ink">{step.title}</h3>
              <p className="text-sm leading-relaxed text-ink-soft">{step.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
