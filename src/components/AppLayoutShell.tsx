"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function AppLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 1. Fullscreen Kiosk Mode & Login Page (clean, no navigation wrapper)
  if (pathname === "/attendance/kiosk" || pathname === "/login") {
    return <div className="min-h-screen bg-[#111315] text-[#F4F3EE]">{children}</div>;
  }

  // 2. Public Gym Website Mode (Root `/` and potential public subpages)
  const isPublicWebsite = pathname === "/";

  if (isPublicWebsite) {
    return (
      <div className="min-h-screen bg-[#111315] text-[#F4F3EE] flex flex-col antialiased selection:bg-[#C8FF3D] selection:text-[#111315]">
        {children}
      </div>
    );
  }

  // 3. Admin & Staff Operations Portal Mode
  return (
    <div className="flex h-screen overflow-hidden bg-[#111315] text-[#F4F3EE] antialiased selection:bg-[#C8FF3D] selection:text-[#111315]">
      {/* Admin Sidebar */}
      <Sidebar />

      {/* Main Admin Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#111315]">
          {children}
        </main>
      </div>
    </div>
  );
}
