import type { Metadata } from "next";
import "./globals.css";
import { PageViewTracker } from "@/components/PageViewTracker";

export const metadata: Metadata = {
  metadataBase: new URL("https://bidbento.lol"),
  title: "bidbento.lol — Proportional screen visibility",
  description:
    "Bid from $1. Every valid bid earns screen space proportional to its value on bidbento.lol.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.svg?v=2", type: "image/svg+xml" },
      { url: "/favicon-32.png?v=2", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon-32.png?v=2",
    apple: "/apple-touch-icon.png?v=2",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "bidbento.lol",
    locale: "en_US",
    title: "bidbento.lol — Proportional screen visibility",
    description:
      "Bid from $1. Every valid bid earns screen space proportional to its value.",
    images: [
      {
        url: "/og/bidbento-robot-link-preview-v2.jpg",
        width: 1200,
        height: 630,
        alt: "Animated BidBento robot mascot floating on a black background",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "bidbento.lol — Proportional screen visibility",
    description:
      "Your bid does not need to be the biggest to claim a block worth noticing.",
    images: ["/og/bidbento-robot-link-preview-v2.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#050508] text-white selection:bg-violet-600 selection:text-white">
        <PageViewTracker />
        {children}
      </body>
    </html>
  );
}
