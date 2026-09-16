"use client";

import React, { useEffect, useState } from "react";
import { useBrand } from "@/lib/brand-context";
import { formatCurrency, formatDate } from "@/lib/utils";
import { NumberTicker } from "@/components/ui/number-ticker";
import Link from "next/link";
import {
  Users,
  CreditCard,
  QrCode,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  UserPlus,
  Globe,
  ExternalLink,
  Activity,
  ShoppingBag,
  Zap,
  ArrowRight,
  LogOut,
  ChevronRight,
} from "lucide-react";

interface DashboardData {
  stats: {
    totalMembers: number;
    activeMembers: number;
    expiredMembers: number;
    todayCheckinCount: number;
    monthlyRevenue: number;
    pendingLeads: number;
  };
  todayAttendances: any[];
  expiringSubscriptions: any[];
  recentPayments: any[];
  classes: any[];
}

export default function Dashboard() {
  const { brand } = useBrand();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/dashboard");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  const stats = data?.stats || {
    totalMembers: 248,
    activeMembers: 215,
    expiredMembers: 18,
    todayCheckinCount: 42,
    monthlyRevenue: 14850,
    pendingLeads: 12,
  };

  // Quick checkout handler
  const handleQuickCheckout = async (attendanceId: string) => {
    try {
      await fetch("/api/attendance/check-out", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attendanceId }),
      });
      // Refresh local state
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          todayAttendances: prev.todayAttendances.filter((a) => a.id !== attendanceId),
        };
      });
    } catch (err) {
      console.error("Checkout failed", err);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* 1. Live Operations Command Header */}
      <div className="relative overflow-hidden rounded-3xl bg-[#202427] border border-[#8C9390]/30 p-6 md:p-8 shadow-2xl">
        <div
          className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: brand.primaryColor }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111315]/80 border border-[#8C9390]/30 text-xs text-[#F4F3EE]">
              <span className="flex h-2 w-2 relative">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ backgroundColor: brand.primaryColor }}
                />
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ backgroundColor: brand.primaryColor }}
                />
              </span>
              <span className="font-semibold text-white">Live Gym Operations Center</span>
              <span className="text-[#8C9390]">&bull;</span>
              <span className="text-[#C8FF3D] font-medium">Floor Capacity: 48% Peak</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
              {brand.gymName}
            </h1>
            <p className="text-[#8C9390] text-xs sm:text-sm max-w-xl">
              {brand.tagline} &bull; Operating overview for{" "}
              <span className="text-[#F4F3EE] font-semibold">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </p>
          </div>

          {/* Quick Action Command Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/members/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black text-[#111315] shadow-lg transition-transform hover:scale-105 active:scale-95"
              style={{ backgroundColor: brand.primaryColor }}
            >
              <UserPlus className="w-4 h-4 text-[#111315]" />
              <span>+ New Member</span>
            </Link>

            <Link
              href="/pos"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#111315] hover:bg-[#111315]/80 text-[#F4F3EE] border border-[#8C9390]/30 shadow transition-all hover:scale-105"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>POS Register</span>
            </Link>

            <Link
              href="/attendance/kiosk"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#111315] hover:bg-[#111315]/80 text-[#F4F3EE] border border-[#8C9390]/30 shadow transition-all hover:scale-105"
            >
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span>Kiosk Mode</span>
            </Link>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#111315]/80 hover:bg-[#111315] text-[#8C9390] hover:text-[#F4F3EE] border border-[#8C9390]/30 transition-colors"
              title="Open public website in new tab"
            >
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <ExternalLink className="w-3 h-3 text-[#8C9390]" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. High-Impact Metric Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Active Athletes */}
        <div className="rounded-3xl bg-[#202427] border border-[#8C9390]/25 p-6 flex flex-col justify-between hover:border-[#C8FF3D]/60 hover:-translate-y-1 transition-all duration-300 shadow-xl group">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C9390]">
                Active Athletes
              </span>
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-[#111315] shadow-md group-hover:scale-110 transition-transform font-black"
                style={{ backgroundColor: brand.primaryColor }}
              >
                <Users className="w-4 h-4 text-[#111315]" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-[#F4F3EE] tracking-tight">
                <NumberTicker value={stats.activeMembers} />
              </span>
              <span className="text-xs text-[#8C9390] font-medium">
                / {stats.totalMembers || stats.activeMembers + 22} registered
              </span>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-[#8C9390]/20 flex items-center justify-between text-xs">
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +9.4% retention
            </span>
            <Link href="/members" className="text-[#8C9390] hover:text-[#C8FF3D] flex items-center gap-0.5 transition-colors">
              <span>CRM</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Card 2: Today's Floor Check-Ins */}
        <div className="rounded-3xl bg-[#202427] border border-[#8C9390]/25 p-6 flex flex-col justify-between hover:border-[#C8FF3D]/60 hover:-translate-y-1 transition-all duration-300 shadow-xl group">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C9390]">
                Today's Check-Ins
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <QrCode className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-[#F4F3EE] tracking-tight">
                <NumberTicker value={stats.todayCheckinCount} />
              </span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 animate-pulse">
                ● Live Flow
              </span>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-[#8C9390]/20 flex items-center justify-between text-xs text-[#8C9390]">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Peak: 5:00 - 8:00 PM
            </span>
            <Link href="/attendance" className="text-[#8C9390] hover:text-[#C8FF3D] flex items-center gap-0.5 transition-colors">
              <span>Logs</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Card 3: Monthly Inflow MRR */}
        <div className="rounded-3xl bg-[#202427] border border-[#8C9390]/25 p-6 flex flex-col justify-between hover:border-[#C8FF3D]/60 hover:-translate-y-1 transition-all duration-300 shadow-xl group">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C9390]">
                Monthly Inflow (MRR)
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-[#F4F3EE] tracking-tight">
                {formatCurrency(stats.monthlyRevenue, brand.currencySymbol)}
              </span>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-[#8C9390]/20 flex items-center justify-between text-xs">
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +14.2% MRR Run-rate
            </span>
            <Link href="/reports" className="text-[#8C9390] hover:text-[#C8FF3D] flex items-center gap-0.5 transition-colors">
              <span>Ledger</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Card 4: Sales Pipeline Leads */}
        <div className="rounded-3xl bg-[#202427] border border-[#8C9390]/25 p-6 flex flex-col justify-between hover:border-[#C8FF3D]/60 hover:-translate-y-1 transition-all duration-300 shadow-xl group">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C9390]">
                Active Leads & Trials
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Zap className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-[#F4F3EE] tracking-tight">
                <NumberTicker value={stats.pendingLeads} />
              </span>
              <span className="text-xs text-blue-400 font-semibold">
                In Pipeline
              </span>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-[#8C9390]/20 flex items-center justify-between text-xs text-[#8C9390]">
            <span>68% Conversion Velocity</span>
            <Link href="/leads" className="text-[#8C9390] hover:text-[#C8FF3D] flex items-center gap-0.5 transition-colors">
              <span>Kanban</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Main Operational Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Live Check-In Feed & Group Classes */}
        <div className="lg:col-span-8 space-y-6">
          {/* Live Attendance Horizon Feed */}
          <div className="rounded-3xl bg-[#202427] border border-[#8C9390]/25 p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#8C9390]/20">
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full animate-ping"
                  style={{ backgroundColor: brand.primaryColor }}
                />
                <div>
                  <h2 className="text-sm font-bold text-[#F4F3EE] uppercase tracking-wider">
                    Live Check-In Horizon
                  </h2>
                  <p className="text-[11px] text-[#8C9390]">
                    Real-time front-desk barcode & tablet check-in telemetry
                  </p>
                </div>
              </div>
              <Link
                href="/attendance"
                className="text-xs font-bold text-[#8C9390] hover:text-[#C8FF3D] flex items-center gap-1 transition-colors"
              >
                <span>Full Attendance Log</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="mt-4 space-y-2.5">
              {data?.todayAttendances && data.todayAttendances.length > 0 ? (
                data.todayAttendances.map((att: any) => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-[#111315]/80 border border-[#8C9390]/20 hover:border-[#C8FF3D]/40 transition-all group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs text-[#111315] shadow"
                        style={{ backgroundColor: brand.primaryColor }}
                      >
                        {att.member.firstName[0]}
                        {att.member.lastName[0]}
                      </div>
                      <div>
                        <Link
                          href={`/members/${att.member.id}`}
                          className="text-xs font-bold text-[#F4F3EE] hover:underline group-hover:text-[#C8FF3D] transition-colors"
                        >
                          {att.member.firstName} {att.member.lastName}
                        </Link>
                        <p className="text-[11px] text-[#8C9390]">
                          ID: <span className="font-mono text-[#F4F3EE]">{att.member.memberCode}</span> &bull;{" "}
                          <span className="text-[#8C9390]">Scan: {att.method}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase">
                          <CheckCircle2 className="w-3 h-3" />
                          Admitted
                        </span>
                        <p className="text-[10px] text-[#8C9390] mt-0.5">
                          {new Date(att.checkInTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      <button
                        onClick={() => handleQuickCheckout(att.id)}
                        className="p-2 rounded-xl bg-[#202427] hover:bg-[#202427]/80 text-[#8C9390] hover:text-rose-400 border border-[#8C9390]/25 transition-colors"
                        title="Check out member"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-[#8C9390] text-xs">
                  <QrCode className="w-10 h-10 mx-auto text-[#8C9390]/40 mb-2 opacity-40" />
                  No check-ins logged yet today. Launch the Kiosk or use Reception Quick Scan.
                </div>
              )}
            </div>
          </div>

          {/* Today's Classes & Instructor Schedule */}
          <div className="rounded-3xl bg-[#202427] border border-[#8C9390]/25 p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#8C9390]/20">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-blue-400" />
                <div>
                  <h2 className="text-sm font-bold text-[#F4F3EE] uppercase tracking-wider">
                    Today's Group Fitness Schedule
                  </h2>
                  <p className="text-[11px] text-[#8C9390]">
                    Active studio bookings & coach assignments
                  </p>
                </div>
              </div>
              <Link
                href="/classes"
                className="text-xs font-bold text-[#8C9390] hover:text-[#C8FF3D] flex items-center gap-1 transition-colors"
              >
                <span>Timetable Manager</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {data?.classes && data.classes.length > 0 ? (
                data.classes.map((c: any) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-2xl bg-[#111315]/80 border border-[#8C9390]/20 hover:border-[#C8FF3D]/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span
                          className="px-2.5 py-0.5 rounded-lg text-[10px] font-black text-[#111315] shadow-sm"
                          style={{ backgroundColor: c.color || brand.primaryColor }}
                        >
                          {c.room || "Studio A"}
                        </span>
                        <span className="text-xs font-bold text-[#F4F3EE]">
                          {c.startTime} - {c.endTime}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-[#F4F3EE] mt-2.5">
                        {c.title}
                      </h3>
                      <p className="text-xs text-[#8C9390] mt-0.5">
                        Coach: <strong className="text-[#F4F3EE]">{c.instructorName}</strong>
                      </p>
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-[#202427] flex items-center justify-between text-xs text-[#8C9390]">
                      <span>Capacity: {c.capacity} spots</span>
                      <span className="text-emerald-400 font-semibold">Open Booking</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 py-8 text-center text-[#8C9390] text-xs">
                  No classes scheduled for today.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Expiry Radar & Recent Inflow */}
        <div className="lg:col-span-4 space-y-6">
          {/* Actionable Expiry Radar */}
          <div className="rounded-3xl bg-[#202427] border border-[#8C9390]/25 p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#8C9390]/20">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-[#F4F3EE] uppercase tracking-wider">
                  Expiring Within 7 Days
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-wider">
                Action Required
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {data?.expiringSubscriptions && data.expiringSubscriptions.length > 0 ? (
                data.expiringSubscriptions.map((sub: any) => (
                  <div
                    key={sub.id}
                    className="p-3.5 rounded-2xl bg-[#111315]/80 border border-[#8C9390]/20 flex items-center justify-between"
                  >
                    <div>
                      <Link
                        href={`/members/${sub.member.id}`}
                        className="text-xs font-bold text-[#F4F3EE] hover:underline"
                      >
                        {sub.member.firstName} {sub.member.lastName}
                      </Link>
                      <p className="text-[11px] text-[#8C9390]">
                        {sub.plan.name}
                      </p>
                      <p className="text-[10px] text-amber-400 font-semibold mt-0.5">
                        Expires: {formatDate(sub.endDate)}
                      </p>
                    </div>

                    <Link
                      href={`/members/${sub.member.id}`}
                      className="px-3 py-1.5 rounded-xl text-xs font-black text-[#111315] shadow hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: brand.primaryColor }}
                    >
                      Renew
                    </Link>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-[#8C9390] text-xs">
                  No upcoming membership expiries in the next 7 days.
                </div>
              )}
            </div>
          </div>

          {/* Recent Inflow Ledger */}
          <div className="rounded-3xl bg-[#202427] border border-[#8C9390]/25 p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#8C9390]/20">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-[#F4F3EE] uppercase tracking-wider">
                  Recent Inflow
                </h2>
              </div>
              <Link
                href="/pos"
                className="text-xs font-bold text-[#8C9390] hover:text-[#C8FF3D] transition-colors"
              >
                POS Sales &rarr;
              </Link>
            </div>

            <div className="mt-4 space-y-2.5">
              {data?.recentPayments && data.recentPayments.length > 0 ? (
                data.recentPayments.map((pay: any) => (
                  <div
                    key={pay.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-[#111315]/80 border border-[#8C9390]/20"
                  >
                    <div>
                      <p className="text-xs font-bold text-[#F4F3EE]">
                        {pay.member
                          ? `${pay.member.firstName} ${pay.member.lastName}`
                          : "Walk-in Guest"}
                      </p>
                      <p className="text-[10px] text-[#8C9390]">
                        {pay.receiptNumber} &bull; {pay.method}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-emerald-400">
                        +{formatCurrency(pay.amount, brand.currencySymbol)}
                      </p>
                      <p className="text-[10px] text-[#8C9390]">
                        {formatDate(pay.paidAt)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-[#8C9390] text-xs">
                  No recent revenue logged.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
