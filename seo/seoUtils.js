/**
 * TSA.BOT — Sitemap Generator & Global SEO Utilities
 *
 * 1. generateSitemap()       → XML sitemap string (all pages + SEO pages)
 * 2. generateRobotsTxt()     → robots.txt content
 * 3. globalPageMeta          → default meta for every page
 * 4. schemaOrgGlobal         → site-wide schema (Organization, WebSite)
 * 5. generateMetaTags()      → utility to build full meta tag set per page
 *
 * Usage in Next.js:
 *   // pages/sitemap.xml.js
 *   import { generateSitemap } from '../seo/seoUtils';
 *   export async function getServerSideProps({ res }) {
 *     res.setHeader('Content-Type', 'text/xml');
 *     res.write(generateSitemap());
 *     res.end();
 *     return { props: {} };
 *   }
 *
 * Usage in Express:
 *   app.get('/sitemap.xml', (req, res) => {
 *     res.set('Content-Type', 'text/xml');
 *     res.send(generateSitemap());
 *   });
 */

const BASE_URL = "https://tsa.bot";
const CURRENT_DATE = new Date().toISOString().split("T")[0];

// ─── All site pages with priorities and change frequencies ────────────────────

const MAIN_PAGES = [
  { path: "/", priority: "1.0", changefreq: "always", label: "Home" },
  {
    path: "/airport-delays",
    priority: "0.9",
    changefreq: "always",
    label: "Airport Delays",
  },
  {
    path: "/tsa-wait-times",
    priority: "0.9",
    changefreq: "always",
    label: "TSA Wait Times",
  },
  {
    path: "/flight-status",
    priority: "0.9",
    changefreq: "always",
    label: "Flight Status",
  },
  {
    path: "/tsa-precheck",
    priority: "0.8",
    changefreq: "weekly",
    label: "TSA PreCheck",
  },
  {
    path: "/prohibited-items",
    priority: "0.8",
    changefreq: "monthly",
    label: "Prohibited Items",
  },
  {
    path: "/checkpoint-alerts",
    priority: "0.7",
    changefreq: "daily",
    label: "Checkpoint Alerts",
  },
  { path: "/about", priority: "0.4", changefreq: "monthly", label: "About" },
];

// SEO hidden pages — NOT in nav but IN sitemap
const SEO_PAGES = [
  {
    path: "/airport-security-wait-times",
    priority: "0.85",
    changefreq: "daily",
    label: "Airport Security Wait Times",
  },
  {
    path: "/tsa-precheck-vs-clear",
    priority: "0.80",
    changefreq: "monthly",
    label: "TSA PreCheck vs CLEAR",
  },
  {
    path: "/what-can-you-bring-on-a-plane",
    priority: "0.80",
    changefreq: "monthly",
    label: "What Can You Bring on a Plane",
  },
  {
    path: "/airport-delays-today",
    priority: "0.85",
    changefreq: "daily",
    label: "Airport Delays Today",
  },
  {
    path: "/real-id-requirements-2026",
    priority: "0.80",
    changefreq: "monthly",
    label: "REAL ID Requirements 2026",
  },
  {
    path: "/tsa-precheck-application",
    priority: "0.80",
    changefreq: "monthly",
    label: "TSA PreCheck Application",
  },
  {
    path: "/liquid-rules-carry-on",
    priority: "0.80",
    changefreq: "monthly",
    label: "Liquid Rules Carry-On",
  },
];

const ALL_PAGES = [...MAIN_PAGES, ...SEO_PAGES];

// ─── Sitemap generator ────────────────────────────────────────────────────────

export function generateSitemap(options = {}) {
  const { baseUrl = BASE_URL, lastmod = CURRENT_DATE } = options;

  const urlEntries = ALL_PAGES.map(
    (page) => `
  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  ).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>${urlEntries}
</urlset>`;
}

// ─── Robots.txt ───────────────────────────────────────────────────────────────

export function generateRobotsTxt(baseUrl = BASE_URL) {
  return `User-agent: *
Allow: /

# SEO content pages
Allow: /airport-security-wait-times
Allow: /tsa-precheck-vs-clear
Allow: /what-can-you-bring-on-a-plane
Allow: /airport-delays-today
Allow: /real-id-requirements-2026
Allow: /tsa-precheck-application
Allow: /liquid-rules-carry-on

# API routes — no crawling needed
Disallow: /api/
Disallow: /admin/
Disallow: /_next/

Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay for bots
User-agent: *
Crawl-delay: 1
`;
}

// ─── Global schema.org markup ─────────────────────────────────────────────────

export const schemaOrgGlobal = {
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TSA.BOT",
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description:
      "Real-time airport delay tracker, TSA wait times, and flight status lookup.",
    sameAs: ["https://twitter.com/tsabot"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${BASE_URL}/contact`,
    },
  },

  webSite: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TSA.BOT",
    url: BASE_URL,
    description: "Real-time TSA wait times, airport delays, and flight status",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  },

  softwareApplication: {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TSA.BOT",
    applicationCategory: "TravelApplication",
    operatingSystem: "Web",
    url: BASE_URL,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Real-time airport delays",
      "TSA security wait times",
      "Flight status lookup",
      "TSA PreCheck information",
      "Carry-on rules guide",
      "REAL ID requirements",
    ],
  },
};

// ─── Per-page meta tag builder ────────────────────────────────────────────────

/**
 * Generates complete meta tag data for a page.
 * Use with your framework's head component (Next.js Head, React Helmet, etc.)
 */
export function generateMetaTags({
  title,
  description,
  canonical,
  keywords = "",
  ogImage = `${BASE_URL}/og-image.png`,
  ogType = "website",
  noIndex = false,
}) {
  return {
    // Core
    title,
    description,
    keywords,

    // Robots
    robots: noIndex ? "noindex, nofollow" : "index, follow",

    // Canonical
    canonical,

    // Open Graph
    "og:title": title,
    "og:description": description,
    "og:url": canonical,
    "og:type": ogType,
    "og:image": ogImage,
    "og:image:width": "1200",
    "og:image:height": "630",
    "og:site_name": "TSA.BOT",
    "og:locale": "en_US",

    // Twitter Card
    "twitter:card": "summary_large_image",
    "twitter:title": title,
    "twitter:description": description,
    "twitter:image": ogImage,
    "twitter:site": "@tsabot",

    // Performance
    viewport: "width=device-width, initial-scale=1",
    "theme-color": "#0f172a",
  };
}

// ─── Default meta for each main page ─────────────────────────────────────────

export const defaultPageMeta = {
  "/": generateMetaTags({
    title: "TSA.BOT — Real-Time Airport Delays, TSA Wait Times & Flight Status",
    description:
      "Live airport delay status, TSA security wait times, and flight status lookup. Powered by FAA ATCSCC and FlightAware. Free, no sign-up required.",
    canonical: `${BASE_URL}/`,
  }),

  "/airport-delays": generateMetaTags({
    title: "Live Airport Delays — FAA ATCSCC Status | TSA.BOT",
    description:
      "Real-time airport delay information for all US airports. Ground stops, ground delays, and closures from FAA ATCSCC. Updated every 5 minutes.",
    canonical: `${BASE_URL}/airport-delays`,
  }),

  "/tsa-wait-times": generateMetaTags({
    title: "TSA Wait Times — Live Security Checkpoint Lines | TSA.BOT",
    description:
      "Check live TSA security line wait times at your airport. Data from TSA MyTSA, updated every 10 minutes. LAX, JFK, ORD, ATL, and 400+ airports.",
    canonical: `${BASE_URL}/tsa-wait-times`,
  }),

  "/flight-status": generateMetaTags({
    title: "Flight Status Lookup — Live Departures & Arrivals | TSA.BOT",
    description:
      "Look up real-time flight status by flight number or route. Powered by FlightAware AeroAPI. Delays, gates, terminals, and arrival estimates.",
    canonical: `${BASE_URL}/flight-status`,
  }),

  "/tsa-precheck": generateMetaTags({
    title: "TSA PreCheck Information & Enrollment | TSA.BOT",
    description:
      "Everything about TSA PreCheck: enrollment, costs, benefits, and how to add your KTN to your airline profile. Apply today for $85 / 5 years.",
    canonical: `${BASE_URL}/tsa-precheck`,
  }),

  "/prohibited-items": generateMetaTags({
    title: "TSA Prohibited Items Search — What's Allowed on a Plane | TSA.BOT",
    description:
      "Search TSA rules for any item. Find out if you can bring it in carry-on or checked baggage. Official TSA prohibited items database.",
    canonical: `${BASE_URL}/prohibited-items`,
  }),

  // SEO hidden pages
  "/airport-security-wait-times": generateMetaTags({
    title: "TSA Wait Times by Airport — Live Security Line Updates | TSA.BOT",
    description:
      "Check live TSA wait times at all major US airports. See current security line waits at LAX, JFK, ORD, ATL, DFW and 400+ airports.",
    canonical: `${BASE_URL}/airport-security-wait-times`,
  }),

  "/tsa-precheck-vs-clear": generateMetaTags({
    title: "TSA PreCheck vs CLEAR: Which Is Worth It in 2026? | TSA.BOT",
    description:
      "Full comparison of TSA PreCheck vs CLEAR. Costs, benefits, airport availability, and which is better for your travel style in 2026.",
    canonical: `${BASE_URL}/tsa-precheck-vs-clear`,
    ogType: "article",
  }),

  "/what-can-you-bring-on-a-plane": generateMetaTags({
    title: "What Can You Bring on a Plane? TSA Rules 2026 | TSA.BOT",
    description:
      "Complete TSA carry-on and checked bag rules for 2026. Liquids, electronics, food, medications, and prohibited items explained.",
    canonical: `${BASE_URL}/what-can-you-bring-on-a-plane`,
    ogType: "article",
  }),

  "/airport-delays-today": generateMetaTags({
    title: "Airport Delays Today — Live FAA Status & Ground Stops | TSA.BOT",
    description:
      "Real-time airport delay status for all US airports. Live FAA ATCSCC data — ground stops, delays, and closures updated every 5 minutes.",
    canonical: `${BASE_URL}/airport-delays-today`,
  }),

  "/real-id-requirements-2026": generateMetaTags({
    title: "REAL ID Requirements 2026 — Do You Need It to Fly? | TSA.BOT",
    description:
      "REAL ID enforcement is now required. Learn what documents you need to fly, how to get REAL ID, and what alternative IDs TSA accepts.",
    canonical: `${BASE_URL}/real-id-requirements-2026`,
    ogType: "article",
  }),

  "/tsa-precheck-application": generateMetaTags({
    title: "TSA PreCheck Application Guide 2026 — How to Enroll | TSA.BOT",
    description:
      "Step-by-step guide to applying for TSA PreCheck in 2026. Required documents, enrollment process, and how to add your KTN to airline profiles.",
    canonical: `${BASE_URL}/tsa-precheck-application`,
    ogType: "article",
  }),

  "/liquid-rules-carry-on": generateMetaTags({
    title: "TSA Liquid Rules for Carry-On Bags 2026 — 3-1-1 Rule | TSA.BOT",
    description:
      "Everything about the TSA 3-1-1 liquid rule: what counts as a liquid, exceptions for medications and baby formula, and packing tips.",
    canonical: `${BASE_URL}/liquid-rules-carry-on`,
    ogType: "article",
  }),
};

// ─── Next.js App Router usage example ────────────────────────────────────────

/**
 * Usage in Next.js 13+ App Router:
 *
 * // app/airport-security-wait-times/page.jsx
 * import { generateMetaTags } from '@/seo/seoUtils';
 *
 * export const metadata = {
 *   title: "TSA Wait Times by Airport — Live Security Line Updates | TSA.BOT",
 *   description: "Check live TSA wait times at all major US airports...",
 *   alternates: { canonical: "https://tsa.bot/airport-security-wait-times" },
 *   openGraph: {
 *     title: "TSA Wait Times by Airport",
 *     description: "...",
 *     url: "https://tsa.bot/airport-security-wait-times",
 *     type: "website",
 *   },
 * };
 *
 * export default function Page() { ... }
 */

// ─── Google Search Console submission reminder ────────────────────────────────

export const GSC_SUBMISSION_CHECKLIST = `
Google Search Console Sitemap Submission:
1. Go to search.google.com/search-console
2. Add property: tsa.bot
3. Verify ownership (HTML tag or DNS record)
4. Navigate to Sitemaps (left sidebar)
5. Enter: sitemap.xml
6. Click Submit

After submission, GSC will show:
- # of URLs discovered
- # of URLs indexed
- Any crawl errors

Monitor weekly for the first month, then monthly.
Re-submit sitemap after major content additions.
`;

export { ALL_PAGES, MAIN_PAGES, SEO_PAGES, BASE_URL };
