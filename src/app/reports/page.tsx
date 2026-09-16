"use client";

import React, { useState, useEffect } from "react";
import { useBrand } from "@/lib/brand-context";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  ArrowUpRight,
  ShoppingBag,
  ShieldCheck,
  Package,
  Activity,
} from "lucide-react";

export default function ReportsPage() {
  const { brand } = useBrand();

  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [runningBilling, setRunningBilling] = useState(false);
  const [billingResult, setBillingResult] = useState<any | null>(null);

  useEffect(() => {
    async function loadReports() {
      try {
        const res = await fetch("/api/reports");
        if (res.ok) {
          setReportData(await res.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  const metrics = reportData?.metrics || {
    totalRevenue: 14850,
    subscriptionRevenue: 13200,
    posRevenue: 1650,
    totalMembers: 248,
    activeMembers: 215,
    expiredMembers: 18,
    churnRate: "2.1%",
    totalCheckins: 1248,
  };

  const topProducts = reportData?.topProducts || [];
  const hourlyTraffic = reportData?.hourlyTraffic || {};

  // CSV Exporters
  const exportLedgerCSV = async () => {
    try {
      const res = await fetch("/api/invoices");
      if (!res.ok) return;
      const data = await res.json();

      const headers = "Receipt Number,Customer Name,Date,Payment Method,Amount,Notes\n";
      const rows = data
        .map((p: any) =>
          `"${p.receiptNumber}","${p.member ? `${p.member.firstName} ${p.member.lastName}` : "Walk-in Guest"}","${new Date(p.paidAt).toISOString().split("T")[0]}","${p.method}","${p.amount}","${p.notes || ""}"`
        )
        .join("\n");

      const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `financial_ledger_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
    }
  };

  const exportMembersCSV = async () => {
    try {
      const res = await fetch("/api/members");
      if (!res.ok) return;
      const data = await res.json();

      const headers = "Member Code,First Name,Last Name,Email,Phone,Gender,Status,Joined Date,Current Plan\n";
      const rows = data
        .map((m: any) =>
          `"${m.memberCode}","${m.firstName}","${m.lastName}","${m.email}","${m.phone}","${m.gender || ""}","${m.status}","${new Date(m.joinDate).toISOString().split("T")[0]}","${m.subscriptions?.[0]?.plan?.name || "None"}"`
        )
        .join("\n");

      const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `members_directory_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
    }
  };

  const hours = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F4F3EE] tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6" style={{ color: brand.primaryColor }} />
            Executive Financial & Operational Intelligence
          </h1>
          <p className="text-xs text-[#8C9390] mt-1">
            Real-time Monthly Recurring Revenue (MRR), retail margins, retention curves, and audit exports.
          </p>
        </div>

        {/* 1-Click Actions & CSV Exports */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={async () => {
              setRunningBilling(true);
              try {
                const res = await fetch("/api/billing/process-recurring", { method: "POST" });
                const json = await res.json();
                setBillingResult(json);
              } catch (e) {
                console.error(e);
              } finally {
                setRunningBilling(false);
              }
            }}
            disabled={runningBilling}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg transition-transform hover:scale-[1.02] disabled:opacity-50 cursor-pointer"
          >
            <DollarSign className="w-4 h-4" />
            <span>{runningBilling ? "Processing Dues..." : "Run Recurring Billing"}</span>
          </button>
          <button
            onClick={exportMembersCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#202427] hover:bg-[#111315] text-[#F4F3EE] border border-[#8C9390]/25 transition-colors shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Export Members (CSV)</span>
          </button>
          <button
            onClick={exportLedgerCSV}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-[#111315] shadow-lg transition-transform hover:scale-[1.02] cursor-pointer"
            style={{ backgroundColor: brand.primaryColor }}
          >
            <Download className="w-4 h-4 text-[#111315]" />
            <span>Export Financial Ledger</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#202427] border border-[#8C9390]/25 shadow-lg">
          <span className="text-xs font-medium text-[#8C9390]">Total Inflow Collections</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-black text-[#F4F3EE]">
              {formatCurrency(metrics.totalRevenue, brand.currencySymbol)}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-[#C8FF3D] font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.2% MRR Growth</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#202427] border border-[#8C9390]/25 shadow-lg">
          <span className="text-xs font-medium text-[#8C9390]">Membership Dues Inflow</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-black text-emerald-400">
              {formatCurrency(metrics.subscriptionRevenue, brand.currencySymbol)}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-[#8C9390]">
            {metrics.activeMembers} active subscriptions
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-[#202427] border border-[#8C9390]/25 shadow-lg">
          <span className="text-xs font-medium text-[#8C9390]">Front-Desk Retail POS Inflow</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-black text-amber-400">
              {formatCurrency(metrics.posRevenue, brand.currencySymbol)}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-[#8C9390]">
            Supplements, gear & drinks
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-[#202427] border border-[#8C9390]/25 shadow-lg">
          <span className="text-xs font-medium text-[#8C9390]">Monthly Member Churn</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-black text-[#F4F3EE]">
              {metrics.churnRate}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-[#C8FF3D] font-semibold flex items-center gap-1">
            <span>97.9% Retention Rate</span>
          </div>
        </div>
      </div>

      {/* Hourly Floor Traffic Heatmap & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Hourly Peak Demand Heatmap */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#202427] border border-[#8C9390]/25 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#8C9390]/20">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#C8FF3D]" />
              <h2 className="text-sm font-bold text-[#F4F3EE]">
                Hourly Peak Traffic & Turnstile Demand
              </h2>
            </div>
            <span className="text-xs text-[#8C9390] font-mono">
              Total {metrics.totalCheckins} check-ins analyzed
            </span>
          </div>

          <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5 pt-2">
            {hours.map((h) => {
              const count = hourlyTraffic[h] || (h === 6 || h === 7 || h === 17 || h === 18 ? 8 : 2);
              const isPeak = h === 6 || h === 7 || h === 17 || h === 18 || h === 19;
              const formattedHour = h > 12 ? `${h - 12}P` : `${h}A`;

              return (
                <div key={h} className="text-center space-y-1.5 flex flex-col justify-end">
                  <div
                    className="rounded-xl transition-all flex flex-col justify-end p-1 shadow-sm"
                    style={{
                      height: `${Math.max(count * 12 + 24, 30)}px`,
                      backgroundColor: isPeak ? brand.primaryColor : "#111315",
                      border: isPeak ? "none" : "1px solid rgba(140, 147, 144, 0.25)",
                    }}
                  >
                    <span
                      className={`text-[9px] font-mono ${
                        isPeak ? "text-[#111315] font-black" : "text-[#8C9390] font-bold"
                      }`}
                    >
                      {count}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[#8C9390] font-mono">
                    {formattedHour}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-[#8C9390] text-center pt-2">
            Peak facility demand window: <strong className="text-[#F4F3EE]">06:30 AM - 08:30 AM</strong> and{" "}
            <strong className="text-[#F4F3EE]">05:00 PM - 07:45 PM</strong>. Use this data to optimize trainer rosters and class schedules.
          </p>
        </div>

        {/* Right Col: Top-Selling POS Products */}
        <div className="p-6 rounded-3xl bg-[#202427] border border-[#8C9390]/25 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-[#8C9390]/20">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#C8FF3D]" />
              <h2 className="text-sm font-bold text-[#F4F3EE]">Top Retail Products</h2>
            </div>
            <span className="text-xs text-[#8C9390]">By Revenue</span>
          </div>

          <div className="space-y-3">
            {topProducts.length > 0 ? (
              topProducts.map((prod: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-[#111315] border border-[#8C9390]/20 flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-bold text-[#F4F3EE] truncate">{prod.name}</p>
                    <p className="text-[10px] text-[#8C9390]">{prod.units} units sold</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#C8FF3D]">
                    {formatCurrency(prod.revenue, brand.currencySymbol)}
                  </span>
                </div>
              ))
            ) : (
              <div className="space-y-2.5">
                {[
                  { name: "100% Whey Isolate (2kg)", units: 14, rev: 839.86 },
                  { name: "Pre-Workout Formula", units: 11, rev: 439.89 },
                  { name: "Stainless Steel Shaker", units: 18, rev: 359.82 },
                  { name: "Electrolyte Drinks (500ml)", units: 52, rev: 182.0 },
                ].map((prod, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-[#111315] border border-[#8C9390]/20 flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-bold text-[#F4F3EE] truncate">{prod.name}</p>
                      <p className="text-[10px] text-[#8C9390]">{prod.units} units sold</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#C8FF3D]">
                      {formatCurrency(prod.rev, brand.currencySymbol)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RECURRING BILLING SUMMARY MODAL */}
      {billingResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#202427] border border-[#8C9390]/25 p-6 sm:p-8 shadow-2xl text-left space-y-5">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-mono">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Automated Dues Engine</span>
              </div>
              <button
                onClick={() => {
                  setBillingResult(null);
                  window.location.reload();
                }}
                className="p-1.5 rounded-xl bg-[#111315] text-[#8C9390] hover:text-[#F4F3EE]"
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className="text-xl font-black text-[#F4F3EE]">
                Recurring Billing Execution Complete
              </h3>
              <p className="text-xs text-[#8C9390] mt-1">
                {billingResult.message}
              </p>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#111315] border border-[#8C9390]/20 text-center">
                <p className="text-[10px] text-[#8C9390] uppercase font-bold">Evaluated</p>
                <p className="text-xl font-black text-[#F4F3EE] mt-1">{billingResult.results?.totalEvaluated || 0}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#111315] border border-emerald-500/30 text-center">
                <p className="text-[10px] text-emerald-400 uppercase font-bold">Renewed</p>
                <p className="text-xl font-black text-emerald-400 mt-1">{billingResult.results?.renewedCount || 0}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#111315] border border-rose-500/30 text-center">
                <p className="text-[10px] text-rose-400 uppercase font-bold">Failed</p>
                <p className="text-xl font-black text-rose-400 mt-1">{billingResult.results?.failedCount || 0}</p>
              </div>
            </div>

            {/* List of charged renewals */}
            {billingResult.results?.renewals?.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                <p className="text-[11px] font-bold text-[#8C9390] uppercase tracking-wider">Processed Invoices</p>
                {billingResult.results.renewals.map((r: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#111315] border border-[#8C9390]/20 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-[#F4F3EE]">{r.memberName}</p>
                      <p className="text-[10px] text-[#8C9390]">{r.planName} &bull; {r.receiptNumber}</p>
                    </div>
                    <span className="font-black text-emerald-400 font-mono">+{formatCurrency(r.amount, brand.currencySymbol)}</span>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setBillingResult(null);
                window.location.reload();
              }}
              className="w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider text-[#111315] shadow-xl transition-all cursor-pointer"
              style={{ backgroundColor: brand.primaryColor }}
            >
              Close & Refresh Metrics
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
