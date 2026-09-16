"use client";

import React from "react";
import Link from "next/link";
import { useBrand } from "@/lib/brand-context";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import {
  Heart,
  Target,
  ShieldCheck,
  ArrowRight,
  Flame,
  Sparkles,
  Zap,
  Dumbbell,
  Compass,
} from "lucide-react";

interface AboutSectionProps {
  onOpenFreePass: () => void;
}

export default function AboutSection({ onOpenFreePass }: AboutSectionProps) {
  const { brand } = useBrand();

  const values = [
    {
      icon: Heart,
      title: "Healthy Lifestyle & Habit Formation",
      description: "We promote consistent, sustainable daily training habits and nutritional principles that lead to lifelong physical vitality.",
    },
    {
      icon: Target,
      title: "Personalized Progression Roadmaps",
      description: "Custom periodized workouts and InBody composition tracking tailored precisely to your biomechanics and athletic ambitions.",
    },
    {
      icon: ShieldCheck,
      title: "Pristine, Safe & Sanitized Facility",
      description: "Medical-grade HEPA airflow, luxury rain showers, sanitized Eleiko stations, and 24/7 keycard access for complete peace of mind.",
    },
  ];

  return (
    <section id="about" className="py-24 bg-[#111315] relative overflow-hidden border-t border-[#202427]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column (5 cols): High-Impact Graphic Poster with 3D Depth */}
          <div className="lg:col-span-5">
            <ScrollReveal direction="left" duration={0.6}>
              <div className="rounded-3xl bg-gradient-to-b from-[#202427] to-[#111315] border-2 border-[#8C9390]/30 p-8 sm:p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[440px] group hover:border-[#C8FF3D]/60 transition-all duration-500">
                {/* Background glowing sphere */}
                <div
                  className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none group-hover:opacity-35 transition-opacity duration-700"
                  style={{ backgroundColor: brand.primaryColor }}
                />

                <div className="space-y-4 relative z-10">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111315] border border-[#8C9390]/30 text-[10px] font-black tracking-widest uppercase text-[#F4F3EE] shadow">
                    <Flame className="w-3.5 h-3.5 text-[#C8FF3D]" />
                    <span>The {brand.gymName} Ethos</span>
                  </span>

                  <h3 className="text-3xl sm:text-4xl font-black text-[#F4F3EE] uppercase tracking-tight leading-tight">
                    DISCIPLINE TODAY. <br />
                    <span
                      style={{ color: brand.primaryColor }}
                      className="drop-shadow-md"
                    >
                      SUCCESS TOMORROW.
                    </span>
                  </h3>

                  <p className="text-xs sm:text-sm text-[#8C9390] leading-relaxed pt-2">
                    Greatness isn't born overnight. It's forged rep by rep, session by session, in a community that refuses to let you settle for average.
                  </p>
                </div>

                <div className="pt-8 border-t border-[#8C9390]/20 relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black text-[#F4F3EE] uppercase tracking-wider">20,000 SQ FT FACILITY</p>
                    <p className="text-[10px] text-[#8C9390] font-medium">Validated On-Site Parking &bull; Keyless Access</p>
                  </div>
                  <span
                    className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xs shadow-xl group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: brand.primaryColor, color: "#111315" }}
                  >
                    24/7
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column (7 cols): About Narrative & 3 Core Values */}
          <div className="lg:col-span-7 space-y-6">
            <ScrollReveal direction="right" duration={0.6}>
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#202427] border border-[#8C9390]/30 text-xs font-bold text-[#F4F3EE] uppercase tracking-wider mb-3 shadow">
                  <Sparkles className="w-3.5 h-3.5 text-[#C8FF3D]" />
                  <span>About Our Club</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-[#F4F3EE] tracking-tight uppercase">
                  More Than Just A Gym. <br />
                  We Are A Community.
                </h2>
                <p className="mt-4 text-[#8C9390] text-sm sm:text-base leading-relaxed">
                  At <strong className="text-[#F4F3EE]">{brand.gymName}</strong>, we believe fitness is a lifelong commitment to self-mastery. We provide an uncompromising athletic environment where every member receives the tools, coaching, and recovery facilities to thrive.
                </p>
              </div>
            </ScrollReveal>

            {/* 3 Values list */}
            <StaggerContainer className="space-y-4 pt-2" staggerDelay={0.12}>
              {values.map((v, idx) => {
                const Icon = v.icon;
                return (
                  <StaggerItem key={idx}>
                    <div
                      className="p-4 rounded-2xl bg-[#202427]/90 border border-[#8C9390]/25 flex items-start gap-4 hover:border-[#C8FF3D]/60 hover:-translate-x-1 transition-all duration-300 shadow-md backdrop-blur-md group"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow group-hover:scale-105 transition-transform"
                        style={{ backgroundColor: brand.primaryColor, color: "#111315" }}
                      >
                        <Icon className="w-5 h-5 font-black" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-[#F4F3EE] uppercase tracking-tight group-hover:text-[#C8FF3D] transition-colors">
                          {v.title}
                        </h4>
                        <p className="text-xs text-[#8C9390] mt-1 leading-relaxed">
                          {v.description}
                        </p>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>

            {/* Action Buttons */}
            <ScrollReveal direction="up" delay={0.3} duration={0.5}>
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  href="/members/new"
                  className="px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group"
                  style={{ backgroundColor: brand.primaryColor, color: "#111315" }}
                >
                  <span>Join Our Community</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button
                  onClick={onOpenFreePass}
                  className="px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider text-[#F4F3EE] hover:text-[#C8FF3D] bg-[#202427] border border-[#8C9390]/30 hover:border-[#C8FF3D]/50 transition-all hover:scale-105 active:scale-95 shadow"
                >
                  Book Facility Tour
                </button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
