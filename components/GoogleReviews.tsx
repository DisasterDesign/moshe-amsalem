"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

/**
 * Real Google reviews for משה אמסלם - משרד עורכי דין, curated manually
 * (per DECISIONS.md — the official Places API caps at ~5 reviews and its ToS
 * restricts caching). Snapshot: 5.0★ · 4 reviews (July 2026). Refresh periodically,
 * or wire a Featurable headless feed later. Attribution: author name + profile link.
 */
const REVIEWS = [
  {
    name: "שלו אלימלך",
    initials: "שא",
    rating: 5,
    time: "לפני 3 חודשים",
    text: "אני רוצה להמליץ בחום על עורך הדין משה אמסלם. קיבלתי ממנו שירות מקצועי, יסודי ואמין לאורך כל הדרך. הוא היה זמין לכל שאלה, הסביר כל שלב בצורה ברורה ונתן לי תחושת ביטחון מלאה בתהליך.",
  },
  {
    name: "Efrat Shoshana",
    initials: "ES",
    rating: 5,
    time: "לפני חודש",
    text: "זכות גדולה לעבוד עם עורך דין משה אמסלם. עברנו יחד כמה עסקאות והוא תמיד היה שם בשבילי – זמין, קשוב ומנוסה מאוד. הוא הופך כל תהליך מורכב לפשוט ורגוע בזכות האדיבות והאכפתיות שלו. מי שמחפש ליווי צמוד ומקצועי, זו הכתובת. תודה על הכל!",
  },
  {
    name: "נווה לוצקי",
    initials: "נל",
    rating: 5,
    time: "לפני חודשיים",
    text: "מושיקו ליווה אותי בעסקת רכישה של דירה, מקצועי מאוד, זמין ונעים. ממליץ בחום!",
  },
  {
    name: "Yossi Parienti",
    initials: "YP",
    rating: 5,
    time: "לפני 4 חודשים",
    text: "היה לי איתו כמה וכמה עבודות, עורך דין נאמן מאוד, יסודי מאוד. בקיצור — מומלץ!",
  },
];

const GOOGLE_PROFILE_URL = "https://maps.app.goo.gl/6nsUfK3hiMxV23n29";
const RATING = "5.0";
const COUNT = "4";

function GoogleG({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
      <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
      <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z" />
      <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" />
    </svg>
  );
}

export default function GoogleReviews() {
  return (
    <section className="section-padding bg-cream-soft">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex flex-col items-center gap-4 rounded-2xl border border-line bg-white p-6 text-center shadow-sm md:flex-row md:justify-between md:text-right"
        >
          <div className="flex items-center gap-4">
            <GoogleG className="h-10 w-10" />
            <div>
              <div className="font-heading text-lg font-bold text-ink">ביקורות Google</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-ink">{RATING}</span>
                <span className="flex text-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-current" />
                  ))}
                </span>
                <span className="text-sm text-ink-muted">({COUNT} ביקורות)</span>
              </div>
            </div>
          </div>
          <a
            href={GOOGLE_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            לכל הביקורות בגוגל
          </a>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {REVIEWS.map((r, index) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-2xl border border-line bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                  {r.initials}
                </div>
                <div>
                  <div className="font-semibold text-ink">{r.name}</div>
                  <div className="text-xs text-ink-muted">{r.time}</div>
                </div>
                <GoogleG className="ms-auto h-5 w-5" />
              </div>
              <div className="mb-3 flex text-gold">
                {[...Array(r.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-current" />
                ))}
              </div>
              <p className="text-ink-soft text-sm leading-relaxed">{r.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
