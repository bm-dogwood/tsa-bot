"use client";
import { Shield, Mail, Phone, MapPin, LineChart, X } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {/* Brand */}
          <div>
            <a href="#" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <span className="text-lg font-bold">
                TSA<span className="text-primary">.BOT</span>
              </span>
            </a>
            <p className="text-sm text-neutral-400 leading-relaxed">
              AI-powered automated security screening for next-generation
              airport checkpoints.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              {[
                "Screening Workflow",
                "AI Dashboard",
                "Passenger Experience",
                "Infrastructure",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-neutral-400 hover:text-primary transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {[
                "Documentation",
                "Case Studies",
                "Security Whitepaper",
                "Compliance",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-neutral-400 hover:text-primary transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                enterprise@tsascreen.ai
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                1-800-TSA-DEMO
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5" />
                Washington, D.C. Metro Area
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-neutral-500">
            © {currentYear} TSAScreen AI. Conceptual demonstration platform.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm text-neutral-500 hover:text-primary transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-neutral-500 hover:text-primary transition-colors"
            >
              Terms of Use
            </a>

            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-neutral-400 hover:bg-white/20 hover:text-primary transition"
              >
                <LineChart className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-neutral-400 hover:bg-white/20 hover:text-primary transition"
              >
                <X className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
