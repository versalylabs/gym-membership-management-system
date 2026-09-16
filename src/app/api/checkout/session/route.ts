import { NextRequest, NextResponse } from "next/server";
import { processMembershipCheckout } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planId, member, cardLast4, cardBrand } = body;

    if (!planId) {
      return NextResponse.json(
        { error: "Plan ID is required." },
        { status: 400 }
      );
    }

    if (!member || !member.firstName || !member.lastName || !member.email || !member.phone) {
      return NextResponse.json(
        { error: "First name, last name, email, and phone number are required." },
        { status: 400 }
      );
    }

    const result = await processMembershipCheckout({
      planId,
      member,
      cardLast4: cardLast4 || "4242",
      cardBrand: cardBrand || "Visa",
    });

    return NextResponse.json({
      success: true,
      message: "Membership activated successfully!",
      ...result,
    });
  } catch (error: any) {
    console.error("Checkout Session Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process membership checkout." },
      { status: 500 }
    );
  }
}
