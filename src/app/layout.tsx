import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MySpace - Dispute a Dominância Visual da Tela",
  description:
    "Compre espaço e conquiste a tela em tempo real para sua marca, software ou SaaS. Inspirado na dinâmica viral do outbid.lol.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="antialiased bg-black text-white selection:bg-violet-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
