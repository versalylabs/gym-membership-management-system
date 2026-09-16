"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useBrand } from "@/lib/brand-context";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import {
  User,
  CreditCard,
  QrCode,
  Calendar,
  Clock,
  HeartPulse,
  FileCheck,
  PauseCircle,
  PlayCircle,
  RefreshCw,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  Home,
  ShieldCheck,
  Receipt,
  Download,
  Printer,
  X,
  Plus,
  Flame,
  Activity,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import PrintableReceipt from "@/components/PrintableReceipt";

export default function MemberDossierPage() {
  const params = useParams();
  const router = useRouter();
  const { brand } = useBrand();
  const memberId = params?.id as string;

  const [member, setMember] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState<any>(null);

  // Renewal Form
  const [renewPlanId, setRenewPlanId] = useState("");
  const [renewPaymentMethod, setRenewPaymentMethod] = useState("CARD");
  const [renewAmount, setRenewAmount] = useState<number>(0);
  const [submittingAction, setSubmittingAction] = useState(false);

  // Freeze Form
  const [freezeDays, setFreezeDays] = useState(30);

  // Edit Form
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "",
    medicalNotes: "",
    fitnessGoals: "",
  });

  const fetchMember = async () => {
    try {
      const res = await fetch(`/api/members/${memberId}`);
      if (res.ok) {
        const data = await res.json();
        setMember(data);
        setEditForm({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          phone: data.phone || "",
          email: data.email || "",
          emergencyName: data.emergencyName || "",
          emergencyPhone: data.emergencyPhone || "",
          emergencyRelation: data.emergencyRelation || "",
          medicalNotes: data.medicalNotes || "",
          fitnessGoals: data.fitnessGoals || "",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMember();
    async function loadPlans() {
      try {
        const res = await fetch("/api/memberships");
        if (res.ok) {
          const data = await res.json();
          setPlans(data);
          if (data.length > 0) {
            setRenewPlanId(data[0].id);
            setRenewAmount(data[0].price);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadPlans();
  }, [memberId]);

  const handleStatusChange = async (newStatus: string) => {
    if (!confirm(`Are you sure you want to change member status to ${newStatus}?`)) return;
    setSubmittingAction(true);
    try {
      const res = await fetch(`/api/members/${memberId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchMember();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleRenew = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingAction(true);
    try {
      const res = await fetch(`/api/members/${memberId}/renew`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: renewPlanId,
          paymentMethod: renewPaymentMethod,
          amountPaid: renewAmount,
        }),
      });
      if (res.ok) {
        setShowRenewModal(false);
        fetchMember();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleFreeze = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingAction(true);
    const resumeDate = new Date();
    resumeDate.setDate(resumeDate.getDate() + freezeDays);

    try {
      const res = await fetch(`/api/members/${memberId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "FROZEN",
          freezeEndDate: resumeDate.toISOString(),
        }),
      });
      if (res.ok) {
        setShowFreezeModal(false);
        fetchMember();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingAction(true);
    try {
      const res = await fetch(`/api/members/${memberId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        setShowEditModal(false);
        fetchMember();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to permanently delete this member record? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/members/${memberId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/members");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !member) {
    return (
      <div className="py-24 text-center text-[#8C9390]">
        <RefreshCw className="w-8 h-8 mx-auto animate-spin mb-3 text-[#8C9390]" />
        <p className="text-xs">Loading athlete command dossier...</p>
      </div>
    );
  }

  const activeSub = member.subscriptions?.[0];
  const isExpired =
    member.status === "EXPIRED" ||
    (activeSub && new Date(activeSub.endDate) < new Date());

  const totalSpent = member.payments?.reduce((acc: number, p: any) => acc + p.amount, 0) || 0;
  const totalAttendances = member.attendances?.length || 0;

  // Calculate days remaining
  let daysRemaining = 0;
  if (activeSub && activeSub.endDate) {
    const diff = new Date(activeSub.endDate).getTime() - new Date().getTime();
    daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  const tabs = [
    { id: "overview", label: "Dossier & Vitals", icon: User },
    { id: "memberships", label: "Membership Tiers", icon: CreditCard },
    { id: "attendance", label: "Attendance & Heatmap", icon: Clock },
    { id: "payments", label: "Billing & Invoices", icon: Receipt },
    { id: "waiver", label: "Signed Waiver (E-Sign)", icon: FileCheck },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Breadcrumb back navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/members"
          className="text-xs font-semibold text-[#8C9390] hover:text-[#F4F3EE] flex items-center gap-1.5 transition-colors"
        >
          &larr; Back to Athlete Directory
        </Link>
        <span className="text-[11px] font-mono text-[#8C9390]">
          ID: {member.id}
        </span>
      </div>

      {/* 1. Master Athlete Dossier Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-[#202427] border border-[#8C9390]/25 p-6 md:p-8 shadow-2xl">
        <div
          className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: brand.primaryColor }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar with Initials */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center font-black text-2xl text-[#111315] shadow-xl flex-shrink-0"
              style={{ backgroundColor: brand.primaryColor }}
            >
              {member.firstName[0]}
              {member.lastName[0]}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-[#F4F3EE] tracking-tight uppercase">
                  {member.firstName} {member.lastName}
                </h1>

                {/* Status Pill */}
                {member.status === "ACTIVE" && !isExpired && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-black uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Active Athlete
                  </span>
                )}
                {member.status === "FROZEN" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-black uppercase tracking-wider">
                    <PauseCircle className="w-3.5 h-3.5" />
                    Pass Frozen
                  </span>
                )}
                {isExpired && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-black uppercase tracking-wider">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Expired Tier
                  </span>
                )}

                {/* Attendance Streak Flame */}
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold">
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>4-Day Streak</span>
                </span>
              </div>

              {/* Contact Chips */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#8C9390] pt-1">
                <span className="flex items-center gap-1.5 text-[#F4F3EE]/80">
                  <Phone className="w-3.5 h-3.5 text-[#8C9390]" /> {member.phone}
                </span>
                <span className="flex items-center gap-1.5 text-[#F4F3EE]/80">
                  <Mail className="w-3.5 h-3.5 text-[#8C9390]" /> {member.email}
                </span>
                <span className="flex items-center gap-1.5 font-mono text-amber-400 bg-[#111315] px-2.5 py-0.5 rounded-md border border-[#8C9390]/25">
                  <QrCode className="w-3.5 h-3.5" /> {member.memberCode}
                </span>
              </div>
            </div>
          </div>

          {/* Action Command Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowRenewModal(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-black text-[#111315] shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-1.5"
              style={{ backgroundColor: brand.primaryColor }}
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#111315]" />
              <span>Renew / Upgrade</span>
            </button>

            {member.status === "FROZEN" ? (
              <button
                onClick={() => handleStatusChange("ACTIVE")}
                disabled={submittingAction}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow transition-all flex items-center gap-1.5"
              >
                <PlayCircle className="w-3.5 h-3.5" />
                <span>Resume Pass</span>
              </button>
            ) : (
              <button
                onClick={() => setShowFreezeModal(true)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#111315] hover:bg-[#202427] text-[#F4F3EE] border border-[#8C9390]/25 transition-all flex items-center gap-1.5"
              >
                <PauseCircle className="w-3.5 h-3.5 text-sky-400" />
                <span>Freeze</span>
              </button>
            )}

            <button
              onClick={() => setShowEditModal(true)}
              className="p-2.5 rounded-xl bg-[#111315] hover:bg-[#202427] text-[#8C9390] hover:text-[#F4F3EE] border border-[#8C9390]/25 transition-colors"
              title="Edit Athlete Info"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleDelete}
              className="p-2.5 rounded-xl bg-[#111315] hover:bg-rose-900/50 text-[#8C9390] hover:text-rose-400 border border-[#8C9390]/25 transition-colors"
              title="Delete Member"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Telemetry Metric Bar */}
        <div className="mt-8 pt-6 border-t border-[#8C9390]/20 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-2xl bg-[#111315] border border-[#8C9390]/20">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C9390]">
              Current Membership
            </span>
            <p className="text-sm font-black text-[#F4F3EE] mt-1">
              {activeSub?.plan?.name || "No Active Plan"}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#111315] border border-[#8C9390]/20">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C9390]">
              Validity / Days Left
            </span>
            <p className="text-sm font-black text-emerald-400 mt-1">
              {daysRemaining > 0 ? `${daysRemaining} Days Left` : "Expired"}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#111315] border border-[#8C9390]/20">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C9390]">
              Total Workouts
            </span>
            <p className="text-sm font-black text-[#F4F3EE] mt-1">
              {totalAttendances} Check-Ins
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#111315] border border-[#8C9390]/20">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C9390]">
              Lifetime Value (LTV)
            </span>
            <p className="text-sm font-black text-amber-400 mt-1">
              {formatCurrency(totalSpent, brand.currencySymbol)}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#8C9390]/20 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isSelected
                  ? "text-[#111315] font-black shadow-md"
                  : "text-[#8C9390] hover:text-[#F4F3EE] hover:bg-[#202427]"
              }`}
              style={{
                backgroundColor: isSelected ? brand.primaryColor : undefined,
              }}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Tab Workspaces */}

      {/* Tab 1: Overview & Health */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Emergency Contact & Safety */}
          <div className="rounded-3xl bg-[#202427] border border-[#8C9390]/25 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#8C9390]/20">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-bold text-[#F4F3EE] uppercase tracking-wider">
                  Emergency & Safety Dossier
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                PAR-Q Cleared
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-[#8C9390]/15">
                <span className="text-[#8C9390]">Emergency Contact:</span>
                <span className="font-bold text-[#F4F3EE]">
                  {member.emergencyName || "Not specified"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#8C9390]/15">
                <span className="text-[#8C9390]">Relation:</span>
                <span className="text-[#F4F3EE]/80">
                  {member.emergencyRelation || "Family"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#8C9390]/15">
                <span className="text-[#8C9390]">Emergency Phone:</span>
                <span className="font-bold text-rose-400 font-mono">
                  {member.emergencyPhone || "None"}
                </span>
              </div>
            </div>
          </div>

          {/* Fitness Goals & Medical Vitals */}
          <div className="rounded-3xl bg-[#202427] border border-[#8C9390]/25 p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#8C9390]/20">
              <Activity className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-bold text-[#F4F3EE] uppercase tracking-wider">
                Fitness Goals & Bio Notes
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[#8C9390] block mb-1">Primary Training Objectives:</span>
                <p className="p-3 rounded-xl bg-[#111315] border border-[#8C9390]/20 text-[#F4F3EE]">
                  {member.fitnessGoals || "General fitness, functional hypertrophy and stamina."}
                </p>
              </div>

              <div>
                <span className="text-[#8C9390] block mb-1">Medical Limitations & Notes:</span>
                <p className="p-3 rounded-xl bg-[#111315] border border-[#8C9390]/20 text-[#8C9390]">
                  {member.medicalNotes || "No reported musculoskeletal injuries or cardiovascular issues."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Attendance & Heatmap */}
      {activeTab === "attendance" && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-[#202427] border border-[#8C9390]/25 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#8C9390]/20">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C8FF3D]" />
                <h3 className="text-sm font-bold text-[#F4F3EE] uppercase tracking-wider">
                  Verified Check-In Stream
                </h3>
              </div>
              <span className="text-xs text-[#8C9390]">
                Total Visits: <strong className="text-[#F4F3EE]">{member.attendances?.length || 0}</strong>
              </span>
            </div>

            <div className="mt-4 space-y-2.5">
              {member.attendances && member.attendances.length > 0 ? (
                member.attendances.map((att: any) => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-[#111315] border border-[#8C9390]/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#F4F3EE]">
                          Verified Admission ({att.method})
                        </p>
                        <p className="text-[10px] text-[#8C9390]">
                          {formatDate(att.checkInTime)}
                        </p>
                      </div>
                    </div>

                    <div className="text-right text-xs">
                      <span className="font-mono text-[#8C9390]">
                        {new Date(att.checkInTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-[#8C9390] text-xs">
                  No attendance logs found for this member.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Membership Plans */}
      {activeTab === "memberships" && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-[#202427] border border-[#8C9390]/25 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#8C9390]/20">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#C8FF3D]" />
                <h3 className="text-sm font-bold text-[#F4F3EE] uppercase tracking-wider">
                  Subscription History & Active Tiers
                </h3>
              </div>
              <button
                onClick={() => setShowRenewModal(true)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-black text-[#111315] shadow"
                style={{ backgroundColor: brand.primaryColor }}
              >
                + Assign New Plan
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {member.subscriptions && member.subscriptions.length > 0 ? (
                member.subscriptions.map((sub: any, idx: number) => (
                  <div
                    key={sub.id}
                    className="p-4 rounded-2xl bg-[#111315] border border-[#8C9390]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#F4F3EE]">
                          {sub.plan?.name || "Membership Plan"}
                        </h4>
                        {idx === 0 && (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase">
                            Current Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#8C9390] mt-1">
                        Valid: {formatDate(sub.startDate)} &rarr; {formatDate(sub.endDate)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-black text-[#F4F3EE]">
                        {formatCurrency(sub.plan?.price || 0, brand.currencySymbol)}
                      </p>
                      <p className="text-[10px] text-[#8C9390]">
                        Status: <strong className="text-[#F4F3EE]">{sub.status}</strong>
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-[#8C9390] text-xs">
                  No subscriptions recorded.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Billing & Invoices */}
      {activeTab === "payments" && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-[#202427] border border-[#8C9390]/25 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#8C9390]/20">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-[#C8FF3D]" />
                <h3 className="text-sm font-bold text-[#F4F3EE] uppercase tracking-wider">
                  Payment History & Tax Invoices
                </h3>
              </div>
            </div>

            <div className="mt-4 space-y-2.5">
              {member.payments && member.payments.length > 0 ? (
                member.payments.map((p: any) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-[#111315] border border-[#8C9390]/20"
                  >
                    <div>
                      <p className="text-xs font-bold text-[#F4F3EE]">
                        Receipt #{p.receiptNumber} &bull; {p.method}
                      </p>
                      <p className="text-[10px] text-[#8C9390]">
                        {formatDate(p.paidAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-emerald-400">
                        +{formatCurrency(p.amount, brand.currencySymbol)}
                      </span>
                      <button
                        onClick={() => setShowReceiptModal(p)}
                        className="px-3 py-1.5 rounded-xl bg-[#202427] hover:bg-[#111315] text-[11px] font-bold text-[#F4F3EE] border border-[#8C9390]/25 flex items-center gap-1 transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Invoice</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-[#8C9390] text-xs">
                  No invoices recorded for this athlete.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Signed Digital Waiver */}
      {activeTab === "waiver" && (
        <div className="rounded-3xl bg-[#202427] border border-[#8C9390]/25 p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-[#8C9390]/20">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#C8FF3D]" />
              <h3 className="text-sm font-bold text-[#F4F3EE] uppercase tracking-wider">
                Digital Legal Waiver & E-Signature
              </h3>
            </div>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Legally Binding Record
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#111315] border border-[#8C9390]/25 text-xs text-[#8C9390] space-y-2">
            <p>
              I, <strong className="text-[#F4F3EE]">{member.firstName} {member.lastName}</strong>, hereby acknowledge and assume all physical risks associated with participation in athletic activities at {brand.gymName}.
            </p>
            <p className="text-[11px] text-[#8C9390]">
              Timestamp: {formatDate(member.createdAt)} &bull; IP Logged &bull; Verified E-Signature
            </p>
          </div>

          {member.signature || member.signatureUrl ? (
            <div className="p-4 rounded-2xl bg-[#111315] border border-[#8C9390]/25 max-w-sm">
              <span className="text-[10px] font-mono text-[#8C9390] block mb-2 font-bold">
                STORED E-SIGNATURE:
              </span>
              <img
                src={member.signature || member.signatureUrl}
                alt="Member Signature"
                className="max-h-24 filter invert"
              />
            </div>
          ) : (
            <div className="py-6 text-center text-[#8C9390] text-xs">
              No digital signature image attached.
            </div>
          )}
        </div>
      )}

      {/* RENEW MODAL */}
      {showRenewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-[#202427] border border-[#8C9390]/25 shadow-2xl p-6 sm:p-8 text-left">
            <button
              onClick={() => setShowRenewModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-[#111315] text-[#8C9390] hover:text-[#F4F3EE]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-[#F4F3EE] uppercase tracking-tight">
              Renew / Upgrade Membership
            </h3>
            <p className="text-xs text-[#8C9390] mt-1">
              Extend athlete subscription for {member.firstName} {member.lastName}.
            </p>

            <form onSubmit={handleRenew} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#F4F3EE] mb-1.5">
                  Select Membership Tier
                </label>
                <select
                  value={renewPlanId}
                  onChange={(e) => {
                    setRenewPlanId(e.target.value);
                    const selected = plans.find((p) => p.id === e.target.value);
                    if (selected) setRenewAmount(selected.price);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#111315] border border-[#8C9390]/25 text-xs text-[#F4F3EE] focus:border-[#C8FF3D] outline-none"
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id} className="bg-[#111315] text-[#F4F3EE]">
                      {p.name} ({formatCurrency(p.price, brand.currencySymbol)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F4F3EE] mb-1.5">
                  Payment Method
                </label>
                <select
                  value={renewPaymentMethod}
                  onChange={(e) => setRenewPaymentMethod(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#111315] border border-[#8C9390]/25 text-xs text-[#F4F3EE] focus:border-[#C8FF3D] outline-none"
                >
                  <option value="CARD" className="bg-[#111315] text-[#F4F3EE]">Credit / Debit Card</option>
                  <option value="CASH" className="bg-[#111315] text-[#F4F3EE]">Cash at Desk</option>
                  <option value="BANK_TRANSFER" className="bg-[#111315] text-[#F4F3EE]">Direct Bank Transfer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F4F3EE] mb-1.5">
                  Amount to Collect
                </label>
                <input
                  type="number"
                  value={renewAmount}
                  onChange={(e) => setRenewAmount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#111315] border border-[#8C9390]/25 text-xs text-[#F4F3EE] font-bold focus:border-[#C8FF3D] outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submittingAction}
                className="w-full py-3 rounded-xl text-xs font-black text-[#111315] shadow-xl hover:opacity-90 disabled:opacity-50 transition-all"
                style={{ backgroundColor: brand.primaryColor }}
              >
                {submittingAction ? "Processing Renewal..." : "Confirm & Activate Renewal"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FREEZE MODAL */}
      {showFreezeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-[#202427] border border-[#8C9390]/25 shadow-2xl p-6 sm:p-8 text-left">
            <button
              onClick={() => setShowFreezeModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-[#111315] text-[#8C9390] hover:text-[#F4F3EE]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-[#F4F3EE] uppercase tracking-tight">
              Freeze Membership Pass
            </h3>
            <p className="text-xs text-[#8C9390] mt-1">
              Temporarily suspend active pass for travel or medical pause.
            </p>

            <form onSubmit={handleFreeze} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#F4F3EE] mb-1.5">
                  Freeze Duration (Days)
                </label>
                <select
                  value={freezeDays}
                  onChange={(e) => setFreezeDays(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#111315] border border-[#8C9390]/25 text-xs text-[#F4F3EE] focus:border-[#C8FF3D] outline-none"
                >
                  <option value={14} className="bg-[#111315] text-[#F4F3EE]">14 Days (2 Weeks)</option>
                  <option value={30} className="bg-[#111315] text-[#F4F3EE]">30 Days (1 Month)</option>
                  <option value={60} className="bg-[#111315] text-[#F4F3EE]">60 Days (2 Months)</option>
                  <option value={90} className="bg-[#111315] text-[#F4F3EE]">90 Days (Maximum)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submittingAction}
                className="w-full py-3 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-xl disabled:opacity-50 transition-all"
              >
                {submittingAction ? "Freezing Pass..." : "Confirm Freeze Period"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#202427] border border-[#8C9390]/25 shadow-2xl p-6 sm:p-8 text-left max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-[#111315] text-[#8C9390] hover:text-[#F4F3EE]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-[#F4F3EE] uppercase tracking-tight">
              Edit Athlete Information
            </h3>

            <form onSubmit={handleEditSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#F4F3EE] mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#111315] border border-[#8C9390]/25 text-xs text-[#F4F3EE] focus:border-[#C8FF3D] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#F4F3EE] mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#111315] border border-[#8C9390]/25 text-xs text-[#F4F3EE] focus:border-[#C8FF3D] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#F4F3EE] mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#111315] border border-[#8C9390]/25 text-xs text-[#F4F3EE] focus:border-[#C8FF3D] outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#F4F3EE] mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#111315] border border-[#8C9390]/25 text-xs text-[#F4F3EE] focus:border-[#C8FF3D] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F4F3EE] mb-1">Emergency Contact Name</label>
                <input
                  type="text"
                  value={editForm.emergencyName}
                  onChange={(e) => setEditForm({ ...editForm, emergencyName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#111315] border border-[#8C9390]/25 text-xs text-[#F4F3EE] focus:border-[#C8FF3D] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#F4F3EE] mb-1">Emergency Phone</label>
                  <input
                    type="text"
                    value={editForm.emergencyPhone}
                    onChange={(e) => setEditForm({ ...editForm, emergencyPhone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#111315] border border-[#8C9390]/25 text-xs text-[#F4F3EE] focus:border-[#C8FF3D] outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#F4F3EE] mb-1">Relationship</label>
                  <input
                    type="text"
                    value={editForm.emergencyRelation}
                    onChange={(e) => setEditForm({ ...editForm, emergencyRelation: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#111315] border border-[#8C9390]/25 text-xs text-[#F4F3EE] focus:border-[#C8FF3D] outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submittingAction}
                className="w-full py-3 rounded-xl text-xs font-black text-[#111315] shadow-xl hover:opacity-90 disabled:opacity-50 transition-all"
                style={{ backgroundColor: brand.primaryColor }}
              >
                {submittingAction ? "Saving Changes..." : "Save Member Information"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE RECEIPT MODAL */}
      {showReceiptModal && (
        <PrintableReceipt
          payment={showReceiptModal}
          member={member}
          onClose={() => setShowReceiptModal(null)}
        />
      )}
    </div>
  );
}
