import { generateRobotsTxt } from "@/seo/seoUtils";

export async function GET() {
  const text = generateRobotsTxt();

  return new Response(text, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
