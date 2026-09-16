import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BrandProvider } from "@/lib/brand-context";
import { AuthProvider } from "@/lib/auth-context";
import AppLayoutShell from "@/components/AppLayoutShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fitness & Performance Club | Membership & Training Platform",
  description: "Elite training facility, dynamic group classes, personal coaching, and membership management.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
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
