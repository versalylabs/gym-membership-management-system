"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useBrand } from "@/lib/brand-context";
import { formatCurrency } from "@/lib/utils";
import SignaturePad from "@/components/SignaturePad";
import {
  UserPlus,
  User,
  HeartPulse,
  CreditCard,
  FileCheck,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldAlert,
  Calendar,
  Phone,
  Mail,
  Home,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

function MemberOnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { brand } = useBrand();

  const [step, setStep] = useState(1);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal Demographics
    firstName: searchParams.get("firstName") || "",
    lastName: searchParams.get("lastName") || "",
    email: searchParams.get("email") || "",
    phone: searchParams.get("phone") || "",
    gender: "Male",
    dateOfBirth: "1995-05-15",
    address: "",

    // Step 2: Emergency & Health Screening
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "Spouse",
    medicalNotes: "",
    fitnessGoals: searchParams.get("goals") || "Muscle Gain, Strength",

    // Step 3: Membership Plan & Payment
    planId: "",
    startDate: new Date().toISOString().split("T")[0],
    paymentMethod: "MPESA",
    amountPaid: 0,

    // Step 4: Waiver
    waiverAgreed: false,
    signature: "",
  });

  useEffect(() => {
    async function loadPlans() {
      try {
        const res = await fetch("/api/memberships");
        if (res.ok) {
          const data = await res.json();
          setPlans(data);
          if (data.length > 0 && !formData.planId) {
            setFormData((prev) => ({
              ...prev,
              planId: data[0].id,
              amountPaid: data[0].price,
            }));
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadPlans();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePlanSelect = (plan: any) => {
    setFormData((prev) => ({
      ...prev,
      planId: plan.id,
      amountPaid: plan.price,
    }));
  };

  const validateStep1 = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setErrorMsg("Please enter both first and last name.");
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return false;
    }
    if (!formData.phone.trim()) {
      setErrorMsg("Please enter a valid phone number.");
      return false;
    }
    setErrorMsg("");
    return true;
  };

  const validateStep2 = () => {
    if (!formData.emergencyName.trim() || !formData.emergencyPhone.trim()) {
      setErrorMsg("Emergency contact name and phone number are required.");
      return false;
    }
    setErrorMsg("");
    return true;
  };

  const validateStep3 = () => {
    if (!formData.planId) {
      setErrorMsg("Please select a membership plan.");
      return false;
    }
    setErrorMsg("");
    return true;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setErrorMsg("");
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.waiverAgreed) {
      setErrorMsg("You must accept and agree to the liability waiver & terms.");
      return;
    }
    if (!formData.signature) {
      setErrorMsg("Please provide your digital signature on the signature pad.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Failed to register member.");
        setLoading(false);
        return;
      }

      // Success -> Redirect to member dossier
      router.push(`/members/${data.member.id}`);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  const stepsList = [
    { num: 1, title: "Demographics", icon: User },
    { num: 2, title: "Health & Emergency", icon: HeartPulse },
    { num: 3, title: "Plan & Billing", icon: CreditCard },
    { num: 4, title: "Waiver & E-Sign", icon: FileCheck },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/members"
            className="text-xs text-[#8C9390] hover:text-[#F4F3EE] flex items-center gap-1 mb-2 transition-colors"
          >
            &larr; Back to Member Directory
          </Link>
          <h1 className="text-2xl font-black text-[#F4F3EE] tracking-tight flex items-center gap-2.5">
            <UserPlus className="w-7 h-7" style={{ color: brand.primaryColor }} />
            New Member Digital Registration
          </h1>
          <p className="text-xs text-[#8C9390] mt-1">
            Paperless digital onboarding for {brand.gymName}.
          </p>
        </div>
      </div>

      {/* Step Progress Bar */}
      <div className="grid grid-cols-4 gap-2">
        {stepsList.map((s) => {
          const isCompleted = step > s.num;
          const isCurrent = step === s.num;
          const Icon = s.icon;
          return (
            <div
              key={s.num}
              className={`p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                isCurrent
                  ? "bg-[#202427] border-[#8C9390]/50 shadow-md"
                  : isCompleted
                  ? "bg-[#111315] border-[#8C9390]/25 text-[#8C9390]"
                  : "bg-[#111315]/40 border-[#8C9390]/15 text-[#8C9390]/50"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                  isCurrent
                    ? "text-[#111315] font-black shadow-sm"
                    : isCompleted
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-[#202427] text-[#8C9390]"
                }`}
                style={{
                  backgroundColor: isCurrent ? brand.primaryColor : undefined,
                }}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <div className="hidden sm:block">
                <p
                  className={`text-xs font-bold ${
                    isCurrent ? "text-[#F4F3EE]" : "text-[#8C9390]"
                  }`}
                >
                  {s.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-950/70 border border-red-500/50 flex items-center gap-3 text-xs text-red-300 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Step Form Box */}
      <div className="p-8 rounded-3xl bg-[#202427] border border-[#8C9390]/25 shadow-2xl">
        {/* STEP 1: Personal Demographics */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-sm font-bold text-[#F4F3EE] flex items-center gap-2 border-b border-[#8C9390]/20 pb-3">
              <User className="w-4 h-4 text-[#8C9390]" />
              Step 1: Personal Information & Contact
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#F4F3EE] mb-1.5">
                  First Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="e.g. Jason"
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-xs text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D] placeholder-[#8C9390]/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F4F3EE] mb-1.5">
                  Last Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="e.g. Bourne"
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-xs text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D] placeholder-[#8C9390]/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F4F3EE] mb-1.5">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jason.bourne@example.com"
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-xs text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D] placeholder-[#8C9390]/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F4F3EE] mb-1.5">
                  Phone Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+254 712 345 678"
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-xs text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D] placeholder-[#8C9390]/50 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F4F3EE] mb-1.5">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-xs text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                >
                  <option value="Male" className="bg-[#111315] text-[#F4F3EE]">Male</option>
                  <option value="Female" className="bg-[#111315] text-[#F4F3EE]">Female</option>
                  <option value="Non-Binary" className="bg-[#111315] text-[#F4F3EE]">Non-Binary</option>
                  <option value="Prefer not to say" className="bg-[#111315] text-[#F4F3EE]">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F4F3EE] mb-1.5">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-xs text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#F4F3EE] mb-1.5">
                  Residential Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. Rhapta Road, Westlands, Nairobi"
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-xs text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D] placeholder-[#8C9390]/50"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Emergency & Health Screening (PAR-Q) */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-sm font-bold text-[#F4F3EE] flex items-center gap-2 border-b border-[#8C9390]/20 pb-3">
              <HeartPulse className="w-4 h-4 text-[#8C9390]" />
              Step 2: Emergency Contacts & Health Questionnaire
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#F4F3EE] mb-1.5">
                  Emergency Contact Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="emergencyName"
                  value={formData.emergencyName}
                  onChange={handleChange}
                  placeholder="e.g. Grace Ochieng"
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-xs text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D] placeholder-[#8C9390]/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F4F3EE] mb-1.5">
                  Emergency Contact Phone <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                  placeholder="+254 722 000 111"
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-xs text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D] placeholder-[#8C9390]/50 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F4F3EE] mb-1.5">
                  Relationship to Member
                </label>
                <select
                  name="emergencyRelation"
                  value={formData.emergencyRelation}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-xs text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                >
                  <option value="Spouse" className="bg-[#111315] text-[#F4F3EE]">Spouse / Partner</option>
                  <option value="Parent" className="bg-[#111315] text-[#F4F3EE]">Parent / Guardian</option>
                  <option value="Sibling" className="bg-[#111315] text-[#F4F3EE]">Sibling</option>
                  <option value="Friend" className="bg-[#111315] text-[#F4F3EE]">Friend / Colleague</option>
                  <option value="Other" className="bg-[#111315] text-[#F4F3EE]">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F4F3EE] mb-1.5">
                  Primary Fitness Goals
                </label>
                <input
                  type="text"
                  name="fitnessGoals"
                  value={formData.fitnessGoals}
                  onChange={handleChange}
                  placeholder="e.g. Hypertrophy, Weight Loss, Marathon prep"
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-xs text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D] placeholder-[#8C9390]/50"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#F4F3EE] mb-1.5">
                  Medical Conditions, Allergies, or Past Injuries (Optional)
                </label>
                <textarea
                  name="medicalNotes"
                  value={formData.medicalNotes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="e.g. Previous ACL reconstruction in 2023, Asthma, High blood pressure..."
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-xs text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D] placeholder-[#8C9390]/50"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Membership Plan & Initial Payment */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-sm font-bold text-[#F4F3EE] flex items-center gap-2 border-b border-[#8C9390]/20 pb-3">
              <CreditCard className="w-4 h-4 text-[#8C9390]" />
              Step 3: Select Plan & Record Initial Payment
            </h2>

            {/* Plan Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {plans.map((p) => {
                const isSelected = formData.planId === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => handlePlanSelect(p)}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-[#111315] border-[#C8FF3D] shadow-xl"
                        : "bg-[#111315]/60 border-[#8C9390]/25 hover:border-[#8C9390]/60"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#F4F3EE]">
                          {p.name}
                        </span>
                        {isSelected && (
                          <span
                            className="px-2 py-0.5 rounded-full text-[10px] font-black text-[#111315]"
                            style={{ backgroundColor: brand.primaryColor }}
                          >
                            Selected
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#8C9390] mt-1">
                        {p.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#8C9390]/20 flex items-baseline justify-between">
                      <span className="text-xl font-extrabold text-[#F4F3EE]">
                        {formatCurrency(p.price, brand.currencySymbol)}
                      </span>
                      <span className="text-[11px] text-[#8C9390]">
                        {p.durationMonths === 12
                          ? "Annual"
                          : p.sessionLimit
                          ? `${p.sessionLimit} sessions`
                          : "Monthly"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#8C9390]/20">
              <div>
                <label className="block text-xs font-semibold text-[#F4F3EE] mb-1.5">
                  Membership Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-xs text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F4F3EE] mb-1.5">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-xs text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                >
                  <option value="MPESA" className="bg-[#111315] text-[#F4F3EE]">Safaricom M-Pesa (Mobile Money)</option>
                  <option value="CASH" className="bg-[#111315] text-[#F4F3EE]">Cash (Front Desk)</option>
                  <option value="CARD" className="bg-[#111315] text-[#F4F3EE]">Credit / Debit Card (PDQ / POS)</option>
                  <option value="TRANSFER" className="bg-[#111315] text-[#F4F3EE]">Bank Transfer / EFT / Pesalink</option>
                  <option value="STRIPE" className="bg-[#111315] text-[#F4F3EE]">Online Payment (Portal)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F4F3EE] mb-1.5">
                  Amount Received ({brand.currencySymbol})
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="amountPaid"
                  value={formData.amountPaid}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-xs font-mono font-bold text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Digital Liability Waiver & E-Signature */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-sm font-bold text-[#F4F3EE] flex items-center gap-2 border-b border-[#8C9390]/20 pb-3">
              <FileCheck className="w-4 h-4 text-[#8C9390]" />
              Step 4: Liability Waiver, PAR-Q Terms & Digital Signature
            </h2>

            {/* Waiver Legal Text Box */}
            <div className="p-4 rounded-2xl bg-[#111315] border border-[#8C9390]/25 max-h-44 overflow-y-auto text-[11px] text-[#8C9390] space-y-2 leading-relaxed">
              <p className="font-bold text-[#F4F3EE]">
                {brand.gymName.toUpperCase()} — MEMBER LIABILITY RELEASE & ASSUMPTION OF RISK AGREEMENT
              </p>
              <p>
                1. <strong>Physical Activity Notice:</strong> I hereby acknowledge that I have voluntarily chosen to participate in physical exercise, personal training, and group fitness classes at {brand.gymName}. I understand that exercise involves inherent risks of injury.
              </p>
              <p>
                2. <strong>Medical Declaration:</strong> I declare that I am physically sound and capable of undertaking exercise. I agree to notify staff immediately if my medical condition changes.
              </p>
              <p>
                3. <strong>Facility Rules:</strong> I agree to abide by all facility guidelines, hygiene practices, and turnstile check-in rules.
              </p>
              <p>
                4. <strong>Release:</strong> I release {brand.gymName}, its trainers, and owners from any liability for accidental injury or property damage resulting from my use of the premises.
              </p>
            </div>

            {/* Checkbox agreement */}
            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#111315]/70 border border-[#8C9390]/25 cursor-pointer">
              <input
                type="checkbox"
                name="waiverAgreed"
                checked={formData.waiverAgreed}
                onChange={handleChange}
                className="mt-0.5 w-4 h-4 rounded bg-[#111315] border-[#8C9390]/50 text-[#C8FF3D] focus:ring-0"
              />
              <span className="text-xs text-[#8C9390] leading-snug">
                I have read, understood, and voluntarily agree to the {brand.gymName} Member Liability Waiver and Physical Activity Readiness terms.
              </span>
            </label>

            {/* Signature Pad */}
            <SignaturePad
              brandColor={brand.primaryColor}
              onSave={(sigData) =>
                setFormData((prev) => ({ ...prev, signature: sigData }))
              }
            />
          </div>
        )}

        {/* Wizard Controls */}
        <div className="mt-8 pt-6 border-t border-[#8C9390]/20 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#111315] hover:bg-[#202427] text-[#F4F3EE] border border-[#8C9390]/25 text-xs font-bold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-[#111315] text-xs font-black transition-transform hover:scale-[1.02] shadow-lg"
              style={{ backgroundColor: brand.primaryColor }}
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4 text-[#111315]" />
            </button>
          ) : (
            <button
              type="button"
              disabled={loading}
              onClick={handleSubmit}
              className="flex items-center gap-2 px-8 py-3 rounded-xl text-[#111315] text-xs font-black shadow-2xl transition-all hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: brand.primaryColor }}
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-[#111315]" />
              ) : (
                <Check className="w-4 h-4 text-[#111315]" />
              )}
              <span>Complete Registration & Activate Pass</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function NewMemberOnboardingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#8C9390] text-xs">Loading registration wizard...</div>}>
      <MemberOnboardingContent />
    </Suspense>
  );
}
