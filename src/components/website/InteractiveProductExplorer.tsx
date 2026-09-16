"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useBrand } from "@/lib/brand-context";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  QrCode,
  ShoppingBag,
  CalendarDays,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  CreditCard,
  Flame,
  ArrowRight,
  ShieldCheck,
  Zap,
  Printer,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function InteractiveProductExplorer() {
  const { brand } = useBrand();
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "dossier" | "kiosk" | "pos" | "classes" | "analytics"
  >("dashboard");

  const productTabs = [
    { id: "dashboard", label: "Operations Dashboard", icon: LayoutDashboard, tag: "Live Pulse" },
    { id: "dossier", label: "Athlete Dossier", icon: Users, tag: "Member CRM" },
    { id: "kiosk", label: "Turnstile Tablet Kiosk", icon: QrCode, tag: "Front Desk" },
    { id: "pos", label: "Retail & POS Register", icon: ShoppingBag, tag: "Commerce" },
    { id: "classes", label: "Group Class Timetable", icon: CalendarDays, tag: "Scheduling" },
    { id: "analytics", label: "Executive Analytics", icon: BarChart3, tag: "Reports" },
  ];

  return (
    <section id="tour" className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background radial ambience */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full blur-[150px] opacity-15 pointer-events-none"
        style={{ backgroundColor: brand.primaryColor }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive Platform Tour</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            Experience The Software In Action
          </h2>
          <p className="mt-4 text-slate-400 text-sm sm:text-base">
            Click through the core operating modules below to see how our platform streamlines every aspect of your gym operations.
          </p>
        </div>

        {/* Tab Selector Pill Bar */}
        <div className="flex items-center justify-start lg:justify-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
          {productTabs.map((tab) => {
            const isSelected = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border ${
                  isSelected
                    ? "bg-slate-900 border-2 text-white shadow-xl scale-105"
                    : "bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
                style={{
                  borderColor: isSelected ? brand.primaryColor : undefined,
                }}
              >
                <Icon
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: isSelected ? brand.primaryColor : undefined }}
                />
                <span>{tab.label}</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  {tab.tag}
                </span>
              </button>
            );
          })}
        </div>

        {/* Interactive Live Screen Simulation Frame */}
        <div className="rounded-3xl bg-slate-900/90 border-2 border-slate-800 p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          {/* Top Browser Window Header */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-800 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-3 font-mono text-[11px] text-slate-400 hidden sm:inline">
                https://{brand.gymName.toLowerCase().replace(/\s+/g, "")}.gymos.app/{activeTab}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Demo Active
              </span>
              <Link
                href={`/${activeTab === "dashboard" ? "dashboard" : activeTab === "dossier" ? "members" : activeTab === "kiosk" ? "attendance/kiosk" : activeTab}`}
                className="px-3 py-1 rounded-xl text-xs font-bold text-white shadow flex items-center gap-1 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: brand.primaryColor }}
              >
                <span>Launch Live</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* SLICE 1: OPERATIONS DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Telemetry banner */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-white uppercase">
                    {brand.gymName} Operations Telemetry
                  </h3>
                  <p className="text-xs text-slate-400">
                    Real-time check-in stream &bull; 42 Athletes currently on floor (48% Capacity)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                    +14.2% MRR Growth
                  </span>
                </div>
              </div>

              {/* Mini KPI row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Active Members</span>
                  <p className="text-xl font-black text-white mt-1">215</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Today's Scans</span>
                  <p className="text-xl font-black text-emerald-400 mt-1">42 Visits</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Monthly MRR</span>
                  <p className="text-xl font-black text-amber-400 mt-1">$14,850</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Active Leads</span>
                  <p className="text-xl font-black text-blue-400 mt-1">12 in Pipeline</p>
                </div>
              </div>

              {/* Feed simulation */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                  Recent Turnstile Scans
                </span>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="font-bold text-white">Marcus Vance (MEM-1001)</span>
                    <span className="text-[11px] text-slate-400">&bull; VIP All-Access</span>
                  </div>
                  <span className="text-emerald-400 font-mono text-[11px]">Just Now (Kiosk)</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="font-bold text-white">Elena Rostova (MEM-1003)</span>
                    <span className="text-[11px] text-slate-400">&bull; Standard Plan</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">4 mins ago</span>
                </div>
              </div>
            </div>
          )}

          {/* SLICE 2: ATHLETE DOSSIER */}
          {activeTab === "dossier" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow"
                    style={{ backgroundColor: brand.primaryColor }}
                  >
                    MV
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-white">Marcus Vance</h3>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        ACTIVE ATHLETE
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-amber-400" /> 4-Day Streak
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      marcus@ironpeak.demo &bull; +1 (555) 349-2011 &bull; ID: MEM-1001
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-400">
                    VIP Annual Tier &bull; Exp: Dec 31
                  </span>
                </div>
              </div>

              {/* Dossier Tabs Mock */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="font-bold text-slate-300 uppercase block">Emergency & Safety</span>
                  <p className="text-slate-400">Contact: Sarah Vance (Spouse)</p>
                  <p className="text-slate-400">Emergency Tel: +1 (555) 902-1144</p>
                  <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                    PAR-Q Cleared ✓
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="font-bold text-slate-300 uppercase block">Training Metrics</span>
                  <p className="text-slate-400">Total Check-Ins: <strong className="text-white">48 visits</strong></p>
                  <p className="text-slate-400">Favorite Time: <strong className="text-white">06:00 AM (HIIT)</strong></p>
                  <p className="text-slate-400">Lifetime Spend: <strong className="text-emerald-400">$899.00</strong></p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="font-bold text-slate-300 uppercase block">Digital E-Signature Waiver</span>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-[10px] text-emerald-400">
                    SIGNATURE VERIFIED &bull; IP LOGGED
                  </div>
                  <p className="text-[10px] text-slate-500">Stored on encrypted legal vault</p>
                </div>
              </div>
            </div>
          )}

          {/* SLICE 3: KIOSK TABLET */}
          {activeTab === "kiosk" && (
            <div className="space-y-6 animate-in fade-in duration-300 max-w-xl mx-auto text-center">
              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                <span className="text-xs font-mono text-slate-400 tracking-widest uppercase">
                  TABLET FRONT-DESK CHECK-IN KIOSK
                </span>
                <h3 className="text-2xl font-black text-white">
                  Welcome to {brand.gymName}
                </h3>
                <p className="text-xs text-slate-400">
                  Scan barcode card or enter 4-digit member code
                </p>

                {/* Touch Numpad Mock */}
                <div className="w-48 mx-auto p-3 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xl font-bold tracking-widest text-amber-400">
                  MEM-1001
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>ACCESS GRANTED &bull; Audio Chime Triggered</span>
                </div>
              </div>
            </div>
          )}

          {/* SLICE 4: POS REGISTER */}
          {activeTab === "pos" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs animate-in fade-in duration-300">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="font-bold text-slate-300 uppercase block">
                  Quick Retail Catalog
                </span>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <span>Whey Protein Isolate 2kg</span>
                    <span className="font-bold text-white">$64.99</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <span>Pre-Workout Explosive Energy</span>
                    <span className="font-bold text-white">$38.50</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <span>Electrolyte Hydration Drink</span>
                    <span className="font-bold text-white">$4.50</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="font-bold text-slate-300 uppercase block">
                  Order Tab & Tender
                </span>
                <div className="space-y-1.5 border-b border-slate-800 pb-2">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal:</span>
                    <span>$107.99</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Tax (8%):</span>
                    <span>$8.64</span>
                  </div>
                  <div className="flex justify-between font-black text-white text-sm">
                    <span>Total Due:</span>
                    <span className="text-emerald-400">$116.63</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded bg-slate-900 text-slate-300 font-bold">CARD</span>
                  <span className="px-3 py-1 rounded bg-slate-900 text-slate-400">CASH</span>
                  <span className="ml-auto text-[10px] text-emerald-400 font-mono">
                    Printable Tax Receipt Ready ✓
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SLICE 5: CLASS TIMETABLE */}
          {activeTab === "classes" && (
            <div className="space-y-4 text-xs animate-in fade-in duration-300">
              <span className="font-bold text-slate-300 uppercase block">
                Live Studio Timetable & Capacity Fill
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold text-[10px]">Studio A</span>
                    <span className="text-slate-400">06:00 AM</span>
                  </div>
                  <h4 className="font-bold text-white">Dawn Patrol HIIT</h4>
                  <p className="text-[11px] text-slate-400">Coach: Marcus Vance</p>
                  <p className="text-[10px] text-emerald-400 font-bold">18 / 20 spots booked (90%)</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold text-[10px]">Turf Grid</span>
                    <span className="text-slate-400">07:30 AM</span>
                  </div>
                  <h4 className="font-bold text-white">Athletic Conditioning</h4>
                  <p className="text-[11px] text-slate-400">Coach: Sarah Connor</p>
                  <p className="text-[10px] text-emerald-400 font-bold">14 / 22 spots booked (63%)</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px]">Zen Room</span>
                    <span className="text-slate-400">05:30 PM</span>
                  </div>
                  <h4 className="font-bold text-white">Power Yoga & Fascia</h4>
                  <p className="text-[11px] text-slate-400">Coach: Elena Rostova</p>
                  <p className="text-[10px] text-emerald-400 font-bold">12 / 15 spots booked (80%)</p>
                </div>
              </div>
            </div>
          )}

          {/* SLICE 6: EXECUTIVE ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="space-y-4 text-xs animate-in fade-in duration-300">
              <span className="font-bold text-slate-300 uppercase block">
                Executive Velocity & Peak Traffic Heatmap
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="font-semibold text-slate-400">Peak Hour Gym Foot Traffic</span>
                  <div className="h-16 flex items-end gap-1.5 pt-2">
                    {[20, 45, 90, 65, 40, 30, 85, 95, 70, 30].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t transition-all"
                        style={{
                          height: `${h}%`,
                          backgroundColor: h > 80 ? brand.primaryColor : "#334155",
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>6 AM</span>
                    <span>12 PM</span>
                    <span>6 PM (Peak)</span>
                    <span>10 PM</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="font-semibold text-slate-400">Revenue Stream Split</span>
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between">
                      <span>Monthly Recurring Memberships:</span>
                      <strong className="text-white">78%</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>POS Retail & Supplements:</span>
                      <strong className="text-white">14%</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Personal Trainer Packs:</span>
                      <strong className="text-white">8%</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
