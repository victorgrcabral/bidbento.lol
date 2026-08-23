import type { Metadata } from "next";
import "./globals.css";
import { PageViewTracker } from "@/components/PageViewTracker";

export const metadata: Metadata = {
  metadataBase: new URL("https://bidbento.lol"),
  title: "bidbento.lol - Visual Screen Domination & Advertising Engine",
  description:
    "Claim screen space and drive real traffic to your brand, software or SaaS in real-time on bidbento.lol.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon-32.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "bidbento.lol - Real-Time Screen Domination",
    description: "Conquer visual territory and drive direct clicks to your website.",
    images: ["/logo.png"],
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
