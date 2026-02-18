"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ServiceCard from "./ServiceCard";
import {
  Building2,
  Home,
  Building,
  FileText,
  Heart,
  FileCheck,
} from "lucide-react";

export const services = [
  {
    icon: Building2,
    title: "עסקאות מקרקעין",
    description: "ליווי וייצוג במכירה/רכישה של נכסי מגורים/מסחר - ליווי משפטי מלא מתחילת המשא ומתן ועד לרישום הזכויות בטאבו.",
  },
  {
    icon: Home,
    title: "שכירות",
    description: "עריכת הסכמי שכירות לנכסי מגורים/מסחר והגנה על זכויות המשכיר והשוכר.",
  },
  {
    icon: Building,
    title: "התחדשות עירונית",
    description: "ליווי וייצוג דיירים בפרויקטים של פינוי בינוי / תמ״א 38.",
  },
  {
    icon: FileText,
    title: "צוואות וירושות",
    description: "עריכת צוואות, בקשות לצווי ירושה וקיום צוואה, חלוקת עיזבון.",
  },
  {
    icon: Heart,
    title: "הסכם ממון והסכם חיים משותפים",
    description: "עריכת הסכמי ממון (לזוגות נשואים או לזוגות שעומדים להינשא) והסכמי חיים משותפים (לידועים בציבור)",
  },
  {
    icon: FileCheck,
    title: "ייפוי כוח מתמשך",
    description: "עריכת ייפוי כוח מתמשך וייעוץ וליווי מקצועי.",
  },
];

interface ServicesGridProps {
  showTitle?: boolean;
  showCTA?: boolean;
}

export default function ServicesGrid({ showTitle = true, showCTA = true }: ServicesGridProps) {
  return (
    <section className="section-padding bg-dark">
      <div className="container-custom">
        {showTitle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="heading-lg mb-4">
              תחומי <span className="text-primary">התמחות</span>
            </h2>
            <p className="text-light-secondary text-lg max-w-2xl mx-auto">
              ליווי משפטי מקצועי ואישי בכל סוגי העסקאות במקרקעין
            </p>
          </motion.div>
        )}

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service.title} {...service} index={index} />
          ))}
        </div>

        {/* CTA */}
        {showCTA && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Link href="/services" className="btn-outline">
              לכל תחומי ההתמחות
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
