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
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-dark-secondary border border-dark-tertiary rounded-lg p-6
                 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10
                 hover:-translate-y-2 transition-all duration-300 ease-out cursor-pointer"
    >
      {/* Icon */}
      <div className="w-14 h-14 rounded-lg bg-dark flex items-center justify-center mb-5
                      group-hover:bg-primary/10 group-hover:scale-110
                      transition-all duration-300 ease-out">
        <Icon className="w-7 h-7 text-primary group-hover:scale-110 transition-transform duration-300" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-light mb-3 group-hover:text-primary transition-colors duration-300">
        {title}
      </h3>

      {/* Description */}
      <p className="text-light-tertiary leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
