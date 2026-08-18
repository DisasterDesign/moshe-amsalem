import { FileSignature, Handshake, KeyRound, MessageSquare } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const steps = [
  {
    icon: MessageSquare,
    title: "שיחת היכרות",
    description: "שיחה קצרה בוואטסאפ או בטלפון להבנת הצורך - בלי התחייבות ובלי עלות.",
  },
  {
    icon: Handshake,
    title: "פגישת ייעוץ",
    description: "נפגשים, בוחנים את התיק לעומק, ומסבירים את התהליך והאפשרויות בשפה ברורה.",
  },
  {
    icon: FileSignature,
    title: "ליווי וטיפול",
    description: "עריכת המסמכים, ניהול המשא ומתן וייצוג מולכם ומול כל הגורמים - לאורך כל הדרך.",
  },
  {
    icon: KeyRound,
    title: "סגירה בראש שקט",
    description: "חתימה, רישום הזכויות והשלמת העסקה - עם ליווי וזמינות גם אחרי.",
  },
];

export default function Process() {
  return (
    <section className="section-padding bg-cream">
      <div className="container-custom">
        <SectionHeading
          eyebrow="פשוט וברור"
          title="איך"
          highlight="עובדים יחד"
          description="תהליך שקוף בארבעה שלבים - כדי שתדעו בדיוק למה לצפות בכל רגע."
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
