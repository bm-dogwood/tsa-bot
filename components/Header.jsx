"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Menu, X } from "lucide-react";

const navItems = [
  { label: "Workflow", href: "#workflow" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Infrastructure", href: "#infrastructure" },
  { label: "Comparison", href: "#comparison" },
  { label: "Contact", href: "#contact" },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll
  const handleSmoothScroll = (e, href) => {
    if (e) e.preventDefault();

    setIsMobileMenuOpen(false);

    if (href.startsWith("#")) {
      const id = href.substring(1);
      const element = document.getElementById(id);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        window.history.pushState(null, "", href);
      }
    } else {
      window.location.href = href;
    }
  };

  // Logo click → scroll to top
  const handleLogoClick = (e) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    window.history.pushState(null, "", window.location.pathname);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a
            href="#"
            onClick={handleLogoClick}
            className="flex items-center gap-2"
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isScrolled ? "bg-yellow-500/10" : "bg-white/10"
              }`}
            >
              <Shield className="w-6 h-6 text-yellow-500" />
            </div>

            <span
              className={`font-bold text-lg ${
                isScrolled ? "text-gray-900" : "text-white"
              }`}
            >
              TSA<span className="text-yellow-500">.BOT</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleSmoothScroll(e, item.href)}
                className={`text-sm font-medium transition-colors hover:text-yellow-500 ${
                  isScrolled ? "text-gray-600" : "text-white/70"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={(e) => handleSmoothScroll(e, "#contact")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                isScrolled
                  ? "border border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white"
                  : "bg-white/10 text-white backdrop-blur hover:bg-white/20"
              }`}
            >
              Request Briefing
            </button>
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 rounded-md ${
              isScrolled ? "text-gray-900" : "text-white"
            }`}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="lg:hidden bg-white border-b border-gray-200"
        >
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleSmoothScroll(e, item.href)}
                className="block text-sm font-medium text-gray-600 hover:text-yellow-500"
              >
                {item.label}
              </a>
            ))}

            <button
              onClick={(e) => handleSmoothScroll(e, "#contact")}
              className="w-full px-4 py-2 text-sm font-medium rounded-md bg-yellow-500 text-white hover:bg-yellow-600"
            >
              Request Briefing
            </button>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;
