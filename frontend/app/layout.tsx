import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";

import "./globals.css";

const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

export const metadata: Metadata = {
  title: "CHAT QUEST // HISTORY ARENA",
  description: "A retro AI chat agent. Insert coin to begin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${pixelFont.variable} font-mono`}>{children}</body>
    </html>
  );
}
