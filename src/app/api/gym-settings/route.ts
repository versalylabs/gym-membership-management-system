import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let settings = await prisma.gymSetting.findUnique({
      where: { id: "default-gym" },
    });

    if (!settings) {
      settings = await prisma.gymSetting.create({
        data: {
          id: "default-gym",
          gymName: "Pulse",
          tagline: "Fuel Your Heartbeat. Master Your Strength.",
          primaryColor: "#C8FF3D",
          accentColor: "#8C9390",
          currencySymbol: "$",
          currencyCode: "USD",
          taxRate: 8.25,
          contactEmail: "contact@pulsegym.com",
          phone: "+1 (555) 892-4411",
          address: "450 Olympus Way, Suite 100, Austin, TX",
          website: "https://pulsegym.com",
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching gym settings:", error);
    return NextResponse.json(
      {
        gymName: "Pulse",
        tagline: "Fuel Your Heartbeat. Master Your Strength.",
        primaryColor: "#C8FF3D",
        accentColor: "#8C9390",
        currencySymbol: "$",
        currencyCode: "USD",
        taxRate: 8.25,
        contactEmail: "contact@pulsegym.com",
        phone: "+1 (555) 892-4411",
        address: "450 Olympus Way, Suite 100, Austin, TX",
        website: "https://pulsegym.com",
      },
      { status: 200 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      gymName,
      tagline,
      logoUrl,
      primaryColor,
      accentColor,
      currencySymbol,
      currencyCode,
      taxRate,
      contactEmail,
      phone,
      address,
      website,
    } = body;

    const updated = await prisma.gymSetting.upsert({
      where: { id: "default-gym" },
      update: {
        gymName: gymName ?? undefined,
        tagline: tagline ?? undefined,
        logoUrl: logoUrl ?? undefined,
        primaryColor: primaryColor ?? undefined,
        accentColor: accentColor ?? undefined,
        currencySymbol: currencySymbol ?? undefined,
        currencyCode: currencyCode ?? undefined,
        taxRate: taxRate !== undefined ? parseFloat(taxRate) : undefined,
        contactEmail: contactEmail ?? undefined,
        phone: phone ?? undefined,
        address: address ?? undefined,
        website: website ?? undefined,
      },
      create: {
        id: "default-gym",
        gymName: gymName || "IronPeak Fitness & Performance",
        tagline: tagline || "Forge Strength. Master Discipline.",
        logoUrl: logoUrl || "/logo.png",
        primaryColor: primaryColor || "#dc2626",
        accentColor: accentColor || "#f97316",
        currencySymbol: currencySymbol || "$",
        currencyCode: currencyCode || "USD",
        taxRate: taxRate ? parseFloat(taxRate) : 8.25,
        contactEmail: contactEmail || "info@ironpeakfitness.com",
        phone: phone || "+1 (555) 234-5678",
        address: address || "450 Olympus Way, Austin, TX",
        website: website || "https://ironpeakfitness.com",
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error saving gym settings:", error);
    return NextResponse.json({ error: "Failed to update gym settings" }, { status: 500 });
  }
}
