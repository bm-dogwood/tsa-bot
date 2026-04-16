"use client";
import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";

const comparisonData = [
  {
    feature: "Threat Detection Accuracy",
    manual: "85-90%",
    traditional: "92-95%",
    ai: "99.7%",
    highlight: true,
  },
  {
    feature: "Processing Time per Bag",
    manual: "45+ sec",
    traditional: "25-30 sec",
    ai: "<10 sec",
    highlight: true,
  },
  {
    feature: "24/7 Consistent Performance",
    manual: false,
    traditional: false,
    ai: true,
  },
  {
    feature: "Fatigue-Proof Analysis",
    manual: false,
    traditional: false,
    ai: true,
  },
  {
    feature: "Real-time Threat Updates",
    manual: false,
    traditional: "limited",
    ai: true,
  },
  {
    feature: "Explainable Decisions",
    manual: true,
    traditional: false,
    ai: true,
  },
  {
    feature: "Scalability",
    manual: "Limited",
    traditional: "Moderate",
    ai: "Unlimited",
  },
  {
    feature: "Integration with Mobile Apps",
    manual: false,
    traditional: false,
    ai: true,
  },
];

const renderValue = (value) => {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="mx-auto h-5 w-5 text-green-600" />
    ) : (
      <X className="mx-auto h-5 w-5 text-red-500 opacity-70" />
    );
  }

  if (value === "limited") {
    return <Minus className="mx-auto h-5 w-5 text-gray-400" />;
  }

  return <span className="text-sm text-gray-700">{value}</span>;
};

const Comparison = () => {
  return (
    <section id="comparison" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block mb-4 rounded-full border border-yellow-400 px-4 py-1 text-sm font-medium text-yellow-700">
            Comparison
          </span>

          <h2 className="mb-4 text-3xl md:text-4xl font-semibold text-gray-900">
            Why AI-Powered Screening?
          </h2>

          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            See how automated AI screening compares to traditional methods.
          </p>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-5xl mx-auto overflow-x-auto"
        >
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="rounded-tl-lg bg-gray-100 p-4 text-left text-sm font-semibold text-gray-800">
                  Feature
                </th>
                <th className="bg-gray-100 p-4 text-center text-sm font-semibold text-gray-800">
                  Manual Screening
                </th>
                <th className="bg-gray-100 p-4 text-center text-sm font-semibold text-gray-800">
                  Traditional Vendors
                </th>
                <th className="rounded-tr-lg border-2 border-blue-600 bg-blue-50 p-4 text-center">
                  <div className="mb-1 inline-block rounded-full bg-yellow-100 px-3 py-0.5 text-xs font-semibold text-yellow-800">
                    Recommended
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    AI-Powered
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              {comparisonData.map((row, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-200 ${
                    row.highlight ? "bg-blue-50/40" : "bg-white"
                  }`}
                >
                  <td className="p-4 text-sm font-medium text-gray-800">
                    {row.feature}
                  </td>

                  <td className="p-4 text-center">{renderValue(row.manual)}</td>

                  <td className="p-4 text-center">
                    {renderValue(row.traditional)}
                  </td>

                  <td className="border-x-2 border-blue-600/30 bg-blue-50 p-4 text-center font-semibold">
                    {renderValue(row.ai)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
};

export default Comparison;
