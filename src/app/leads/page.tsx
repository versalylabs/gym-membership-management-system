"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBrand } from "@/lib/brand-context";
import { formatDate } from "@/lib/utils";
import {
  TrendingUp,
  Plus,
  Phone,
  Mail,
  UserCheck,
  Calendar,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Edit2,
  Trash2,
  CheckCircle,
  X,
  UserPlus,
  MessageSquare,
} from "lucide-react";

export default function LeadsPage() {
  const router = useRouter();
  const { brand } = useBrand();

  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<any>(null);

  // Add Lead Form State
  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    phone: "",
    status: "NEW_INQUIRY",
    source: "WALK_IN",
    interest: "General Gym Access",
    notes: "",
    trialDate: "",
  });

  const loadLeads = async () => {
    try {
      const res = await fetch("/api/leads");
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLead),
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewLead({
          name: "",
          email: "",
          phone: "",
          status: "NEW_INQUIRY",
          source: "WALK_IN",
          interest: "General Gym Access",
          notes: "",
          trialDate: "",
        });
        loadLeads();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStage = async (leadId: string, newStage: string) => {
    try {
      await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStage }),
      });
      loadLeads();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditModal) return;
    try {
      await fetch(`/api/leads/${showEditModal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(showEditModal),
      });
      setShowEditModal(null);
      loadLeads();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm("Are you sure you want to remove this lead?")) return;
    try {
      await fetch(`/api/leads/${leadId}`, { method: "DELETE" });
      loadLeads();
    } catch (err) {
      console.error(err);
    }
  };

  const handleConvertToMember = async (lead: any) => {
    // Transition status to WON
    await handleUpdateStage(lead.id, "WON");
    // Redirect to onboarding wizard
    const names = lead.name.split(" ");
    const firstName = names[0] || "";
    const lastName = names.slice(1).join(" ") || "Member";
    router.push(
      `/members/new?firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}&email=${encodeURIComponent(lead.email || "")}&phone=${encodeURIComponent(lead.phone || "")}&goals=${encodeURIComponent(lead.interest || "")}`
    );
  };

  const columns = [
    { id: "NEW_INQUIRY", title: "New Inquiries", color: "#3b82f6" },
    { id: "TRIAL_BOOKED", title: "Trial Scheduled", color: "#f59e0b" },
    { id: "TRIAL_COMPLETED", title: "Trial Completed", color: "#8b5cf6" },
    { id: "WON", title: "Converted to Member", color: "#10b981" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F4F3EE] tracking-tight flex items-center gap-2.5">
            <TrendingUp className="w-6 h-6" style={{ color: brand.primaryColor }} />
            Sales & Leads CRM Pipeline (Kanban)
          </h1>
          <p className="text-xs text-[#8C9390] mt-1">
            Track walk-in inquiries, scheduled trial workouts, and convert leads into paying members.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black text-[#111315] shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
          style={{ backgroundColor: brand.primaryColor }}
        >
          <Plus className="w-4 h-4 text-[#111315]" />
          <span>Add New Prospect</span>
        </button>
      </div>

      {/* Kanban Pipeline Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col, cIdx) => {
          const colLeads = leads.filter((l) => l.status === col.id);
          return (
            <div
              key={col.id}
              className="rounded-3xl bg-[#202427] border border-[#8C9390]/25 p-4 flex flex-col min-h-[260px] h-auto lg:h-[650px] shadow-xl"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#8C9390]/20 mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: col.color }}
                  />
                  <h3 className="text-xs font-bold text-[#F4F3EE] uppercase tracking-wide">
                    {col.title}
                  </h3>
                </div>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#111315] border border-[#8C9390]/25 text-[#8C9390]">
                  {colLeads.length}
                </span>
              </div>

              {/* Cards Stream */}
              <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                {colLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-4 rounded-2xl bg-[#111315] border border-[#8C9390]/20 hover:border-[#C8FF3D]/50 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-[#F4F3EE] leading-tight">
                          {lead.name}
                        </h4>
                        <span className="text-[10px] text-[#8C9390] font-mono">
                          {lead.phone}
                        </span>
                      </div>
                      <button
                        onClick={() => setShowEditModal(lead)}
                        className="p-1 rounded-lg text-[#8C9390] hover:text-[#F4F3EE]"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-[#8C9390]">
                      <span className="px-2 py-0.5 rounded-md bg-[#202427] text-[#F4F3EE] border border-[#8C9390]/20">
                        {lead.interest || "General"}
                      </span>
                      <span>{lead.source}</span>
                    </div>

                    {lead.notes && (
                      <p className="text-[11px] text-[#8C9390] bg-[#202427]/60 border border-[#8C9390]/15 p-2 rounded-xl italic">
                        "{lead.notes}"
                      </p>
                    )}

                    <div className="flex items-center justify-between gap-1 pt-2 border-t border-[#8C9390]/15">
                      {cIdx > 0 && (
                        <button
                          onClick={() => handleUpdateStage(lead.id, columns[cIdx - 1].id)}
                          className="p-1.5 rounded-lg bg-[#202427] hover:bg-[#111315] border border-[#8C9390]/20 text-[#8C9390] hover:text-[#F4F3EE] text-[10px] flex items-center gap-1"
                          title="Move Back"
                        >
                          <ArrowLeft className="w-3 h-3" />
                        </button>
                      )}

                      {col.id === "TRIAL_COMPLETED" ? (
                        <button
                          onClick={() => handleConvertToMember(lead)}
                          className="flex-1 py-1.5 rounded-lg text-[#111315] font-black text-[10px] shadow flex items-center justify-center gap-1"
                          style={{ backgroundColor: brand.primaryColor }}
                        >
                          <UserPlus className="w-3 h-3 text-[#111315]" />
                          <span>Convert to Member</span>
                        </button>
                      ) : cIdx < columns.length - 1 ? (
                        <button
                          onClick={() => handleUpdateStage(lead.id, columns[cIdx + 1].id)}
                          className="flex-1 py-1.5 rounded-lg bg-[#202427] hover:bg-[#111315] border border-[#8C9390]/20 text-[#F4F3EE] text-[10px] font-semibold flex items-center justify-center gap-1"
                        >
                          <span>Advance</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <span className="text-[10px] font-semibold text-[#C8FF3D] flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Enrolled
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {colLeads.length === 0 && (
                  <div className="h-40 flex items-center justify-center text-center text-xs text-[#8C9390]/60">
                    No prospects in this stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD LEAD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#202427] border border-[#8C9390]/25 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#8C9390]/20">
              <h3 className="text-sm font-bold text-[#F4F3EE] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#C8FF3D]" />
                Add New Sales Lead
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#8C9390] hover:text-[#F4F3EE]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#F4F3EE] font-semibold mb-1">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Wick"
                  value={newLead.name}
                  onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-[#F4F3EE] focus:border-[#C8FF3D] outline-none placeholder-[#8C9390]/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#F4F3EE] font-semibold mb-1">
                    Phone <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+254 712 345 678"
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-[#F4F3EE] focus:border-[#C8FF3D] outline-none placeholder-[#8C9390]/50 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#F4F3EE] font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-[#F4F3EE] focus:border-[#C8FF3D] outline-none placeholder-[#8C9390]/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#F4F3EE] font-semibold mb-1">Lead Source</label>
                  <select
                    value={newLead.source}
                    onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-[#F4F3EE] focus:border-[#C8FF3D] outline-none"
                  >
                    <option value="WALK_IN" className="bg-[#111315] text-[#F4F3EE]">Walk-In Guest</option>
                    <option value="INSTAGRAM" className="bg-[#111315] text-[#F4F3EE]">Instagram / Social</option>
                    <option value="WEBSITE" className="bg-[#111315] text-[#F4F3EE]">Website Form</option>
                    <option value="REFERRAL" className="bg-[#111315] text-[#F4F3EE]">Member Referral</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#F4F3EE] font-semibold mb-1">Interest</label>
                  <input
                    type="text"
                    placeholder="e.g. Personal Training"
                    value={newLead.interest}
                    onChange={(e) => setNewLead({ ...newLead, interest: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-[#F4F3EE] focus:border-[#C8FF3D] outline-none placeholder-[#8C9390]/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#F4F3EE] font-semibold mb-1">Notes & Follow-up</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Came in for lunch trial, interested in 6am classes."
                  value={newLead.notes}
                  onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-[#F4F3EE] focus:border-[#C8FF3D] outline-none placeholder-[#8C9390]/50"
                />
              </div>

              <div className="pt-3 border-t border-[#8C9390]/20 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#111315] border border-[#8C9390]/25 text-[#F4F3EE] hover:bg-[#202427]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-[#111315] font-black"
                  style={{ backgroundColor: brand.primaryColor }}
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT LEAD MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#202427] border border-[#8C9390]/25 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#8C9390]/20">
              <h3 className="text-sm font-bold text-[#F4F3EE] flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#C8FF3D]" />
                Edit Lead & Notes
              </h3>
              <button
                onClick={() => setShowEditModal(null)}
                className="text-[#8C9390] hover:text-[#F4F3EE]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditLead} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#F4F3EE] font-semibold mb-1">Name</label>
                <input
                  type="text"
                  value={showEditModal.name}
                  onChange={(e) => setShowEditModal({ ...showEditModal, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-[#F4F3EE] focus:border-[#C8FF3D] outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#F4F3EE] font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    value={showEditModal.phone}
                    onChange={(e) => setShowEditModal({ ...showEditModal, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-[#F4F3EE] focus:border-[#C8FF3D] outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#F4F3EE] font-semibold mb-1">Email</label>
                  <input
                    type="text"
                    value={showEditModal.email || ""}
                    onChange={(e) => setShowEditModal({ ...showEditModal, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-[#F4F3EE] focus:border-[#C8FF3D] outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[#F4F3EE] font-semibold mb-1">Notes</label>
                <textarea
                  rows={3}
                  value={showEditModal.notes || ""}
                  onChange={(e) => setShowEditModal({ ...showEditModal, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-[#F4F3EE] focus:border-[#C8FF3D] outline-none"
                />
              </div>
              <div className="pt-3 border-t border-[#8C9390]/20 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(null)}
                  className="px-4 py-2 rounded-xl bg-[#111315] border border-[#8C9390]/25 text-[#F4F3EE] hover:bg-[#202427]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-[#111315] font-black"
                  style={{ backgroundColor: brand.primaryColor }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
