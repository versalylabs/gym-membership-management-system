"use client";

import React, { useState } from "react";
import { useBrand } from "@/lib/brand-context";
import { formatCurrency } from "@/lib/utils";
import {
  X,
  CreditCard,
  Lock,
  CheckCircle2,
  Sparkles,
  QrCode,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Calendar,
  Zap,
  Smartphone,
} from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: any | null;
}

export default function CheckoutModal({ isOpen, onClose, plan }: CheckoutModalProps) {
  const { brand } = useBrand();

  const [step, setStep] = useState<"details" | "payment" | "success">("details");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("Female");

  // Payment Options (M-Pesa / Card)
  const [paymentOption, setPaymentOption] = useState<"MPESA" | "CARD">("MPESA");
  const [mpesaPhone, setMpesaPhone] = useState("");

  // Card Info
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("123");
  const [cardBrand, setCardBrand] = useState("Visa");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutResult, setCheckoutResult] = useState<any | null>(null);

  if (!isOpen || !plan) return null;

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !phone) {
      setError("Please fill in all personal details.");
      return;
    }
    setError(null);
    if (!mpesaPhone) {
      setMpesaPhone(phone);
    }
    setStep("payment");
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const isMpesa = paymentOption === "MPESA";
    const last4 = isMpesa
      ? mpesaPhone.replace(/\D/g, "").slice(-4) || "MPES"
      : cardNumber.replace(/\D/g, "").slice(-4) || "4242";
    const brandName = isMpesa ? "M-PESA" : cardBrand;

    try {
      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.id,
          member: {
            firstName,
            lastName,
            email,
            phone: isMpesa && mpesaPhone ? mpesaPhone : phone,
            gender,
          },
          cardLast4: last4,
          cardBrand: brandName,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Payment transaction failed.");
        return;
      }

      setCheckoutResult(data);
      setStep("success");
    } catch {
      setError("An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep("details");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setError(null);
    setCheckoutResult(null);
    onClose();
  };

  const totalPrice = plan.price + (plan.signupFee || 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto selection:bg-[#C8FF3D] selection:text-[#111315]">
      <div className="relative w-full max-w-lg bg-[#202427] border border-[#8C9390]/30 rounded-3xl shadow-2xl p-5 sm:p-8 my-auto max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#111315] hover:bg-[#111315]/80 text-[#8C9390] hover:text-[#F4F3EE] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* STEP 1: ATHLETE DETAILS */}
        {step === "details" && (
          <form onSubmit={handleNextToPayment} className="space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#111315] border border-[#8C9390]/25 text-xs text-[#C8FF3D] font-mono mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Step 1 of 2: Athlete Profile</span>
              </div>
              <h2 className="text-2xl font-black text-[#F4F3EE] tracking-tight">
                Join {brand.gymName} Online
              </h2>
              <p className="text-xs text-[#8C9390] mt-1">
                Selected Plan: <strong className="text-[#F4F3EE]">{plan.name}</strong> &bull; {formatCurrency(totalPrice, brand.currencySymbol)}
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#8C9390] uppercase tracking-wider mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Sarah"
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-xs text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#8C9390] uppercase tracking-wider mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Connor"
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-xs text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#8C9390] uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="brian.ochieng@gmail.com"
                className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-xs text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#8C9390] uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+254 712 345 678"
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-xs text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#8C9390] uppercase tracking-wider mb-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-xs text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider text-[#111315] shadow-xl flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-98 cursor-pointer mt-2"
              style={{ backgroundColor: brand.primaryColor }}
            >
              <span>Continue to Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: STRIPE CARD PAYMENT */}
        {step === "payment" && (
          <form onSubmit={handleProcessPayment} className="space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#111315] border border-[#8C9390]/25 text-xs text-[#C8FF3D] font-mono mb-2">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Step 2 of 2: Secure Payment</span>
              </div>
              <h2 className="text-2xl font-black text-[#F4F3EE] tracking-tight">
                Payment Details
              </h2>
              <p className="text-xs text-[#8C9390] mt-1">
                256-bit encrypted checkout via Stripe Gateway
              </p>
            </div>

            {/* Order Summary Box */}
            <div className="p-4 rounded-2xl bg-[#111315] border border-[#8C9390]/25 space-y-2 text-xs">
              <div className="flex justify-between text-[#8C9390]">
                <span>Membership Plan:</span>
                <span className="font-bold text-[#F4F3EE]">{plan.name}</span>
              </div>
              <div className="flex justify-between text-[#8C9390]">
                <span>Member Name:</span>
                <span className="font-bold text-[#F4F3EE]">{firstName} {lastName}</span>
              </div>
              <div className="pt-2 border-t border-[#8C9390]/20 flex justify-between text-sm font-black text-[#F4F3EE]">
                <span>Total Due Today:</span>
                <span className="text-[#C8FF3D] font-mono">{formatCurrency(totalPrice, brand.currencySymbol)}</span>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                {error}
              </div>
            )}

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-[#8C9390] uppercase tracking-wider block">
                Select Payment Method
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentOption("MPESA")}
                  className={`py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                    paymentOption === "MPESA"
                      ? "bg-[#111315] border-[#C8FF3D] text-[#C8FF3D] shadow"
                      : "bg-[#111315] border-[#8C9390]/20 text-[#8C9390] hover:text-[#F4F3EE]"
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Safaricom M-Pesa</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentOption("CARD")}
                  className={`py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                    paymentOption === "CARD"
                      ? "bg-[#111315] border-[#C8FF3D] text-[#C8FF3D] shadow"
                      : "bg-[#111315] border-[#8C9390]/20 text-[#8C9390] hover:text-[#F4F3EE]"
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Debit / Credit Card</span>
                </button>
              </div>

              {/* M-PESA PROMPT */}
              {paymentOption === "MPESA" ? (
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-[#8C9390] uppercase tracking-wider mb-1">
                      M-Pesa Mobile Number
                    </label>
                    <div className="relative">
                      <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                      <input
                        type="tel"
                        required
                        value={mpesaPhone}
                        onChange={(e) => setMpesaPhone(e.target.value)}
                        placeholder="0712 345 678 or +254 712 345 678"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-xs font-mono text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                      />
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-300 space-y-1">
                    <p className="font-bold flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-emerald-400" /> Instant STK Push Prompt
                    </p>
                    <p className="text-[#8C9390]">
                      A secure PIN prompt will appear on your Safaricom mobile handset. Enter your secret M-Pesa PIN to activate your membership instantly.
                    </p>
                  </div>
                </div>
              ) : (
                /* Card Inputs */
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-[#8C9390] uppercase tracking-wider mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C9390]" />
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 •••• •••• 4242"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-xs font-mono text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#8C9390] uppercase tracking-wider mb-1">
                        Expiration (MM/YY)
                      </label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="12/28"
                        className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-xs font-mono text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#8C9390] uppercase tracking-wider mb-1">
                        Security CVC
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        required
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="123"
                        className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-xs font-mono text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setStep("details")}
                className="px-5 py-3.5 rounded-2xl bg-[#111315] hover:bg-[#111315]/80 text-[#8C9390] hover:text-[#F4F3EE] text-xs font-bold border border-[#8C9390]/25 transition-all"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider text-[#111315] shadow-xl flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-98 disabled:opacity-40 cursor-pointer"
                style={{ backgroundColor: brand.primaryColor }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#111315]" />
                    <span>Authorizing Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-[#111315]" />
                    <span>Pay {formatCurrency(totalPrice, brand.currencySymbol)} & Activate</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: CELEBRATION & DIGITAL PASS */}
        {step === "success" && checkoutResult && (
          <div className="text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Payment Confirmed &bull; Membership Active</span>
              </div>
              <h2 className="text-2xl font-black text-[#F4F3EE]">
                Welcome to {brand.gymName}, {checkoutResult.member.firstName}!
              </h2>
              <p className="text-xs text-[#8C9390] mt-1">
                Your digital membership pass is ready for immediate gym access.
              </p>
            </div>

            {/* Digital Pass Card */}
            <div className="p-5 rounded-3xl bg-[#111315] border-2 border-[#C8FF3D]/40 text-left space-y-3 shadow-2xl relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#8C9390]">Official Access Pass</span>
                  <p className="text-base font-black text-[#F4F3EE]">{checkoutResult.member.firstName} {checkoutResult.member.lastName}</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#C8FF3D]/20 text-[#C8FF3D]">
                  {checkoutResult.plan.name}
                </span>
              </div>

              <div className="pt-2 border-t border-[#8C9390]/20 flex justify-between items-center text-xs">
                <div>
                  <p className="text-[10px] text-[#8C9390]">Member ID:</p>
                  <p className="font-mono font-black text-lg text-[#C8FF3D]">{checkoutResult.member.memberCode}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#8C9390]">Receipt #:</p>
                  <p className="font-mono text-[11px] text-[#F4F3EE]">{checkoutResult.payment.receiptNumber}</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider text-[#111315] shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
              style={{ backgroundColor: brand.primaryColor }}
            >
              Finish & Return to Website
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
