import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Counsel — Protected Legal Intake",
  description:
    "AI-powered personal injury intake protected by attorney-client privilege.",
};

export const viewport: Viewport = {
  // Shrinks the viewport when the keyboard opens so the input bar stays visible
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-navy text-slate-100">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
