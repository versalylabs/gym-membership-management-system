"use client";

import React, { useState, useEffect } from "react";
import { useBrand } from "@/lib/brand-context";
import { Spotlight } from "@/components/ui/spotlight";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { NumberTicker } from "@/components/ui/number-ticker";
import {
  Dumbbell,
  Award,
  Target,
  Users,
  Clock,
  Star,
  Activity,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface HeroSectionProps {
  onOpenFreePass: () => void;
  occupancyCount: number;
}

const TYPEWRITER_WORDS = ["ALIVE", "ELECTRIC", "FIERCE"];

export default function HeroSection({ onOpenFreePass, occupancyCount }: HeroSectionProps) {
  const { brand } = useBrand();

  // Animated typewriter + backspace effect
  const [wordIdx, setWordIdx] = useState(0);
  const [displayedText, setDisplayedText] = useState(TYPEWRITER_WORDS[0]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("clean") === "1") {
      setDisplayedText("ALIVE");
      return;
    }

    const currentTarget = TYPEWRITER_WORDS[wordIdx];
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      if (displayedText.length < currentTarget.length) {
        timeout = setTimeout(() => {
          setDisplayedText(currentTarget.slice(0, displayedText.length + 1));
        }, 130);
      } else {
        // Pause for 1.8 seconds when full word is displayed
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 1800);
      }
    } else {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(currentTarget.slice(0, displayedText.length - 1));
        }, 65);
      } else {
        setIsDeleting(false);
        setWordIdx((prev) => (prev + 1) % TYPEWRITER_WORDS.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, wordIdx]);

  const featurePillars = [
    {
      icon: Dumbbell,
      title: "Top Equipment",
      description: "Eleiko barbells, power racks, selectorized pin machines, and 50m sprint turf.",
    },
    {
      icon: Award,
      title: "Expert Coaches",
      description: "Certified trainers to guide your biomechanics, nutrition, & personal PRs.",
    },
    {
      icon: Target,
      title: "Personalized Plans",
      description: "Periodized workout splits tailored to fat loss, athletic power, or muscle gain.",
    },
    {
      icon: Users,
      title: "Strong Community",
      description: "A motivating, high-energy environment that pushes you to be your best.",
    },
  ];

  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-24 sm:pt-28 pb-8 overflow-hidden bg-[#111315]">
      {/* 1. Subtle Background Spotlight Glow */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill={brand.primaryColor || "#C8FF3D"}
      />

      {/* 2. Authentic Athlete & Power Rack Background Image from User */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 brightness-[0.42] contrast-[1.25] saturate-[0.8] scale-100"
          style={{
            backgroundImage: `url('/images/hero-gym-bg.jpg')`,
          }}
        />

        {/* Precise Vignette & Contrast Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111315] via-[#111315]/40 to-[#111315]/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111315]/60 via-transparent to-[#111315]/60" />

        {/* Ambient Lime Accent Lighting */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] rounded-full blur-[160px] opacity-[0.10] pointer-events-none"
          style={{ backgroundColor: brand.primaryColor }}
        />
      </div>

      {/* 3. Hero Center Experience */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 w-full my-auto py-3 sm:py-4">
        {/* Main Headline with Custom Timegoing & Arial Rounded Fonts + Typewriter Loop */}
        <ScrollReveal direction="up" duration={0.65}>
          <h1 className="font-arial-rounded text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.08] sm:leading-[1.05] drop-shadow-2xl max-w-5xl mx-auto">
            The{" "}
            <span
              className="font-timegoing text-[#C8FF3D] inline-block transform -rotate-1 px-1 drop-shadow-[0_0_25px_rgba(200,255,61,0.35)]"
              style={{ color: brand.primaryColor }}
            >
              GRIND
            </span>{" "}
            Never <br />
            Felt This{" "}
            <span
              className="font-timegoing text-[#C8FF3D] inline-block transform rotate-1 px-1 drop-shadow-[0_0_25px_rgba(200,255,61,0.35)]"
              style={{ color: brand.primaryColor }}
            >
              {displayedText}
              <span className="inline-block w-[3px] sm:w-[4px] h-[0.75em] align-middle bg-[#C8FF3D] ml-1 sm:ml-1.5 animate-pulse rounded-full" />
            </span>
          </h1>
        </ScrollReveal>

        {/* Subtitle Matching UI Mockup */}
        <ScrollReveal direction="up" delay={0.2} duration={0.6}>
          <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-[#F4F3EE]/85 max-w-xl mx-auto font-normal leading-relaxed">
            Premium equipment. Expert coaching. A community that pushes you past your last personal best.
          </p>
        </ScrollReveal>

        {/* CTA Buttons with Arrow Icons */}
        <ScrollReveal direction="up" delay={0.35} duration={0.6}>
          <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={onOpenFreePass}
              className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm font-black text-[#111315] shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 group"
              style={{
                backgroundColor: brand.primaryColor,
                boxShadow: `0 10px 30px -10px ${brand.primaryColor}80`,
              }}
            >
              <span>Feel the Pulse</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <a
              href="#programs"
              className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm font-black text-[#C8FF3D] bg-[#111315]/80 hover:bg-[#202427] border border-[#8C9390]/35 hover:border-[#C8FF3D]/60 shadow-lg backdrop-blur-md transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group"
            >
              <span>View Programs</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </ScrollReveal>

        {/* 4 Feature Pillars Matching Mockup */}
        <StaggerContainer
          className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 text-left"
          staggerDelay={0.1}
        >
          {featurePillars.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <StaggerItem key={idx}>
                <div className="h-full p-5 sm:p-5.5 rounded-2xl bg-[#111315]/85 border border-[#8C9390]/25 hover:border-[#C8FF3D]/50 transition-all duration-300 group shadow-xl backdrop-blur-md hover:-translate-y-1">
                  {/* Rounded Square Lime Badge with Icon */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: brand.primaryColor, color: "#111315" }}
                  >
                    <Icon className="w-5 h-5 font-black stroke-[2.2]" />
                  </div>
                  <h3
                    className="text-sm font-bold tracking-tight mb-1"
                    style={{ color: brand.primaryColor }}
                  >
                    {feat.title}
                  </h3>
                  <p className="text-xs text-[#8C9390] leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>

      {/* 4. Bottom Metrics Ribbon with Clean Divider Line */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-2">
        {/* Subtle Horizontal Divider */}
        <div className="border-t border-[#8C9390]/20 pt-4 pb-1">
          <ScrollReveal direction="up" delay={0.4} duration={0.6}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-left">
              {/* Metric 1: Active Members */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
                  style={{ backgroundColor: brand.primaryColor, color: "#111315" }}
                >
                  <Users className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-[#F4F3EE] flex items-center tracking-tight">
                    <NumberTicker value={1500} />+
                  </p>
                  <p className="text-[11px] sm:text-xs text-[#8C9390] font-medium">
                    Active Members
                  </p>
                </div>
              </div>

              {/* Metric 2: Certified Trainers */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
                  style={{ backgroundColor: brand.primaryColor, color: "#111315" }}
                >
                  <Award className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-[#F4F3EE] flex items-center tracking-tight">
                    <NumberTicker value={25} />+
                  </p>
                  <p className="text-[11px] sm:text-xs text-[#8C9390] font-medium">
                    Certified Trainers
                  </p>
                </div>
              </div>

              {/* Metric 3: Weekly Classes */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
                  style={{ backgroundColor: brand.primaryColor, color: "#111315" }}
                >
                  <Clock className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-[#F4F3EE] flex items-center tracking-tight">
                    <NumberTicker value={40} />+
                  </p>
                  <p className="text-[11px] sm:text-xs text-[#8C9390] font-medium">
                    Weekly Classes
                  </p>
                </div>
              </div>

              {/* Metric 4: Reviews */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
                  style={{ backgroundColor: brand.primaryColor, color: "#111315" }}
                >
                  <Star className="w-5 h-5 fill-[#111315] stroke-[1.5]" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-[#F4F3EE] flex items-center tracking-tight">
                    4.9 <span className="text-xs text-[#8C9390] ml-1 font-normal">/ 5.0</span>
                  </p>
                  <p className="text-[11px] sm:text-xs text-[#8C9390] font-medium">
                    500+ Member Reviews
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
