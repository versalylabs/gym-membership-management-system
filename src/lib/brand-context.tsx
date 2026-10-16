"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface GymBrand {
  id?: string;
  gymName: string;
  tagline: string;
  logoUrl?: string;
  primaryColor: string;
  accentColor: string;
  currencySymbol: string;
  currencyCode: string;
  taxRate: number;
  contactEmail: string;
  phone: string;
  address: string;
  website: string;
}

export const PRESET_BRANDS: Record<string, GymBrand> = {
  pulse: {
    gymName: "Pulse",
    tagline: "Fuel Your Heartbeat. Master Your Strength.",
    primaryColor: "#C8FF3D", // Chartreuse Neon Volt
    accentColor: "#8C9390", // Grey Olive
    currencySymbol: "KSh",
    currencyCode: "KES",
    taxRate: 16.0,
    contactEmail: "contact@pulsefitness.co.ke",
    phone: "+254 712 345 678",
    address: "Woodvale Grove, Westlands, Nairobi, Kenya",
    website: "https://pulsefitness.co.ke",
  },
  ironpeak: {
    gymName: "IronPeak Barbell & Powerhouse",
    tagline: "Forge Strength. Master Discipline.",
    primaryColor: "#C8FF3D", // Chartreuse Volt
    accentColor: "#8C9390", // Grey Olive
    currencySymbol: "KSh",
    currencyCode: "KES",
    taxRate: 16.0,
    contactEmail: "info@ironpeak.co.ke",
    phone: "+254 722 234 567",
    address: "Ngong Road, Kilimani, Nairobi, Kenya",
    website: "https://ironpeak.co.ke",
  },
  apex: {
    gymName: "Apex Athletics & Boxing Club",
    tagline: "Unleash the Champion Within.",
    primaryColor: "#10b981", // Emerald Green
    accentColor: "#f59e0b", // Gold Amber
    currencySymbol: "KSh",
    currencyCode: "KES",
    taxRate: 16.0,
    contactEmail: "admin@apexathletic.co.ke",
    phone: "+254 733 946 019",
    address: "Karen Crossroads, Nairobi, Kenya",
    website: "https://apexathletic.co.ke",
  },
  titan: {
    gymName: "Titan Barbell & Powerhouse",
    tagline: "Heavy Metal. Real Results.",
    primaryColor: "#f59e0b", // Amber / Gold
    accentColor: "#ef4444", // Red
    currencySymbol: "KSh",
    currencyCode: "KES",
    taxRate: 16.0,
    contactEmail: "contact@titanpower.co.ke",
    phone: "+254 710 123 456",
    address: "Limuru Road, Gigiri, Nairobi, Kenya",
    website: "https://titanpower.co.ke",
  },
};

interface BrandContextType {
  brand: GymBrand;
  isLoading: boolean;
  updateBrand: (newBrand: Partial<GymBrand>) => Promise<void>;
  applyPreset: (presetKey: string) => Promise<void>;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const [brand, setBrand] = useState<GymBrand>(PRESET_BRANDS.pulse);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Apply CSS custom properties dynamically to document
  const applyCSSVariables = (b: GymBrand) => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.style.setProperty("--brand-primary", b.primaryColor);
      root.style.setProperty("--brand-accent", b.accentColor);
      root.style.setProperty("--brand-600", b.primaryColor);
    }
  };

  useEffect(() => {
    async function loadBrand() {
      try {
        const res = await fetch("/api/gym-settings");
        if (res.ok) {
          const data = await res.json();
          if (data && data.gymName) {
            setBrand(data);
            applyCSSVariables(data);
          } else {
            applyCSSVariables(PRESET_BRANDS.pulse);
          }
        } else {
          applyCSSVariables(PRESET_BRANDS.pulse);
        }
      } catch (err) {
        console.error("Error loading brand settings:", err);
        applyCSSVariables(PRESET_BRANDS.pulse);
      } finally {
        setIsLoading(false);
      }
    }
    loadBrand();
  }, []);

  const updateBrand = async (newBrand: Partial<GymBrand>) => {
    const updated = { ...brand, ...newBrand };
    setBrand(updated);
    applyCSSVariables(updated);

    try {
      await fetch("/api/gym-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.error("Failed to persist brand changes to database:", err);
    }
  };

  const applyPreset = async (presetKey: string) => {
    if (PRESET_BRANDS[presetKey]) {
      await updateBrand(PRESET_BRANDS[presetKey]);
    }
  };

  return (
    <BrandContext.Provider value={{ brand, isLoading, updateBrand, applyPreset }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error("useBrand must be used within a BrandProvider");
  }
  return context;
}
