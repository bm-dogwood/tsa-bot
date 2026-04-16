"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scan,
  Briefcase,
  Camera,
  Users,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Zap,
  CheckCircle,
  XCircle,
  BarChart3,
  TrendingUp,
} from "lucide-react";

const BAGS = [
  {
    id: "business",
    title: "Business Traveler Bag",
    icon: Briefcase,
    items: ["Laptop", "Tablet", "Phone Charger", "Documents"],
    risk: "low",
    confidence: 98,
    details:
      "All electronics properly organized. No prohibited items detected.",
  },
  {
    id: "family",
    title: "Family Vacation Bag",
    icon: Users,
    items: ["Clothing", "Toiletries", "Snacks", "Medications"],
    risk: "medium",
    confidence: 92,
    details:
      "Multiple liquid containers detected. Requires secondary screening.",
  },
  {
    id: "photo",
    title: "Photography Equipment",
    icon: Camera,
    items: ["Camera Body", "Multiple Lenses", "Tripod", "Batteries"],
    risk: "review",
    confidence: 87,
    details:
      "Unusual metallic objects detected. Recommended for manual inspection.",
  },
];

const WAIT_TIME_DATA = [
  { time: "8 AM", traditional: 22, ai: 8 },
  { time: "10 AM", traditional: 28, ai: 9 },
  { time: "12 PM", traditional: 35, ai: 11 },
  { time: "2 PM", traditional: 30, ai: 10 },
  { time: "4 PM", traditional: 38, ai: 12 },
  { time: "6 PM", traditional: 25, ai: 8 },
];

export default function InteractiveScanDemo() {
  const [activeTab, setActiveTab] = useState("scan");
  const [selectedBag, setSelectedBag] = useState(BAGS[0]);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);

  const startScan = () => {
    setScanning(true);
    setResult(null);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setResult(selectedBag);
            setScanning(false);
          }, 300);
          return 100;
        }
        return prev + 5;
      });
    }, 80);
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case "low":
        return "text-emerald-600 bg-emerald-50 border-emerald-100";
      case "medium":
        return "text-amber-600 bg-amber-50 border-amber-100";
      case "review":
        return "text-rose-600 bg-rose-50 border-rose-100";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getRiskIcon = (risk) => {
    switch (risk) {
      case "low":
        return CheckCircle;
      case "medium":
        return AlertTriangle;
      case "review":
        return XCircle;
      default:
        return AlertTriangle;
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200">
            <Zap className="w-4 h-4" />
            Interactive Demonstration
          </span>

          <h2 className="text-4xl md:text-5xl font-bold mt-6 mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Experience AI-Powered Security
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See how our advanced AI transforms threat detection and reduces wait
            times through intelligent automation.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-1 border border-yellow-100 inline-flex">
            {[
              { id: "scan", label: "AI Scan Demo", icon: Scan },
              { id: "wait", label: "Wait Time Analytics", icon: BarChart3 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 text-sm font-medium rounded-lg transition-all duration-300 flex items-center gap-2 ${
                    isActive
                      ? "bg-white shadow-lg text-gray-900 border border-yellow-200"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${isActive ? "text-yellow-600" : ""}`}
                  />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "scan" && (
            <motion.div
              key="scan"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Main Card */}
              <div className="border-2 border-gray-200 rounded-2xl bg-white shadow-xl overflow-hidden">
                {/* Card Header */}
                <div className="p-6 border-b bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center shadow-lg">
                      <Scan className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Interactive Scan Demo
                      </h3>
                      <p className="text-sm text-gray-500">
                        Experience real-time AI threat detection
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <span className="text-gray-600">Live Simulation</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                  {/* Bag Selector */}
                  <div className="mb-10">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-yellow-600" />
                      Select Bag Type to Scan
                    </h4>

                    <div className="grid md:grid-cols-3 gap-4">
                      {BAGS.map((bag) => {
                        const Icon = bag.icon;
                        const RiskIcon = getRiskIcon(bag.risk);
                        const isActive = selectedBag.id === bag.id;

                        return (
                          <motion.button
                            key={bag.id}
                            onClick={() => {
                              setSelectedBag(bag);
                              setResult(null);
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`text-left border-2 rounded-xl p-5 transition-all duration-300 relative overflow-hidden ${
                              isActive
                                ? "border-yellow-500 bg-gradient-to-br from-yellow-50 to-amber-50 shadow-lg"
                                : "border-gray-200 bg-white hover:border-yellow-300 hover:shadow-md"
                            }`}
                          >
                            {isActive && (
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-transparent"
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              />
                            )}

                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`p-2 rounded-lg ${
                                    isActive ? "bg-yellow-100" : "bg-gray-100"
                                  }`}
                                >
                                  <Icon
                                    className={`w-5 h-5 ${
                                      isActive
                                        ? "text-yellow-600"
                                        : "text-gray-600"
                                    }`}
                                  />
                                </div>
                                <span className="font-semibold text-gray-900">
                                  {bag.title}
                                </span>
                              </div>
                              <RiskIcon
                                className={`w-5 h-5 ${
                                  getRiskColor(bag.risk).split(" ")[0]
                                }`}
                              />
                            </div>

                            <div className="space-y-2">
                              {bag.items.map((item, idx) => (
                                <span
                                  key={idx}
                                  className="inline-block text-xs px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 mr-2 mb-2"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Scan Area */}
                  <div className="border-3 border-dashed border-gray-300 rounded-2xl p-8 bg-gradient-to-b from-gray-50 to-white">
                    <div className="text-center max-w-lg mx-auto">
                      {!scanning && !result ? (
                        <>
                          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-100 to-amber-100 flex items-center justify-center border-4 border-white shadow-lg">
                            <Scan className="w-10 h-10 text-yellow-600" />
                          </div>
                          <h4 className="text-xl font-semibold text-gray-900 mb-2">
                            Ready to Analyze
                          </h4>
                          <p className="text-gray-600 mb-6">
                            Click below to simulate AI analysis of{" "}
                            {selectedBag.title.toLowerCase()}
                          </p>
                          <motion.button
                            onClick={startScan}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                          >
                            Start AI Scan Analysis
                          </motion.button>
                        </>
                      ) : scanning ? (
                        <>
                          <div className="relative w-24 h-24 mx-auto mb-6">
                            <motion.div
                              className="absolute inset-0 rounded-full border-4 border-yellow-200"
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            />
                            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center">
                              <Scan className="w-8 h-8 text-white animate-pulse" />
                            </div>
                          </div>

                          <h4 className="text-xl font-semibold text-gray-900 mb-3">
                            Analyzing Contents
                          </h4>
                          <p className="text-gray-600 mb-4">
                            AI is scanning and classifying items...
                          </p>

                          {/* Progress Bar */}
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 overflow-hidden">
                            <motion.div
                              className="bg-gradient-to-r from-yellow-500 to-amber-600 h-full rounded-full"
                              initial={{ width: "0%" }}
                              animate={{ width: `${scanProgress}%` }}
                              transition={{ duration: 0.1 }}
                            />
                          </div>
                          <p className="text-sm text-gray-500">
                            {scanProgress}% complete
                          </p>
                        </>
                      ) : (
                        result && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-6"
                          >
                            <div
                              className={`p-4 rounded-xl border ${getRiskColor(
                                result.risk
                              )}`}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  {(() => {
                                    const IconComponent = getRiskIcon(
                                      result.risk
                                    );
                                    return (
                                      <IconComponent className="w-8 h-8" />
                                    );
                                  })()}
                                  <div>
                                    <h4 className="font-bold text-lg">
                                      {result.risk === "low"
                                        ? "✓ All Clear"
                                        : result.risk === "medium"
                                        ? "⚠ Review Required"
                                        : "✗ Manual Inspection"}
                                    </h4>
                                    <p className="text-sm opacity-75">
                                      Threat Assessment Complete
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold">
                                    {result.confidence}%
                                  </div>
                                  <div className="text-sm opacity-75">
                                    Confidence
                                  </div>
                                </div>
                              </div>
                              <p className="text-sm">{result.details}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-4 rounded-xl bg-gray-50 border">
                                <div className="text-sm text-gray-600 mb-1">
                                  Items Analyzed
                                </div>
                                <div className="text-lg font-semibold">
                                  {result.items.length}
                                </div>
                              </div>
                              <div className="p-4 rounded-xl bg-gray-50 border">
                                <div className="text-sm text-gray-600 mb-1">
                                  Processing Time
                                </div>
                                <div className="text-lg font-semibold">
                                  1.8s
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <button
                                onClick={startScan}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-semibold rounded-xl hover:shadow-lg transition"
                              >
                                Scan Another Bag
                              </button>
                              <button
                                onClick={() => setResult(null)}
                                className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
                              >
                                Reset
                              </button>
                            </div>
                          </motion.div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "wait" && (
            <motion.div
              key="wait"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Wait Time Analytics Card */}
              <div className="border-2 border-gray-200 rounded-2xl bg-white shadow-xl overflow-hidden">
                <div className="p-6 border-b bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Wait Time Analytics
                      </h3>
                      <p className="text-sm text-gray-500">
                        AI-powered efficiency improvements
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Chart */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-6">
                        Average Screening Time Comparison
                      </h4>
                      <div className="space-y-4">
                        {WAIT_TIME_DATA.map((data, idx) => (
                          <div key={idx} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">{data.time}</span>
                              <span className="font-medium">
                                {data.traditional} → {data.ai}s
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <div className="flex-1 bg-gradient-to-r from-rose-500/20 to-rose-600/30 rounded-full h-3 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${(data.traditional / 40) * 100}%`,
                                  }}
                                  transition={{ delay: idx * 0.1 }}
                                  className="h-full bg-gradient-to-r from-rose-500 to-rose-600 rounded-full"
                                />
                              </div>
                              <div className="flex-1 bg-gradient-to-r from-emerald-500/20 to-emerald-600/30 rounded-full h-3 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${(data.ai / 40) * 100}%`,
                                  }}
                                  transition={{ delay: idx * 0.1 + 0.2 }}
                                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
                                />
                              </div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>Traditional</span>
                              <span>AI-Assisted</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="space-y-6">
                      <div className="p-6 rounded-xl bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200">
                        <h4 className="font-semibold text-gray-900 mb-4">
                          Efficiency Gains
                        </h4>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                              Average Time Reduction
                            </span>
                            <span className="text-2xl font-bold text-emerald-600">
                              65%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                              Passenger Throughput
                            </span>
                            <span className="text-2xl font-bold text-blue-600">
                              +42%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                              False Alarms Reduced
                            </span>
                            <span className="text-2xl font-bold text-yellow-600">
                              -78%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-gray-50 border">
                          <div className="text-3xl font-bold text-gray-900 mb-1">
                            8.3s
                          </div>
                          <div className="text-sm text-gray-600">
                            Avg. AI Screening Time
                          </div>
                        </div>
                        <div className="p-4 rounded-xl bg-gray-50 border">
                          <div className="text-3xl font-bold text-gray-900 mb-1">
                            23.1s
                          </div>
                          <div className="text-sm text-gray-600">
                            Traditional Screening
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
