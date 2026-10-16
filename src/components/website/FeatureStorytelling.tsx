"use client";

import React from "react";
import Link from "next/link";
import { useBrand } from "@/lib/brand-context";
import { formatDate } from "@/lib/utils";
import {
  Users,
  QrCode,
  ShoppingBag,
  Layers,
  CheckCircle2,
  Sparkles,
  Flame,
  Clock,
  Printer,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Maximize2,
  FileCheck,
} from "lucide-react";

export default function FeatureStorytelling() {
  const { brand } = useBrand();

  return (
    <section id="features" className="py-24 bg-slate-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-28">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Engineered For Fitness Operators</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            Purpose-Built Workflows
          </h2>
          <p className="mt-4 text-slate-400 text-sm sm:text-base">
            Eliminate fragmented spreadsheets and clunky generic software. Every module is tailored specifically for real-world gym operations.
          </p>
        </div>

        {/* STORY 1: Athlete Command Center */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Text narrative (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold uppercase tracking-wider">
              <Users className="w-3.5 h-3.5" />
              <span>Athlete Intelligence</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Understand Every Member At A Single Glance
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Replace disconnected paper files with a comprehensive Athlete Dossier. Instantly review emergency contacts, PAR-Q medical clearance, attendance habits, workout streaks, and signed liability waivers.
            </p>

            <ul className="space-y-2.5 pt-2 text-xs text-slate-300">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Automated 7-day membership expiry radar & 1-click renewals</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>30-Day punch-card heatmap & workout consistency streaks</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Legally binding HTML5 canvas touch/stylus e-signature vault</span>
              </li>
            </ul>

            <div className="pt-3">
              <Link
                href="/members"
                className="inline-flex items-center gap-2 text-xs font-bold text-white hover:underline"
                style={{ color: brand.primaryColor }}
              >
                <span>Explore Athlete CRM</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Visual UI slice (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-slate-950 border-2 border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs text-white shadow"
                  style={{ backgroundColor: brand.primaryColor }}
                >
                  SR
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Sarah Reynolds</h4>
                  <p className="text-[11px] text-slate-400">sarah@athlete.demo &bull; ID: MEM-1042</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase">
                Active &bull; VIP Tier
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Streak</span>
                <p className="text-base font-black text-amber-400 mt-0.5 flex items-center gap-1">
                  <Flame className="w-4 h-4 fill-amber-400" /> 6 Days
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Days Left</span>
                <p className="text-base font-black text-emerald-400 mt-0.5">244 Days</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold">PAR-Q Risk</span>
                <p className="text-base font-black text-emerald-400 mt-0.5">Cleared ✓</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Digital Waiver on File:</span>
              <span className="font-mono text-emerald-400 font-bold">
                E-SIGN-VERIFIED &bull; {formatDate(new Date())}
              </span>
            </div>
          </div>
        </div>

        {/* STORY 2: Touchless Turnstiles & Tablet Kiosk */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Visual UI slice (7 cols) */}
          <div className="lg:col-span-7 order-2 lg:order-1 rounded-3xl bg-slate-950 border-2 border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Live Floor Density</span>
                <p className="text-xl font-black text-white mt-0.5">42 / 120 Athletes Inside</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                35% Capacity
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-300 uppercase">
                    Scan Verified: Devon Reed (MEM-1004)
                  </h4>
                  <p className="text-[11px] text-emerald-400/90">
                    VIP All-Access &bull; Synthesized Audio Verification Chime Triggered
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs text-emerald-400 font-bold">0.8s</span>
            </div>
          </div>

          {/* Text narrative (5 cols) */}
          <div className="lg:col-span-5 order-1 lg:order-2 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
              <QrCode className="w-3.5 h-3.5" />
              <span>Turnstiles & Kiosk</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Rapid Access Control & Live Floor Headcount
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Speed up reception check-ins with our dedicated fullscreen tablet kiosk. Members enter their 4-digit PIN or scan their barcode card for sub-second verified admission.
            </p>

            <ul className="space-y-2.5 pt-2 text-xs text-slate-300">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Web Audio API chords for instant positive audio chimes & alerts</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>PIN-protected staff exit lock (`1234`) for secure tablet deployment</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Real-time occupancy load balancing with safety capacity thresholds</span>
              </li>
            </ul>

            <div className="pt-3">
              <Link
                href="/attendance/kiosk"
                className="inline-flex items-center gap-2 text-xs font-bold text-white hover:underline"
                style={{ color: brand.primaryColor }}
              >
                <span>Launch Tablet Kiosk Mode</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* STORY 3: Point of Sale & Tax Invoices */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Text narrative (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Front-Desk POS</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Front-Desk Retail & Instant Tax Invoicing
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Sell apparel, protein shakes, hydration supplements, and guest day passes effortlessly. Link purchases directly to member accounts or accept walk-in guest cash payments with automated change calculators.
            </p>

            <ul className="space-y-2.5 pt-2 text-xs text-slate-300">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Multi-tender support (Credit Card, Cash, Bank Transfer)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Automated itemized tax receipts & PDF invoices with gym branding</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Real-time inventory deduction & low-stock warning alerts</span>
              </li>
            </ul>

            <div className="pt-3">
              <Link
                href="/pos"
                className="inline-flex items-center gap-2 text-xs font-bold text-white hover:underline"
                style={{ color: brand.primaryColor }}
              >
                <span>Open POS Terminal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Visual UI slice (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-slate-950 border-2 border-slate-800 p-6 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white uppercase">
                  Tax Invoice #INV-2026-8942
                </span>
              </div>
              <span className="text-xs font-black text-emerald-400">KSh 6,500 PAID</span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span>1 &times; Whey Protein Isolate (2kg Tub)</span>
                <span className="font-bold text-white">KSh 6,500</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Subtotal</span>
                <span>KSh 5,603.45</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">VAT (16%)</span>
                <span>KSh 896.55</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Receipt Dispatched:</span>
              <span className="text-emerald-400 font-bold">
                Printed & SMS Sent to Member ✓
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
