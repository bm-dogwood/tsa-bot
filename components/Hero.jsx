"use client";
import { motion } from "framer-motion";
import { Shield, Zap, ScanLine, ArrowRight, Bot } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={"/download.jpeg"}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-650/90 via-yellow-950/80 to-yellow-650/95" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/15 text-yellow-400 text-sm font-medium backdrop-blur"
          >
            <Bot className="w-4 h-4" />
            AI-Powered Security Platform
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Next-Generation{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Automated Screening
            </span>{" "}
            for Airport Security
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/70 mb-10 max-w-2xl mx-auto"
          >
            Intelligent threat detection powered by advanced AI. Reduce wait
            times, enhance accuracy, and empower security officers with
            real-time decision support.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <button className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition">
              View Screening Workflow
              <ArrowRight className="w-5 h-5" />
            </button>

            <button className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-white/10 text-white backdrop-blur border border-white/20 hover:bg-white/20 transition">
              Request Confidential Briefing
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
