"use client";
import { motion } from "framer-motion";
import {
  Building2,
  Server,
  Network,
  Globe,
  Cpu,
  Database,
  Shield,
  Workflow,
} from "lucide-react";

const integrations = [
  { icon: Building2, label: "Airport Checkpoints" },
  { icon: Server, label: "Data Centers" },
  { icon: Network, label: "Secure Networks" },
  { icon: Globe, label: "Multi-Site Deployment" },
];

const techStack = [
  {
    icon: Cpu,
    label: "Edge AI Processing",
    desc: "On-premise compute for real-time analysis",
  },
  {
    icon: Database,
    label: "Secure Data Lake",
    desc: "Encrypted storage with audit trails",
  },
  {
    icon: Shield,
    label: "Zero-Trust Security",
    desc: "Multi-layer authentication & encryption",
  },
  {
    icon: Workflow,
    label: "API Integration",
    desc: "Seamless connection to existing systems",
  },
];

const Infrastructure = () => {
  return (
    <section id="infrastructure" className="py-20 bg-gray-50">
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
            Deployment
          </span>

          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
            Infrastructure & Integration
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Designed to integrate seamlessly with existing TSA screening
            hardware and scale across multiple airports nationwide.
          </p>
        </motion.div>

        {/* Integration Points */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {integrations.map((item, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 bg-white p-6 text-center transition hover:border-yellow-300"
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-md bg-yellow-50">
                <item.icon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="text-sm font-medium text-gray-800">
                {item.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Architecture Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16 rounded-xl border border-gray-200 bg-white p-8 md:p-12"
        >
          <h3 className="mb-10 text-center text-xl font-semibold text-gray-900">
            System Architecture
          </h3>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-4">
              {/* Scanner */}
              <div className="rounded-lg bg-gray-100 p-4 text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-yellow-50">
                  <Building2 className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="text-xs font-medium text-gray-800">
                  Scanning Hardware
                </div>
                <div className="mt-1 text-[11px] text-gray-500">
                  X-ray & CT Systems
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex justify-center">
                <div className="h-0.5 w-full bg-gradient-to-r from-gray-300 to-yellow-500" />
              </div>

              {/* Edge AI */}
              <div className="rounded-lg border-2 border-yellow-600 bg-yellow-50 p-4 text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-yellow-600">
                  <Cpu className="h-5 w-5 text-white" />
                </div>
                <div className="text-xs font-medium text-gray-900">Edge AI</div>
                <div className="mt-1 text-[11px] text-gray-600">
                  Real-time Analysis
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex justify-center">
                <div className="h-0.5 w-full bg-gradient-to-r from-yellow-500 to-gray-300" />
              </div>

              {/* Dashboard */}
              <div className="rounded-lg bg-gray-100 p-4 text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-yellow-50">
                  <Shield className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="text-xs font-medium text-gray-800">
                  Officer Dashboard
                </div>
                <div className="mt-1 text-[11px] text-gray-500">
                  Decision Support
                </div>
              </div>
            </div>

            {/* Cloud */}
            <div className="mt-10 flex justify-center">
              <div className="max-w-xs rounded-lg bg-gray-900 p-6 text-center text-white">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-md bg-white/10">
                  <Server className="h-6 w-6 text-white" />
                </div>
                <div className="text-sm font-medium">
                  Secure Cloud Infrastructure
                </div>
                <div className="mt-1 text-xs text-gray-300">
                  Central management, model updates, analytics
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tech Stack */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {techStack.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="rounded-lg border border-gray-200 bg-white p-6"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-yellow-50">
                <item.icon className="h-6 w-6 text-yellow-600" />
              </div>
              <h4 className="mb-2 font-semibold text-gray-900">{item.label}</h4>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Infrastructure;
