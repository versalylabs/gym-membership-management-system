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

  const getTrainerDetails = (trainer: any) => {
    const name = trainer.name || "";
    if (name.includes("Alex")) {
      return {
        specialty: "Head Strength Coach & Director",
        certifications: "CSCS • USAW Senior Coach",
        bio: "Former collegiate strength director specializing in periodization, biomechanics, and competitive barbell athletics.",
      };
    }
    if (name.includes("Marcus")) {
      return {
        specialty: "Powerlifting & Hypertrophy",
        certifications: "CSCS • USAW Level 2",
        bio: "Specializing in heavy compound lifts, CNS recovery protocols, and competitive powerlifting periodization.",
      };
    }
    if (name.includes("Maya")) {
      return {
        specialty: "Athletic Mobility & Vinyasa",
        certifications: "RYT-500 • Postural Specialist",
        bio: "Integrating power yoga, deep fascia release, and joint mobility to keep heavy lifters mobile, agile, and pain-free.",
      };
    }
    if (name.includes("Devon") || name.includes("Sarah")) {
      return {
        specialty: "Combat Conditioning & Striking",
        certifications: "ISSA Master Trainer • Boxing Coach",
        bio: "Coaching fighters and everyday lifters with precision nutrition planning and explosive striking conditioning.",
      };
    }
    return {
      specialty: trainer.specialty || "Strength & Conditioning Specialist",
      certifications: trainer.certifications || "CSCS • NASM-CPT",
      bio: trainer.bio || "Dedicated to guiding athletes and beginners toward sustainable personal records and body transformations.",
    };
  };

  return (
    <section id="trainers" className="py-14 sm:py-16 bg-[#111315] relative overflow-hidden border-t border-[#202427]">
      {/* Authentic Athlete Background Image matching homepage styling */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 brightness-[0.38] contrast-[1.25] saturate-[0.8] scale-100"
          style={{
            backgroundImage: `url('/images/coaches-bg.jpg')`,
          }}
        />

        {/* Precise Vignette & Contrast Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111315] via-[#111315]/65 to-[#111315]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111315]/75 via-transparent to-[#111315]/75" />

        {/* Ambient Lime Accent Lighting */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] rounded-full blur-[160px] opacity-[0.10] pointer-events-none"
          style={{ backgroundColor: brand.primaryColor }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <ScrollReveal direction="up" duration={0.6}>
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#202427] border border-[#8C9390]/30 text-xs font-bold text-[#F4F3EE] uppercase tracking-wider mb-2.5 shadow">
              <Award className="w-3.5 h-3.5 text-[#C8FF3D]" />
              <span>Master Coaches</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#F4F3EE] tracking-tight uppercase">
              Coached By Industry{" "}
              <span
                className="font-timegoing text-[#C8FF3D] inline-block transform rotate-1 px-1 drop-shadow-[0_0_20px_rgba(200,255,61,0.35)]"
                style={{ color: brand.primaryColor }}
              >
                LEADERS
              </span>
            </h2>
            <p className="mt-3.5 text-[#8C9390] text-sm sm:text-base">
              Our certified strength & conditioning specialists design evidence-based training programs tailored to your unique biomechanics, body composition, and athletic goals.
            </p>
          </div>
        </ScrollReveal>

        {/* Trainers Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
          {trainers.map((t, idx) => {
            const details = getTrainerDetails(t);
            return (
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
                        {details.specialty}
                      </p>
                      <p className="text-[11px] text-[#8C9390]/80 font-mono mt-1">
                        {details.certifications}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#8C9390]/20 text-[11px] text-[#8C9390] text-center leading-relaxed">
                      {details.bio}
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
            );
          })}
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
