"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBrand } from "@/lib/brand-context";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  QrCode,
  CalendarDays,
  ShoppingBag,
  TrendingUp,
  BarChart3,
  Settings,
  Dumbbell,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Globe,
  ExternalLink,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { brand } = useBrand();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const allNavItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["OWNER", "MANAGER", "RECEPTIONIST", "TRAINER"] },
    { name: "Members CRM", href: "/members", icon: Users, roles: ["OWNER", "MANAGER", "RECEPTIONIST"] },
    { name: "Memberships & Plans", href: "/memberships", icon: CreditCard, roles: ["OWNER", "MANAGER", "RECEPTIONIST"] },
    { name: "Check-in Kiosk", href: "/attendance", icon: QrCode, roles: ["OWNER", "MANAGER", "RECEPTIONIST", "TRAINER"] },
    { name: "Classes & Schedule", href: "/classes", icon: CalendarDays, roles: ["OWNER", "MANAGER", "RECEPTIONIST", "TRAINER"] },
    { name: "Trainer Hub", href: "/trainers", icon: Dumbbell, roles: ["OWNER", "MANAGER", "TRAINER"] },
    { name: "POS & Billing", href: "/pos", icon: ShoppingBag, roles: ["OWNER", "MANAGER", "RECEPTIONIST"] },
    { name: "Leads Pipeline", href: "/leads", icon: TrendingUp, roles: ["OWNER", "MANAGER", "RECEPTIONIST"] },
    { name: "Reports & Analytics", href: "/reports", icon: BarChart3, roles: ["OWNER", "MANAGER"] },
    { name: "Brand & Settings", href: "/settings", icon: Settings, roles: ["OWNER", "MANAGER"] },
  ];

  // Filter items based on active role (default to MANAGER if loading or unassigned)
  const userRole = user?.role || "MANAGER";
  const navItems = allNavItems.filter((item) => item.roles.includes(userRole));

  return (
    <aside
      className={`relative flex flex-col border-r border-[#8C9390]/20 bg-[#202427]/98 backdrop-blur transition-all duration-300 z-30 ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-[#8C9390]/20">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div
            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black shadow-lg transition-colors"
            style={{ backgroundColor: brand.primaryColor, color: "#111315" }}
          >
            <Dumbbell className="w-6 h-6" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-[#F4F3EE] truncate tracking-tight">
                {brand.gymName}
              </span>
              <span className="text-[11px] text-[#8C9390] truncate">
                Staff Operations Portal
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex p-1.5 rounded-lg text-[#8C9390] hover:text-[#F4F3EE] hover:bg-[#111315] transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-[#8C9390] uppercase flex items-center justify-between">
          {!collapsed ? <span>Navigation ({userRole})</span> : <span>•••</span>}
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all ${
                isActive
                  ? "shadow-sm font-black"
                  : "text-[#8C9390] hover:text-[#F4F3EE] hover:bg-[#111315]/70 font-medium"
              }`}
              style={{
                backgroundColor: isActive ? brand.primaryColor : undefined,
                color: isActive ? "#111315" : undefined,
              }}
              title={collapsed ? item.name : undefined}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-[#111315]" : "text-[#8C9390]"}`} />
              {!collapsed && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </div>

      {/* Switch to Public Website Link */}
      <div className="p-3 border-t border-[#8C9390]/20 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#F4F3EE] bg-[#111315] hover:bg-[#111315]/80 border border-[#8C9390]/30 transition-all group"
          title={collapsed ? "View Public Website" : undefined}
        >
          <Globe className="w-4 h-4 text-[#C8FF3D] flex-shrink-0 group-hover:scale-110 transition-transform" />
          {!collapsed && (
            <div className="flex items-center justify-between w-full">
              <span>View Public Website</span>
              <ExternalLink className="w-3 h-3 text-[#8C9390]" />
            </div>
          )}
        </Link>

        {/* System Status */}
        {!collapsed && (
          <div className="p-3 rounded-xl bg-[#111315] border border-[#8C9390]/20">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C8FF3D]" />
              <span className="text-[11px] font-semibold text-[#F4F3EE]">Pulse System</span>
            </div>
            <p className="text-[10px] text-[#8C9390] leading-snug">
              Role: <span className="text-[#C8FF3D] font-bold">{userRole}</span>
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
