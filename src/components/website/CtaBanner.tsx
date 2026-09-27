"use client";

import React from "react";
import Link from "next/link";
import { useBrand } from "@/lib/brand-context";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Flame,
  Zap,
} from "lucide-react";

interface CtaBannerProps {
  onOpenFreePass: () => void;
}

export default function CtaBanner({ onOpenFreePass }: CtaBannerProps) {
  const { brand } = useBrand();

  return (
    <section className="py-12 sm:py-14 bg-[#111315] relative overflow-hidden border-t border-[#202427]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" duration={0.6}>
          <div className="relative rounded-3xl bg-gradient-to-r from-[#202427] via-[#202427]/95 to-[#202427] border-2 border-[#8C9390]/30 p-8 sm:p-14 shadow-2xl overflow-hidden hover:border-[#C8FF3D]/60 transition-all duration-500">
            {/* Glowing brand orb */}
            <div
              className="absolute -right-20 -top-20 w-96 h-96 rounded-full blur-[140px] opacity-25 pointer-events-none"
              style={{ backgroundColor: brand.primaryColor }}
            />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
              {/* Left Narrative */}
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#111315] border border-[#8C9390]/30 text-xs font-bold text-[#C8FF3D] shadow">
                  <Flame className="w-3.5 h-3.5 fill-[#C8FF3D]" />
                  <span>Start Your Transformation</span>
                </div>

                <h2 className="text-3xl sm:text-5xl font-black text-[#F4F3EE] uppercase tracking-tight leading-tight">
                  READY TO{" "}
                  <span
                    className="font-timegoing text-[#C8FF3D] inline-block transform -rotate-1 px-1 drop-shadow-[0_0_25px_rgba(200,255,61,0.35)]"
                    style={{ color: brand.primaryColor }}
                  >
                    TRANSFORM
                  </span>{" "}
                  <br />
                  <span style={{ color: brand.primaryColor }}>
                    YOUR BODY & LIFE?
                  </span>
                </h2>

                <p className="text-[#8C9390] text-sm sm:text-base leading-relaxed">
                  Join <strong className="text-[#F4F3EE]">{brand.gymName}</strong> today and take the first step towards breaking PRs, building lean muscle, and unlocking true athletic confidence.
                </p>

                {/* Guarantees Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-xs text-[#F4F3EE]/90">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C8FF3D] flex-shrink-0" />
                    <span className="font-semibold">No Initiation Fee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C8FF3D] flex-shrink-0" />
                    <span className="font-semibold">Free InBody Assessment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C8FF3D] flex-shrink-0" />
                    <span className="font-semibold">30-Day Guarantee</span>
                  </div>
                </div>
              </div>

              {/* Right Action CTAs */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3.5 flex-shrink-0">
                <Link
                  href="/members/new"
                  className="px-9 py-4 rounded-2xl text-xs font-black uppercase tracking-wider shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-center group"
                  style={{
                    backgroundColor: brand.primaryColor,
                    color: "#111315",
                    boxShadow: `0 10px 30px -10px ${brand.primaryColor}80`,
                  }}
                >
                  <span>Join Online Today</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <button
                  onClick={onOpenFreePass}
                  className="px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider text-[#C8FF3D] bg-[#111315] hover:bg-[#111315]/80 border border-[#C8FF3D]/40 transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95 shadow"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Claim Free Day Pass</span>
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
