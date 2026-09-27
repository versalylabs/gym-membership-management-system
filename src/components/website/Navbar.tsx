"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useBrand } from "@/lib/brand-context";
import {
  Activity,
  Menu,
  X,
  User,
  Sparkles,
  ArrowRight,
  Dumbbell,
} from "lucide-react";

interface NavbarProps {
  onOpenFreePass: () => void;
}

export default function WebsiteNavbar({ onOpenFreePass }: NavbarProps) {
  const { brand } = useBrand();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sectionIds = ["faq", "trainers", "pricing", "schedule", "about", "programs"];
      const scrollPosition = window.scrollY + 250;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(id);
          return;
        }
      }
      setActiveSection("");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Programs", href: "#programs", id: "programs" },
    { label: "About", href: "#about", id: "about" },
    { label: "Classes", href: "#schedule", id: "schedule" },
    { label: "Memberships", href: "#pricing", id: "pricing" },
    { label: "Coaches", href: "#trainers", id: "trainers" },
    { label: "FAQ", href: "#faq", id: "faq" },
  ];

  return (
    <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto pointer-events-none">
      {/* Floating Pill Outer Container Matching UI Mockup */}
      <div
        className={`pointer-events-auto w-full flex items-center justify-between rounded-full px-3.5 sm:px-6 py-2.5 sm:py-3 transition-all duration-300 ${
          scrolled
            ? "bg-[#111315]/95 backdrop-blur-2xl border border-[#8C9390]/40 shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_20px_-5px_rgba(200,255,61,0.15)]"
            : "bg-[#111315]/85 backdrop-blur-xl border border-[#8C9390]/35 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
        }`}
      >
        {/* Left: Brand Logo Pill with Icon */}
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-black shadow-lg transition-transform group-hover:scale-105"
            style={{
              backgroundColor: brand.primaryColor,
              color: "#111315",
              boxShadow: `0 0 16px ${brand.primaryColor}50`,
            }}
          >
            <Activity className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-xl sm:text-2xl font-black text-[#F4F3EE] tracking-wider uppercase">
            {brand.gymName}
          </span>
        </Link>

        {/* Center: Enclosed Pill Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 px-7 py-2 rounded-full border border-[#8C9390]/30 bg-[#111315]/80 backdrop-blur-md">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.label}
                href={link.href}
                className={`text-xs sm:text-sm tracking-wide transition-all font-semibold relative ${
                  isActive
                    ? "text-[#C8FF3D] font-bold drop-shadow-[0_0_8px_rgba(200,255,61,0.6)]"
                    : "text-[#F4F3EE]/80 hover:text-[#C8FF3D]"
                }`}
              >
                {link.label}
                {isActive && (
                  <span
                    className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full"
                    style={{ backgroundColor: brand.primaryColor }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Free Day Pass Button */}
          <button
            type="button"
            onClick={onOpenFreePass}
            className="hidden sm:inline-flex px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-[#F4F3EE] bg-[#202427]/90 hover:bg-[#2A2E33] border border-[#8C9390]/40 hover:border-[#C8FF3D] transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap items-center shadow"
          >
            Free Day Pass
          </button>

          {/* Feel the Pulse CTA Button */}
          <button
            type="button"
            onClick={onOpenFreePass}
            className="px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-black text-[#111315] shadow-lg transition-all hover:opacity-95 hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
            style={{ backgroundColor: brand.primaryColor }}
          >
            Feel the Pulse
          </button>

          {/* Circular Action Button from Mockup */}
          <Link
            href="/login"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#8C9390]/40 hover:border-[#C8FF3D] bg-[#111315]/80 hover:bg-[#202427] flex items-center justify-center text-[#8C9390] hover:text-[#C8FF3D] transition-all shadow cursor-pointer group"
            title="Staff & Member Portal"
          >
            <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full bg-[#202427] border border-[#8C9390]/30 text-[#8C9390] hover:text-[#F4F3EE]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto lg:hidden mt-3 rounded-3xl bg-[#111315]/98 border border-[#8C9390]/30 p-6 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 text-sm font-bold uppercase tracking-wider transition-colors ${
                    isActive ? "text-[#C8FF3D]" : "text-[#F4F3EE] hover:text-[#C8FF3D]"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
            <div className="pt-4 border-t border-[#8C9390]/20 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenFreePass();
                }}
                className="w-full py-3 rounded-full text-xs font-bold text-[#F4F3EE] bg-[#202427] text-center border border-[#8C9390]/30 hover:border-[#C8FF3D]"
              >
                Free Day Pass
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenFreePass();
                }}
                className="w-full py-3 rounded-full text-xs font-black text-[#111315] text-center"
                style={{ backgroundColor: brand.primaryColor }}
              >
                Feel the Pulse
              </button>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-full text-xs font-bold text-[#8C9390] bg-[#111315] text-center border border-[#8C9390]/20"
              >
                Staff Portal Sign In
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
