"use client";

import { motion } from "framer-motion";
import { Scale, Award, Users, Target, MapPin, Navigation } from "lucide-react";
import Image from "next/image";
import CTASection from "@/components/CTASection";

const values = [
  { icon: Scale, title: "מקצועיות", description: "ידע משפטי מעמיק וניסיון רב בתחום המקרקעין" },
  { icon: Users, title: "יחס אישי", description: "ליווי צמוד ותשומת לב לכל לקוח ולקוח" },
  { icon: Target, title: "מחויבות", description: "מחויבות מלאה להשגת התוצאות הטובות ביותר" },
  { icon: Award, title: "מצוינות", description: "שאיפה למצוינות בכל פרויקט ועסקה" },
];

export default function AboutPage() {
  return (
    <>
      {/* Header band */}
      <section className="pt-24 md:pt-28 pb-12 md:pb-16 bg-dark">
        <div className="container-custom text-center">
          <h1 className="heading-xl mb-4 text-white">
            אודות <span className="text-gold">המשרד</span>
          </h1>
          <p className="text-light-secondary text-lg max-w-2xl mx-auto">
            משרד עו״ד משה אמסלם - מומחיות, מקצועיות ויחס אישי.
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden rounded-2xl border border-line aspect-[4/5] shadow-lg shadow-primary/5"
            >
              <Image
                src="/moshe-amsalem.jpeg"
                alt="עו״ד משה אמסלם"
                width={600}
                height={750}
                className="w-full h-full object-cover object-top"
                priority
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="heading-lg mb-6 text-ink">
                עו״ד <span className="text-primary">משה אמסלם</span>
              </h2>
              <div className="space-y-4 text-ink-soft text-lg leading-relaxed">
                <p>
                  עו״ד משה אמסלם בעל תואר ראשון במשפטים (LLB) במכללה למנהל ראשון לציון
                  וחבר לשכת עורכי הדין משנת 2021.
                </p>
                <p>
                  עורך דין המתמחה בתחום המקרקעין וההתחדשות העירונית, עריכה וליווי של כל
                  סוגי החוזים המסחריים, וכן בכל ענייני צוואות וירושות, לרבות ייפוי כוח מתמשך.
                </p>
                <p>
                  המשרד מספק ליווי משפטי מקצועי ואישי בכל סוגי העסקאות במקרקעין, תוך מתן
                  תשומת לב לפרטים ומחויבות מלאה ללקוח.
                </p>
                <p>
                  אנו מאמינים בבניית יחסי אמון ארוכי טווח עם לקוחותינו, ופועלים להשגת
                  התוצאות הטובות ביותר בכל עסקה.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-cream-soft">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-lg mb-4 text-ink">
              הערכים <span className="text-primary">שלנו</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-2xl border border-line bg-white p-6 text-center shadow-sm
                           hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10
                           hover:-translate-y-1.5 transition-all duration-300 ease-out"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <value.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-bold text-ink mb-2">{value.title}</h3>
                <p className="text-ink-soft text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Location */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-lg mb-4 text-ink">
              מיקום <span className="text-primary">המשרד</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden rounded-2xl border border-line aspect-video"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3381.2!2d34.7901!3d32.0694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d4b9b0c5f5b1b%3A0x0!2sMidtown%20Tower%2C%20Derech%20Menachem%20Begin%20144%2C%20Tel%20Aviv!5e0!3m2!1siw!2sil!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="מיקום המשרד"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center lg:text-right"
            >
              <div className="flex items-start gap-4 justify-center lg:justify-start mb-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-ink font-bold text-xl mb-2">כתובת המשרד</h3>
                  <p className="text-ink-soft text-lg">דרך מנחם בגין 144, תל אביב</p>
                  <p className="text-ink-soft text-lg">מגדל מידטאון, קומה 36</p>
                </div>
              </div>

              <a
                href="https://waze.com/ul?q=דרך%20מנחם%20בגין%20144%20תל%20אביב%20מגדל%20מידטאון&navigate=yes"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-lg bg-[#33CCFF] px-8 py-4 text-lg font-bold text-dark transition-all duration-300 hover:bg-[#28b8e8] hover:scale-105 hover:shadow-lg"
              >
                <Navigation className="h-6 w-6" />
                נווט עם Waze
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
