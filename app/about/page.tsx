"use client";

import { motion } from "framer-motion";
import { Scale, Award, Users, Target } from "lucide-react";
import CTASection from "@/components/CTASection";

const values = [
  {
    icon: Scale,
    title: "מקצועיות",
    description: "ידע משפטי מעמיק וניסיון רב בתחום המקרקעין",
  },
  {
    icon: Users,
    title: "יחס אישי",
    description: "ליווי צמוד ותשומת לב לכל לקוח ולקוח",
  },
  {
    icon: Target,
    title: "מחויבות",
    description: "מחויבות מלאה להשגת התוצאות הטובות ביותר",
  },
  {
    icon: Award,
    title: "מצוינות",
    description: "שאיפה למצוינות בכל פרויקט ועסקה",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-dark">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="heading-xl mb-6">
              אודות <span className="text-primary">המשרד</span>
            </h1>
            <p className="text-light-secondary text-lg max-w-2xl mx-auto">
              משרד עו״ד משה אמסלם - מומחיות, מקצועיות ויחס אישי
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Content */}
      <section className="section-padding bg-dark-secondary">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image Placeholder */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-dark rounded-xl border border-dark-tertiary aspect-[4/5] flex items-center justify-center"
            >
              <div className="text-center text-light-tertiary">
                <Scale className="w-20 h-20 mx-auto mb-4 text-primary/50" />
                <p>תמונת עורך הדין</p>
              </div>
            </motion.div>

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="heading-lg mb-6">
                עו״ד <span className="text-primary">משה אמסלם</span>
              </h2>
              <div className="space-y-4 text-light-secondary text-lg leading-relaxed">
                <p>
                  עו״ד משה אמסלם הינו עורך דין המתמחה בתחום המקרקעין וההתחדשות העירונית.
                </p>
                <p>
                  המשרד מספק ליווי משפטי מקצועי ואישי בכל סוגי העסקאות במקרקעין,
                  תוך מתן תשומת לב לפרטים ומחויבות מלאה ללקוח.
                </p>
                <p>
                  אנו מאמינים בבניית יחסי אמון ארוכי טווח עם לקוחותינו, ופועלים
                  להשגת התוצאות הטובות ביותר בכל עסקה.
                </p>
              </div>

              {/* Placeholder for additional info */}
              <div className="mt-8 p-6 bg-dark rounded-lg border border-primary/20">
                <p className="text-light-tertiary text-sm">
                  * פרטים נוספים על רקע, השכלה וניסיון מקצועי יתווספו בהמשך
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-dark">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="heading-lg mb-4">
              הערכים <span className="text-primary">שלנו</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6 text-center hover:border-primary/50 transition-colors duration-300"
              >
                <div className="w-14 h-14 rounded-lg bg-dark flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-light mb-2">
                  {value.title}
                </h3>
                <p className="text-light-tertiary text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
