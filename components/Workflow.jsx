"use client";
import { motion } from "framer-motion";
import {
  Users,
  ScanLine,
  Brain,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    icon: Users,
    title: "Passenger Entry",
    description:
      "Passengers approach the checkpoint with belongings ready for scanning.",
    status: "active",
  },
  {
    icon: ScanLine,
    title: "Baggage Scanning",
    description:
      "Advanced X-ray and CT scanners capture detailed imagery of all items.",
    status: "active",
  },
  {
    icon: Brain,
    title: "AI Analysis",
    description:
      "Machine learning models analyze scans in milliseconds, identifying potential threats.",
    status: "processing",
  },
  {
    icon: CheckCircle,
    title: "Clearance / Flag",
    description:
      "System provides instant recommendation: Clear for passage or flag for secondary screening.",
    status: "complete",
  },
];

const Workflow = () => {
  return (
    <section id="workflow" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-yellow-500/15 text-yellow-600 text-sm font-medium">
            How It Works
          </span>

          <h2 className="text-3xl md:text-4xl text-gray-600 font-bold mb-4">
            Automated Screening Workflow
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto">
            From entry to clearance in seconds. See how AI transforms the
            checkpoint experience.
          </p>
        </motion.div>

        {/* Workflow Steps */}
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-500/20 via-yellow-500 to-yellow-500/20" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                    {/* Step Number */}
                    <div className="absolute -top-3 left-6 bg-yellow-500 text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>

                    <div className="mb-4 mt-2">
                      <div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                          step.status === "processing"
                            ? "bg-yellow-500/15 animate-pulse"
                            : "bg-gray-100"
                        }`}
                      >
                        <step.icon
                          className={`w-7 h-7 ${
                            step.status === "processing"
                              ? "text-yellow-600"
                              : "text-gray-900"
                          }`}
                        />
                      </div>
                    </div>

                    <h3 className="text-lg text-gray-600 font-semibold mb-2">
                      {step.title}
                    </h3>

                    <p className="text-gray-600 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-4 top-24 z-10"></div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Manual */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-gray-600" />
                </div>
                <h4 className="font-semibold text-gray-600">
                  Manual Screening
                </h4>
              </div>

              <ul className="space-y-3 text-sm text-gray-600">
                <li>• Average 45+ seconds per passenger</li>
                <li>• Subject to human fatigue and error</li>
                <li>• Inconsistent threat identification</li>
                <li>• Limited scalability during peak hours</li>
              </ul>
            </div>

            {/* AI Powered */}
            <div className="bg-white rounded-2xl p-6 border-2 border-yellow-500 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/15 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-yellow-600" />
                </div>

                <h4 className="font-semibold text-gray-600">
                  AI-Powered Screening
                </h4>

                <span className="ml-auto px-3 py-1 rounded-full bg-yellow-500 text-black text-xs font-semibold">
                  Recommended
                </span>
              </div>

              <ul className="space-y-3 text-sm text-gray-700">
                <li>✓ Under 10 seconds per passenger analysis</li>
                <li>✓ Consistent 24/7 performance</li>
                <li>✓ 99.7% threat detection accuracy</li>
                <li>✓ Infinite scalability with demand</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Workflow;
