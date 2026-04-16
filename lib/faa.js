import xml2js from "xml2js";

export async function parseFAA(xml) {
  const parsed = await xml2js.parseStringPromise(xml, {
    explicitArray: false,
  });

  const root = parsed?.AIRPORT_STATUS_INFORMATION?.Delay_type || [];
  const items = Array.isArray(root) ? root : [root];

  return items.map((item) => ({
    airport: item?.ARPT || "",
    reason: item?.Reason || "",
  }));
}
