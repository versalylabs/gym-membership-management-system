import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const leadName = body.name || body.fullName;
    const { email, phone, status, source, interest, notes, trialDate } = body;

    if (!leadName || !phone) {
      return NextResponse.json(
        { error: "Prospect name and phone number are required." },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.create({
      data: {
        name: leadName,
        email: email || null,
        phone,
        status: status || "NEW_INQUIRY",
        source: source || "WALK_IN",
        interest: interest || "General Gym Access",
        notes: notes || null,
        trialDate: trialDate ? new Date(trialDate) : null,
      },
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: "Failed to create new lead." },
      { status: 500 }
    );
  }
}
