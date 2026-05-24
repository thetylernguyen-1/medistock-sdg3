import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "animate.css";
import "./globals.css";

import { MedicalDisclaimer } from "@/components/cards/medical-disclaimer";
import { SiteHeader } from "@/components/navigation/site-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MediStock",
  description: "A calm healthcare inventory visibility app for clinics and citizens.",
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
      <body className="min-h-full bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.14),_transparent_32%),linear-gradient(180deg,_#f8fffe_0%,_#f7fbff_100%)] text-slate-900">
        <div className="flex min-h-full flex-col">
          <SiteHeader />
          <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
          <footer className="border-t border-slate-200/80 bg-white/80 px-4 py-6 backdrop-blur sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
              <MedicalDisclaimer />
              <p className="text-sm text-slate-500">
                Emergency situations should be directed to local emergency services immediately.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
