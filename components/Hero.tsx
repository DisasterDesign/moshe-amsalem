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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark-secondary to-dark" />

      {/* Decorative elements */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      {/* 3D Scales Model - behind content on mobile, interactive on desktop */}
      <div className="absolute inset-0 z-0 md:z-[1] pointer-events-none md:pointer-events-auto">
        <ScalesModel />
      </div>

      {/* Titles - in front on mobile, behind on desktop */}
      <div className="absolute inset-0 z-10 md:z-0 flex items-start justify-center pt-[calc(10vh+80px)] md:pt-[calc(15vh+120px)] px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center md:text-right"
        >
          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-8xl lg:text-9xl font-bold mb-4">
            <span className="text-primary">עו״ד</span> משה אמסלם
          </h1>

          {/* Subtitles - centered on mobile, positioned on desktop */}
          <div className="md:absolute md:left-[calc(50%+20px)] mt-2 md:text-left">
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-light-secondary mb-2">
              משרד עורכי דין
            </p>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-primary">
              מקרקעין והתחדשות עירונית
            </p>
          </div>
        </motion.div>
      </div>

      {/* Bottom section - CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="absolute bottom-[200px] sm:bottom-[250px] md:bottom-[330px] left-0 right-0 md:right-[45px] z-20 md:z-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-[42px] px-4"
      >
        <Link href="/contact" className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto text-center md:-ml-[10px]">
          צור קשר
        </Link>
        <Link href="/services" className="btn-outline text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto text-center">
          תחומי התמחות
        </Link>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
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
