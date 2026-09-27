"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useBrand } from "@/lib/brand-context";
import { playSuccessChime, playErrorAlert } from "@/lib/audio-effects";
import {
  Activity,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Lock,
  Dumbbell,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Delete,
  ScanLine,
  UserCheck,
  RotateCcw,
  Zap,
} from "lucide-react";

export default function FullscreenKioskPage() {
  const router = useRouter();
  const { brand } = useBrand();

  const [inputCode, setInputCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [showKeypad, setShowKeypad] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const inputRef = useRef<HTMLInputElement>(null);

  // Scan Result State
  const [result, setResult] = useState<{
    status: "ADMITTED" | "EXPIRED" | "FROZEN" | "NOT_FOUND" | null;
    message: string;
    member?: any;
    planName?: string;
  }>({ status: null, message: "" });

  // PIN Exit Modal
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  // Live Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-focus input when in scanner mode
  useEffect(() => {
    if (!result.status && inputRef.current) {
      inputRef.current.focus();
    }
  }, [result.status]);

  // Countdown timer for auto-resetting after scan
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (result.status) {
      setCountdown(5);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleResetTerminal();
            return 5;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [result.status]);

  const handleResetTerminal = () => {
    setResult({ status: null, message: "" });
    setInputCode("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeypadPress = (val: string) => {
    if (inputCode.length < 12) {
      setInputCode((prev) => prev + val);
    }
  };

  const handleBackspace = () => {
    setInputCode((prev) => prev.slice(0, -1));
  };

  const handleVerify = async (codeToVerify?: string) => {
    const code = codeToVerify || inputCode;
    if (!code || !code.trim()) return;

    setLoading(true);
    setResult({ status: null, message: "" });

    try {
      const res = await fetch("/api/attendance/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), method: "KIOSK_TABLET" }),
      });

      const data = await res.json();

      if (res.ok) {
        playSuccessChime();
        setResult({
          status: "ADMITTED",
          message: data.message || `Welcome, ${data.member.firstName}!`,
          member: data.member,
          planName: data.planName,
        });
      } else {
        playErrorAlert();
        setResult({
          status: data.status || "NOT_FOUND",
          message: data.error || "Access Denied. Please visit the front desk.",
          member: data.member,
        });
      }
    } catch {
      playErrorAlert();
      setResult({
        status: "NOT_FOUND",
        message: "System network error. Please notify reception staff.",
      });
    } finally {
      setLoading(false);
      setInputCode("");
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === "1234" || pinInput === brand.phone) {
      router.push("/attendance");
    } else {
      setPinError(true);
      setPinInput("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#111315] text-[#F4F3EE] flex flex-col justify-between p-4 sm:p-10 select-none overflow-y-auto selection:bg-[#C8FF3D] selection:text-[#111315]">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#C8FF3D]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* 1. Kiosk Top Navigation Bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-[#8C9390]/20 pb-4">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-[#111315] shadow-xl font-black"
            style={{
              backgroundColor: brand.primaryColor,
              boxShadow: `0 0 20px ${brand.primaryColor}50`,
            }}
          >
            <Activity className="w-6 h-6 stroke-[2.5] text-[#111315]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-[#F4F3EE]">
                {brand.gymName}
              </h1>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-[#C8FF3D]/10 text-[#C8FF3D] border border-[#C8FF3D]/30">
                Self-Service Kiosk
              </span>
            </div>
            <p className="text-xs text-[#8C9390]">Express Turnstile & Entry Check-In</p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          {/* Live Clock */}
          <div className="text-right font-mono">
            <span className="text-xl font-bold text-[#F4F3EE] tracking-widest">
              {currentTime}
            </span>
            <p className="text-[10px] text-[#8C9390] uppercase tracking-wider">
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Staff Exit Button */}
          <button
            onClick={() => setShowPinModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#202427] hover:bg-[#202427]/80 border border-[#8C9390]/25 text-xs text-[#8C9390] hover:text-[#F4F3EE] transition-all cursor-pointer shadow-sm"
            title="Exit Kiosk Mode (Staff PIN required)"
          >
            <Lock className="w-3.5 h-3.5 text-[#C8FF3D]" />
            <span className="hidden sm:inline font-bold">Staff Exit</span>
          </button>
        </div>
      </div>

      {/* 2. Main Center Terminal Experience */}
      <div className="relative z-10 flex-1 flex items-center justify-center py-6">
        <div className="max-w-2xl w-full">
          {/* A. RESULT SCREEN: ACCESS GRANTED (GREEN) */}
          {result.status === "ADMITTED" && (
            <div className="p-8 sm:p-10 rounded-3xl bg-[#202427] border-2 border-emerald-500 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
              <div className="w-24 h-24 rounded-full bg-emerald-500/15 border-2 border-emerald-500/50 flex items-center justify-center mx-auto shadow-2xl">
                <CheckCircle2 className="w-14 h-14 text-emerald-400 animate-pulse" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-black tracking-widest uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ACCESS GRANTED &bull; TURNSTILE UNLOCKED</span>
                </div>
                <h2 className="text-3xl font-black text-[#F4F3EE]">
                  Welcome, {result.member?.firstName} {result.member?.lastName}!
                </h2>
                <p className="text-sm text-[#8C9390]">
                  Tier: <span className="font-bold text-[#F4F3EE]">{result.planName || "Active Membership"}</span> &bull; ID: <span className="font-mono text-[#C8FF3D]">{result.member?.memberCode}</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#111315] border border-[#8C9390]/25 max-w-md mx-auto flex items-center justify-between text-xs">
                <span className="text-[#8C9390]">Status:</span>
                <span className="font-black text-emerald-400 uppercase tracking-wider">Turnstile Barrier Open (10s)</span>
              </div>

              {/* Action Buttons & Countdown */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleResetTerminal}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider text-[#111315] shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  style={{ backgroundColor: brand.primaryColor }}
                >
                  <RotateCcw className="w-4 h-4 text-[#111315]" />
                  <span>Check In Next Athlete</span>
                </button>
                <p className="text-xs text-[#8C9390]">
                  Auto-resetting in <span className="font-mono font-bold text-[#C8FF3D]">{countdown}s</span>
                </p>
              </div>
            </div>
          )}

          {/* B. RESULT SCREEN: ACCESS DENIED (EXPIRED / FROZEN / NOT FOUND) */}
          {(result.status === "EXPIRED" || result.status === "FROZEN" || result.status === "NOT_FOUND") && (
            <div className="p-8 sm:p-10 rounded-3xl bg-[#202427] border-2 border-rose-500 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
              <div className="w-24 h-24 rounded-full bg-rose-500/15 border-2 border-rose-500/50 flex items-center justify-center mx-auto shadow-2xl">
                <AlertCircle className="w-14 h-14 text-rose-400" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-black tracking-widest uppercase">
                  <span>ACCESS DENIED</span>
                </div>
                <h2 className="text-2xl font-black text-[#F4F3EE]">
                  {result.member ? `${result.member.firstName} ${result.member.lastName}` : "Unrecognized Code"}
                </h2>
                <p className="text-sm text-rose-300/90 max-w-md mx-auto">
                  {result.message}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-200 max-w-md mx-auto">
                👉 Please see the front desk receptionist to renew or unfreeze your membership.
              </div>

              {/* Action Button & Countdown */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleResetTerminal}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider text-[#111315] shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  style={{ backgroundColor: brand.primaryColor }}
                >
                  <RotateCcw className="w-4 h-4 text-[#111315]" />
                  <span>Try Again / Next Scan</span>
                </button>
                <p className="text-xs text-[#8C9390]">
                  Auto-resetting in <span className="font-mono font-bold text-rose-400">{countdown}s</span>
                </p>
              </div>
            </div>
          )}

          {/* C. DEFAULT ACTIVE SCANNER TERMINAL */}
          {!result.status && (
            <div className="space-y-6">
              <div className="p-8 rounded-3xl bg-[#202427] border border-[#8C9390]/25 shadow-2xl space-y-6">
                {/* Title & Instructions */}
                <div className="text-center space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#111315] border border-[#8C9390]/25 text-xs text-[#C8FF3D] font-mono">
                    <ScanLine className="w-3.5 h-3.5 animate-pulse" />
                    <span>Optical Barcode / RFID Reader Active</span>
                  </div>
                  <h2 className="text-2xl font-black text-[#F4F3EE] tracking-tight">
                    Scan Member QR or Enter ID
                  </h2>
                  <p className="text-xs text-[#8C9390]">
                    Present your digital gym pass, scan your key tag, or enter your member code below.
                  </p>
                </div>

                {/* Input Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleVerify();
                  }}
                  className="space-y-3"
                >
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      placeholder="e.g. PLS-1001 or 1001"
                      className="w-full px-6 py-4 bg-[#111315] border-2 border-[#8C9390]/30 rounded-2xl text-center text-2xl font-mono font-black text-[#F4F3EE] tracking-widest uppercase placeholder-[#8C9390]/40 focus:outline-none focus:border-[#C8FF3D] transition-colors shadow-inner"
                      autoFocus
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={loading || !inputCode.trim()}
                      className="flex-1 py-3.5 rounded-2xl text-[#111315] font-black text-xs uppercase tracking-wider shadow-xl transition-all hover:opacity-90 active:scale-98 disabled:opacity-30 flex items-center justify-center gap-2 cursor-pointer"
                      style={{ backgroundColor: brand.primaryColor }}
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-[#111315]" />
                          <span>Verifying Pass...</span>
                        </>
                      ) : (
                        <>
                          <QrCode className="w-4 h-4 text-[#111315]" />
                          <span>Verify & Unlock Turnstile</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowKeypad(!showKeypad)}
                      className="px-4 py-3.5 rounded-2xl bg-[#111315] hover:bg-[#111315]/80 border border-[#8C9390]/30 text-xs font-bold text-[#F4F3EE] transition-all cursor-pointer"
                    >
                      {showKeypad ? "Hide Keypad" : "Touch Keypad"}
                    </button>
                  </div>
                </form>

                {/* Optional On-Screen Keypad */}
                {showKeypad && (
                  <div className="pt-2 border-t border-[#8C9390]/20 space-y-3 animate-in fade-in duration-200">
                    <p className="text-[11px] text-[#8C9390] text-center">Touch Numeric Keypad</p>
                    <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                      {["1", "2", "3", "4", "5", "6", "7", "8", "9", "PLS-", "0"].map(
                        (val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => handleKeypadPress(val)}
                            className="h-12 rounded-xl bg-[#111315] border border-[#8C9390]/25 hover:bg-[#111315]/80 text-base font-mono font-bold text-[#F4F3EE] active:scale-95 transition-all cursor-pointer"
                          >
                            {val}
                          </button>
                        )
                      )}
                      <button
                        type="button"
                        onClick={handleBackspace}
                        className="h-12 rounded-xl bg-[#111315] border border-[#8C9390]/25 hover:bg-[#111315]/80 text-[#8C9390] hover:text-[#F4F3EE] flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                      >
                        <Delete className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 1-Tap Quick Demo Athlete Passes */}
              <div className="p-5 rounded-3xl bg-[#202427]/60 border border-[#8C9390]/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#C8FF3D]" />
                    <span className="text-[11px] font-bold text-[#8C9390] uppercase tracking-wider">
                      Quick 1-Tap Test Passes
                    </span>
                  </div>
                  <span className="text-[10px] text-[#8C9390]">Tap any card to simulate member scan</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleVerify("PLS-1001")}
                    className="p-3 rounded-2xl bg-[#111315] hover:bg-[#111315]/80 border border-emerald-500/30 hover:border-emerald-500 text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#F4F3EE] group-hover:text-emerald-400">Sarah C.</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    </div>
                    <p className="text-[10px] font-mono text-[#8C9390] mt-0.5">PLS-1001</p>
                    <span className="text-[9px] text-emerald-400/80 uppercase font-bold">Gold VIP</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleVerify("PLS-1003")}
                    className="p-3 rounded-2xl bg-[#111315] hover:bg-[#111315]/80 border border-emerald-500/30 hover:border-emerald-500 text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#F4F3EE] group-hover:text-emerald-400">Elena R.</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    </div>
                    <p className="text-[10px] font-mono text-[#8C9390] mt-0.5">PLS-1003</p>
                    <span className="text-[9px] text-purple-400/80 uppercase font-bold">VIP + PT</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleVerify("PLS-1002")}
                    className="p-3 rounded-2xl bg-[#111315] hover:bg-[#111315]/80 border border-emerald-500/30 hover:border-emerald-500 text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#F4F3EE] group-hover:text-emerald-400">David M.</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    </div>
                    <p className="text-[10px] font-mono text-[#8C9390] mt-0.5">PLS-1002</p>
                    <span className="text-[9px] text-blue-400/80 uppercase font-bold">Monthly Flex</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleVerify("PLS-1005")}
                    className="p-3 rounded-2xl bg-[#111315] hover:bg-[#111315]/80 border border-rose-500/30 hover:border-rose-500 text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#F4F3EE] group-hover:text-rose-400">Chloe B.</span>
                      <span className="w-2 h-2 rounded-full bg-rose-400" />
                    </div>
                    <p className="text-[10px] font-mono text-[#8C9390] mt-0.5">PLS-1005</p>
                    <span className="text-[9px] text-rose-400/80 uppercase font-bold">Expired Pass</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Kiosk Footer */}
      <div className="relative z-10 text-center text-[11px] text-[#8C9390] border-t border-[#8C9390]/20 pt-4 flex items-center justify-between">
        <span>Powered by {brand.gymName} Access Network</span>
        <span className="font-mono">TERMINAL-01 &bull; Optical Sensor: Active</span>
      </div>

      {/* STAFF PIN EXIT MODAL */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#202427] border border-[#8C9390]/30 rounded-3xl p-6 max-w-xs w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="text-center space-y-1">
              <Lock className="w-8 h-8 text-[#C8FF3D] mx-auto" />
              <h3 className="text-sm font-bold text-[#F4F3EE]">Staff PIN Required</h3>
              <p className="text-[11px] text-[#8C9390]">
                Enter staff PIN (default: 1234) to return to admin portal.
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-3">
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="PIN"
                className="w-full px-4 py-2.5 bg-[#111315] border border-[#8C9390]/30 rounded-xl text-center text-lg font-mono font-bold text-[#F4F3EE] tracking-widest focus:outline-none focus:border-[#C8FF3D]"
                autoFocus
              />

              {pinError && (
                <p className="text-[11px] text-rose-400 text-center font-bold">
                  Incorrect PIN
                </p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 py-2 rounded-xl bg-[#111315] hover:bg-[#111315]/80 text-[#8C9390] hover:text-[#F4F3EE] text-xs font-bold border border-[#8C9390]/25"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-[#111315] text-xs font-black shadow"
                  style={{ backgroundColor: brand.primaryColor }}
                >
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
