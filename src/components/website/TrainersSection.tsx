"use client";

import React, { useState, useEffect } from "react";
import { useBrand } from "@/lib/brand-context";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import {
  Award,
  Calendar,
  Sparkles,
  Dumbbell,
  CheckCircle2,
  ArrowRight,
  UserCheck,
  Star,
} from "lucide-react";

interface TrainersSectionProps {
  onOpenConsult: (trainerName: string) => void;
}

export default function TrainersSection({ onOpenConsult }: TrainersSectionProps) {
  const { brand } = useBrand();
  const [trainers, setTrainers] = useState<any[]>([]);

  useEffect(() => {
    async function loadTrainers() {
      try {
        const res = await fetch("/api/trainers");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setTrainers(data);
          } else {
            setTrainers(defaultTrainers);
          }
        } else {
          setTrainers(defaultTrainers);
        }
      } catch (err) {
        setTrainers(defaultTrainers);
      }
    }
    loadTrainers();
  }, []);

  return (
    <section id="trainers" className="py-24 bg-[#111315] relative border-t border-[#202427]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal direction="up" duration={0.6}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#202427] border border-[#8C9390]/30 text-xs font-bold text-[#F4F3EE] uppercase tracking-wider mb-3 shadow">
              <Award className="w-3.5 h-3.5 text-[#C8FF3D]" />
              <span>Master Coaches</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#F4F3EE] tracking-tight uppercase">
              Coached By Industry Leaders
            </h2>
            <p className="mt-4 text-[#8C9390] text-sm sm:text-base">
              Our certified strength & conditioning specialists design evidence-based training programs tailored to your unique biomechanics, body composition, and athletic goals.
            </p>
          </div>
        </ScrollReveal>

        {/* Trainers Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
          {trainers.map((t, idx) => (
            <StaggerItem key={t.id || idx}>
              <div
                className="h-full rounded-3xl bg-[#202427] border border-[#8C9390]/25 p-6 flex flex-col justify-between hover:border-[#C8FF3D]/70 transition-all duration-300 group relative overflow-hidden shadow-xl hover:-translate-y-1.5 hover:shadow-2xl"
              >
                {/* Background subtle glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8FF3D]/5 rounded-full blur-2xl group-hover:bg-[#C8FF3D]/15 transition-all pointer-events-none" />

                <div className="relative z-10">
                  {/* Trainer Avatar Mock */}
                  <div className="relative mb-5 flex items-center justify-center">
                    <div
                      className="w-24 h-24 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl group-hover:scale-110 transition-transform duration-300 border-2"
                      style={{
                        backgroundColor: brand.primaryColor,
                        color: "#111315",
                        borderColor: `${brand.primaryColor}80`,
                      }}
                    >
                      {t.name
                        ? t.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                        : "PT"}
                    </div>
                    <span className="absolute -bottom-2 px-2.5 py-0.5 rounded-md bg-[#111315] border border-[#8C9390]/30 text-[10px] font-bold text-[#C8FF3D] flex items-center gap-1 shadow">
                      <Star className="w-2.5 h-2.5 fill-[#C8FF3D] text-[#C8FF3D]" />
                      <span>5.0 Rating</span>
                    </span>
                  </div>

                  <div className="text-center mt-4">
                    <h3 className="text-base font-black text-[#F4F3EE] uppercase tracking-tight group-hover:text-[#C8FF3D] transition-colors">
                      {t.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#8C9390] mt-0.5">
                      {t.specialty || "Strength & Performance"}
                    </p>
                    <p className="text-[11px] text-[#8C9390]/80 font-mono mt-1">
                      {t.certifications || "CSCS &bull; NASM-CPT"}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#8C9390]/20 text-[11px] text-[#8C9390] text-center leading-relaxed">
                    {t.bio ||
                      "Over 8 years coaching elite athletes and everyday lifters toward peak strength and body transformations."}
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-[#8C9390]/20 relative z-10">
                  <button
                    onClick={() => onOpenConsult(t.name)}
                    className="w-full py-2.5 rounded-xl text-xs font-black text-[#F4F3EE] bg-[#111315] hover:bg-[#C8FF3D] hover:text-[#111315] border border-[#8C9390]/30 hover:border-[#C8FF3D]/50 transition-all duration-300 flex items-center justify-center gap-1.5 shadow group/btn"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-[#C8FF3D] group-hover/btn:text-[#111315] transition-colors" />
                    <span>Book Free Consult</span>
                  </button>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

const defaultTrainers = [
  {
    id: "tr-1",
    name: "Marcus Vance",
    specialty: "Powerlifting & Hypertrophy",
    certifications: "CSCS • USAW Level 2",
    bio: "Former collegiate strength coach specializing in heavy compound lifts, periodization, and injury rehabilitation.",
  },
  {
    id: "tr-2",
    name: "Sarah Connor",
    specialty: "High-Intensity & Conditioning",
    certifications: "NASM-CPT • FMS Level 1",
    bio: "Endurance and metabolic conditioning specialist focused on fat loss, sprint mechanics, and functional mobility.",
  },
  {
    id: "tr-3",
    name: "Elena Rostova",
    specialty: "Athletic Mobility & Core",
    certifications: "RYT-500 • Postural Specialist",
    bio: "Integrating power yoga, deep fascia release, and joint mobility to keep heavy lifters pain-free and supple.",
  },
  {
    id: "tr-4",
    name: "Devon Reed",
    specialty: "Combat Sports & Bodybuilding",
    certifications: "ISSA Master Trainer • Boxing Coach",
    bio: "Coaching fighters and physique athletes with precision nutrition planning and explosive striking conditioning.",
  },
];
