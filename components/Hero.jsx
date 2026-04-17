"use client";
import { motion } from "framer-motion";
import { Shield, Zap, ScanLine, ArrowRight, Bot } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const Hero = () => {
  const videoRef = useRef(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-105"
        style={{
          filter: "brightness(0.4) contrast(1.1)",
        }}
      >
        <source
          src="https://www.pexels.com/download/video/36282790/"
          type="video/mp4"
        />
        {/* Fallback to another video if first doesn't load */}
        <source
          src="https://videos.pexels.com/video-files/854180/854180-hd_1920_1080_30fps.mp4"
          type="video/mp4"
        />
      </video>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
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
