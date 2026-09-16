"use client";

import React, { useState, useEffect } from "react";
import { useBrand } from "@/lib/brand-context";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Sparkles,
  Flame,
  CheckCircle2,
  Users,
  Layers,
} from "lucide-react";
import ClassBookingModal from "@/components/website/ClassBookingModal";

export default function LiveScheduleSection() {
  const { brand } = useBrand();
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState("All Days");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [bookingClass, setBookingClass] = useState<any | null>(null);

  const days = ["All Days", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  useEffect(() => {
    async function loadClasses() {
      try {
        const res = await fetch("/api/classes");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setClasses(data);
          } else {
            setClasses(defaultSchedule);
          }
        } else {
          setClasses(defaultSchedule);
        }
      } catch (err) {
        setClasses(defaultSchedule);
      }
    }
    loadClasses();
  }, []);

  // Comprehensive day matching logic
  const isClassOnDay = (c: any, day: string) => {
    if (day === "All Days") return true;

    const shortDay = day.slice(0, 3).toUpperCase(); // e.g. "MON", "TUE", "WED"
    const fullDay = day.toUpperCase(); // e.g. "MONDAY"
    const rawDays = (c.daysOfWeek || c.dayOfWeek || "").toUpperCase();

    if (!rawDays) return true;
    return rawDays.includes(shortDay) || rawDays.includes(fullDay);
  };

  // Smart category matching
  const isClassInCategory = (c: any, cat: string) => {
    if (cat === "ALL") return true;
    const searchTarget = `${c.title || ""} ${c.description || ""} ${c.room || ""} ${c.category || ""}`.toLowerCase();
    const catLower = cat.toLowerCase();

    if (catLower === "strength") {
      return searchTarget.includes("strength") || searchTarget.includes("powerlifting") || searchTarget.includes("barbell");
    }
    if (catLower === "hiit") {
      return searchTarget.includes("hiit") || searchTarget.includes("crossfit") || searchTarget.includes("circuit") || searchTarget.includes("interval");
    }
    if (catLower === "cardio") {
      return searchTarget.includes("cardio") || searchTarget.includes("spin") || searchTarget.includes("cycle") || searchTarget.includes("endurance");
    }
    if (catLower === "yoga") {
      return searchTarget.includes("yoga") || searchTarget.includes("mobility") || searchTarget.includes("vinyasa") || searchTarget.includes("flexibility");
    }
    if (catLower === "boxing") {
      return searchTarget.includes("boxing") || searchTarget.includes("striking") || searchTarget.includes("combat") || searchTarget.includes("heavy bag");
    }

    return searchTarget.includes(catLower);
  };

  // Filter classes
  const filteredClasses = classes.filter((c) => {
    return isClassOnDay(c, selectedDay) && isClassInCategory(c, selectedCategory);
  });

  return (
    <section id="schedule" className="py-24 bg-[#111315] relative border-t border-[#202427]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal direction="up" duration={0.6}>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#202427] border border-[#8C9390]/30 text-xs font-bold text-[#F4F3EE] uppercase tracking-wider mb-3 shadow">
              <Calendar className="w-3.5 h-3.5 text-[#C8FF3D]" />
              <span>Weekly Timetable</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#F4F3EE] tracking-tight uppercase">
              Live Group Fitness Timetable
            </h2>
            <p className="mt-4 text-[#8C9390] text-sm sm:text-base">
              Over 40 coach-led sessions weekly. From 6:00 AM dawn-patrol HIIT to evening Olympic lifting clinics. Reserve your free trial spot in seconds.
            </p>
          </div>
        </ScrollReveal>

        {/* Day of Week Selector */}
        <ScrollReveal direction="up" delay={0.1} duration={0.5}>
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 scrollbar-none">
            {days.map((day) => {
              const isSelected = selectedDay.toLowerCase() === day.toLowerCase();
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer select-none duration-200 ${
                    isSelected
                      ? "text-[#111315] shadow-lg font-black scale-105 ring-2 ring-[#C8FF3D]/50"
                      : "bg-[#202427] hover:bg-[#202427]/80 text-[#8C9390] hover:text-[#F4F3EE] border border-[#8C9390]/25"
                  }`}
                  style={{
                    backgroundColor: isSelected ? brand.primaryColor : undefined,
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Category Filter Pills */}
        <ScrollReveal direction="up" delay={0.15} duration={0.5}>
          <div className="flex items-center justify-center gap-2 mt-2 mb-8 flex-wrap">
            {[
              { label: "All Disciplines", value: "ALL" },
              { label: "Strength & Power", value: "Strength" },
              { label: "HIIT & CrossFit", value: "HIIT" },
              { label: "Spin & Cardio", value: "Cardio" },
              { label: "Yoga & Mobility", value: "Yoga" },
              { label: "Boxing & Striking", value: "Boxing" },
            ].map((cat) => {
              const isSelected = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none ${
                    isSelected
                      ? "bg-[#202427] text-[#C8FF3D] border border-[#C8FF3D] font-bold shadow-md ring-1 ring-[#C8FF3D]/30"
                      : "text-[#8C9390] hover:text-[#F4F3EE] bg-[#111315] border border-[#8C9390]/20 hover:border-[#8C9390]/40"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Class Cards Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" staggerDelay={0.08}>
          {filteredClasses.length > 0 ? (
            filteredClasses.map((cls, idx) => {
              const bookedCount = cls.bookings?.length || 0;
              const daysFormatted = cls.daysOfWeek || cls.dayOfWeek || "Weekly";

              return (
                <StaggerItem key={cls.id || idx}>
                  <div
                    className="h-full rounded-2xl bg-[#202427] border border-[#8C9390]/25 p-5 flex flex-col justify-between hover:border-[#C8FF3D]/60 hover:-translate-y-1 transition-all duration-300 group shadow-lg"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span
                          className="px-2.5 py-0.5 rounded-md text-[10px] font-black text-[#111315] shadow-sm uppercase tracking-wider"
                          style={{ backgroundColor: cls.color || brand.primaryColor }}
                        >
                          {cls.room || "Studio Main"}
                        </span>
                        <span className="text-xs font-bold text-[#F4F3EE] flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#C8FF3D]" />
                          {cls.startTime} - {cls.endTime}
                        </span>
                      </div>

                      <h3 className="text-base font-extrabold text-[#F4F3EE] mt-3 group-hover:text-[#C8FF3D] transition-colors">
                        {cls.title}
                      </h3>
                      <p className="text-xs text-[#8C9390] mt-1 line-clamp-2">
                        {cls.description || "High-intensity coaching session engineered to build functional athletic strength, speed, and endurance."}
                      </p>

                      <div className="mt-4 pt-3 border-t border-[#8C9390]/20 flex items-center justify-between text-xs text-[#8C9390]">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#C8FF3D]" />
                          <span className="text-[#F4F3EE] font-medium">
                            Coach {cls.instructorName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[#8C9390] font-mono text-[11px]">
                          <Calendar className="w-3 h-3 text-[#8C9390]" />
                          <span>{daysFormatted}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-[#8C9390]/20">
                      <button
                        type="button"
                        onClick={() => setBookingClass(cls)}
                        className="w-full py-2.5 rounded-xl text-xs font-black shadow-md hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        style={{ backgroundColor: brand.primaryColor, color: "#111315" }}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#111315]" />
                        <span>Book Free Trial Spot</span>
                      </button>
                    </div>
                  </div>
                </StaggerItem>
              );
            })
          ) : (
            <div className="col-span-3 py-16 text-center rounded-2xl bg-[#202427]/50 border border-[#8C9390]/20 text-[#8C9390] text-sm flex flex-col items-center justify-center gap-3">
              <Calendar className="w-8 h-8 text-[#8C9390]/40" />
              <p>No classes found for <strong>{selectedDay}</strong> in <strong>{selectedCategory}</strong>.</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedDay("All Days");
                  setSelectedCategory("ALL");
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#111315] shadow transition-all hover:opacity-90"
                style={{ backgroundColor: brand.primaryColor }}
              >
                Reset All Filters
              </button>
            </div>
          )}
        </StaggerContainer>
      </div>

      {/* Booking Modal */}
      {bookingClass && (
        <ClassBookingModal
          cls={bookingClass}
          onClose={() => setBookingClass(null)}
        />
      )}
    </section>
  );
}

const defaultSchedule = [
  {
    id: "cls-1",
    title: "Iron Peak Power Hour",
    daysOfWeek: "MON,WED,FRI",
    startTime: "06:00 AM",
    endTime: "07:00 AM",
    instructorName: "Alex Davis",
    room: "Studio A",
    category: "Strength",
    capacity: 18,
    color: "#f59e0b",
  },
  {
    id: "cls-2",
    title: "CrossFit HIIT Conditioning",
    daysOfWeek: "MON,WED,FRI",
    startTime: "06:30 AM",
    endTime: "07:30 AM",
    instructorName: "Marcus Vance",
    room: "CrossFit Arena",
    category: "HIIT",
    capacity: 18,
    color: "#dc2626",
  },
  {
    id: "cls-3",
    title: "Evening Spin & Cardio Rush",
    daysOfWeek: "MON,TUE,THU",
    startTime: "07:00 PM",
    endTime: "08:00 PM",
    instructorName: "Sarah Connor",
    room: "Cycle Studio",
    category: "Cardio",
    capacity: 22,
    color: "#8b5cf6",
  },
  {
    id: "cls-4",
    title: "Vinyasa Core & Mobility Yoga",
    daysOfWeek: "TUE,THU,SAT",
    startTime: "08:00 AM",
    endTime: "09:00 AM",
    instructorName: "Maya Lin",
    room: "Zen Studio",
    category: "Yoga",
    capacity: 15,
    color: "#06b6d4",
  },
];
