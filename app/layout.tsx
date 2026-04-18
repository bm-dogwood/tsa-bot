import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
        url: "https://images.pexels.com/photos/3912838/pexels-photo-3912838.jpeg",
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
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
