"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, Camera, ChevronRight, ChevronLeft } from "lucide-react";

/**
 * PLACEHOLDER testimonials — to be replaced with the real WhatsApp screenshots
 * extracted from the client's chat (with written consent + PII blurred).
 * Drop the real screenshot into /public/testimonials and set `realSrc`.
 */
type Testimonial = {
  name: string;
  initials: string;
  context: string;
  messages: string[];
  time: string;
  realSrc?: string;
};

const testimonials: Testimonial[] = [
  {
    name: "חני",
    initials: "ח",
    context: "לקוחה",
    messages: [
      "כל הכבוד לך, אין עליך! כולך לב אחד גדול 🤍",
      "ה׳ ישמור אותך ותראה רק נחת ואור בחיים. תודה רבה רבה 🙏",
    ],
    time: "13:10",
    realSrc: "/testimonials/chani.png",
  },
  {
    name: "מיכאל ח.",
    initials: "מ",
    context: "לקוח · ליווי אישי",
    messages: [
      "תודה על הליווי לחיים חדשים. זה לא היה קורה בלי העזרה שלך 🤍🌻🙏",
    ],
    time: "13:29",
    realSrc: "/testimonials/michael.png",
  },
  {
    name: "אפרת",
    initials: "א",
    context: "לקוחה",
    messages: [
      "שיקו יקירנו, תודה על שירות מעל ומעבר 🤍",
      "תודה שאתה תמיד זמין, במאור פנים ובעצות טובות. מעריכים ומוקירים!",
    ],
    time: "8:18",
  },
];

function ChatCard({ t }: { t: Testimonial }) {
  const [showReal, setShowReal] = useState(false);

  return (
    <div
      className="relative w-[300px] flex-none snap-center overflow-hidden rounded-2xl border border-line bg-white shadow-md"
      onMouseEnter={() => setShowReal(true)}
      onMouseLeave={() => setShowReal(false)}
      dir="rtl"
    >
      {/* WhatsApp header */}
      <div className="flex items-center gap-3 bg-whatsapp-header px-4 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">
          {t.initials}
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold text-white">{t.name}</div>
          <div className="text-[11px] text-white/70">{t.context}</div>
        </div>
      </div>

      {/* Chat body */}
      <div className="relative min-h-[190px] bg-whatsapp-wall px-3 py-4">
        <div className="space-y-2">
          {t.messages.map((m, i) => (
            <div key={i} className="flex justify-end">
              <div className="relative max-w-[85%] rounded-xl rounded-tr-sm bg-whatsapp-bubble px-3 py-2 shadow-sm">
                <p className="text-[13px] leading-relaxed text-ink">{m}</p>
                <div className="mt-1 flex items-center justify-end gap-1">
                  <span className="text-[10px] text-ink-muted">{t.time}</span>
                  <span className="flex text-[#34B7F1]">
                    <Check size={12} className="-ml-1.5" />
                    <Check size={12} className="-ml-2.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reveal overlay: real original screenshot (or placeholder) */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/95 p-4 text-center transition-opacity duration-300 ${
            showReal ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          {t.realSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={t.realSrc}
              alt={`צילום מסך של הודעת תודה מ${t.name}`}
              className="max-h-full max-w-full rounded-lg border border-line object-contain"
            />
          ) : (
            <>
              <Camera className="h-8 w-8 text-primary" />
              <p className="text-xs font-medium text-ink">צילום השיחה המקורי</p>
              <p className="text-[11px] text-ink-muted">יתווסף לאחר אישור הלקוח</p>
            </>
          )}
        </div>
      </div>

      {/* Reveal toggle (touch / keyboard) */}
      <button
        type="button"
        onClick={() => setShowReal((v) => !v)}
        className="flex w-full items-center justify-center gap-1.5 border-t border-line py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/5"
        aria-pressed={showReal}
      >
        <Camera size={13} />
        {showReal ? "חזרה להודעה" : "הצגת הצילום המקורי"}
      </button>
    </div>
  );
}

export default function TestimonialsWhatsApp() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const scroll = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <section className="section-padding bg-cream overflow-hidden">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-right"
        >
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              מילים של לקוחות
            </span>
            <h2 className="heading-lg mt-3 text-ink">
              המלצות <span className="text-primary">אמיתיות</span>
            </h2>
          </div>

          {/* Arrows (RTL: right = previous) */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label="ההמלצה הקודמת"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink transition-colors hover:bg-primary hover:text-white"
            >
              <ChevronRight size={20} />
            </button>
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label="ההמלצה הבאה"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink transition-colors hover:bg-primary hover:text-white"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
        </motion.div>

        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {testimonials.map((t) => (
            <ChatCard key={t.name} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
