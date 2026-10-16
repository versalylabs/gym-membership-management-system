import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BrandProvider } from "@/lib/brand-context";
import { AuthProvider } from "@/lib/auth-context";
import AppLayoutShell from "@/components/AppLayoutShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Pulse Fitness & Performance Club | Membership Platform",
    template: "%s | Pulse Fitness",
  },
  description: "Elite training facility, dynamic group classes, personal coaching, and membership management.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${inter.className} bg-[#111315] text-[#F4F3EE] min-h-screen`}>
        <BrandProvider>
          <AuthProvider>
            <AppLayoutShell>{children}</AppLayoutShell>
          </AuthProvider>
        </BrandProvider>
      </body>
    </html>
  );
}
