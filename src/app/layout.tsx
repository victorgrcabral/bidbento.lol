import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://bidbento.lol"),
  title: "BidBento.lol - Visual Screen Domination & Advertising Engine",
  description:
    "Claim screen space and drive real traffic to your brand, software or SaaS in real-time on bidbento.lol.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "BidBento.lol - Real-Time Screen Domination",
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
      <body className="antialiased bg-slate-100 dark:bg-[#050508] text-slate-900 dark:text-white selection:bg-violet-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
