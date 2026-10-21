import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import MotionProvider from "@/components/MotionProvider";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
const description = "Vishesh Jangid is a full-stack developer in Pune, building considered interfaces, distributed API systems, browser extensions, and desktop tools.";

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio-ashen-asasphi-67.vercel.app"),
  title: { default: "Vishesh Jangid — Full-Stack Developer", template: "%s · Vishesh Jangid" },
  description,
  alternates: { canonical: "/" },
  openGraph: { title: "Vishesh Jangid — Full-Stack Developer", description, type: "website", locale: "en_IN", siteName: "Vishesh Jangid", url: "/" },
  twitter: { card: "summary_large_image", title: "Vishesh Jangid — Full-Stack Developer", description },
  robots: { index: true, follow: true },
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}><body><MotionProvider>{children}</MotionProvider></body></html>;
}
