"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

export default function ServiceCard({ icon: Icon, title, description, index }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group rounded-2xl bg-white border border-line p-6 shadow-sm
                 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1.5
                 hover:border-primary/40 transition-all duration-300 ease-out"
    >
      {/* Icon */}
      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5
                      group-hover:bg-primary group-hover:scale-105 transition-all duration-300 ease-out">
        <Icon className="w-7 h-7 text-primary group-hover:text-white transition-colors duration-300" />
      </div>

      {/* Title */}
      <h3 className="font-heading text-xl font-bold text-ink mb-3 group-hover:text-primary transition-colors duration-300">
        {title}
      </h3>

      {/* Description */}
      <p className="text-ink-soft leading-relaxed">{description}</p>
    </motion.div>
  );
}
