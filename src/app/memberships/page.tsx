"use client";

import React, { useState, useEffect } from "react";
import { useBrand } from "@/lib/brand-context";
import { formatCurrency } from "@/lib/utils";
import {
  CreditCard,
  Plus,
  Check,
  Zap,
  Calendar,
  Layers,
  Sparkles,
  Edit2,
  Trash2,
  Users,
  X,
  RefreshCw,
  UserCheck,
  CheckCircle,
} from "lucide-react";

export default function MembershipsPage() {
  const { brand } = useBrand();
  const [plans, setPlans] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<any>(null);
  const [showAssignModal, setShowAssignModal] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  // Plan Form State
  const [planForm, setPlanForm] = useState({
    name: "",
    description: "",
    durationMonths: 1,
    durationDays: 30,
    price: 49.99,
    signupFee: 0.0,
    sessionLimit: "",
    isGroupClass: true,
    isPersonalTraining: false,
    features: "24/7 Access, Locker Rooms, Free Wi-Fi",
  });

  // Assign Form State
  const [assignMemberId, setAssignMemberId] = useState("");
  const [assignPaymentMethod, setAssignPaymentMethod] = useState("CARD");
  const [assignSuccess, setAssignSuccess] = useState(false);

  const loadPlans = async () => {
    try {
      const res = await fetch("/api/memberships");
      if (res.ok) {
        const data = await res.json();
        setPlans(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMembers = async () => {
    try {
      const res = await fetch("/api/members");
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
        if (data.length > 0) setAssignMemberId(data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadPlans();
    loadMembers();
  }, []);

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/memberships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(planForm),
      });
      if (res.ok) {
        setShowCreateModal(false);
        setPlanForm({
          name: "",
          description: "",
          durationMonths: 1,
          durationDays: 30,
          price: 49.99,
          signupFee: 0.0,
          sessionLimit: "",
          isGroupClass: true,
          isPersonalTraining: false,
          features: "24/7 Access, Locker Rooms, Free Wi-Fi",
        });
        loadPlans();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditModal) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/memberships/${showEditModal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(showEditModal),
      });
      if (res.ok) {
        setShowEditModal(null);
        loadPlans();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePlan = async (id: string, name?: string) => {
    if (!confirm(`Are you sure you want to remove '${name || "this plan"}'? If active members are currently subscribed, it will be safely archived/deactivated.`)) return;
    try {
      const res = await fetch(`/api/memberships/${id}`, { method: "DELETE" });
      if (res.ok) {
        loadPlans();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to remove plan.");
      }
    } catch (err) {
      console.error(err);
      alert("Error removing plan.");
    }
  };

  const handleAssignPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAssignModal || !assignMemberId) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/members/${assignMemberId}/renew`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: showAssignModal.id,
          paymentMethod: assignPaymentMethod,
          amountPaid: showAssignModal.price,
        }),
      });
      if (res.ok) {
        setAssignSuccess(true);
        setTimeout(() => {
          setAssignSuccess(false);
          setShowAssignModal(null);
          loadPlans();
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#202427] border border-[#8C9390]/30 text-xs text-[#8C9390] mb-2 shadow">
            <CreditCard className="w-3.5 h-3.5 text-[#C8FF3D]" />
            <span>Membership Plans & Tier Engine</span>
          </div>
          <h1 className="text-3xl font-black text-[#F4F3EE] tracking-tight uppercase">
            Membership Plans
          </h1>
          <p className="text-xs text-[#8C9390] mt-1">
            Build duration subscriptions, group class punch cards, and personal training tiers.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider text-[#111315] shadow-xl transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          style={{ backgroundColor: brand.primaryColor }}
        >
          <Plus className="w-4 h-4 text-[#111315]" />
          <span>Create New Tier / Plan</span>
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const featuresList = plan.features ? plan.features.split(",") : [];
          return (
            <div
              key={plan.id}
              className={`p-6 rounded-3xl bg-[#202427] border transition-all flex flex-col justify-between shadow-xl group relative overflow-hidden ${
                plan.isActive ? "border-[#8C9390]/25 hover:border-[#C8FF3D]/60 hover:-translate-y-1" : "border-rose-900/40 opacity-60"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className="px-2.5 py-0.5 rounded-md text-[10px] font-black text-[#111315] uppercase tracking-wider shadow"
                    style={{ backgroundColor: brand.primaryColor }}
                  >
                    {plan.durationMonths === 12
                      ? "Annual Tier"
                      : plan.sessionLimit
                      ? `${plan.sessionLimit} Sessions`
                      : `${plan.durationMonths || 1} Month`}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setShowEditModal({ ...plan })}
                      className="p-1.5 rounded-lg text-[#8C9390] hover:text-[#C8FF3D] hover:bg-[#111315] transition-colors cursor-pointer"
                      title="Edit Plan Tier"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePlan(plan.id, plan.name)}
                      className="p-1.5 rounded-lg text-[#8C9390] hover:text-rose-400 hover:bg-[#111315] transition-colors cursor-pointer"
                      title="Remove / Deactivate Plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-extrabold text-[#F4F3EE] mt-4">
                  {plan.name}
                </h3>
                <p className="text-xs text-[#8C9390] mt-1 line-clamp-2">
                  {plan.description || "Full access to facility features and equipment."}
                </p>

                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-[#F4F3EE]">
                    {formatCurrency(plan.price, brand.currencySymbol)}
                  </span>
                  <span className="text-xs text-[#8C9390]">
                    / {plan.durationMonths === 12 ? "year" : plan.sessionLimit ? "pack" : "mo"}
                  </span>
                </div>

                {/* Features list */}
                <div className="mt-6 pt-4 border-t border-[#8C9390]/20 space-y-2">
                  {featuresList.map((feat: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#F4F3EE]/90">
                      <Check className="w-3.5 h-3.5 text-[#C8FF3D] mt-0.5 flex-shrink-0" />
                      <span>{feat.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#8C9390]/20 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-[#8C9390]">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#8C9390]" />
                    Active Members:
                  </span>
                  <strong className="text-[#F4F3EE]">
                    {plan._count?.subscriptions || 0}
                  </strong>
                </div>

                <button
                  onClick={() => setShowAssignModal(plan)}
                  className="w-full py-2.5 rounded-xl text-xs font-black text-[#111315] transition-transform hover:scale-[1.02] shadow-md active:scale-95 cursor-pointer"
                  style={{ backgroundColor: brand.primaryColor }}
                >
                  Assign to Member
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE PLAN MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#202427] border border-[#8C9390]/30 rounded-3xl p-5 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#8C9390]/20">
              <h3 className="text-base font-bold text-[#F4F3EE] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#C8FF3D]" />
                Create New Membership Plan Tier
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#8C9390] hover:text-[#F4F3EE]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#8C9390] font-semibold mb-1">
                  Plan Tier Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP Platinum Annual"
                  value={planForm.name}
                  onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/30 rounded-xl text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                />
              </div>

              <div>
                <label className="block text-[#8C9390] font-semibold mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Complete access to gym floor, group classes & sauna"
                  value={planForm.description}
                  onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/30 rounded-xl text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8C9390] font-semibold mb-1">
                    Price ({brand.currencySymbol}) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={planForm.price}
                    onChange={(e) => setPlanForm({ ...planForm, price: parseFloat(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/30 rounded-xl text-[#F4F3EE] font-mono font-bold focus:outline-none focus:border-[#C8FF3D]"
                  />
                </div>
                <div>
                  <label className="block text-[#8C9390] font-semibold mb-1">
                    Signup / Admin Fee ({brand.currencySymbol})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={planForm.signupFee}
                    onChange={(e) => setPlanForm({ ...planForm, signupFee: parseFloat(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/30 rounded-xl text-[#F4F3EE] font-mono focus:outline-none focus:border-[#C8FF3D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8C9390] font-semibold mb-1">
                    Duration (Months)
                  </label>
                  <select
                    value={planForm.durationMonths}
                    onChange={(e) => setPlanForm({ ...planForm, durationMonths: parseInt(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/30 rounded-xl text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                  >
                    <option value={1}>1 Month (Monthly)</option>
                    <option value={3}>3 Months (Quarterly)</option>
                    <option value={6}>6 Months (Bi-annual)</option>
                    <option value={12}>12 Months (Annual)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#8C9390] font-semibold mb-1">
                    Session Limit (Punch Card)
                  </label>
                  <input
                    type="number"
                    placeholder="Leave empty for unlimited"
                    value={planForm.sessionLimit}
                    onChange={(e) => setPlanForm({ ...planForm, sessionLimit: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/30 rounded-xl text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#8C9390] font-semibold mb-1">
                  Features & Privileges (Comma Separated)
                </label>
                <textarea
                  rows={2}
                  value={planForm.features}
                  onChange={(e) => setPlanForm({ ...planForm, features: e.target.value })}
                  placeholder="24/7 Access, Unlimited Classes, Sauna, 1 Free PT Session"
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/30 rounded-xl text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                />
              </div>

              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={planForm.isGroupClass}
                    onChange={(e) => setPlanForm({ ...planForm, isGroupClass: e.target.checked })}
                    className="rounded bg-[#111315] border-[#8C9390]/30 text-[#C8FF3D]"
                  />
                  <span className="text-[#8C9390]">Includes Group Classes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={planForm.isPersonalTraining}
                    onChange={(e) => setPlanForm({ ...planForm, isPersonalTraining: e.target.checked })}
                    className="rounded bg-[#111315] border-[#8C9390]/30 text-[#C8FF3D]"
                  />
                  <span className="text-[#8C9390]">Includes Personal Training</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#8C9390]/20 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#111315] hover:bg-[#111315]/80 text-[#8C9390] hover:text-[#F4F3EE] border border-[#8C9390]/30"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl text-[#111315] font-black shadow-lg cursor-pointer"
                  style={{ backgroundColor: brand.primaryColor }}
                >
                  {submitting ? "Saving..." : "Save Plan Tier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PLAN MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#202427] border border-[#8C9390]/30 rounded-3xl p-5 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#8C9390]/20">
              <h3 className="text-base font-bold text-[#F4F3EE] flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-[#C8FF3D]" />
                Edit Membership Plan
              </h3>
              <button
                onClick={() => setShowEditModal(null)}
                className="text-[#8C9390] hover:text-[#F4F3EE]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditPlan} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#8C9390] font-semibold mb-1">Plan Name</label>
                <input
                  type="text"
                  value={showEditModal.name}
                  onChange={(e) => setShowEditModal({ ...showEditModal, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/30 rounded-xl text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8C9390] font-semibold mb-1">Price ({brand.currencySymbol})</label>
                  <input
                    type="number"
                    step="0.01"
                    value={showEditModal.price}
                    onChange={(e) => setShowEditModal({ ...showEditModal, price: parseFloat(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/30 rounded-xl text-[#F4F3EE] font-mono font-bold focus:outline-none focus:border-[#C8FF3D]"
                  />
                </div>
                <div>
                  <label className="block text-[#8C9390] font-semibold mb-1">Duration (Months)</label>
                  <input
                    type="number"
                    value={showEditModal.durationMonths}
                    onChange={(e) => setShowEditModal({ ...showEditModal, durationMonths: parseInt(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/30 rounded-xl text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#8C9390] font-semibold mb-1">Description</label>
                <input
                  type="text"
                  value={showEditModal.description || ""}
                  onChange={(e) => setShowEditModal({ ...showEditModal, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/30 rounded-xl text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                />
              </div>

              <div>
                <label className="block text-[#8C9390] font-semibold mb-1">Features (Comma Separated)</label>
                <textarea
                  rows={2}
                  value={showEditModal.features || ""}
                  onChange={(e) => setShowEditModal({ ...showEditModal, features: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/30 rounded-xl text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(showEditModal.isGroupClass)}
                    onChange={(e) =>
                      setShowEditModal({ ...showEditModal, isGroupClass: e.target.checked })
                    }
                    className="rounded bg-[#111315] border-[#8C9390]/30 text-[#C8FF3D]"
                  />
                  <span className="text-[#8C9390]">Group Classes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(showEditModal.isPersonalTraining)}
                    onChange={(e) =>
                      setShowEditModal({ ...showEditModal, isPersonalTraining: e.target.checked })
                    }
                    className="rounded bg-[#111315] border-[#8C9390]/30 text-[#C8FF3D]"
                  />
                  <span className="text-[#8C9390]">Personal Training</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(showEditModal.isActive)}
                    onChange={(e) =>
                      setShowEditModal({ ...showEditModal, isActive: e.target.checked })
                    }
                    className="rounded bg-[#111315] border-[#8C9390]/30 text-[#C8FF3D]"
                  />
                  <span className={showEditModal.isActive ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                    {showEditModal.isActive ? "Active (Listed)" : "Archived (Hidden)"}
                  </span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#8C9390]/20 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowEditModal(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#111315] hover:bg-[#111315]/80 text-[#8C9390] hover:text-[#F4F3EE] border border-[#8C9390]/30"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl text-[#111315] font-black shadow-lg cursor-pointer"
                  style={{ backgroundColor: brand.primaryColor }}
                >
                  {submitting ? "Updating..." : "Update Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN TO MEMBER MODAL */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#202427] border border-[#8C9390]/30 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#8C9390]/20">
              <div>
                <h3 className="text-sm font-bold text-[#F4F3EE]">
                  Assign "{showAssignModal.name}"
                </h3>
                <p className="text-[11px] text-[#8C9390]">
                  {formatCurrency(showAssignModal.price, brand.currencySymbol)} &bull; {showAssignModal.durationMonths} Month(s)
                </p>
              </div>
              <button
                onClick={() => setShowAssignModal(null)}
                className="text-[#8C9390] hover:text-[#F4F3EE]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {assignSuccess ? (
              <div className="py-6 text-center text-emerald-400 space-y-2">
                <CheckCircle className="w-12 h-12 mx-auto animate-bounce" />
                <p className="text-xs font-bold">Plan successfully assigned & invoiced!</p>
              </div>
            ) : (
              <form onSubmit={handleAssignPlan} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#8C9390] font-semibold mb-1.5">
                    Select Member
                  </label>
                  <select
                    value={assignMemberId}
                    onChange={(e) => setAssignMemberId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/30 rounded-xl text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.firstName} {m.lastName} ({m.memberCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#8C9390] font-semibold mb-1.5">
                    Payment Method
                  </label>
                  <select
                    value={assignPaymentMethod}
                    onChange={(e) => setAssignPaymentMethod(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/30 rounded-xl text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                  >
                    <option value="CARD">Credit / Debit Card</option>
                    <option value="CASH">Cash (Front Desk)</option>
                    <option value="TRANSFER">Bank Transfer</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-[#8C9390]/20 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAssignModal(null)}
                    className="px-4 py-2 rounded-xl bg-[#111315] hover:bg-[#111315]/80 text-[#8C9390] hover:text-[#F4F3EE] border border-[#8C9390]/30"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl text-[#111315] font-black shadow-md cursor-pointer"
                    style={{ backgroundColor: brand.primaryColor }}
                  >
                    {submitting ? "Assigning..." : "Confirm & Bill"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
