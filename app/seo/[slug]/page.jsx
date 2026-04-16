import { seoPages } from "@/seo/seoPages";
import { generateMetaTags } from "@/seo/seoUtils";
import { notFound } from "next/navigation";

// ✅ Generate metadata dynamically
export async function generateMetadata({ params }) {
  const slug = params.slug;
  const path = `/${slug}`;

  const page = seoPages[path];

  if (!page) {
    return {
      title: "Page Not Found | TSA.BOT",
      description: "The requested page does not exist.",
      robots: "noindex, nofollow",
    };
  }

  const meta = generateMetaTags(page.meta);

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    robots: meta.robots,

    alternates: {
      canonical: meta.canonical,
    },

    openGraph: {
      title: meta["og:title"],
      description: meta["og:description"],
      url: meta["og:url"],
      type: meta["og:type"],
      images: [
        {
          url: meta["og:image"],
          width: 1200,
          height: 630,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: meta["twitter:title"],
      description: meta["twitter:description"],
      images: [meta["twitter:image"]],
    },
  };
}

// ✅ Convert markdown-like string → HTML
function formatContent(content) {
  return content
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
    .replace(/\n/g, "<br />");
}

// ✅ Page component
export default function SeoPage({ params }) {
  const slug = params.slug;
  const path = `/${slug}`;

  const page = seoPages[path];

  if (!page) return notFound();

  return (
    <div className="min-h-screen px-6 py-10">
      {/* ✅ Schema (VERY IMPORTANT for ranking) */}
      {page.schema?.map((schemaObj, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaObj),
          }}
        />
      ))}

      {/* ✅ SEO Content */}
      <article className="max-w-4xl mx-auto">
        <div
          className="prose"
          dangerouslySetInnerHTML={{
            __html: formatContent(page.content),
          }}
        />
      </article>
    </div>
  );
}

// ✅ Pre-generate all SEO pages (BEST FOR SEO)
export async function generateStaticParams() {
  return Object.keys(seoPages).map((path) => ({
    slug: path.replace("/", ""),
  }));
}
