"use client";

import React, { useState, useEffect } from "react";
import { useBrand } from "@/lib/brand-context";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import {
  Users,
  Search,
  Plus,
  Filter,
  CheckCircle,
  AlertCircle,
  Clock,
  Phone,
  Mail,
  QrCode,
  Sparkles,
  ArrowRight,
  PauseCircle,
  ShieldCheck,
  Flame,
  ChevronRight,
} from "lucide-react";

export default function MembersPage() {
  const { brand } = useBrand();
  const [members, setMembers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const loadMembers = async () => {
    try {
      const res = await fetch("/api/members");
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      }
    } catch (err) {
      console.error("Failed to load members", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.memberCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = members.filter((m) => m.status === "ACTIVE").length;
  const expiredCount = members.filter((m) => m.status === "EXPIRED").length;
  const frozenCount = members.filter((m) => m.status === "FROZEN").length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#202427] border border-[#8C9390]/30 text-xs text-[#8C9390] mb-2 shadow">
            <Users className="w-3.5 h-3.5 text-[#C8FF3D]" />
            <span>Member Intelligence & CRM</span>
          </div>
          <h1 className="text-3xl font-black text-[#F4F3EE] tracking-tight uppercase">
            Athlete Directory
          </h1>
          <p className="text-xs text-[#8C9390] mt-1">
            Search, filter, renew, and manage memberships, attendance histories, and e-signatures.
          </p>
        </div>

        <Link
          href="/members/new"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider text-[#111315] shadow-xl transition-transform hover:scale-105 active:scale-95"
          style={{ backgroundColor: brand.primaryColor }}
        >
          <Plus className="w-4 h-4 text-[#111315]" />
          <span>Register New Athlete</span>
        </Link>
      </div>

      {/* 2. Quick Filter Tabs & Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { id: "ALL", label: "All Athletes", count: members.length, color: "text-[#F4F3EE]" },
          { id: "ACTIVE", label: "Active Passes", count: activeCount, color: "text-emerald-400" },
          { id: "FROZEN", label: "Frozen Passes", count: frozenCount, color: "text-sky-400" },
          { id: "EXPIRED", label: "Expired", count: expiredCount, color: "text-rose-400" },
        ].map((tab) => {
          const isSelected = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#202427] border-2 shadow-lg"
                  : "bg-[#202427]/70 border-[#8C9390]/25 hover:border-[#8C9390]/50"
              }`}
              style={{
                borderColor: isSelected ? brand.primaryColor : undefined,
              }}
            >
              <span className="text-[11px] font-bold text-[#8C9390] uppercase tracking-wider block">
                {tab.label}
              </span>
              <span className={`text-2xl font-black mt-1 block ${tab.color}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Search & Filter Palette */}
      <div className="p-4 rounded-2xl bg-[#202427] border border-[#8C9390]/25 flex items-center justify-between gap-4 shadow">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C9390]" />
          <input
            type="text"
            placeholder="Search by athlete name, ID code (e.g. MEM-), phone, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#111315] border border-[#8C9390]/30 rounded-xl text-xs text-[#F4F3EE] placeholder-[#8C9390]/60 focus:outline-none focus:border-[#C8FF3D]"
          />
        </div>
        <span className="text-xs text-[#8C9390] hidden sm:inline">
          Showing <strong className="text-[#F4F3EE]">{filteredMembers.length}</strong> matching athletes
        </span>
      </div>

      {/* 4. Athlete Table */}
      <div className="rounded-3xl bg-[#202427] border border-[#8C9390]/25 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#8C9390]/20 bg-[#111315]/90 text-[10px] font-black text-[#8C9390] uppercase tracking-wider">
                <th className="py-4 px-5">Athlete</th>
                <th className="py-4 px-5">Member Code</th>
                <th className="py-4 px-5">Current Tier</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5">Join Date</th>
                <th className="py-4 px-5 text-right">Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#8C9390]/15 text-xs">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => {
                  const currentSub = member.subscriptions?.[0];
                  return (
                    <tr
                      key={member.id}
                      className="hover:bg-[#111315]/50 transition-colors group"
                    >
                      {/* Name & Contact */}
                      <td className="py-4 px-5">
                        <Link
                          href={`/members/${member.id}`}
                          className="flex items-center gap-3.5"
                        >
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs text-[#111315] shadow flex-shrink-0"
                            style={{ backgroundColor: brand.primaryColor }}
                          >
                            {member.firstName[0]}
                            {member.lastName[0]}
                          </div>
                          <div>
                            <p className="font-bold text-[#F4F3EE] group-hover:text-[#C8FF3D] transition-colors">
                              {member.firstName} {member.lastName}
                            </p>
                            <p className="text-[11px] text-[#8C9390]">
                              {member.phone} &bull; {member.email}
                            </p>
                          </div>
                        </Link>
                      </td>

                      {/* Member Code */}
                      <td className="py-4 px-5">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-[#111315] border border-[#8C9390]/30 text-[#C8FF3D]">
                          {member.memberCode}
                        </span>
                      </td>

                      {/* Current Plan */}
                      <td className="py-4 px-5">
                        <span className="font-bold text-[#F4F3EE] block">
                          {currentSub?.plan?.name || "No Active Plan"}
                        </span>
                        {currentSub?.endDate && (
                          <span className="text-[10px] text-[#8C9390]">
                            Exp: {formatDate(currentSub.endDate)}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                            member.status === "ACTIVE"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : member.status === "EXPIRED"
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                              : "bg-sky-500/10 text-sky-400 border-sky-500/20"
                          }`}
                        >
                          {member.status === "ACTIVE" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                          {member.status === "EXPIRED" && <AlertCircle className="w-3 h-3" />}
                          {member.status === "FROZEN" && <PauseCircle className="w-3 h-3" />}
                          {member.status}
                        </span>
                      </td>

                      {/* Join Date */}
                      <td className="py-4 px-5 text-[#8C9390]">
                        {formatDate(member.joinDate)}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-5 text-right">
                        <Link
                          href={`/members/${member.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#111315] hover:bg-[#111315]/80 text-[#F4F3EE] hover:text-[#C8FF3D] border border-[#8C9390]/30 transition-colors"
                        >
                          <span>Open</span>
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-[#8C9390] text-xs">
                    <Users className="w-8 h-8 mx-auto text-[#8C9390]/40 mb-2 opacity-40" />
                    No athletes found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
