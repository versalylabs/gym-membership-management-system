"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useBrand } from "@/lib/brand-context";
import {
  Dumbbell,
  ShieldCheck,
  Mail,
  ArrowRight,
  Heart,
  Globe,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  CheckCircle2,
  Sparkles,
  QrCode,
  ShoppingBag,
} from "lucide-react";

export default function WebsiteFooter() {
  const { brand } = useBrand();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail("");
    }
  };

  return (
    <footer className="bg-[#111315] border-t border-[#202427] pt-20 pb-12 text-[#8C9390] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#202427]">
          {/* Col 1 & 2: Brand & Platform Mission (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center font-black shadow-lg"
                style={{ backgroundColor: brand.primaryColor, color: "#111315" }}
              >
                <Dumbbell className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-[#F4F3EE] tracking-tight uppercase">
                  {brand.gymName}
                </span>
                <span className="text-[10px] text-[#8C9390] font-bold uppercase">
                  {brand.tagline}
                </span>
              </div>
            </Link>

            <p className="text-xs text-[#8C9390] leading-relaxed max-w-sm">
              The premier training facility and community dedicated to athletic performance, strength progression, and holistic recovery.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <span className="w-8 h-8 rounded-xl bg-[#202427] border border-[#8C9390]/25 flex items-center justify-center hover:text-[#C8FF3D] hover:border-[#C8FF3D]/40 transition-colors cursor-pointer text-[#F4F3EE]">
                <Instagram className="w-4 h-4" />
              </span>
              <span className="w-8 h-8 rounded-xl bg-[#202427] border border-[#8C9390]/25 flex items-center justify-center hover:text-[#C8FF3D] hover:border-[#C8FF3D]/40 transition-colors cursor-pointer text-[#F4F3EE]">
                <Youtube className="w-4 h-4" />
              </span>
              <span className="w-8 h-8 rounded-xl bg-[#202427] border border-[#8C9390]/25 flex items-center justify-center hover:text-[#C8FF3D] hover:border-[#C8FF3D]/40 transition-colors cursor-pointer text-[#F4F3EE]">
                <Twitter className="w-4 h-4" />
              </span>
              <span className="w-8 h-8 rounded-xl bg-[#202427] border border-[#8C9390]/25 flex items-center justify-center hover:text-[#C8FF3D] hover:border-[#C8FF3D]/40 transition-colors cursor-pointer text-[#F4F3EE]">
                <Facebook className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Col 3: Training Disciplines */}
          <div className="space-y-3">
            <p className="text-xs font-black text-[#F4F3EE] uppercase tracking-wider">
              Programs & Zones
            </p>
            <ul className="space-y-2">
              <li>
                <a href="#programs" className="hover:text-[#C8FF3D] transition-colors">
                  Strength & Powerlifting
                </a>
              </li>
              <li>
                <a href="#programs" className="hover:text-[#C8FF3D] transition-colors">
                  High-Intensity HIIT
                </a>
              </li>
              <li>
                <a href="#programs" className="hover:text-[#C8FF3D] transition-colors">
                  50m Athletic Turf
                </a>
              </li>
              <li>
                <a href="#programs" className="hover:text-[#C8FF3D] transition-colors">
                  Boxing & Heavy Bags
                </a>
              </li>
              <li>
                <a href="#programs" className="hover:text-[#C8FF3D] transition-colors">
                  Cold Plunge & Finnish Sauna
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Member Navigation & Portals */}
          <div className="space-y-3">
            <p className="text-xs font-black text-[#F4F3EE] uppercase tracking-wider">
              Quick Links
            </p>
            <ul className="space-y-2">
              <li>
                <a href="#schedule" className="hover:text-[#C8FF3D] transition-colors">
                  Live Class Timetable
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-[#C8FF3D] transition-colors">
                  Membership Options
                </a>
              </li>
              <li>
                <Link href="/members/new" className="hover:text-[#C8FF3D] transition-colors">
                  Online Member Sign-Up
                </Link>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#C8FF3D] transition-colors">
                  Location & Hours
                </a>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-[#C8FF3D] font-bold hover:underline flex items-center gap-1 pt-1"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Staff Operations Login &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Newsletter */}
          <div className="space-y-3">
            <p className="text-xs font-black text-[#F4F3EE] uppercase tracking-wider">
              Athlete Newsletter
            </p>
            <p className="text-[11px] text-[#8C9390] leading-relaxed">
              Weekly workout programming tips, nutrition guides, and coach workshops.
            </p>

            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  placeholder="athlete@example.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#202427] border border-[#8C9390]/30 text-xs text-[#F4F3EE] placeholder-[#8C9390]/60 focus:outline-none focus:border-[#C8FF3D]"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow transition-all hover:opacity-90 flex items-center justify-center gap-1.5"
                  style={{ backgroundColor: brand.primaryColor, color: "#111315" }}
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <div className="p-3 rounded-xl bg-[#202427] border border-[#C8FF3D]/40 text-[#C8FF3D] text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Subscribed successfully!</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-[#8C9390]">
            &copy; {new Date().getFullYear()} {brand.gymName}. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-[11px] text-[#8C9390]">
            <Link href="/settings" className="hover:text-[#F4F3EE] transition-colors">
              Brand Settings
            </Link>
            <span>&bull;</span>
            <Link href="/dashboard" className="hover:text-[#F4F3EE] transition-colors">
              Staff Portal
            </Link>
            <span>&bull;</span>
            <Link href="/attendance/kiosk" className="hover:text-[#F4F3EE] transition-colors">
              Check-In Kiosk
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
