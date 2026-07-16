"use client";

import { motion } from "framer-motion";
import { MessageSquare, Handshake, FileSignature, KeyRound } from "lucide-react";

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
    <section className="section-padding bg-cream-soft">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            פשוט וברור
          </span>
          <h2 className="heading-lg mt-3 mb-4 text-ink">
            איך <span className="text-primary">עובדים יחד</span>
          </h2>
          <p className="text-ink-soft text-lg max-w-2xl mx-auto">
            תהליך שקוף בארבעה שלבים - כדי שתדעו בדיוק למה לצפות בכל רגע.
          </p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative text-center"
            >
              <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
                <step.icon className="h-7 w-7" />
                <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-gold text-sm font-bold text-dark">
                  {index + 1}
                </span>
              </div>
              <h3 className="font-heading text-lg font-bold text-ink mb-2">{step.title}</h3>
              <p className="text-ink-soft text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
