"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useBrand, PRESET_BRANDS } from "@/lib/brand-context";
import WebsiteNavbar from "@/components/website/Navbar";
import HeroSection from "@/components/website/HeroSection";
import ProgramsSection from "@/components/website/ProgramsSection";
import AboutSection from "@/components/website/AboutSection";
import LiveScheduleSection from "@/components/website/LiveScheduleSection";
import PricingSection from "@/components/website/PricingSection";
import TrainersSection from "@/components/website/TrainersSection";
import ReviewsAndFaq from "@/components/website/ReviewsAndFaq";
import CtaBanner from "@/components/website/CtaBanner";
import WebsiteFooter from "@/components/website/Footer";
import LeadPassModal from "@/components/website/LeadPassModal";
import CheckoutModal from "@/components/website/CheckoutModal";
import {
  Sparkles,
  ShieldCheck,
  QrCode,
  ArrowRight,
  Check,
  Dumbbell,
  Layers,
} from "lucide-react";

export default function GymLandingPage() {
  const { brand, applyPreset } = useBrand();

  // Modals & State
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<string | undefined>(undefined);
  const [selectedCheckoutPlan, setSelectedCheckoutPlan] = useState<any | null>(null);
  const [occupancyCount, setOccupancyCount] = useState(42);
  const [showPitchPill, setShowPitchPill] = useState(true);

  // Fetch real floor headcount
  useEffect(() => {
    async function loadOccupancy() {
      try {
        const res = await fetch("/api/dashboard");
        if (res.ok) {
          const data = await res.json();
          if (data?.stats?.todayCheckinCount) {
            setOccupancyCount(data.stats.todayCheckinCount);
          }
        }
      } catch (err) {
        // keep default
      }
    }
    loadOccupancy();
  }, []);

  const handleOpenFreePass = () => {
    setSelectedTrainer(undefined);
    setIsLeadModalOpen(true);
  };

  const handleOpenConsult = (trainerName: string) => {
    setSelectedTrainer(trainerName);
    setIsLeadModalOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#111315] text-[#F4F3EE] flex flex-col selection:bg-[#C8FF3D] selection:text-[#111315] antialiased">
      {/* 1. Sticky Glassmorphism Header */}
      <WebsiteNavbar onOpenFreePass={handleOpenFreePass} />

      {/* 2. Athletic Hero Section */}
      <HeroSection
        onOpenFreePass={handleOpenFreePass}
        occupancyCount={occupancyCount}
      />

      {/* 3. Training Programs & Disciplines ("Fitness For Every Goal") */}
      <ProgramsSection onOpenFreePass={handleOpenFreePass} />

      {/* 4. About Our Facility & Community ("More Than Just A Gym") */}
      <AboutSection onOpenFreePass={handleOpenFreePass} />

      {/* 5. Live Group Class Timetable & Spot Reservation */}
      <LiveScheduleSection />

      {/* 6. Membership Plans & Pricing Grid ("Choose Your Perfect Plan") */}
      <PricingSection
        onOpenFreePass={handleOpenFreePass}
        onSelectPlan={(plan) => setSelectedCheckoutPlan(plan)}
      />

      {/* 7. Master Coaches & Personal Trainers Spotlight */}
      <TrainersSection onOpenConsult={handleOpenConsult} />

      {/* 8. Member Transformation Stories, Google Reviews & FAQ */}
      <ReviewsAndFaq />

      {/* 9. High-Impact Conversion Banner ("Ready To Transform Your Body & Life?") */}
      <CtaBanner onOpenFreePass={handleOpenFreePass} />

      {/* 10. Facility Hours, Contact & Footer */}
      <WebsiteFooter />

      {/* Interactive Free 1-Day Trial Pass & Consultation Lead Modal */}
      <LeadPassModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        defaultTrainer={selectedTrainer}
      />

      {/* Online Stripe Membership Checkout Modal */}
      <CheckoutModal
        isOpen={Boolean(selectedCheckoutPlan)}
        onClose={() => setSelectedCheckoutPlan(null)}
        plan={selectedCheckoutPlan}
      />

      {/* Floating Pitch & Demo Controller Bar with Fixed High-Contrast Styling */}
      {showPitchPill && (
        <div className="fixed bottom-6 right-6 z-40 max-w-sm w-full sm:w-auto animate-in slide-in-from-bottom-5 duration-300">
          <div className="p-3 rounded-2xl bg-[#202427]/95 border border-[#8C9390]/30 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[#111315] font-black shadow"
                style={{ backgroundColor: brand.primaryColor }}
              >
                <Sparkles className="w-4 h-4 text-[#111315]" />
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Link
                href="/dashboard"
                className="px-3.5 py-1.5 rounded-xl bg-[#111315] hover:bg-[#111315]/80 text-xs font-bold text-[#F4F3EE] hover:text-[#C8FF3D] border border-[#8C9390]/30 flex items-center gap-1.5 transition-all shadow"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#C8FF3D]" />
                <span>Staff Portal</span>
              </Link>
              <Link
                href="/attendance/kiosk"
                className="px-3.5 py-1.5 rounded-xl text-xs font-black text-[#111315] shadow flex items-center gap-1.5 hover:opacity-95 transition-all"
                style={{ backgroundColor: brand.primaryColor }}
              >
                <QrCode className="w-3.5 h-3.5 text-[#111315]" />
                <span>Kiosk</span>
              </Link>
              <button
                onClick={() => setShowPitchPill(false)}
                className="text-[#8C9390] hover:text-[#F4F3EE] text-sm px-1.5 transition-colors"
                title="Hide demo bar"
              >
                &times;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
