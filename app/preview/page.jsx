import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Workflow from "@/components/Workflow";

import Infrastructure from "@/components/Infrastructure";
import Comparison from "@/components/Comparison";
import Contact from "@/components/Contact";
import BotAssistant from "@/components/bot";
import Footer from "@/components/Footer";
import InteractiveScanDemo from "@/components/Interactive";
import { generateMetaTags } from "@/seo/seoUtils";
import Script from "next/script";

// ✅ Next.js SEO (server side)
export async function generateMetadata() {
  const meta = generateMetaTags("preview");

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
    },
  };
}

export default function Preview() {
  // ✅ FIX: define meta again here
  const meta = generateMetaTags("preview");

  return (
    <div className="min-h-screen">
      {/* Structured Data */}
      <Script
        id="json-ld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(meta.schema),
        }}
      />
      <Header />
      <Hero />
      <Workflow />
      <InteractiveScanDemo />

      <Infrastructure />
      <Comparison />
      <Contact />
      <Footer />
      <BotAssistant />
    </div>
  );
}
