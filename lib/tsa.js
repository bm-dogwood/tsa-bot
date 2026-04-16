import xml2js from "xml2js";

export async function parseTSA(xml, airport) {
  // ✅ guard against bad responses
  if (typeof xml !== "string") {
    throw new Error("TSA response is not a string");
  }

  if (!xml.includes("<") || xml.startsWith("<!DOCTYPE html")) {
    console.error("❌ TSA returned HTML:", xml.slice(0, 200));
    throw new Error("Invalid TSA response");
  }

  const parsed = await xml2js.parseStringPromise(xml, {
    explicitArray: false,
    trim: true,
  });

  const airports = parsed?.Airports?.Airport || [];
  const list = Array.isArray(airports) ? airports : [airports];

  const found = list.find((a) => a.AirportCode === airport);

  if (!found) return [];

  const checkpoints = found?.WaitTimes?.WaitTime || [];

  return Array.isArray(checkpoints) ? checkpoints : [checkpoints];
}
