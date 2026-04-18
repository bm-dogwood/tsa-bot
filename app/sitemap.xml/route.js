import { generateSitemap } from "@/seo/seoUtils";

export async function GET() {
  const xml = generateSitemap();

  return new Response(xml, {
    headers: {
      "Content-Type": "text/xml",
    },
  });
}
