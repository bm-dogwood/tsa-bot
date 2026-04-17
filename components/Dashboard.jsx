"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  AlertTriangle,
  ScanLine,
  Activity,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

const Dashboard = () => {
  const [scanProgress, setScanProgress] = useState(0);
  const [threatScore, setThreatScore] = useState(12);
  const [confidence, setConfidence] = useState(98.7);
  const [activeScans, setActiveScans] = useState(847);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanProgress((p) => (p >= 100 ? 0 : p + Math.random() * 15));
      setThreatScore(Math.floor(Math.random() * 25) + 5);
      setConfidence(95 + Math.random() * 4);
      setActiveScans((p) => p + Math.floor(Math.random() * 5) - 2);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const flaggedItems = [
    { type: "Electronics", confidence: 99.2, status: "cleared" },
    { type: "Liquids Container", confidence: 94.1, status: "review" },
    { type: "Personal Items", confidence: 99.8, status: "cleared" },
  ];

  return (
    <section id="dashboard" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-gray-200 text-gray-700 text-sm border border-gray-300">
            Live Demo
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            AI Threat Detection Dashboard
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto">
            Real-time decision support with explainable AI recommendations for
            security officers.
          </p>
        </motion.div>

        {/* Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-6xl mx-auto"
        >
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-xl">
            {/* Top Bar */}
            <div className="flex flex-wrap justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-gray-900 font-medium">System Active</span>
                <span className="text-gray-500 text-sm">• Checkpoint 14A</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <Clock className="w-4 h-4" />
                Live Feed
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main */}
              <div className="lg:col-span-2 space-y-6">
                {/* Scan */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex justify-between mb-4">
                    <h4 className="text-gray-900 flex items-center gap-2">
                      <ScanLine className="w-5 h-5 text-amber-600" />
                      Current Scan Analysis
                    </h4>
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                      Processing
                    </span>
                  </div>

                  <div className="relative aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <div className="w-48 h-32 bg-gray-300 rounded border border-gray-400 relative overflow-hidden">
                      <div className="absolute inset-x-0 h-1 bg-gradient-to-b from-amber-500 to-transparent animate-pulse" />
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-600">
                        BAGGAGE SCAN
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
                    <motion.div
                      className="h-full bg-amber-500"
                      animate={{ width: `${scanProgress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    Analyzing {Math.floor(scanProgress)}% complete...
                  </p>
                </div>

                {/* Detected Items */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h4 className="text-gray-900 mb-4 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-amber-600" />
                    Detected Items
                  </h4>

                  <div className="space-y-3">
                    {flaggedItems.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center gap-3">
                          {item.status === "cleared" ? (
                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                          )}
                          <span className="text-gray-900 text-sm">
                            {item.type}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-600">
                            {item.confidence}% conf.
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.status === "cleared"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {item.status === "cleared" ? "Cleared" : "Review"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Threat */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <p className="text-gray-600 text-sm mb-2">
                    Threat Probability
                  </p>
                  <div className="flex items-end gap-2 mb-3">
                    <span className="text-4xl font-bold text-emerald-600">
                      {threatScore}%
                    </span>
                    <span className="text-gray-500 text-sm">Low Risk</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded overflow-hidden">
                    <motion.div
                      className="h-full bg-emerald-500"
                      animate={{ width: `${threatScore}%` }}
                    />
                  </div>
                </div>

                {/* Confidence */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <p className="text-gray-600 text-sm mb-2">Model Confidence</p>
                  <span className="text-4xl font-bold text-amber-600">
                    {confidence.toFixed(1)}%
                  </span>
                </div>

                {/* Recommendation */}
                <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <h4 className="text-gray-900">AI Recommendation</h4>
                  </div>
                  <p className="text-emerald-700 font-semibold text-lg">
                    CLEAR FOR PASSAGE
                  </p>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm border border-gray-300 transition-colors">
                    <CheckCircle className="w-4 h-4" />
                    Approve & Clear
                  </button>
                  <button className="w-full flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm border border-gray-300 transition-colors">
                    <XCircle className="w-4 h-4" />
                    Flag for Review
                  </button>
                </div>

                {/* Live Stats */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-amber-600" />
                    <span className="text-gray-600 text-sm">Active Scans</span>
                  </div>
                  <span className="text-gray-900 font-semibold">
                    {activeScans}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Dashboard;
