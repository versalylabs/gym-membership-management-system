"use client";

import React from "react";
import { useBrand } from "@/lib/brand-context";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import {
  Dumbbell,
  Flame,
  Activity,
  HeartPulse,
  Sparkles,
  Zap,
  Target,
  ArrowRight,
  Trophy,
} from "lucide-react";

interface ProgramsSectionProps {
  onOpenFreePass: () => void;
}

export default function ProgramsSection({ onOpenFreePass }: ProgramsSectionProps) {
  const { brand } = useBrand();

  const programs = [
    {
      id: "strength",
      title: "Strength & Powerlifting",
      tag: "Raw Power",
      description:
        "Competition Eleiko barbells, heavy-duty power racks, calibrated steel plates, and deadlift platforms built for serious strength athletes.",
      features: ["8 Olympic Power Racks", "Dumbbells Up to 150 lbs", "Competition Benches & Chalk Bays"],
      icon: Dumbbell,
    },
    {
      id: "hiit",
      title: "High-Intensity HIIT",
      tag: "Fat Loss & Cardio",
      description:
        "Heart-pumping interval sessions combining Concept2 rowers, SkiErgs, assault bikes, and plyometrics to accelerate athletic conditioning.",
      features: ["Live Heart Rate Tracking", "45-min High-Octane Workouts", "Coach-Led Group Motivation"],
      icon: Flame,
    },
    {
      id: "turf",
      title: "Athletic Sprint Turf",
      tag: "Performance",
      description:
        "50-meter indoor sprint track with heavy weighted prowler sleds, kettlebells, medicine balls, and agility ladders for peak athletic speed.",
      features: ["50m Sprint Turf Track", "Weighted Prowler Sleds", "Agility & Explosive Power Drills"],
      icon: Activity,
    },
    {
      id: "combat",
      title: "Combat & Boxing",
      tag: "Striking",
      description:
        "Develop rotational torque and athletic hand-eye coordination with authentic heavy bag drills, pad work, and conditioning.",
      features: ["Fairtex Heavy Bags & Speed Bags", "Technique & Pad Work", "Hand Wrapping Stations"],
      icon: Zap,
    },
    {
      id: "recovery",
      title: "Recovery & Cold Plunge",
      tag: "Contrast Therapy",
      description:
        "Recover faster in our wellness sanctuary featuring sub-40°F cold plunges, dry Finnish saunas, and Normatec 3 compression therapy.",
      features: ["Sub-40°F Cold Water Plunges", "Infrared & Finnish Saunas", "Normatec Compression Lounge"],
      icon: Sparkles,
    },
    {
      id: "pt",
      title: "1-on-1 Elite Coaching",
      tag: "Customized",
      description:
        "Work directly with certified strength & conditioning specialists. Tailored periodization, InBody composition scans, and nutrition roadmaps.",
      features: ["InBody 570 Body Scans", "Personalized Workout Splits", "Bi-Weekly Progress Reviews"],
      icon: Target,
    },
  ];

  return (
    <section id="programs" className="py-24 bg-[#111315] relative border-t border-[#202427]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal direction="up" duration={0.6}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#202427] border border-[#8C9390]/30 text-xs font-bold text-[#F4F3EE] uppercase tracking-wider mb-3 shadow">
              <Trophy className="w-3.5 h-3.5 text-[#C8FF3D]" />
              <span>Training Programs</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#F4F3EE] tracking-tight uppercase">
              Fitness For Every Goal
            </h2>
            <p className="mt-4 text-[#8C9390] text-sm sm:text-base">
              Whether your goal is breaking a deadlift personal record, shedding body fat, or building explosive athletic endurance, our zones deliver results.
            </p>
          </div>
        </ScrollReveal>

        {/* 6 High-Impact Program Cards with Staggered Scroll Entrance */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
          {programs.map((prog) => {
            const Icon = prog.icon;
            return (
              <StaggerItem key={prog.id}>
                <div
                  className="h-full rounded-3xl bg-[#202427] border border-[#8C9390]/25 p-7 flex flex-col justify-between hover:border-[#C8FF3D]/70 transition-all duration-300 group relative overflow-hidden shadow-xl hover:-translate-y-1.5 hover:shadow-2xl"
                >
                  {/* Background Accent Glow on hover */}
                  <div
                    className="absolute inset-0 bg-gradient-to-b from-[#C8FF3D]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none duration-500"
                  />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-5">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                        style={{ backgroundColor: brand.primaryColor, color: "#111315" }}
                      >
                        <Icon className="w-6 h-6 font-black" />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-[#111315] border border-[#8C9390]/30 text-[10px] font-black text-[#C8FF3D] uppercase tracking-wider shadow-inner">
                        {prog.tag}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-[#F4F3EE] group-hover:text-[#C8FF3D] transition-colors uppercase tracking-tight">
                      {prog.title}
                    </h3>
                    <p className="mt-2 text-xs text-[#8C9390] leading-relaxed">
                      {prog.description}
                    </p>

                    <ul className="mt-5 space-y-2.5">
                      {prog.features.map((f, idx) => (
                        <li key={idx} className="flex items-center gap-2.5 text-xs text-[#F4F3EE]/90">
                          <span
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: brand.primaryColor }}
                          />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-5 border-t border-[#111315] relative z-10">
                    <button
                      onClick={onOpenFreePass}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#111315] hover:bg-[#C8FF3D] hover:text-[#111315] text-xs font-black uppercase tracking-wider text-[#F4F3EE] border border-[#8C9390]/30 group-hover:border-[#C8FF3D]/50 transition-all duration-300 shadow group/btn"
                    >
                      <span>Try This Program Free</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
