"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const WA_LINK =
  "https://wa.me/972524337633?text=" +
  encodeURIComponent("היי משה, אשמח לתאם פגישת ייעוץ");

export default function CTASection() {
  return (
    <section className="section-padding bg-dark">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="heading-lg mb-6 text-white">
            מחפשים <span className="text-gold">ליווי משפטי</span> שרואה אתכם?
          </h2>
          <p className="text-light-secondary text-lg mb-8">
            פגישת ייעוץ ראשונית ללא התחייבות. נשמח ללוות אתכם בכל שלבי העסקה — באופן
            אישי, זמין וברור.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp w-full sm:w-auto"
            >
              <MessageCircle size={20} />
              שיחה מהירה בוואטסאפ
            </a>
            <a
              href="#contact"
              className="w-full sm:w-auto rounded-lg border-2 border-white/70 px-6 py-3 font-semibold text-white
                         transition-all duration-300 hover:bg-white hover:text-dark hover:-translate-y-0.5"
            >
              השארת פרטים
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
