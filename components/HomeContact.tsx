"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import ContactForm from "./ContactForm";

const WA_LINK =
  "https://wa.me/972524337633?text=" +
  encodeURIComponent("היי משה, אשמח לתאם פגישת ייעוץ");

const contactInfo = [
  { icon: Phone, title: "טלפון", value: "052-4337633", link: "tel:052-4337633" },
  { icon: MessageCircle, title: "וואטסאפ", value: "שליחת הודעה מהירה", link: WA_LINK },
  { icon: Mail, title: "דוא״ל", value: "moshe@ams-law.com", link: "mailto:moshe@ams-law.com" },
  {
    icon: MapPin,
    title: "כתובת",
    value: "דרך מנחם בגין 144, תל אביב · מגדל מידטאון, קומה 36",
    link: "https://maps.google.com/?q=דרך+מנחם+בגין+144+תל+אביב+מגדל+מידטאון",
  },
  { icon: Clock, title: "שעות פעילות", value: "א׳-ה׳: 09:00-18:00", link: null },
];

export default function HomeContact() {
  return (
    <section id="contact" className="section-padding bg-cream scroll-mt-20">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            כאן בשבילכם
          </span>
          <h2 className="heading-lg mt-3 mb-4 text-ink">
            נשמח <span className="text-primary">לשמוע מכם</span>
          </h2>
          <p className="text-ink-soft text-lg max-w-2xl mx-auto">
            השאירו פרטים ואחזור אליכם בהקדם, או דברו איתי ישירות בוואטסאפ.
          </p>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-3">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="space-y-5">
              {contactInfo.map((info) => (
                <div key={info.title} className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <info.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-ink mb-0.5">{info.title}</h3>
                    {info.link ? (
                      <a
                        href={info.link}
                        target={info.link.startsWith("http") ? "_blank" : undefined}
                        rel={info.link.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-ink-soft hover:text-primary transition-colors"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-ink-soft">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Map */}
            <div className="mt-8 overflow-hidden rounded-2xl border border-line aspect-video">
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
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
