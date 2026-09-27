"use client";

import React, { useState, useEffect } from "react";
import { useBrand } from "@/lib/brand-context";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Dumbbell,
  Users,
  Plus,
  CheckCircle,
  AlertCircle,
  Calendar,
  Clock,
  Phone,
  Mail,
  UserCheck,
  Zap,
  TrendingUp,
  X,
  RefreshCw,
  Award,
  Edit2,
  Trash2,
  UserPlus,
} from "lucide-react";

export default function TrainersPage() {
  const { brand } = useBrand();

  const [trainers, setTrainers] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDebitModal, setShowDebitModal] = useState<any>(null);
  const [showAddTrainerModal, setShowAddTrainerModal] = useState(false);
  const [showEditTrainerModal, setShowEditTrainerModal] = useState<any>(null);
  const [workoutNotes, setWorkoutNotes] = useState("");
  const [debiting, setDebiting] = useState(false);
  const [submittingTrainer, setSubmittingTrainer] = useState(false);

  // New Trainer Form
  const [newTrainerForm, setNewTrainerForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "TRAINER",
  });

  // Assign Form
  const [assignForm, setAssignForm] = useState({
    trainerId: "",
    memberId: "",
    sessionsTotal: 10,
    notes: "Strength & Hypertrophy Program",
  });

  const loadData = async () => {
    try {
      const [trRes, memRes] = await Promise.all([
        fetch("/api/trainers"),
        fetch("/api/members"),
      ]);

      if (trRes.ok) {
        const trData = await trRes.json();
        setTrainers(trData);
        if (trData.length > 0) {
          setAssignForm((prev) => ({ ...prev, trainerId: trData[0].id }));
        }
      }
      if (memRes.ok) {
        const memData = await memRes.json();
        setMembers(memData);
        if (memData.length > 0) {
          setAssignForm((prev) => ({ ...prev, memberId: memData[0].id }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTrainer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingTrainer(true);
    try {
      const res = await fetch("/api/trainers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "CREATE_TRAINER", ...newTrainerForm }),
      });
      if (res.ok) {
        setShowAddTrainerModal(false);
        setNewTrainerForm({ name: "", email: "", phone: "", role: "TRAINER" });
        loadData();
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to add trainer.");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding trainer.");
    } finally {
      setSubmittingTrainer(false);
    }
  };

  const handleEditTrainer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditTrainerModal) return;
    setSubmittingTrainer(true);
    try {
      const res = await fetch(`/api/trainers/${showEditTrainerModal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(showEditTrainerModal),
      });
      if (res.ok) {
        setShowEditTrainerModal(null);
        loadData();
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to update trainer.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating trainer.");
    } finally {
      setSubmittingTrainer(false);
    }
  };

  const handleDeleteTrainer = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from coaches? This will also unassign active client packages.`)) return;
    try {
      const res = await fetch(`/api/trainers/${id}`, { method: "DELETE" });
      if (res.ok) {
        loadData();
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to delete trainer.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting trainer.");
    }
  };

  const handleAssignClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/trainers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assignForm),
      });
      if (res.ok) {
        setShowAssignModal(false);
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDebitSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showDebitModal) return;
    setDebiting(true);

    try {
      const res = await fetch("/api/trainers/debit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: showDebitModal.id,
          workoutNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to debit session.");
      } else {
        setShowDebitModal(null);
        setWorkoutNotes("");
        loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDebiting(false);
    }
  };

  // Collect all assigned clients across trainers
  const allClients: any[] = [];
  trainers.forEach((t) => {
    t.trainers?.forEach((c: any) => {
      allClients.push({ ...c, trainerName: t.name, trainerEmail: t.email });
    });
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Dumbbell className="w-6 h-6" style={{ color: brand.primaryColor }} />
            Personal Trainer Hub & Client Session Tracker
          </h1>
          <p className="text-xs text-[#8C9390] mt-1">
            Manage certified coaching staff, track PT session pack balances, and log completed client workouts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddTrainerModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black text-[#111315] shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            style={{ backgroundColor: brand.primaryColor }}
          >
            <UserPlus className="w-4 h-4 text-[#111315]" />
            <span>Add Trainer</span>
          </button>

          <button
            onClick={() => setShowAssignModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-[#F4F3EE] bg-[#202427] border border-[#8C9390]/30 shadow-lg transition-colors hover:border-[#C8FF3D]/50 hover:bg-[#111315] cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#C8FF3D]" />
            <span>Assign PT Client Pack</span>
          </button>
        </div>
      </div>

      {/* Trainers Directory Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainers.map((t) => {
          const clientCount = t.trainers?.length || 0;
          return (
            <div
              key={t.id}
              className="p-6 rounded-3xl bg-[#202427] border border-[#8C9390]/25 shadow-xl flex flex-col justify-between hover:border-[#C8FF3D]/50 transition-all duration-300 relative group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base text-[#111315] shadow-md flex-shrink-0"
                      style={{ backgroundColor: brand.primaryColor }}
                    >
                      {t.name[0]}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#F4F3EE]">{t.name}</h3>
                      <p className="text-xs text-[#8C9390]">{t.role} &bull; {t.phone || "+1 (555) 018-9922"}</p>
                      <p className="text-[11px] text-[#8C9390]/70 truncate max-w-[180px]">{t.email}</p>
                    </div>
                  </div>

                  {/* Edit and Remove Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setShowEditTrainerModal(t)}
                      className="p-1.5 rounded-lg text-[#8C9390] hover:text-[#C8FF3D] hover:bg-[#111315] transition-colors cursor-pointer"
                      title="Edit Coach Details"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTrainer(t.id, t.name)}
                      className="p-1.5 rounded-lg text-[#8C9390] hover:text-rose-400 hover:bg-[#111315] transition-colors cursor-pointer"
                      title="Remove Coach"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-xs pt-4 border-t border-[#8C9390]/20">
                  <div className="p-3 rounded-2xl bg-[#111315] border border-[#8C9390]/20">
                    <span className="text-[#8C9390] text-[10px] uppercase font-semibold">Active Clients</span>
                    <p className="text-base font-bold text-[#F4F3EE] mt-0.5">{clientCount}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#111315] border border-[#8C9390]/20">
                    <span className="text-[#8C9390] text-[10px] uppercase font-semibold">Commission Rate</span>
                    <p className="text-base font-bold text-emerald-400 mt-0.5">
                      {brand.currencySymbol}35.00 <span className="text-[10px] text-[#8C9390] font-normal">/ sess</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Personal Training Client Roster Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#F4F3EE] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#C8FF3D]" />
            Active Personal Training Client Packages ({allClients.length})
          </h2>
        </div>

        <div className="rounded-3xl bg-[#202427] border border-[#8C9390]/25 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#111315]/80 border-b border-[#8C9390]/25 text-[11px] font-semibold text-[#8C9390] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Member</th>
                  <th className="py-3.5 px-4">Assigned Coach</th>
                  <th className="py-3.5 px-4">Sessions Remaining</th>
                  <th className="py-3.5 px-4">Program Notes</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#8C9390]/15">
                {allClients.map((client) => {
                  const isLow = client.sessionsRemaining <= 2;
                  return (
                    <tr key={client.id} className="hover:bg-[#111315]/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-[#F4F3EE]">
                          {client.member.firstName} {client.member.lastName}
                        </p>
                        <p className="text-[10px] text-[#8C9390] font-mono">
                          ID: {client.member.memberCode} &bull; {client.member.phone}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-[#F4F3EE]/80">
                        {client.trainerName}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-mono font-bold ${
                                isLow ? "text-amber-400" : "text-[#C8FF3D]"
                              }`}
                            >
                              {client.sessionsRemaining} of {client.sessionsTotal} remaining
                            </span>
                            {isLow && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-400">
                                Low
                              </span>
                            )}
                          </div>
                          <div className="w-36 h-1.5 bg-[#111315] rounded-full overflow-hidden border border-[#8C9390]/20">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${(client.sessionsRemaining / client.sessionsTotal) * 100}%`,
                                backgroundColor: isLow ? "#f59e0b" : "#C8FF3D",
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-[#8C9390] max-w-xs truncate">
                        {client.notes || "Standard PT Pack"}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setShowDebitModal(client)}
                          disabled={client.sessionsRemaining <= 0}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black text-[#111315] transition-opacity hover:opacity-90 disabled:opacity-30 shadow"
                          style={{ backgroundColor: brand.primaryColor }}
                        >
                          <Zap className="w-3.5 h-3.5 text-[#111315]" />
                          <span>Debit 1 Session</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {allClients.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-[#8C9390]">
                      No personal training clients assigned yet. Click "Assign PT Client Pack" to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* DEBIT SESSION MODAL */}
      {showDebitModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#202427] border border-[#8C9390]/25 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#8C9390]/20">
              <div>
                <h3 className="text-sm font-bold text-[#F4F3EE] flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#C8FF3D]" />
                  Log Completed PT Session
                </h3>
                <p className="text-[11px] text-[#8C9390] mt-0.5">
                  Client: {showDebitModal.member.firstName} {showDebitModal.member.lastName} &bull; Balance: {showDebitModal.sessionsRemaining} left
                </p>
              </div>
              <button
                onClick={() => setShowDebitModal(null)}
                className="text-[#8C9390] hover:text-[#F4F3EE]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDebitSession} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#F4F3EE] font-semibold mb-1">
                  Workout Summary & Coaching Notes
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Completed heavy leg day: Squats 4x8 @ 100kg, RDLs 3x10, Core circuit."
                  value={workoutNotes}
                  onChange={(e) => setWorkoutNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/30 rounded-xl text-[#F4F3EE] focus:border-[#C8FF3D] outline-none placeholder-[#8C9390]/50"
                />
              </div>

              <div className="p-3 rounded-2xl bg-[#111315] border border-[#8C9390]/20 text-[11px] text-[#8C9390] space-y-1">
                <p>
                  Debiting will deduct <strong>1 session credit</strong> and update client history.
                </p>
                <p className="text-[#C8FF3D] font-medium">
                  Trainer commission earned: {brand.currencySymbol}35.00
                </p>
              </div>

              <div className="pt-3 border-t border-[#8C9390]/20 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDebitModal(null)}
                  className="px-4 py-2 rounded-xl bg-[#111315] border border-[#8C9390]/25 text-[#F4F3EE] hover:bg-[#202427]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={debiting}
                  className="px-5 py-2 rounded-xl text-[#111315] font-black"
                  style={{ backgroundColor: brand.primaryColor }}
                >
                  {debiting ? "Logging..." : "Confirm Workout & Debit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN PT CLIENT MODAL */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#202427] border border-[#8C9390]/25 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#8C9390]/20">
              <h3 className="text-sm font-bold text-[#F4F3EE] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#C8FF3D]" />
                Assign Personal Training Package
              </h3>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-[#8C9390] hover:text-[#F4F3EE]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAssignClient} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#F4F3EE] font-semibold mb-1">Select Coach</label>
                <select
                  value={assignForm.trainerId}
                  onChange={(e) => setAssignForm({ ...assignForm, trainerId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/30 rounded-xl text-[#F4F3EE] focus:border-[#C8FF3D] outline-none"
                >
                  {trainers.map((t) => (
                    <option key={t.id} value={t.id} className="bg-[#111315] text-[#F4F3EE]">
                      {t.name} ({t.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#F4F3EE] font-semibold mb-1">Select Member</label>
                <select
                  value={assignForm.memberId}
                  onChange={(e) => setAssignForm({ ...assignForm, memberId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/30 rounded-xl text-[#F4F3EE] focus:border-[#C8FF3D] outline-none"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id} className="bg-[#111315] text-[#F4F3EE]">
                      {m.firstName} {m.lastName} ({m.memberCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#F4F3EE] font-semibold mb-1">Total Sessions Purchased</label>
                <select
                  value={assignForm.sessionsTotal}
                  onChange={(e) => setAssignForm({ ...assignForm, sessionsTotal: parseInt(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/30 rounded-xl text-[#F4F3EE] focus:border-[#C8FF3D] outline-none"
                >
                  <option value={5} className="bg-[#111315] text-[#F4F3EE]">5 Sessions Pack</option>
                  <option value={10} className="bg-[#111315] text-[#F4F3EE]">10 Sessions Pack (Standard)</option>
                  <option value={20} className="bg-[#111315] text-[#F4F3EE]">20 Sessions Pack (Transformation)</option>
                  <option value={30} className="bg-[#111315] text-[#F4F3EE]">30 Sessions Pack (Athlete Tier)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#F4F3EE] font-semibold mb-1">Training Focus / Notes</label>
                <input
                  type="text"
                  value={assignForm.notes}
                  onChange={(e) => setAssignForm({ ...assignForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/30 rounded-xl text-[#F4F3EE] focus:border-[#C8FF3D] outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#8C9390]/20 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#111315] border border-[#8C9390]/25 text-[#F4F3EE] hover:bg-[#202427]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-[#111315] font-black"
                  style={{ backgroundColor: brand.primaryColor }}
                >
                  Assign Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD NEW TRAINER MODAL */}
      {showAddTrainerModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#202427] border border-[#8C9390]/25 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#8C9390]/20">
              <h3 className="text-sm font-bold text-[#F4F3EE] flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#C8FF3D]" />
                Add Certified Coach / Trainer
              </h3>
              <button
                onClick={() => setShowAddTrainerModal(false)}
                className="text-[#8C9390] hover:text-[#F4F3EE]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTrainer} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#F4F3EE] font-semibold mb-1">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marcus Vance"
                  value={newTrainerForm.name}
                  onChange={(e) => setNewTrainerForm({ ...newTrainerForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/30 rounded-xl text-[#F4F3EE] focus:border-[#C8FF3D] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#F4F3EE] font-semibold mb-1">
                  Email Address <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. marcus@pulsegym.com"
                  value={newTrainerForm.email}
                  onChange={(e) => setNewTrainerForm({ ...newTrainerForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/30 rounded-xl text-[#F4F3EE] focus:border-[#C8FF3D] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#F4F3EE] font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="e.g. +1 (555) 392-1084"
                  value={newTrainerForm.phone}
                  onChange={(e) => setNewTrainerForm({ ...newTrainerForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/30 rounded-xl text-[#F4F3EE] focus:border-[#C8FF3D] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#F4F3EE] font-semibold mb-1">Role / Specialization</label>
                <select
                  value={newTrainerForm.role}
                  onChange={(e) => setNewTrainerForm({ ...newTrainerForm, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/30 rounded-xl text-[#F4F3EE] focus:border-[#C8FF3D] outline-none"
                >
                  <option value="TRAINER" className="bg-[#111315] text-[#F4F3EE]">Trainer / Personal Coach</option>
                  <option value="MANAGER" className="bg-[#111315] text-[#F4F3EE]">Head Coach / Manager</option>
                  <option value="OWNER" className="bg-[#111315] text-[#F4F3EE]">Director / Owner</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#8C9390]/20 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTrainerModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#111315] border border-[#8C9390]/25 text-[#F4F3EE] hover:bg-[#202427]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingTrainer}
                  className="px-5 py-2 rounded-xl text-[#111315] font-black disabled:opacity-40"
                  style={{ backgroundColor: brand.primaryColor }}
                >
                  {submittingTrainer ? "Saving..." : "Add Coach"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TRAINER MODAL */}
      {showEditTrainerModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#202427] border border-[#8C9390]/25 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#8C9390]/20">
              <h3 className="text-sm font-bold text-[#F4F3EE] flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#C8FF3D]" />
                Edit Coach Profile
              </h3>
              <button
                onClick={() => setShowEditTrainerModal(null)}
                className="text-[#8C9390] hover:text-[#F4F3EE]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditTrainer} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#F4F3EE] font-semibold mb-1">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={showEditTrainerModal.name}
                  onChange={(e) =>
                    setShowEditTrainerModal({ ...showEditTrainerModal, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/30 rounded-xl text-[#F4F3EE] focus:border-[#C8FF3D] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#F4F3EE] font-semibold mb-1">
                  Email Address <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={showEditTrainerModal.email}
                  onChange={(e) =>
                    setShowEditTrainerModal({ ...showEditTrainerModal, email: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/30 rounded-xl text-[#F4F3EE] focus:border-[#C8FF3D] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#F4F3EE] font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  value={showEditTrainerModal.phone || ""}
                  onChange={(e) =>
                    setShowEditTrainerModal({ ...showEditTrainerModal, phone: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/30 rounded-xl text-[#F4F3EE] focus:border-[#C8FF3D] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#F4F3EE] font-semibold mb-1">Role / Position</label>
                <select
                  value={showEditTrainerModal.role}
                  onChange={(e) =>
                    setShowEditTrainerModal({ ...showEditTrainerModal, role: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/30 rounded-xl text-[#F4F3EE] focus:border-[#C8FF3D] outline-none"
                >
                  <option value="TRAINER" className="bg-[#111315] text-[#F4F3EE]">Trainer / Personal Coach</option>
                  <option value="MANAGER" className="bg-[#111315] text-[#F4F3EE]">Head Coach / Manager</option>
                  <option value="OWNER" className="bg-[#111315] text-[#F4F3EE]">Director / Owner</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#8C9390]/20 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditTrainerModal(null)}
                  className="px-4 py-2 rounded-xl bg-[#111315] border border-[#8C9390]/25 text-[#F4F3EE] hover:bg-[#202427]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingTrainer}
                  className="px-5 py-2 rounded-xl text-[#111315] font-black disabled:opacity-40"
                  style={{ backgroundColor: brand.primaryColor }}
                >
                  {submittingTrainer ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
