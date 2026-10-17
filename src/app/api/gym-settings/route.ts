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
          currencySymbol: "KSh",
          currencyCode: "KES",
          taxRate: 16.0,
          contactEmail: "versalylabs@gmail.com",
          phone: "+254 704 611 033 / +254 929 868 25",
          address: "Ruaraka, Nairobi, Kenya",
          website: "https://pulsefitness.co.ke",
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
        currencySymbol: "KSh",
        currencyCode: "KES",
        taxRate: 16.0,
        contactEmail: "versalylabs@gmail.com",
        phone: "+254 704 611 033 / +254 929 868 25",
        address: "Ruaraka, Nairobi, Kenya",
        website: "https://pulsefitness.co.ke",
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
        gymName: gymName || "Pulse",
        tagline: tagline || "Fuel Your Heartbeat. Master Your Strength.",
        logoUrl: logoUrl || "/logo.png",
        primaryColor: primaryColor || "#C8FF3D",
        accentColor: accentColor || "#8C9390",
        currencySymbol: currencySymbol || "KSh",
        currencyCode: currencyCode || "KES",
        taxRate: taxRate ? parseFloat(taxRate) : 16.0,
        contactEmail: contactEmail || "versalylabs@gmail.com",
        phone: phone || "+254 704 611 033 / +254 929 868 25",
        address: address || "Ruaraka, Nairobi, Kenya",
        website: website || "https://pulsefitness.co.ke",
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error saving gym settings:", error);
    return NextResponse.json({ error: "Failed to update gym settings" }, { status: 500 });
  }
}
