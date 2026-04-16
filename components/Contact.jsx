"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Building2, Mail, Phone, Shield, Lock } from "lucide-react";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitted(false);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitted(true);
    e.currentTarget.reset();
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 max-w-6xl mx-auto">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block mb-4 rounded-full border border-yellow-400 px-4 py-1 text-sm font-semibold text-yellow-700">
              Get Started
            </span>

            <h2 className="mb-6 text-3xl md:text-4xl font-semibold text-gray-900">
              Request a Confidential Briefing
            </h2>

            <p className="mb-8 text-lg text-gray-600">
              Schedule a private demonstration with our security technology
              specialists. All discussions are held under strict
              confidentiality.
            </p>

            <div className="mb-10 space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                  <Building2 className="h-5 w-5 text-yellow-700" />
                </div>
                <span>Custom deployment assessments</span>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                  <Shield className="h-5 w-5 text-yellow-700" />
                </div>
                <span>Security architecture review</span>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                  <Lock className="h-5 w-5 text-yellow-700" />
                </div>
                <span>NDA-protected discussions</span>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h4 className="mb-4 font-semibold text-gray-900">
                Direct Contact
              </h4>

              <div className="space-y-3">
                <a
                  href="mailto:enterprise@tsascreen.ai"
                  className="flex items-center gap-3 text-sm text-gray-600 hover:text-gray-900"
                >
                  <Mail className="h-4 w-4" />
                  enterprise@tsascreen.ai
                </a>

                <a
                  href="tel:+1-800-TSA-DEMO"
                  className="flex items-center gap-3 text-sm text-gray-600 hover:text-gray-900"
                >
                  <Phone className="h-4 w-4" />
                  1-800-TSA-DEMO
                </a>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form
              onSubmit={handleSubmit}
              className="rounded-xl border border-gray-200 bg-white p-8 shadow-md"
            >
              <h3 className="mb-6 text-xl font-semibold text-gray-900">
                Schedule Your Briefing
              </h3>

              {submitted && (
                <div className="mb-6 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  Request submitted. A specialist will contact you within 24
                  hours.
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2 mb-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    required
                    placeholder="John"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    required
                    placeholder="Smith"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Work Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="john.smith@airport.gov"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Organization
                </label>
                <input
                  required
                  placeholder="Airport Authority / TSA / Government Agency"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Role / Title
                </label>
                <input
                  required
                  placeholder="Director of Operations"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                />
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Message (Optional)
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your screening challenges or questions..."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-yellow-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-yellow-400 disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : "Request Briefing"}
                {!isSubmitting && <Send className="h-4 w-4" />}
              </button>

              <p className="mt-4 text-center text-xs text-gray-500">
                Your information is protected under our privacy policy. We never
                share your data with third parties.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
