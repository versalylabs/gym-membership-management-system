import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const plans = await prisma.membershipPlan.findMany({
      orderBy: { price: "asc" },
      include: {
        _count: {
          select: { subscriptions: true },
        },
      },
    });
    return NextResponse.json(plans);
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      description,
      durationMonths,
      durationDays,
      price,
      signupFee,
      sessionLimit,
      isGroupClass,
      isPersonalTraining,
      features,
    } = body;

    if (!name || price === undefined) {
      return NextResponse.json(
        { error: "Plan name and price are required." },
        { status: 400 }
      );
    }

    const plan = await prisma.membershipPlan.create({
      data: {
        name,
        description: description || null,
        durationMonths: durationMonths ? parseInt(durationMonths) : 1,
        durationDays: durationDays ? parseInt(durationDays) : 30,
        price: parseFloat(price),
        signupFee: signupFee ? parseFloat(signupFee) : 0.0,
        sessionLimit: sessionLimit ? parseInt(sessionLimit) : null,
        isGroupClass: isGroupClass !== undefined ? isGroupClass : true,
        isPersonalTraining: isPersonalTraining || false,
        features: Array.isArray(features) ? features.join(",") : features || "",
        isActive: true,
      },
    });

    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error("Error creating membership plan:", error);
    return NextResponse.json(
      { error: "Failed to create membership plan." },
      { status: 500 }
    );
  }
}
