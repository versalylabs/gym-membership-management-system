"use client";

import React, { useState } from "react";
import { useBrand } from "@/lib/brand-context";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import {
  Star,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
  Award,
  Sparkles,
  Quote,
} from "lucide-react";

export default function ReviewsAndFaq() {
  const { brand } = useBrand();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const testimonials = [
    {
      name: "Brian Kiprop",
      achievement: "Gained 6 kg lean muscle in 6 months",
      rating: 5,
      review:
        "The Olympic lifting platform and Eleiko barbells in Westlands are world-class. Coaches actually know biomechanics and helped me hit a 220 kg deadlift cleanly.",
      tag: "Strength & Power",
    },
    {
      name: "Faith Wanjiku",
      achievement: "Dropped 12 kg & crushed Nairobi City Half-Marathon",
      rating: 5,
      review:
        "The 6:00 AM high-altitude HIIT sessions and recovery sauna transformed my endurance. Cleanest locker rooms and most supportive community in Nairobi.",
      tag: "Endurance & HIIT",
    },
    {
      name: "Kevin Otieno",
      achievement: "Recovered from lower back rugby strain",
      rating: 5,
      review:
        "Coach Brian and the mobility team tailored my movements so I could train pain-free again. The recovery lounge cold plunge is unmatched after hard sessions.",
      tag: "Mobility & Recovery",
    },
  ];

  const faqs = [
    {
      q: "What are the facility operating hours?",
      a: "We are open Monday through Friday from 5:00 AM to 11:00 PM, and Saturday & Sunday from 6:00 AM to 9:00 PM. VIP members with 24/7 keycard access have round-the-clock entry 365 days a year.",
    },
    {
      q: "Are group fitness classes included in the membership?",
      a: "Yes! Our VIP All-Access and Annual tiers include unlimited group fitness sessions (HIIT, Strength clinics, Power Yoga, Boxing). Standard tier members can drop in with a discounted KSh 1,000 class pass.",
    },
    {
      q: "Can I bring a guest or workout partner?",
      a: "VIP All-Access members receive 2 complimentary guest passes per month. First-time visitors can also claim our Free 1-Day Trial Pass directly on this website.",
    },
    {
      q: "Is there on-site parking and towel service?",
      a: "Yes, we provide 120 dedicated validated parking spots directly adjacent to the club entrance, plus complimentary premium towel service, luxury rain showers, and Finnish saunas.",
    },
    {
      q: "What is your cancellation or freeze policy?",
      a: "We believe in earning your business every single month. You can freeze your membership for up to 90 days or cancel anytime with a simple 14-day notice—zero hidden penalty fees.",
    },
  ];

  return (
    <section id="faq" className="py-14 sm:py-16 bg-[#111315] relative border-t border-[#202427]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Testimonials Sub-section */}
        <ScrollReveal direction="up" duration={0.6}>
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#202427] border border-[#8C9390]/30 text-xs font-bold text-[#F4F3EE] uppercase tracking-wider mb-2.5 shadow">
              <Star className="w-3.5 h-3.5 text-[#C8FF3D] fill-[#C8FF3D]" />
              <span>Member Transformations</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#F4F3EE] tracking-tight uppercase">
              Proven Athlete{" "}
              <span
                className="font-timegoing text-[#C8FF3D] inline-block transform -rotate-1 px-1 drop-shadow-[0_0_20px_rgba(200,255,61,0.35)]"
                style={{ color: brand.primaryColor }}
              >
                RESULTS
              </span>
            </h2>
            <p className="mt-3.5 text-[#8C9390] text-sm sm:text-base">
              Real stories from everyday lifters, endurance athletes, and beginners who made {brand.gymName} their training home.
            </p>
          </div>
        </ScrollReveal>

        {/* Testimonial Cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12" staggerDelay={0.1}>
          {testimonials.map((t, idx) => (
            <StaggerItem key={idx}>
              <div
                className="h-full rounded-3xl bg-[#202427] border border-[#8C9390]/25 p-7 flex flex-col justify-between hover:border-[#C8FF3D]/60 hover:-translate-y-1.5 transition-all duration-300 relative shadow-xl group"
              >
                <Quote className="w-8 h-8 text-[#8C9390]/20 absolute top-6 right-6 group-hover:text-[#C8FF3D]/30 transition-colors" />

                <div>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#C8FF3D] text-[#C8FF3D]" />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-[#F4F3EE]/90 leading-relaxed italic">
                    "{t.review}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#8C9390]/20 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#F4F3EE]">{t.name}</h4>
                    <p className="text-[11px] text-[#C8FF3D] font-semibold">
                      {t.achievement}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-[#111315] text-[10px] font-bold text-[#8C9390] border border-[#8C9390]/30 uppercase">
                    {t.tag}
                  </span>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Two-Column: Interactive FAQ & Location Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: FAQ Accordion (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <ScrollReveal direction="left" duration={0.5}>
              <div className="mb-6">
                <span className="text-xs font-bold text-[#8C9390] uppercase tracking-wider">
                  Got Questions?
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#F4F3EE] tracking-tight uppercase mt-1">
                  Frequently Asked{" "}
                  <span
                    className="font-timegoing text-[#C8FF3D] inline-block transform rotate-1 px-1 drop-shadow-[0_0_15px_rgba(200,255,61,0.35)]"
                    style={{ color: brand.primaryColor }}
                  >
                    QUESTIONS
                  </span>
                </h3>
              </div>
            </ScrollReveal>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl bg-[#202427] border border-[#8C9390]/25 overflow-hidden transition-colors hover:border-[#C8FF3D]/40"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-[#F4F3EE] hover:text-[#C8FF3D] transition-colors"
                    >
                      <span className="pr-4">{faq.q}</span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-4 h-4 text-[#C8FF3D] flex-shrink-0" />
                      </motion.div>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                        >
                          <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#8C9390] leading-relaxed border-t border-[#8C9390]/20">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Location & Hours Card (5 cols) */}
          <div className="lg:col-span-5">
            <ScrollReveal direction="right" duration={0.6}>
              <div className="rounded-3xl bg-[#202427] border border-[#8C9390]/25 p-8 shadow-2xl relative overflow-hidden group hover:border-[#C8FF3D]/50 transition-all duration-300">
                <div
                  className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity"
                  style={{ backgroundColor: brand.primaryColor }}
                />

                <h4 className="text-lg font-black text-[#F4F3EE] uppercase tracking-tight">
                  Facility Location & Hours
                </h4>
                <p className="text-xs text-[#8C9390] mt-1">
                  Visit our premier headquarters or drop in for a guided walk-through.
                </p>

                <div className="mt-6 space-y-4 text-xs text-[#8C9390]">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#C8FF3D] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-[#F4F3EE]">{brand.gymName} Performance HQ</p>
                      <p className="text-[#8C9390]">{brand.address || "Ruaraka, Nairobi, Kenya"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-[#C8FF3D] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-[#F4F3EE]">Staffed Hours</p>
                      <p className="text-[#8C9390]">Mon - Fri: 5:00 AM – 11:00 PM</p>
                      <p className="text-[#8C9390]">Sat - Sun: 6:00 AM – 9:00 PM</p>
                      <p className="text-[#C8FF3D] font-bold mt-0.5">VIP Members: 24/7 Access</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-[#C8FF3D] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-[#F4F3EE]">Contact & Support</p>
                      <p className="text-[#8C9390]">
                        Desk:{" "}
                        <a href="tel:+254704611033" className="hover:text-[#C8FF3D] transition-colors">
                          +254 704 611 033
                        </a>
                        {" / "}
                        <a href="tel:+25492986825" className="hover:text-[#C8FF3D] transition-colors">
                          +254 929 868 25
                        </a>
                      </p>
                      <p className="text-[#8C9390]">
                        Email:{" "}
                        <a
                          href={`mailto:${brand.contactEmail || "versalylabs@gmail.com"}`}
                          className="hover:text-[#C8FF3D] transition-colors"
                        >
                          {brand.contactEmail || "versalylabs@gmail.com"}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Map Visual Mock */}
                <div className="mt-6 h-36 rounded-2xl bg-[#111315] border border-[#8C9390]/20 relative overflow-hidden flex items-center justify-center group/map">
                  <div className="absolute inset-0 bg-[radial-gradient(#8C9390_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
                  <div className="relative z-10 text-center">
                    <div
                      className="w-8 h-8 mx-auto rounded-full flex items-center justify-center shadow-lg group-hover/map:scale-110 transition-transform"
                      style={{ backgroundColor: brand.primaryColor, color: "#111315" }}
                    >
                      <MapPin className="w-4 h-4 font-black" />
                    </div>
                    <span className="text-[11px] font-bold text-[#F4F3EE] mt-1 block">
                      Interactive Map View
                    </span>
                    <span className="text-[9px] text-[#8C9390]">Validated Parking on P1</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
