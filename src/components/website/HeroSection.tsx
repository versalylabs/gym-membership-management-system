"use client";

import React from "react";
import Link from "next/link";
import { useBrand } from "@/lib/brand-context";
import { Spotlight } from "@/components/ui/spotlight";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { NumberTicker } from "@/components/ui/number-ticker";
import {
  ArrowRight,
  ShieldCheck,
  Star,
  Users,
  Award,
  Zap,
  Clock,
  Dumbbell,
  Sparkles,
  Activity,
  Target,
  Trophy,
} from "lucide-react";

interface HeroSectionProps {
  onOpenFreePass: () => void;
  occupancyCount: number;
}

export default function HeroSection({ onOpenFreePass, occupancyCount }: HeroSectionProps) {
  const { brand } = useBrand();

  const featurePillars = [
    {
      icon: Dumbbell,
      title: "Top Equipment",
      description: "Eleiko barbells, power racks, selectorized pin machines, and 50m sprint turf.",
    },
    {
      icon: Award,
      title: "Expert Coaches",
      description: "Certified trainers to guide your biomechanics, nutrition, and personal PRs.",
    },
    {
      icon: Target,
      title: "Personalized Plans",
      description: "Periodized workout splits tailored to fat loss, athletic power, or muscle gain.",
    },
    {
      icon: Users,
      title: "Strong Community",
      description: "A motivating, high-energy environment that pushes you to be your absolute best.",
    },
  ];

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-32 pb-20 overflow-hidden bg-[#111315]">
      {/* 1. Aceternity Soft Spotlight Effect */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill={brand.primaryColor || "#C8FF3D"}
      />

      {/* 2. Cinematic Atmospheric Background Image Layer (Crisp & High Visibility) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Real Gym Athlete Photography Background - High Clarity & Visibility */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-75 brightness-[0.72] contrast-[1.18] saturate-[0.95] scale-105 transform transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2400&q=85')`,
          }}
        />

        {/* Soft Vignettes for Typography Legibility without Wiping out Background */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111315] via-[#111315]/25 to-[#111315]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111315]/50 via-transparent to-[#111315]/50" />

        {/* Subtle, Non-Overpowering Brand Ambiance */}
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[450px] rounded-full blur-[180px] opacity-[0.08] pointer-events-none"
          style={{ backgroundColor: brand.primaryColor }}
        />
        <div
          className="absolute bottom-20 -left-20 w-[400px] h-[400px] rounded-full blur-[160px] opacity-[0.05] pointer-events-none"
          style={{ backgroundColor: brand.accentColor }}
        />

        {/* Athletic Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8C939010_1px,transparent_1px),linear-gradient(to_bottom,#8C939010_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />
      </div>

      {/* 3. Hero Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 my-auto">
        <ScrollReveal direction="down" duration={0.6}>
          {/* Top Tagline Pill with Live Attendance Pulse */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#202427]/90 border border-[#8C9390]/30 shadow-2xl mb-6 backdrop-blur-xl">
            <span className="flex h-2.5 w-2.5 relative">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ backgroundColor: brand.primaryColor }}
              />
              <span
                className="relative inline-flex rounded-full h-2.5 w-2.5"
                style={{ backgroundColor: brand.primaryColor }}
              />
            </span>
            <span className="text-xs font-black tracking-widest text-[#F4F3EE] uppercase">
              STRONG BODY &bull; STRONG MIND &bull; STRONGER YOU
            </span>
            <span className="text-[#8C9390]">&bull;</span>
            <span className="text-xs font-bold text-[#C8FF3D] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 animate-pulse text-[#C8FF3D]" />
              <span>
                <NumberTicker value={occupancyCount || 42} className="font-bold text-[#C8FF3D]" /> Athletes Live on Floor
              </span>
            </span>
          </div>
        </ScrollReveal>

        {/* Hero Main Headline */}
        <ScrollReveal direction="up" delay={0.15} duration={0.7}>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-[#F4F3EE] tracking-tight uppercase max-w-5xl mx-auto leading-[1.02] drop-shadow-2xl">
            BUILD STRENGTH. <br />
            <span
              className="text-transparent bg-clip-text bg-gradient-to-r"
              style={{
                backgroundImage: `linear-gradient(to right, #F4F3EE 15%, ${brand.primaryColor} 65%, ${brand.accentColor} 100%)`,
              }}
            >
              BECOME YOUR BEST.
            </span>
          </h1>
        </ScrollReveal>

        {/* Hero Motivating Subcopy */}
        <ScrollReveal direction="up" delay={0.3} duration={0.6}>
          <p className="mt-6 text-base sm:text-lg lg:text-xl text-[#F4F3EE]/95 max-w-2xl mx-auto font-normal leading-relaxed drop-shadow-lg">
            Welcome to <strong className="text-[#F4F3EE] font-bold">{brand.gymName}</strong>. Elite equipment, dynamic group classes, certified personal coaching, and a community dedicated to your transformation.
          </p>
        </ScrollReveal>

        {/* Dual Primary Call-To-Actions */}
        <ScrollReveal direction="up" delay={0.4} duration={0.6}>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/members/new"
              className="w-full sm:w-auto px-9 py-4 rounded-2xl text-xs font-black uppercase tracking-wider shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group relative overflow-hidden"
              style={{
                backgroundColor: brand.primaryColor,
                color: "#111315",
                boxShadow: `0 10px 30px -10px ${brand.primaryColor}90`,
              }}
            >
              <span>Join {brand.gymName} Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              onClick={onOpenFreePass}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-wider bg-[#202427] hover:bg-[#202427]/80 text-[#C8FF3D] border border-[#C8FF3D]/40 shadow-lg backdrop-blur-md transition-all hover:border-[#C8FF3D] hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#C8FF3D]" />
              <span>Claim Free 1-Day Trial Pass</span>
            </button>

            <a
              href="#programs"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl text-xs font-bold uppercase tracking-wider bg-[#111315]/90 hover:bg-[#202427] text-[#8C9390] hover:text-[#F4F3EE] border border-[#8C9390]/30 transition-all flex items-center justify-center gap-1.5"
            >
              <span>View Programs &rarr;</span>
            </a>
          </div>
        </ScrollReveal>

        {/* 4 Feature Pillars */}
        <StaggerContainer className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left" staggerDelay={0.12}>
          {featurePillars.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <StaggerItem key={idx}>
                <div
                  className="h-full p-5 rounded-3xl bg-[#202427]/90 border border-[#8C9390]/25 hover:border-[#C8FF3D]/60 transition-all duration-300 group relative overflow-hidden shadow-xl backdrop-blur-md hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: brand.primaryColor, color: "#111315" }}
                  >
                    <Icon className="w-5 h-5 font-black" />
                  </div>
                  <h3 className="text-sm font-black text-[#F4F3EE] uppercase tracking-tight group-hover:text-[#C8FF3D] transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-[#8C9390] mt-1 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Stat Counter Ribbon with Eldora NumberTicker */}
        <ScrollReveal direction="up" delay={0.5} duration={0.6}>
          <div className="mt-12 pt-8 border-t border-[#8C9390]/20 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div className="flex items-center gap-3.5">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: `${brand.primaryColor}20`, color: brand.primaryColor }}
              >
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-[#F4F3EE] flex items-center">
                  <NumberTicker value={1500} />+
                </p>
                <p className="text-xs text-[#8C9390] font-semibold">Active Members</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: `${brand.primaryColor}20`, color: brand.primaryColor }}
              >
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-[#F4F3EE] flex items-center">
                  <NumberTicker value={25} />+
                </p>
                <p className="text-xs text-[#8C9390] font-semibold">Certified Trainers</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: `${brand.primaryColor}20`, color: brand.primaryColor }}
              >
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-[#F4F3EE] flex items-center">
                  <NumberTicker value={40} />+
                </p>
                <p className="text-xs text-[#8C9390] font-semibold">Weekly Classes</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: `${brand.primaryColor}20`, color: brand.primaryColor }}
              >
                <Star className="w-6 h-6 fill-[#C8FF3D] text-[#C8FF3D]" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-[#F4F3EE] flex items-center gap-1">
                  <span>4.9</span>
                  <span className="text-xs text-[#8C9390]">/ 5.0</span>
                </p>
                <p className="text-xs text-[#8C9390] font-semibold">
                  <NumberTicker value={500} />+ Google Reviews
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
