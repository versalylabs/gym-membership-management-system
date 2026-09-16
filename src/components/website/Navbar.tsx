"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useBrand } from "@/lib/brand-context";
import {
  Activity,
  Menu,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Flame,
  Zap,
} from "lucide-react";

interface NavbarProps {
  onOpenFreePass: () => void;
}

export default function WebsiteNavbar({ onOpenFreePass }: NavbarProps) {
  const { brand } = useBrand();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Programs", href: "#programs" },
    { label: "About", href: "#about" },
    { label: "Classes", href: "#schedule" },
    { label: "Memberships", href: "#pricing" },
    { label: "Coaches", href: "#trainers" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto pointer-events-none">
      {/* Floating Pill Glass Container */}
      <div
        className={`pointer-events-auto w-full flex items-center justify-between rounded-2xl sm:rounded-full px-4 sm:px-6 py-2.5 sm:py-3 transition-all duration-300 ${
          scrolled
            ? "bg-[#111315]/95 backdrop-blur-2xl border border-[#C8FF3D]/30 shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_20px_-5px_rgba(200,255,61,0.15)]"
            : "bg-[#111315]/80 backdrop-blur-xl border border-[#8C9390]/25 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        }`}
      >
        {/* Brand Logo & Live Pulse Mark */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-black shadow-lg transition-transform group-hover:scale-110"
            style={{
              backgroundColor: brand.primaryColor,
              color: "#111315",
              boxShadow: `0 0 16px ${brand.primaryColor}60`,
            }}
          >
            <Activity className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-lg sm:text-xl font-black text-[#F4F3EE] tracking-widest uppercase group-hover:text-[#C8FF3D] transition-colors">
              {brand.gymName}
            </span>
            <span
              className="inline-block w-2 h-2 rounded-full animate-pulse shadow-sm"
              style={{ backgroundColor: brand.primaryColor }}
            />
          </div>
        </Link>

        {/* Center Desktop Navigation Pill */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#202427]/70 p-1 rounded-full border border-[#8C9390]/20 backdrop-blur-md">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#8C9390] hover:text-[#111315] hover:bg-[#C8FF3D] transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right CTA Suite */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Free 1-Day Pass CTA */}
          <button
            onClick={onOpenFreePass}
            className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider text-[#C8FF3D] bg-[#202427] hover:bg-[#202427]/80 border border-[#C8FF3D]/40 hover:border-[#C8FF3D] hover:shadow-[0_0_15px_rgba(200,255,61,0.25)] transition-all flex items-center gap-1.5 shadow"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C8FF3D]" />
            <span>Free Day Pass</span>
          </button>

          {/* Join Now Primary CTA */}
          <Link
            href="/members/new"
            className="px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 group"
            style={{
              backgroundColor: brand.primaryColor,
              color: "#111315",
              boxShadow: `0 0 20px ${brand.primaryColor}50`,
            }}
          >
            <span>Join Now</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          {/* Discrete Staff Portal Link */}
          <Link
            href="/dashboard"
            className="w-9 h-9 rounded-full bg-[#202427] border border-[#8C9390]/30 hover:border-[#C8FF3D]/50 flex items-center justify-center text-[#8C9390] hover:text-[#C8FF3D] transition-all shadow"
            title="Staff Operations & Management Portal"
          >
            <ShieldCheck className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={onOpenFreePass}
            className="px-3.5 py-1.5 rounded-full text-xs font-black shadow-md"
            style={{ backgroundColor: brand.primaryColor, color: "#111315" }}
          >
            Free Pass
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-9 h-9 rounded-full bg-[#202427] text-[#F4F3EE] hover:text-white border border-[#8C9390]/30 flex items-center justify-center"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto mt-2 lg:hidden bg-[#111315]/98 backdrop-blur-2xl border border-[#8C9390]/30 rounded-3xl p-5 space-y-4 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#8C9390] hover:text-[#111315] hover:bg-[#C8FF3D] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-[#202427] flex flex-col gap-2.5">
            <Link
              href="/members/new"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-full text-xs font-black uppercase tracking-wider text-center shadow-lg"
              style={{ backgroundColor: brand.primaryColor, color: "#111315" }}
            >
              Join {brand.gymName} Today &rarr;
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenFreePass();
              }}
              className="w-full py-3 rounded-full text-xs font-bold uppercase tracking-wider text-[#C8FF3D] bg-[#202427] border border-[#C8FF3D]/30 text-center"
            >
              Claim Free 1-Day Trial Pass
            </button>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-full text-xs font-bold text-[#8C9390] bg-[#111315] border border-[#202427] text-center flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-[#C8FF3D]" />
              <span>Staff Management Login</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
