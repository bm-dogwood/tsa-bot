import * as cheerio from "cheerio";

export function parseClear(html) {
  const $ = cheerio.load(html);
  const locations = [];

  $(".location").each((_, el) => {
    locations.push({
      name: $(el).text(),
    });
  });

  return locations;
}
