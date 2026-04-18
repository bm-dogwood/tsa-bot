import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://tsa.bot"),

  title: {
    default:
      "TSA.BOT — Real-Time TSA Wait Times, Airport Delays & Flight Status",
    template: "%s | TSA.BOT",
  },

  description:
    "Live TSA wait times, airport delays, and flight status. Real-time data from FAA and TSA. Fast, free, no login required.",

  keywords: [
    "tsa wait times",
    "airport delays",
    "flight status",
    "tsa lines",
    "airport security wait time",
  ],

  authors: [{ name: "TSA.BOT" }],
  creator: "TSA.BOT",

  openGraph: {
    type: "website",
    url: "https://tsa.bot",
    title: "TSA.BOT — Real-Time TSA Wait Times, Airport Delays & Flight Status",
    description:
      "Check live TSA wait times, airport delays, and flight status instantly.",
    siteName: "TSA.BOT",
    images: [
      {
        url: "https://tsa.bot/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },

  robots: {
    index: true,
    follow: true,
  },
};
