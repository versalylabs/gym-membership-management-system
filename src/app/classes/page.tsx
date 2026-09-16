"use client";

import React, { useState, useEffect } from "react";
import { useBrand } from "@/lib/brand-context";
import { formatDate } from "@/lib/utils";
import {
  CalendarDays,
  Plus,
  Clock,
  MapPin,
  User,
  Users,
  CheckCircle,
  X,
  Edit2,
  Trash2,
  Calendar,
  Sparkles,
  UserCheck,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

export default function ClassesPage() {
  const { brand } = useBrand();

  const [classes, setClasses] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState("ALL");
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<any>(null);
  const [showRosterModal, setShowRosterModal] = useState<any>(null);
  const [rosterBookings, setRosterBookings] = useState<any[]>([]);
  const [rosterMemberId, setRosterMemberId] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  // Add Class Form State
  const [classForm, setClassForm] = useState({
    title: "",
    description: "",
    instructorName: "Marcus Vance",
    startTime: "07:00 AM",
    endTime: "08:00 AM",
    daysOfWeek: "MON,WED,FRI",
    capacity: 20,
    room: "Studio A",
    color: "#e11d48",
  });

  const loadClasses = async () => {
    try {
      const res = await fetch("/api/classes");
      if (res.ok) {
        const data = await res.json();
        setClasses(data);
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
        if (data.length > 0) setRosterMemberId(data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadClasses();
    loadMembers();
  }, []);

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(classForm),
      });
      if (res.ok) {
        setShowAddModal(false);
        setClassForm({
          title: "",
          description: "",
          instructorName: "Marcus Vance",
          startTime: "07:00 AM",
          endTime: "08:00 AM",
          daysOfWeek: "MON,WED,FRI",
          capacity: 20,
          room: "Studio A",
          color: "#e11d48",
        });
        loadClasses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditModal) return;
    try {
      const res = await fetch(`/api/classes/${showEditModal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(showEditModal),
      });
      if (res.ok) {
        setShowEditModal(null);
        loadClasses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteClass = async (id: string) => {
    if (!confirm("Are you sure you want to remove this class schedule?")) return;
    try {
      await fetch(`/api/classes/${id}`, { method: "DELETE" });
      loadClasses();
    } catch (err) {
      console.error(err);
    }
  };

  const openRoster = async (c: any) => {
    setShowRosterModal(c);
    try {
      const res = await fetch(`/api/classes/${c.id}/bookings`);
      if (res.ok) {
        setRosterBookings(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showRosterModal || !rosterMemberId) return;
    setBookingLoading(true);

    try {
      const res = await fetch(`/api/classes/${showRosterModal.id}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId: rosterMemberId }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to book member.");
      } else {
        openRoster(showRosterModal);
        loadClasses();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: string) => {
    try {
      await fetch(`/api/classes/${showRosterModal.id}/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      openRoster(showRosterModal);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveBooking = async (bookingId: string) => {
    try {
      await fetch(`/api/classes/${showRosterModal.id}/bookings/${bookingId}`, {
        method: "DELETE",
      });
      openRoster(showRosterModal);
      loadClasses();
    } catch (err) {
      console.error(err);
    }
  };

  const daysList = ["ALL", "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  const filteredClasses = classes.filter((c) => {
    if (selectedDay === "ALL") return true;
    return c.daysOfWeek?.includes(selectedDay);
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#202427] border border-[#8C9390]/30 text-xs text-[#8C9390] mb-2 shadow">
            <CalendarDays className="w-3.5 h-3.5 text-[#C8FF3D]" />
            <span>Group Fitness Operations</span>
          </div>
          <h1 className="text-3xl font-black text-[#F4F3EE] tracking-tight uppercase">
            Classes & Timetable
          </h1>
          <p className="text-xs text-[#8C9390] mt-1">
            Studio room capacity, weekly timetables, coach assignments, and live booking rosters.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider text-[#111315] shadow-xl transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          style={{ backgroundColor: brand.primaryColor }}
        >
          <Plus className="w-4 h-4 text-[#111315]" />
          <span>+ Schedule Class</span>
        </button>
      </div>

      {/* 2. Day Matrix Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {daysList.map((day) => {
          const isSelected = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? "text-[#111315] shadow-lg font-black"
                  : "bg-[#202427] border border-[#8C9390]/25 text-[#8C9390] hover:text-[#F4F3EE]"
              }`}
              style={{
                backgroundColor: isSelected ? brand.primaryColor : undefined,
              }}
            >
              {day === "ALL" ? "All Weekly Sessions" : day}
            </button>
          );
        })}
      </div>

      {/* 3. Class Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((c) => {
          const bookedCount = c.bookings?.length || 0;
          const fillPercentage = Math.min(Math.round((bookedCount / c.capacity) * 100), 100);

          return (
            <div
              key={c.id}
              className="rounded-3xl bg-[#202427] border border-[#8C9390]/25 p-6 flex flex-col justify-between hover:border-[#C8FF3D]/60 hover:-translate-y-1 transition-all duration-300 shadow-xl group relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="px-3 py-1 rounded-lg text-xs font-black text-[#111315] shadow-sm uppercase tracking-wider"
                    style={{ backgroundColor: c.color || brand.primaryColor }}
                  >
                    {c.room || "Studio A"}
                  </span>
                  <span className="text-xs font-bold text-[#F4F3EE] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#C8FF3D]" />
                    {c.startTime} - {c.endTime}
                  </span>
                </div>

                <h3 className="text-base font-black text-[#F4F3EE] group-hover:text-[#C8FF3D] transition-colors">
                  {c.title}
                </h3>
                <p className="text-xs text-[#8C9390] mt-1 line-clamp-2">
                  {c.description || "High-intensity metabolic conditioning and strength session."}
                </p>

                <div className="mt-4 pt-3 border-t border-[#8C9390]/20 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[#8C9390]">
                    <span className="text-[#8C9390]">Coach:</span>
                    <span className="font-bold text-[#F4F3EE]">{c.instructorName}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#8C9390]">
                    <span className="text-[#8C9390]">Days:</span>
                    <span className="font-mono text-[#F4F3EE]">{c.daysOfWeek}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#8C9390]">
                    <span className="text-[#8C9390]">Capacity Load:</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      {bookedCount} / {c.capacity} spots ({fillPercentage}%)
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-[#111315] rounded-full overflow-hidden border border-[#8C9390]/20">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${fillPercentage}%`,
                        backgroundColor:
                          fillPercentage >= 100
                            ? "#ef4444"
                            : fillPercentage >= 75
                            ? "#f59e0b"
                            : brand.primaryColor,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="mt-6 pt-4 border-t border-[#8C9390]/20 flex items-center justify-between gap-2">
                <button
                  onClick={() => openRoster(c)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-black text-[#111315] shadow flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer"
                  style={{ backgroundColor: brand.primaryColor }}
                >
                  <Users className="w-3.5 h-3.5 text-[#111315]" />
                  <span>Roster ({bookedCount})</span>
                </button>

                <button
                  onClick={() => setShowEditModal(c)}
                  className="p-2.5 rounded-xl bg-[#111315] hover:bg-[#111315]/80 text-[#8C9390] hover:text-[#F4F3EE] border border-[#8C9390]/30 transition-colors"
                  title="Edit Class"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDeleteClass(c.id)}
                  className="p-2.5 rounded-xl bg-[#111315] hover:bg-rose-950/40 text-[#8C9390] hover:text-rose-400 border border-[#8C9390]/30 transition-colors"
                  title="Delete Class"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ROSTER MODAL */}
      {showRosterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-3xl bg-[#202427] border border-[#8C9390]/30 shadow-2xl p-6 sm:p-8 text-left max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowRosterModal(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-[#111315] text-[#8C9390] hover:text-[#F4F3EE]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span
                className="px-2.5 py-0.5 rounded-md text-[10px] font-black text-[#111315]"
                style={{ backgroundColor: showRosterModal.color || brand.primaryColor }}
              >
                {showRosterModal.room}
              </span>
              <span className="text-xs text-[#8C9390]">
                {showRosterModal.startTime} - {showRosterModal.endTime}
              </span>
            </div>

            <h3 className="text-2xl font-black text-[#F4F3EE] uppercase tracking-tight">
              Class Roster: {showRosterModal.title}
            </h3>

            {/* Quick Add Member Booking Form */}
            <form onSubmit={handleBookMember} className="mt-5 p-4 rounded-2xl bg-[#111315] border border-[#8C9390]/20 flex items-center gap-3">
              <div className="flex-1">
                <label className="block text-[11px] font-semibold text-[#8C9390] mb-1">
                  Enroll Member in Class
                </label>
                <select
                  value={rosterMemberId}
                  onChange={(e) => setRosterMemberId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#202427] border border-[#8C9390]/30 text-xs text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.firstName} {m.lastName} ({m.memberCode})
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={bookingLoading}
                className="mt-5 px-4 py-2 rounded-xl text-xs font-black text-[#111315] shadow transition-all hover:opacity-90 disabled:opacity-50 cursor-pointer"
                style={{ backgroundColor: brand.primaryColor }}
              >
                {bookingLoading ? "Adding..." : "+ Book Spot"}
              </button>
            </form>

            {/* Roster Table */}
            <div className="mt-6 space-y-2.5">
              <h4 className="text-xs font-bold text-[#8C9390] uppercase tracking-wider">
                Enrolled Athletes ({rosterBookings.length} / {showRosterModal.capacity})
              </h4>

              {rosterBookings.length > 0 ? (
                rosterBookings.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-[#111315] border border-[#8C9390]/20"
                  >
                    <div>
                      <p className="text-xs font-bold text-[#F4F3EE]">
                        {b.member.firstName} {b.member.lastName}
                      </p>
                      <p className="text-[10px] text-[#8C9390] font-mono">
                        {b.member.memberCode} &bull; Booked: {formatDate(b.bookingDate || b.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={b.status}
                        onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                          b.status === "ATTENDED"
                            ? "bg-emerald-950 border-emerald-500 text-emerald-400"
                            : b.status === "CANCELLED"
                            ? "bg-rose-950 border-rose-500 text-rose-400"
                            : "bg-[#202427] border-[#8C9390]/30 text-[#F4F3EE]"
                        }`}
                      >
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="ATTENDED">Attended</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>

                      <button
                        onClick={() => handleRemoveBooking(b.id)}
                        className="p-1.5 text-[#8C9390] hover:text-rose-400"
                        title="Remove Booking"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-[#8C9390]">
                  No athletes enrolled yet in this session.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADD CLASS MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#202427] border border-[#8C9390]/30 shadow-2xl p-6 sm:p-8 text-left max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-[#111315] text-[#8C9390] hover:text-[#F4F3EE]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-[#F4F3EE] uppercase tracking-tight">
              Schedule New Class
            </h3>

            <form onSubmit={handleAddClass} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block text-[#8C9390] font-semibold mb-1">Class Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Morning Dawn HIIT"
                  value={classForm.title}
                  onChange={(e) => setClassForm({ ...classForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#111315] border border-[#8C9390]/30 text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8C9390] font-semibold mb-1">Coach / Instructor</label>
                  <input
                    type="text"
                    required
                    value={classForm.instructorName}
                    onChange={(e) => setClassForm({ ...classForm, instructorName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#111315] border border-[#8C9390]/30 text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                  />
                </div>
                <div>
                  <label className="block text-[#8C9390] font-semibold mb-1">Room / Studio</label>
                  <input
                    type="text"
                    required
                    value={classForm.room}
                    onChange={(e) => setClassForm({ ...classForm, room: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#111315] border border-[#8C9390]/30 text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8C9390] font-semibold mb-1">Start Time</label>
                  <input
                    type="text"
                    required
                    placeholder="07:00 AM"
                    value={classForm.startTime}
                    onChange={(e) => setClassForm({ ...classForm, startTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#111315] border border-[#8C9390]/30 text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                  />
                </div>
                <div>
                  <label className="block text-[#8C9390] font-semibold mb-1">End Time</label>
                  <input
                    type="text"
                    required
                    placeholder="08:00 AM"
                    value={classForm.endTime}
                    onChange={(e) => setClassForm({ ...classForm, endTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#111315] border border-[#8C9390]/30 text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8C9390] font-semibold mb-1">Recurring Days (comma separated)</label>
                  <input
                    type="text"
                    required
                    placeholder="MON,WED,FRI"
                    value={classForm.daysOfWeek}
                    onChange={(e) => setClassForm({ ...classForm, daysOfWeek: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#111315] border border-[#8C9390]/30 text-[#F4F3EE] font-mono focus:outline-none focus:border-[#C8FF3D]"
                  />
                </div>
                <div>
                  <label className="block text-[#8C9390] font-semibold mb-1">Max Capacity (Spots)</label>
                  <input
                    type="number"
                    required
                    value={classForm.capacity}
                    onChange={(e) => setClassForm({ ...classForm, capacity: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#111315] border border-[#8C9390]/30 text-[#F4F3EE] font-bold focus:outline-none focus:border-[#C8FF3D]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl text-xs font-black text-[#111315] shadow-xl hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: brand.primaryColor }}
              >
                Create Class Timetable Entry
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CLASS MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#202427] border border-[#8C9390]/30 shadow-2xl p-6 sm:p-8 text-left">
            <button
              onClick={() => setShowEditModal(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-[#111315] text-[#8C9390] hover:text-[#F4F3EE]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-[#F4F3EE] uppercase tracking-tight">
              Edit Class Schedule
            </h3>

            <form onSubmit={handleEditClass} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block text-[#8C9390] font-semibold mb-1">Class Title</label>
                <input
                  type="text"
                  required
                  value={showEditModal.title}
                  onChange={(e) => setShowEditModal({ ...showEditModal, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#111315] border border-[#8C9390]/30 text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8C9390] font-semibold mb-1">Coach</label>
                  <input
                    type="text"
                    required
                    value={showEditModal.instructorName}
                    onChange={(e) => setShowEditModal({ ...showEditModal, instructorName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#111315] border border-[#8C9390]/30 text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                  />
                </div>
                <div>
                  <label className="block text-[#8C9390] font-semibold mb-1">Max Spots</label>
                  <input
                    type="number"
                    required
                    value={showEditModal.capacity}
                    onChange={(e) => setShowEditModal({ ...showEditModal, capacity: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#111315] border border-[#8C9390]/30 text-[#F4F3EE] font-bold focus:outline-none focus:border-[#C8FF3D]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl text-xs font-black text-[#111315] shadow-xl hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: brand.primaryColor }}
              >
                Save Schedule Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
