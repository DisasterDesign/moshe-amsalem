"use client";

import { motion } from "framer-motion";
import { services } from "@/components/ServicesGrid";
import CTASection from "@/components/CTASection";
import { Check } from "lucide-react";

export default function ServicesPage() {
  return (
    <>
      {/* Header band */}
      <section className="pt-24 md:pt-28 pb-12 md:pb-16 bg-dark">
        <div className="container-custom text-center">
          <h1 className="heading-xl mb-4 text-white">
            תחומי <span className="text-gold">התמחות</span>
          </h1>
          <p className="text-light-secondary text-lg max-w-2xl mx-auto">
            ליווי משפטי מקצועי ואישי במגוון תחומים - עם יחס אנושי ותשומת לב לפרטים.
          </p>
        </div>
      </section>

      {/* Services Detail */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="space-y-14">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="flex flex-col gap-6 rounded-2xl border border-line bg-white p-6 shadow-sm md:flex-row md:items-start md:p-8"
              >
                <div className="flex-shrink-0">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
                    <service.icon className="h-10 w-10 text-primary" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="heading-md text-ink mb-3">{service.title}</h2>
                  <p className="text-ink-soft text-lg leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <ServiceDetails title={service.title} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}

function ServiceDetails({ title }: { title: string }) {
  const details: Record<string, string[]> = {
    "עסקאות מקרקעין": [
      "בדיקת נכסים ונסחי טאבו",
      "ניהול משא ומתן מול צדדים לעסקה",
      "עריכת הסכמי מכר",
      "ליווי עד לרישום הזכויות",
    ],
    "שכירות": [
      "הסכמי שכירות למגורים",
      "הסכמי שכירות מסחריים",
      "הגנה על זכויות המשכיר",
      "הגנה על זכויות השוכר",
    ],
    "התחדשות עירונית": [
      "ייצוג דיירים בפרויקטי תמ״א 38",
      "ליווי פרויקטי פינוי-בינוי",
      "משא ומתן מול יזמים",
      "בחינת חוזים והסכמים",
    ],
    "צוואות וירושות": [
      "עריכת צוואות",
      "בקשות לצווי ירושה",
      "בקשות לקיום צוואה",
      "חלוקת עיזבון בין יורשים",
    ],
    "הסכם ממון והסכם חיים משותפים": [
      "הסכמי ממון לפני נישואין",
      "הסכמי ממון במהלך הנישואין",
      "הסכמי חיים משותפים לידועים בציבור",
      "הפרדה והגנה רכושית",
    ],
    "ייפוי כוח מתמשך": [
      "עריכת ייפוי כוח מתמשך",
      "תכנון משפטי לעתיד",
      "הגנה על האינטרסים שלכם",
      "הנחיות מקדימות",
    ],
  };

  const items = details[title] || [];
  if (items.length === 0) return null;

  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-center gap-3 text-ink-soft">
          <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Check className="h-3 w-3 text-primary" />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}
