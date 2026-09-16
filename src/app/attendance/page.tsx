"use client";

import React, { useState, useEffect } from "react";
import { useBrand } from "@/lib/brand-context";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import {
  QrCode,
  CheckCircle,
  AlertCircle,
  Search,
  Users,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  LogOut,
  Maximize2,
  Plus,
  Clock,
  Filter,
  Check,
  X,
  Activity,
  ArrowRight,
  Flame,
} from "lucide-react";

export default function AttendanceDashboardPage() {
  const { brand } = useBrand();

  const [memberCode, setMemberCode] = useState("");
  const [scanResult, setScanResult] = useState<{
    status: "success" | "error" | "expired" | null;
    message: string;
    member?: any;
  }>({ status: null, message: "" });
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualMemberId, setManualMemberId] = useState("");

  const maxCapacity = 120;

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/dashboard");
      if (res.ok) {
        const json = await res.json();
        setLogs(json.todayAttendances || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/members");
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
        if (data.length > 0) setManualMemberId(data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchMembers();
  }, []);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberCode.trim()) return;

    setLoading(true);
    setScanResult({ status: null, message: "" });

    try {
      const res = await fetch("/api/attendance/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: memberCode.trim(), method: "FRONT_DESK" }),
      });

      const data = await res.json();

      if (res.ok) {
        setScanResult({
          status: "success",
          message: data.message || `Access granted! Welcome, ${data.member?.firstName || "Athlete"}!`,
          member: data.member,
        });
        setMemberCode("");
        fetchLogs();
      } else {
        setScanResult({
          status: data.status === "EXPIRED" ? "expired" : "error",
          message: data.error || "Check-in declined.",
          member: data.member,
        });
      }
    } catch (err) {
      setScanResult({
        status: "error",
        message: "Network error during check-in.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async (attendanceId: string) => {
    try {
      await fetch("/api/attendance/check-out", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attendanceId }),
      });
      fetchLogs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleManualCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualMemberId) return;

    const selected = members.find((m) => m.id === manualMemberId);
    if (!selected) return;

    setLoading(true);
    try {
      const res = await fetch("/api/attendance/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: selected.memberCode, method: "STAFF_MANUAL" }),
      });
      if (res.ok) {
        setShowManualModal(false);
        fetchLogs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const activeOccupancy = logs.filter((l) => !l.checkOutTime).length;
  const occupancyPercentage = Math.min(Math.round((activeOccupancy / maxCapacity) * 100), 100);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#202427] border border-[#8C9390]/30 text-xs text-[#8C9390] mb-2 shadow">
            <QrCode className="w-3.5 h-3.5 text-[#C8FF3D]" />
            <span>Turnstile & Access Control</span>
          </div>
          <h1 className="text-3xl font-black text-[#F4F3EE] tracking-tight uppercase">
            Attendance Operations
          </h1>
          <p className="text-xs text-[#8C9390] mt-1">
            Real-time floor occupancy gauge, barcode & QR token verification, and fullscreen tablet kiosk launcher.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowManualModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#202427] hover:bg-[#202427]/80 text-[#F4F3EE] border border-[#8C9390]/30 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#C8FF3D]" />
            <span>Staff Manual Check-In</span>
          </button>

          <Link
            href="/attendance/kiosk"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-[#111315] shadow-xl transition-transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: brand.primaryColor }}
          >
            <Maximize2 className="w-4 h-4 text-[#111315]" />
            <span>Launch Kiosk</span>
          </Link>
        </div>
      </div>

      {/* 2. Live Floor Headcount Telemetry Card */}
      <div className="p-8 rounded-3xl bg-[#202427] border border-[#8C9390]/25 shadow-2xl relative overflow-hidden">
        <div
          className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ backgroundColor: brand.primaryColor }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span
                className="w-2.5 h-2.5 rounded-full animate-ping"
                style={{ backgroundColor: brand.primaryColor }}
              />
              <span className="text-xs font-black uppercase tracking-wider text-[#8C9390]">
                Live Gym Floor Headcount
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-black text-[#F4F3EE] tracking-tight">
                {activeOccupancy} Athletes
              </span>
              <span className="text-xs font-medium text-[#8C9390]">
                / {maxCapacity} Max Safe Floor Capacity
              </span>
            </div>
          </div>

          {/* Progress Load Bar */}
          <div className="md:w-80 space-y-2.5">
            <div className="flex justify-between text-xs">
              <span className="text-[#8C9390] font-semibold">Current Floor Density:</span>
              <span className="font-mono font-black text-[#C8FF3D]">
                {occupancyPercentage}%
              </span>
            </div>
            <div className="w-full h-3.5 bg-[#111315] rounded-full overflow-hidden border border-[#8C9390]/20 p-0.5">
              <div
                className="h-full transition-all duration-500 rounded-full"
                style={{
                  width: `${occupancyPercentage}%`,
                  backgroundColor:
                    occupancyPercentage > 85
                      ? "#ef4444"
                      : occupancyPercentage > 60
                      ? "#f59e0b"
                      : brand.primaryColor,
                }}
              />
            </div>
            <p className="text-[10px] text-[#8C9390] text-right">
              Optimal airflow & training density active
            </p>
          </div>
        </div>
      </div>

      {/* 3. Reception Scanner & Currently Inside Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (5 cols): Rapid Reception Quick Verify */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#202427] border border-[#8C9390]/25 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#8C9390]/20">
              <span className="text-xs font-bold text-[#F4F3EE] uppercase tracking-wider">
                Front-Desk Rapid Verify
              </span>
              <span className="text-[11px] text-[#8C9390] font-mono">
                Tokens: IP-1001, IP-1002
              </span>
            </div>

            <form onSubmit={handleScan} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#8C9390] mb-2">
                  Member ID Code or Barcode Token
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={memberCode}
                    onChange={(e) => setMemberCode(e.target.value)}
                    placeholder="e.g. IP-1001"
                    className="w-full px-4 py-3 bg-[#111315] border border-[#8C9390]/30 rounded-2xl text-sm font-mono font-bold text-[#F4F3EE] uppercase focus:outline-none focus:border-[#C8FF3D]"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-2 top-2 bottom-2 px-4 rounded-xl text-xs font-black text-[#111315] shadow transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
                    style={{ backgroundColor: brand.primaryColor }}
                  >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin text-[#111315]" /> : "Verify Access"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Real-time Feedback Card */}
          <div className="mt-6">
            {scanResult.status === "success" && (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 flex items-center gap-3 animate-in zoom-in-95 duration-200">
                <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-300 uppercase">ACCESS GRANTED</h4>
                  <p className="text-[11px] text-emerald-400/90">{scanResult.message}</p>
                </div>
              </div>
            )}
            {scanResult.status === "expired" && (
              <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/50 flex items-center gap-3 animate-in zoom-in-95 duration-200">
                <AlertCircle className="w-6 h-6 text-rose-400 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-rose-300 uppercase">MEMBERSHIP EXPIRED</h4>
                  <p className="text-[11px] text-rose-400/90">{scanResult.message}</p>
                </div>
              </div>
            )}
            {scanResult.status === "error" && (
              <div className="p-4 rounded-2xl bg-amber-950/60 border border-amber-500/50 flex items-center gap-3 animate-in zoom-in-95 duration-200">
                <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-amber-300 uppercase">DECLINED</h4>
                  <p className="text-[11px] text-amber-400/90">{scanResult.message}</p>
                </div>
              </div>
            )}
            {!scanResult.status && (
              <div className="p-6 rounded-2xl bg-[#111315]/80 border border-[#8C9390]/20 text-center text-xs text-[#8C9390]">
                <QrCode className="w-8 h-8 mx-auto text-[#8C9390]/40 mb-2" />
                Ready to scan barcode or type member ID code.
              </div>
            )}
          </div>
        </div>

        {/* Right (7 cols): Currently Inside Live Roster */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#202427] border border-[#8C9390]/25 shadow-xl flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-[#8C9390]/20">
            <span className="text-xs font-bold text-[#F4F3EE] uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-[#C8FF3D]" />
              Active on Floor ({activeOccupancy} Athletes)
            </span>
            <button
              onClick={fetchLogs}
              className="p-1.5 rounded-lg text-[#8C9390] hover:text-[#F4F3EE] bg-[#111315] hover:bg-[#111315]/80 border border-[#8C9390]/20 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto mt-4 space-y-2.5 max-h-96 pr-1">
            {logs.length > 0 ? (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#111315]/80 border border-[#8C9390]/20 hover:border-[#C8FF3D]/40 transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs text-[#111315] shadow"
                      style={{ backgroundColor: brand.primaryColor }}
                    >
                      {log.member?.firstName?.[0] || "M"}
                      {log.member?.lastName?.[0] || ""}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#F4F3EE]">
                        {log.member?.firstName} {log.member?.lastName}
                      </p>
                      <p className="text-[10px] text-[#8C9390] font-mono">
                        {log.member?.memberCode} &bull; Check-in:{" "}
                        {new Date(log.checkInTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <div>
                    {log.checkOutTime ? (
                      <span className="text-[10px] text-[#8C9390] font-mono">
                        Logged Out: {new Date(log.checkOutTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleCheckOut(log.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#202427] hover:bg-[#202427]/80 text-[#8C9390] hover:text-rose-400 text-xs font-semibold border border-[#8C9390]/25 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Check Out</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center text-xs text-[#8C9390]">
                No active check-ins currently on floor.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* STAFF MANUAL CHECK-IN MODAL */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#202427] border border-[#8C9390]/30 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#8C9390]/20">
              <h3 className="text-sm font-bold text-[#F4F3EE] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#C8FF3D]" />
                Staff Manual Check-In
              </h3>
              <button
                onClick={() => setShowManualModal(false)}
                className="text-[#8C9390] hover:text-[#F4F3EE]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleManualCheckIn} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#8C9390] font-semibold mb-1">
                  Select Registered Member
                </label>
                <select
                  value={manualMemberId}
                  onChange={(e) => setManualMemberId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/30 rounded-xl text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.firstName} {m.lastName} ({m.memberCode}) &bull; {m.status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-[#8C9390]/20 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#111315] hover:bg-[#111315]/80 text-[#8C9390] hover:text-[#F4F3EE] border border-[#8C9390]/30"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-[#111315] font-black cursor-pointer shadow"
                  style={{ backgroundColor: brand.primaryColor }}
                >
                  Confirm Check-In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
