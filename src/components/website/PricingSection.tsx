"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useBrand } from "@/lib/brand-context";
import { formatCurrency } from "@/lib/utils";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import {
  Check,
  Zap,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  CreditCard,
  Trophy,
} from "lucide-react";

interface PricingSectionProps {
  onOpenFreePass: () => void;
  onSelectPlan?: (plan: any) => void;
}

export default function PricingSection({ onOpenFreePass, onSelectPlan }: PricingSectionProps) {
  const { brand } = useBrand();
  const [plans, setPlans] = useState<any[]>([]);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  useEffect(() => {
    async function loadPlans() {
      try {
        const res = await fetch("/api/memberships");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setPlans(data);
          } else {
            setPlans(defaultPlans);
          }
        } else {
          setPlans(defaultPlans);
        }
      } catch (err) {
        setPlans(defaultPlans);
      }
    }
    loadPlans();
  }, []);

  return (
    <section id="pricing" className="py-20 bg-[#111315] relative border-t border-[#202427]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal direction="up" duration={0.5}>
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#202427] border border-[#8C9390]/30 text-xs font-bold text-[#F4F3EE] uppercase tracking-wider mb-2.5 shadow">
              <CreditCard className="w-3.5 h-3.5 text-[#C8FF3D]" />
              <span>Membership Plans</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#F4F3EE] tracking-tight uppercase">
              Choose Your Perfect Plan
            </h2>
            <p className="mt-2 text-[#8C9390] text-xs sm:text-sm">
              No initiation fees. No lock-in contracts. Upgrade, freeze, or cancel anytime with zero penalties.
            </p>

            {/* Monthly vs Annual Switcher */}
            <div className="mt-6 inline-flex items-center p-1 rounded-2xl bg-[#202427] border border-[#8C9390]/30 shadow-lg">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-[#111315] text-[#C8FF3D] shadow border border-[#C8FF3D]/30 scale-105"
                    : "text-[#8C9390] hover:text-[#F4F3EE]"
                }`}
              >
                Monthly Flex
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("annual")}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  billingCycle === "annual"
                    ? "bg-[#111315] text-[#C8FF3D] shadow border border-[#C8FF3D]/30 scale-105"
                    : "text-[#8C9390] hover:text-[#F4F3EE]"
                }`}
              >
                <span>Annual VIP</span>
                <span className="px-1.5 py-0.5 rounded-full bg-[#C8FF3D]/20 text-[#C8FF3D] text-[10px] font-black uppercase">
                  -20%
                </span>
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* 4 Plans in One Single Desktop Frame (4 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {plans.map((plan, idx) => {
            const isPopular =
              plan.name.toLowerCase().includes("vip") ||
              plan.name.toLowerCase().includes("gold") ||
              idx === 2;

            const price =
              billingCycle === "annual" && plan.durationMonths >= 1 && plan.durationMonths < 12
                ? Math.round(plan.price * 0.8)
                : plan.price;

            // Parse features list if comma-separated or string array
            let featureList: string[] = [];
            if (Array.isArray(plan.features)) {
              featureList = plan.features;
            } else if (typeof plan.features === "string" && plan.features.trim()) {
              featureList = plan.features.split(",").map((f: string) => f.trim());
            } else {
              featureList = [
                "Full Gym Floor Access",
                "Touchless Kiosk Pass",
                "Locker Room & Showers",
                "Community Member Perks",
              ];
            }

            return (
              <div
                key={plan.id || idx}
                className={`relative rounded-3xl bg-[#202427] border flex flex-col justify-between transition-all duration-300 shadow-xl p-5 sm:p-5.5 hover:-translate-y-1 ${
                  isPopular
                    ? "border-2 shadow-2xl ring-1 ring-[#C8FF3D]/30"
                    : "border-[#8C9390]/25 hover:border-[#C8FF3D]/50"
                }`}
                style={{
                  borderColor: isPopular ? brand.primaryColor : undefined,
                  boxShadow: isPopular ? `0 15px 35px -10px ${brand.primaryColor}40` : undefined,
                }}
              >
                {isPopular && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-md flex items-center gap-1 z-20 whitespace-nowrap"
                    style={{ backgroundColor: brand.primaryColor, color: "#111315" }}
                  >
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>Most Popular</span>
                  </div>
                )}

                <div>
                  {/* Title & Badge */}
                  <div className="flex items-center justify-between gap-1.5">
                    <h3 className="text-base font-black text-[#F4F3EE] uppercase tracking-tight truncate" title={plan.name}>
                      {plan.name}
                    </h3>
                    <span
                      className="px-2 py-0.5 rounded text-[9px] font-black uppercase flex-shrink-0"
                      style={{
                        backgroundColor: isPopular ? `${brand.primaryColor}25` : "#111315",
                        color: isPopular ? brand.primaryColor : "#8C9390",
                        border: `1px solid ${isPopular ? `${brand.primaryColor}40` : "rgba(140,147,144,0.3)"}`,
                      }}
                    >
                      {plan.durationMonths === 12 ? "12 Mos" : plan.durationMonths === 3 ? "90 Days" : "Monthly"}
                    </span>
                  </div>

                  <p className="mt-1.5 text-[11px] text-[#8C9390] min-h-[30px] leading-snug line-clamp-2">
                    {plan.description || "Full access to cardio, strength equipment, and member perks."}
                  </p>

                  {/* Price */}
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-[#F4F3EE]">
                      {formatCurrency(price, brand.currencySymbol)}
                    </span>
                    <span className="text-[10px] text-[#8C9390] font-bold uppercase">
                      {plan.durationMonths === 1 ? "/mo" : plan.durationMonths === 12 ? "/yr" : `/ ${plan.durationMonths || 1}m`}
                    </span>
                  </div>

                  {billingCycle === "annual" && plan.durationMonths >= 1 && plan.durationMonths < 12 && (
                    <p className="text-[10px] text-[#C8FF3D] font-bold mt-0.5">
                      20% off applied
                    </p>
                  )}

                  {/* Features List */}
                  <div className="mt-4 pt-3.5 border-t border-[#8C9390]/20 space-y-2 text-xs">
                    <ul className="space-y-1.5">
                      {featureList.slice(0, 4).map((f, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-1.5 text-[11px] text-[#F4F3EE]/90 leading-tight">
                          <Check className="w-3.5 h-3.5 text-[#C8FF3D] flex-shrink-0 mt-0.5" />
                          <span className="truncate">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card CTA */}
                <div className="mt-5 pt-3 border-t border-[#111315]">
                  <button
                    type="button"
                    onClick={() => onSelectPlan && onSelectPlan({ ...plan, calculatedPrice: price })}
                    className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-center flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer ${
                      isPopular
                        ? "hover:opacity-95 active:scale-98"
                        : "bg-[#111315] hover:bg-[#C8FF3D] hover:text-[#111315] text-[#F4F3EE] border border-[#8C9390]/30 hover:border-[#C8FF3D]/50"
                    }`}
                    style={{
                      backgroundColor: isPopular ? brand.primaryColor : undefined,
                      color: isPopular ? "#111315" : undefined,
                    }}
                  >
                    <span>Join Online</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trial Pass Card Banner */}
        <div className="mt-10 rounded-2xl bg-[#202427] border border-[#8C9390]/25 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="space-y-0.5 text-center sm:text-left">
            <h4 className="text-sm font-black text-[#F4F3EE] uppercase tracking-wide">
              Want to try our facility before committing?
            </h4>
            <p className="text-xs text-[#8C9390]">
              Claim a complimentary 1-day guest pass and test our equipment, group classes, and sauna for free.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenFreePass}
            className="px-5 py-2.5 rounded-xl bg-[#111315] hover:bg-[#C8FF3D] hover:text-[#111315] text-xs font-black uppercase tracking-wider text-[#C8FF3D] border border-[#C8FF3D]/40 transition-all whitespace-nowrap shadow cursor-pointer hover:scale-105 active:scale-95 flex-shrink-0"
          >
            Claim Free Trial Pass &rarr;
          </button>
        </div>
      </div>
    </section>
  );
}

const defaultPlans = [
  {
    id: "plan-1",
    name: "Monthly Flex Plan",
    price: 69,
    durationMonths: 1,
    type: "MONTHLY",
    description: "Month-to-month access to gym floor and locker rooms.",
    features: ["Standard Hours Access", "Locker Room", "No Contract Lock-in"],
  },
  {
    id: "plan-2",
    name: "10-Class Group Pass",
    price: 150,
    durationMonths: 3,
    type: "PACK",
    description: "10 drop-in sessions for any Yoga, HIIT, or CrossFit class.",
    features: ["10 Class Credits", "Valid for 90 days", "Priority Booking"],
  },
  {
    id: "plan-3",
    name: "VIP Performance + PT",
    price: 249,
    durationMonths: 1,
    type: "VIP",
    description: "All-Access membership + 4 dedicated Personal Training sessions per month.",
    features: ["All-Access 24/7", "4 PT Sessions/mo", "Custom Nutrition Plan", "Towel Service"],
  },
  {
    id: "plan-4",
    name: "Gold All-Access Annual",
    price: 699,
    durationMonths: 12,
    type: "ANNUAL",
    description: "Full 24/7 gym floor, sauna, steam room & unlimited group classes.",
    features: ["24/7 Access", "Unlimited Classes", "Sauna & Steam", "Guest Pass (1/mo)"],
  },
];
