"use client";

import React, { useState } from "react";
import { useBrand } from "@/lib/brand-context";
import {
  Activity,
  X,
  Sparkles,
  CheckCircle2,
  QrCode,
  ArrowRight,
  ShieldCheck,
  Flame,
  Phone,
  Mail,
  User,
  Calendar,
} from "lucide-react";

interface LeadPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTrainer?: string;
}

export default function LeadPassModal({
  isOpen,
  onClose,
  defaultTrainer,
}: LeadPassModalProps) {
  const { brand } = useBrand();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [goal, setGoal] = useState("Weight Loss & Fat Burn");
  const [preferredTime, setPreferredTime] = useState("Morning (6 AM - 11 AM)");
  const [submitting, setSubmitting] = useState(false);
  const [passData, setPassData] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const voucherCode = `VIP-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          fullName,
          email,
          phone,
          source: defaultTrainer
            ? `Website PT Consult: ${defaultTrainer}`
            : "Website Free 1-Day VIP Pass",
          notes: `Primary Goal: ${goal}. Preferred Time: ${preferredTime}. Voucher: ${voucherCode}. Requested Trainer: ${
            defaultTrainer || "Any"
          }`,
        }),
      });

      setPassData({
        fullName,
        voucherCode,
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      });
    } catch (err) {
      console.error("Lead submission error", err);
      // Fallback for demo mode
      setPassData({
        fullName,
        voucherCode,
        validUntil: "Next 7 Days",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setPassData(null);
    setFullName("");
    setEmail("");
    setPhone("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#202427] border border-[#8C9390]/30 shadow-2xl p-5 sm:p-8 max-h-[92vh] overflow-y-auto text-left my-auto">
        {/* Background Ambient Glow */}
        <div
          className="absolute -top-24 -right-24 w-52 h-52 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: brand.primaryColor }}
        />

        {/* Close button */}
        <button
          onClick={handleReset}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#111315] text-[#8C9390] hover:text-[#F4F3EE] hover:bg-[#111315]/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!passData ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="px-2.5 py-1 rounded-lg text-xs font-black shadow-sm flex items-center gap-1"
                style={{ backgroundColor: brand.primaryColor, color: "#111315" }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>100% Free Guest Pass</span>
              </span>
              {defaultTrainer && (
                <span className="text-xs font-semibold text-[#C8FF3D]">
                  with Coach {defaultTrainer}
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#F4F3EE] tracking-tight uppercase">
              {defaultTrainer ? "Book 1-on-1 Consultation" : "Claim Your Free 1-Day Pass"}
            </h2>

            <p className="mt-2 text-xs text-[#8C9390]">
              Experience all workout zones, recovery saunas, and group classes at {brand.gymName} with zero obligation.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#F4F3EE] mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#8C9390]" />
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#111315] border border-[#8C9390]/30 text-xs text-[#F4F3EE] placeholder-[#8C9390]/60 focus:outline-none focus:border-[#C8FF3D]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#F4F3EE] mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#8C9390]" />
                    Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 234-5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#111315] border border-[#8C9390]/30 text-xs text-[#F4F3EE] placeholder-[#8C9390]/60 focus:outline-none focus:border-[#C8FF3D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#F4F3EE] mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#8C9390]" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="alex@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#111315] border border-[#8C9390]/30 text-xs text-[#F4F3EE] placeholder-[#8C9390]/60 focus:outline-none focus:border-[#C8FF3D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#F4F3EE] mb-1.5">
                    Primary Fitness Goal
                  </label>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#111315] border border-[#8C9390]/30 text-xs text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                  >
                    <option value="Weight Loss & Fat Burn">Weight Loss & Fat Burn</option>
                    <option value="Muscle Building & Strength">Muscle Building & Strength</option>
                    <option value="Athletic Conditioning">Athletic Conditioning</option>
                    <option value="Flexibility & Wellness">Flexibility & Wellness</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#F4F3EE] mb-1.5">
                    Preferred Workout Time
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#111315] border border-[#8C9390]/30 text-xs text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                  >
                    <option value="Morning (6 AM - 11 AM)">Morning (6 AM - 11 AM)</option>
                    <option value="Midday (11 AM - 3 PM)">Midday (11 AM - 3 PM)</option>
                    <option value="Evening (3 PM - 8 PM)">Evening (3 PM - 8 PM)</option>
                    <option value="Late Night (8 PM+)">Late Night (8 PM+)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 hover:opacity-95 active:scale-98 transition-all disabled:opacity-50"
                  style={{ backgroundColor: brand.primaryColor, color: "#111315" }}
                >
                  {submitting ? (
                    <span>Generating VIP Pass...</span>
                  ) : (
                    <>
                      <span>Get Instant VIP Guest Pass</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <p className="text-[10px] text-[#8C9390] text-center mt-2 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C8FF3D]" />
                  Instant SMS confirmation &bull; No credit card required
                </p>
              </div>
            </form>
          </div>
        ) : (
          <div className="py-2 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#C8FF3D]/20 border border-[#C8FF3D]/40 text-[#C8FF3D] flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-black text-[#F4F3EE] tracking-tight uppercase">
              Your VIP Pass Is Ready!
            </h2>

            <p className="text-xs text-[#8C9390] max-w-sm mx-auto">
              We've activated your complimentary day pass for{" "}
              <strong className="text-[#F4F3EE]">{brand.gymName}</strong>. An SMS confirmation has also been dispatched.
            </p>

            {/* High-Impact Digital VIP Pass Card */}
            <div className="p-5 rounded-3xl bg-[#111315] border-2 border-[#8C9390]/30 text-left max-w-sm mx-auto relative overflow-hidden shadow-2xl">
              <div
                className="absolute top-0 left-0 right-0 h-2"
                style={{ backgroundColor: brand.primaryColor }}
              />

              <div className="flex items-center justify-between pb-3 border-b border-[#202427]">
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shadow"
                    style={{ backgroundColor: brand.primaryColor, color: "#111315" }}
                  >
                    <Activity className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span className="text-xs font-black text-[#F4F3EE] tracking-tight uppercase">
                    {brand.gymName}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#C8FF3D]/20 text-[#C8FF3D] text-[10px] font-bold uppercase tracking-wider">
                  Active Pass
                </span>
              </div>

              <div className="mt-4 space-y-2 text-xs text-[#8C9390]">
                <div className="flex justify-between">
                  <span>Pass Holder:</span>
                  <span className="font-bold text-[#F4F3EE]">{passData.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Voucher Code:</span>
                  <span className="font-mono font-bold text-[#C8FF3D]">
                    {passData.voucherCode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Valid Through:</span>
                  <span className="font-bold text-[#F4F3EE]">{passData.validUntil}</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#202427] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-1 bg-[#F4F3EE] rounded-lg">
                    <QrCode className="w-10 h-10 text-[#111315]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#8C9390] font-mono">SCAN AT KIOSK</p>
                    <p className="text-[9px] text-[#8C9390]">Front desk barcode entry</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="px-8 py-2.5 rounded-xl bg-[#111315] hover:bg-[#111315]/80 text-xs font-bold text-[#F4F3EE] border border-[#8C9390]/30 transition-colors"
            >
              Done / Return to Website
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
