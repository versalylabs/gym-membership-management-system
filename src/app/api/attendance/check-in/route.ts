import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { code, method } = await req.json();

    if (!code || !code.trim()) {
      return NextResponse.json(
        { error: "Member ID, barcode, or phone number is required." },
        { status: 400 }
      );
    }

    const cleanCode = code.trim();
    const formattedCode = cleanCode.toUpperCase();
    const withPrefix = formattedCode.startsWith("PLS-") ? formattedCode : `PLS-${formattedCode}`;

    const member = await prisma.member.findFirst({
      where: {
        OR: [
          { memberCode: formattedCode },
          { memberCode: withPrefix },
          { qrCodeToken: cleanCode },
          { email: cleanCode.toLowerCase() },
          { phone: cleanCode },
          { phone: { contains: cleanCode } },
        ],
      },
      include: {
        subscriptions: {
          include: { plan: true },
          orderBy: { endDate: "desc" },
          take: 1,
        },
      },
    });

    if (!member) {
      return NextResponse.json(
        {
          status: "NOT_FOUND",
          error: `No member found matching "${cleanCode}". Please verify your Member ID (e.g. PLS-1001) or phone number.`,
        },
        { status: 404 }
      );
    }

    const latestSub = member.subscriptions[0];

    // Check if membership is frozen
    if (member.status === "FROZEN") {
      return NextResponse.json(
        {
          status: "FROZEN",
          error: `Membership for ${member.firstName} ${member.lastName} is currently FROZEN. Please unfreeze at the front desk.`,
          member,
        },
        { status: 400 }
      );
    }

    // Check if membership is expired
    if (
      member.status === "EXPIRED" ||
      !latestSub ||
      new Date(latestSub.endDate) < new Date()
    ) {
      return NextResponse.json(
        {
          status: "EXPIRED",
          error: `Membership for ${member.firstName} ${member.lastName} expired on ${
            latestSub
              ? new Date(latestSub.endDate).toLocaleDateString()
              : "N/A"
          }. Please renew at the reception desk.`,
          member,
        },
        { status: 400 }
      );
    }

    // Record check-in
    const attendance = await prisma.attendance.create({
      data: {
        memberId: member.id,
        method: method || "KIOSK_TABLET",
      },
    });

    return NextResponse.json({
      success: true,
      status: "ADMITTED",
      message: `Welcome back, ${member.firstName}! Turnstile unlocked.`,
      member,
      attendance,
      planName: latestSub.plan.name,
      expiresAt: latestSub.endDate,
    });
  } catch (error) {
    console.error("Attendance check-in error:", error);
    return NextResponse.json(
      { error: "Internal server error processing check-in." },
      { status: 500 }
    );
  }
}
