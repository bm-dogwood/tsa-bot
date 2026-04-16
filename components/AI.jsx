"use client";
import Link from "next/link";
import { ArrowRight, UserCheck, Scan, Brain, ShieldCheck } from "lucide-react";

const steps = [
  {
    icon: UserCheck,
    title: "Passenger Entry",
    description:
      "Travelers approach checkpoint with boarding pass verification",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    icon: Scan,
    title: "Baggage Scanning",
    description: "Items pass through advanced imaging technology systems",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    icon: Brain,
    title: "AI Analysis",
    description: "Real-time threat detection with explainable AI reasoning",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    icon: ShieldCheck,
    title: "Decision Support",
    description: "Clear recommendations with human officer final authority",
    color: "bg-yellow-100 text-yellow-700",
  },
];

export function WorkflowPreview() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-yellow-700">
            How It Works
          </span>

          <h2 className="mb-6 text-3xl md:text-4xl font-semibold text-gray-900">
            Intelligent Screening Workflow
          </h2>

          <p className="text-lg text-gray-600">
            From passenger entry to clearance, our AI-powered system streamlines
            every step while maintaining the highest security standards.
          </p>
        </div>

        {/* Workflow */}
        <div className="relative">
          {/* Connector line */}
          <div className="absolute top-1/2 left-0 right-0 hidden lg:block h-px bg-gray-200 -translate-y-1/2" />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow"
              >
                {/* Step number */}
                <div className="absolute -top-3 left-6 rounded-full bg-yellow-500 px-3 py-1 text-xs font-bold text-white">
                  Step {index + 1}
                </div>

                {/* Icon */}
                <div
                  className={`mb-5 mt-2 flex h-14 w-14 items-center justify-center rounded-lg ${step.color}`}
                >
                  <step.icon className="h-7 w-7" />
                </div>

                {/* Content */}
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {step.title}
                </h3>

                <p className="text-sm leading-relaxed text-gray-600">
                  {step.description}
                </p>

                {/* Arrow */}
                {index < steps.length - 1 && (
                  <div className="absolute top-1/2 -right-3 hidden lg:flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white -translate-y-1/2">
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <Link
            to="/workflow"
            className="inline-flex items-center gap-2 rounded-md bg-yellow-500 px-8 py-3 text-sm font-semibold text-black transition hover:bg-yellow-400"
          >
            Explore Full Workflow
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
