"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useBrand } from "@/lib/brand-context";
import {
  Lock,
  Mail,
  Dumbbell,
  ShieldCheck,
  UserCheck,
  Zap,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Globe,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const { login, quickLogin } = useAuth();
  const { brand } = useBrand();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("manager@pulsegym.com");
  const [password, setPassword] = useState("pulse123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        router.push(callbackUrl);
        router.refresh();
      } else {
        setError(res.error || "Invalid email or password");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSelect = async (role: "MANAGER" | "RECEPTIONIST" | "TRAINER") => {
    setError(null);
    setLoading(true);
    try {
      await quickLogin(role);
    } catch {
      setError("Failed to switch account.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111315] text-[#F4F3EE] flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-[#C8FF3D] selection:text-[#111315]">
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#C8FF3D]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Bar with Gym Website Link */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between max-w-5xl mx-auto w-full z-10">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
            style={{ backgroundColor: brand.primaryColor }}
          >
            <Dumbbell className="w-5 h-5 text-[#111315]" />
          </div>
          <div>
            <span className="text-base font-black tracking-tight text-[#F4F3EE]">
              {brand.gymName}
            </span>
            <span className="text-[10px] uppercase tracking-widest font-black text-[#C8FF3D] ml-2 px-1.5 py-0.5 rounded bg-[#C8FF3D]/10 border border-[#C8FF3D]/20">
              Staff Portal
            </span>
          </div>
        </div>

        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#8C9390]/25 bg-[#202427]/80 hover:bg-[#202427] text-xs text-[#F4F3EE] font-bold transition-all group backdrop-blur"
        >
          <Globe className="w-3.5 h-3.5 text-[#C8FF3D] group-hover:rotate-12 transition-transform" />
          <span>Back to Gym Website</span>
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md relative z-10 mt-12 mb-8">
        <div className="p-8 rounded-3xl bg-[#202427] border border-[#8C9390]/25 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="text-center space-y-2 mb-6">
            <h1 className="text-2xl font-black tracking-tight text-[#F4F3EE]">
              Staff Sign In
            </h1>
            <p className="text-xs text-[#8C9390]">
              Enter your credentials to access the facility management portal
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/25 flex items-center gap-2.5 text-xs text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#8C9390] uppercase tracking-wider mb-1.5">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C9390]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@pulsegym.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-xs text-[#F4F3EE] placeholder-[#8C9390]/50 focus:outline-none focus:border-[#C8FF3D] transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-[#8C9390] uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[11px] text-[#8C9390]/60">Default: pulse123</span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C9390]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-xs text-[#F4F3EE] placeholder-[#8C9390]/50 focus:outline-none focus:border-[#C8FF3D] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C9390] hover:text-[#F4F3EE] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-black text-xs text-[#111315] flex items-center justify-center gap-2 shadow-lg transition-all hover:opacity-90 disabled:opacity-50 mt-2"
              style={{ backgroundColor: brand.primaryColor }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#111315]" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Authenticate & Enter</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Switcher Section */}
          <div className="mt-8 pt-6 border-t border-[#8C9390]/20">
            <div className="flex items-center gap-1.5 mb-3">
              <Zap className="w-3.5 h-3.5 text-[#C8FF3D]" />
              <span className="text-[11px] font-bold text-[#8C9390] uppercase tracking-wider">
                1-Click Quick Demo Sign-In
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {/* Manager */}
              <button
                type="button"
                onClick={() => handleQuickSelect("MANAGER")}
                disabled={loading}
                className="p-2.5 rounded-xl bg-[#111315] hover:bg-[#111315]/80 border border-[#8C9390]/25 hover:border-[#C8FF3D]/50 flex flex-col items-center text-center transition-all group"
              >
                <ShieldCheck className="w-4 h-4 text-[#C8FF3D] mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-[#F4F3EE]">Manager</span>
                <span className="text-[9px] text-[#8C9390]">Full Access</span>
              </button>

              {/* Receptionist */}
              <button
                type="button"
                onClick={() => handleQuickSelect("RECEPTIONIST")}
                disabled={loading}
                className="p-2.5 rounded-xl bg-[#111315] hover:bg-[#111315]/80 border border-[#8C9390]/25 hover:border-[#C8FF3D]/50 flex flex-col items-center text-center transition-all group"
              >
                <UserCheck className="w-4 h-4 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-[#F4F3EE]">Front Desk</span>
                <span className="text-[9px] text-[#8C9390]">Operations</span>
              </button>

              {/* Trainer */}
              <button
                type="button"
                onClick={() => handleQuickSelect("TRAINER")}
                disabled={loading}
                className="p-2.5 rounded-xl bg-[#111315] hover:bg-[#111315]/80 border border-[#8C9390]/25 hover:border-[#C8FF3D]/50 flex flex-col items-center text-center transition-all group"
              >
                <Dumbbell className="w-4 h-4 text-amber-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-[#F4F3EE]">Trainer</span>
                <span className="text-[9px] text-[#8C9390]">PT & Classes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-[#8C9390]/60 mt-4">
          Protected by Enterprise Session Authentication • {brand.gymName} Operations
        </p>
      </div>
    </div>
  );
}
