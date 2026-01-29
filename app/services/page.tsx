"use client";

import { motion } from "framer-motion";
import { services } from "@/components/ServicesGrid";
import CTASection from "@/components/CTASection";

export default function ServicesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-16 bg-dark">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="heading-xl mb-6">
              תחומי <span className="text-primary">התמחות</span>
            </h1>
            <p className="text-light-secondary text-lg max-w-2xl mx-auto">
              משרד עו״ד משה אמסלם מעניק ליווי משפטי מקצועי ואישי במגוון תחומים
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Detail */}
      <section className="section-padding bg-dark-secondary">
        <div className="container-custom">
          <div className="space-y-16">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex flex-col md:flex-row gap-8 items-start ${
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-xl bg-dark border border-primary/30 flex items-center justify-center">
                    <service.icon className="w-10 h-10 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h2 className="heading-md text-light mb-4">{service.title}</h2>
                  <p className="text-light-secondary text-lg leading-relaxed mb-4">
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
    "הסכמי ממון": [
      "הסכמי ממון לפני נישואין",
      "הסכמי ממון במהלך הנישואין",
      "הגנה על נכסים",
      "הפרדה רכושית",
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
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-center gap-3 text-light-tertiary">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          {item}
        </li>
      ))}
    </ul>
  );
}
