"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useBrand } from "@/lib/brand-context";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function AppLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { brand } = useBrand();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Automatically close mobile menu & update browser tab title
  useEffect(() => {
    setMobileMenuOpen(false);

    const titles: Record<string, string> = {
      "/": `${brand.gymName} | Elite Performance Club`,
      "/dashboard": `Dashboard | ${brand.gymName}`,
      "/members": `Members Directory | ${brand.gymName}`,
      "/members/new": `Register Athlete | ${brand.gymName}`,
      "/memberships": `Membership Plans | ${brand.gymName}`,
      "/attendance": `Attendance Logs | ${brand.gymName}`,
      "/attendance/kiosk": `Turnstile Kiosk | ${brand.gymName}`,
      "/classes": `Classes Timetable | ${brand.gymName}`,
      "/trainers": `Trainer Hub | ${brand.gymName}`,
      "/pos": `POS & Sales Register | ${brand.gymName}`,
      "/leads": `Sales & Leads Pipeline | ${brand.gymName}`,
      "/reports": `Executive Reports | ${brand.gymName}`,
      "/settings": `Facility Settings | ${brand.gymName}`,
      "/login": `Staff Sign In | ${brand.gymName}`,
    };

    const matchedKey = Object.keys(titles).find((key) =>
      key === "/" ? pathname === "/" : pathname === key || pathname.startsWith(`${key}/`)
    );

    document.title = (matchedKey && titles[matchedKey]) || `${brand.gymName} | Performance Club`;
  }, [pathname, brand.gymName]);

  // 1. Fullscreen Kiosk Mode & Login Page (clean, no navigation wrapper)
  if (pathname === "/attendance/kiosk" || pathname === "/login") {
    return (
      <div key="standalone" className="min-h-screen bg-[#111315] text-[#F4F3EE]">
        {children}
      </div>
    );
  }

  // 2. Public Gym Website Mode (Root `/` and potential public subpages)
  const isPublicWebsite = pathname === "/";

  if (isPublicWebsite) {
    return (
      <div
        key="public-website"
        className="min-h-screen bg-[#111315] text-[#F4F3EE] flex flex-col antialiased selection:bg-[#C8FF3D] selection:text-[#111315]"
      >
        {children}
      </div>
    );
  }

  // 3. Admin & Staff Operations Portal Mode
  return (
    <div
      key="admin-portal"
      className="flex h-screen overflow-hidden bg-[#111315] text-[#F4F3EE] antialiased selection:bg-[#C8FF3D] selection:text-[#111315]"
    >
      {/* Admin Sidebar with Mobile Drawer support */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Admin Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onOpenMobile={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-[#111315]">
          {children}
        </main>
      </div>
    </div>
  );
}
