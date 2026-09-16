"use client";

import React, { useState, useRef, useEffect } from "react";
import { useBrand } from "@/lib/brand-context";
import { useAuth } from "@/lib/auth-context";
import {
  Search,
  Bell,
  QrCode,
  Globe,
  ExternalLink,
  LogOut,
  ChevronDown,
  ShieldCheck,
  UserCheck,
  Dumbbell,
  User,
} from "lucide-react";
import Link from "next/link";

export default function Header() {
  const { brand } = useBrand();
  const { user, logout, quickLogin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name?: string) => {
    if (!name) return "AD";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case "OWNER":
      case "MANAGER":
        return "Gym Manager";
      case "RECEPTIONIST":
        return "Front Desk Reception";
      case "TRAINER":
        return "Fitness Trainer";
      default:
        return "Staff Member";
    }
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-6 border-b border-[#8C9390]/20 bg-[#202427]/90 backdrop-blur">
      {/* Search Bar */}
      <div className="flex items-center gap-3 w-96">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C9390]" />
          <input
            type="text"
            placeholder="Search members, phone, plans, invoices..."
            className="w-full pl-10 pr-4 py-2 bg-[#111315] border border-[#8C9390]/30 rounded-xl text-xs text-[#F4F3EE] placeholder-[#8C9390]/60 focus:outline-none focus:border-[#C8FF3D] transition-colors"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Public Website Switcher */}
        <Link
          href="/"
          target="_blank"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#8C9390]/30 bg-[#111315] hover:bg-[#111315]/80 text-xs text-[#F4F3EE] font-bold transition-all shadow-sm group"
        >
          <Globe className="w-3.5 h-3.5 text-[#C8FF3D] group-hover:rotate-12 transition-transform" />
          <span>Gym Website</span>
          <ExternalLink className="w-3 h-3 text-[#8C9390]" />
        </Link>

        {/* Quick Check-in Launcher */}
        <Link
          href="/attendance"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black shadow-md hover:opacity-90 transition-transform active:scale-95"
          style={{ backgroundColor: brand.primaryColor, color: "#111315" }}
        >
          <QrCode className="w-4 h-4" />
          <span>Quick Check-In</span>
        </Link>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl border border-[#8C9390]/25 text-[#8C9390] hover:text-[#F4F3EE] hover:bg-[#111315] transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C8FF3D]" />
        </button>

        {/* User Profile & Role Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 pl-2 py-1 pr-2 rounded-xl hover:bg-[#111315]/50 border-l border-[#8C9390]/20 transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#111315] border border-[#8C9390]/30 flex items-center justify-center font-black text-xs text-[#C8FF3D]">
              {getInitials(user?.name)}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-[#F4F3EE] leading-none">
                {user?.name || "Staff Member"}
              </p>
              <p className="text-[10px] text-[#8C9390] mt-0.5">
                {getRoleLabel(user?.role)}
              </p>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-[#8C9390] transition-transform ${menuOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#202427] border border-[#8C9390]/25 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
              {/* User details header */}
              <div className="p-3 rounded-xl bg-[#111315] border border-[#8C9390]/20 mb-2">
                <p className="text-xs font-black text-[#F4F3EE]">{user?.name || "Alex Davis"}</p>
                <p className="text-[11px] text-[#8C9390] truncate">{user?.email || "manager@pulsegym.com"}</p>
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#C8FF3D]/10 border border-[#C8FF3D]/30 text-[10px] font-black text-[#C8FF3D]">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{user?.role || "MANAGER"}</span>
                </div>
              </div>

              {/* Demo Account Quick Switch */}
              <div className="px-2 py-1.5 text-[10px] font-bold text-[#8C9390] uppercase tracking-wider">
                Switch Demo Role
              </div>

              <div className="space-y-1 mb-2">
                <button
                  type="button"
                  onClick={() => {
                    quickLogin("MANAGER");
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs hover:bg-[#111315] text-[#F4F3EE] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C8FF3D]" />
                    <span>Manager</span>
                  </div>
                  {user?.role === "MANAGER" && <span className="text-[10px] text-[#C8FF3D] font-bold">Active</span>}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    quickLogin("RECEPTIONIST");
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs hover:bg-[#111315] text-[#F4F3EE] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Front Desk</span>
                  </div>
                  {user?.role === "RECEPTIONIST" && <span className="text-[10px] text-[#C8FF3D] font-bold">Active</span>}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    quickLogin("TRAINER");
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs hover:bg-[#111315] text-[#F4F3EE] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Dumbbell className="w-3.5 h-3.5 text-amber-400" />
                    <span>Trainer</span>
                  </div>
                  {user?.role === "TRAINER" && <span className="text-[10px] text-[#C8FF3D] font-bold">Active</span>}
                </button>
              </div>

              {/* Logout Button */}
              <div className="pt-2 border-t border-[#8C9390]/20">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
