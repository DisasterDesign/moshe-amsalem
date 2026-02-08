"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const ScalesModel = dynamic(() => import("./ScalesModel"), {
  ssr: false,
  loading: () => null,
});

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark-secondary to-dark" />

      {/* 3D Background - always behind everything */}
      <div className="absolute inset-0 z-0 pointer-events-none md:pointer-events-auto">
        <ScalesModel />
      </div>

      {/* Overlay - subtle vignette, gold wall stays visible */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.45) 100%)",
        }}
      />

      {/* Content - centered flex column */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-8xl lg:text-9xl font-bold mb-4 text-white" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8), 0 4px 25px rgba(0,0,0,0.6), 0 0 40px rgba(0,0,0,0.4)' }}>
            <span className="text-primary">עו״ד</span> משה אמסלם
          </h1>

          {/* Subtitles */}
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-light-secondary mb-2" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 4px 20px rgba(0,0,0,0.5)' }}>
            משרד עורכי דין
          </p>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-primary" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 4px 20px rgba(0,0,0,0.5)' }}>
            מקרקעין והתחדשות עירונית
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-10 pointer-events-auto"
        >
          <Link
            href="/contact"
            className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto text-center"
          >
            צור קשר
          </Link>
          <Link
            href="/services"
            className="btn-outline text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto text-center"
          >
            תחומי התמחות
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2"
        >
          <div className="w-1.5 h-2.5 bg-primary rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
