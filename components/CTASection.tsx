"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="section-padding bg-dark-secondary">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="heading-lg mb-6">
            מחפשים <span className="text-primary">ליווי משפטי</span> מקצועי?
          </h2>
          <p className="text-light-secondary text-lg mb-8">
            פגישת ייעוץ ראשונית ללא התחייבות. נשמח ללוות אתכם בכל שלבי העסקה.
          </p>
          <Link href="/contact" className="btn-primary text-lg px-10 py-4">
            לקביעת פגישה
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
