"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import ContactForm from "@/components/ContactForm";

const contactInfo = [
  {
    icon: Phone,
    title: "טלפון",
    value: "03-XXX-XXXX",
    link: "tel:03-XXX-XXXX",
  },
  {
    icon: Mail,
    title: "דוא״ל",
    value: "office@ma-law.co.il",
    link: "mailto:office@ma-law.co.il",
  },
  {
    icon: MapPin,
    title: "כתובת",
    value: "כתובת המשרד תיקבע בהמשך",
    link: null,
  },
  {
    icon: Clock,
    title: "שעות פעילות",
    value: "א׳-ה׳: 09:00-18:00",
    link: null,
  },
];

export default function ContactPage() {
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
              צור <span className="text-primary">קשר</span>
            </h1>
            <p className="text-light-secondary text-lg max-w-2xl mx-auto">
              נשמח לשמוע ממך ולסייע בכל שאלה או פנייה
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-padding bg-dark-secondary">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-1"
            >
              <h2 className="heading-md mb-8">פרטי התקשרות</h2>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-lg bg-dark flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-light font-medium mb-1">{info.title}</h3>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-light-secondary hover:text-primary transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-light-secondary">{info.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Map Placeholder */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-8 bg-dark rounded-lg border border-dark-tertiary aspect-video flex items-center justify-center"
              >
                <div className="text-center text-light-tertiary">
                  <MapPin className="w-10 h-10 mx-auto mb-2 text-primary/50" />
                  <p className="text-sm">מפה תתווסף בהמשך</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2"
            >
              <h2 className="heading-md mb-8">שלח הודעה</h2>
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
