import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    const where: any = {};

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
        { memberCode: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const members = await prisma.member.findMany({
      where,
      include: {
        subscriptions: {
          include: {
            plan: true,
          },
          orderBy: { endDate: "desc" },
          take: 1,
        },
        attendances: {
          orderBy: { checkInTime: "desc" },
          take: 1,
        },
      },
      orderBy: { joinDate: "desc" },
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      gender,
      dateOfBirth,
      address,
      emergencyName,
      emergencyPhone,
      emergencyRelation,
      medicalNotes,
      fitnessGoals,
      planId,
      startDate,
      paymentMethod,
      amountPaid,
      signature,
    } = body;

    if (!firstName || !lastName || !email || !phone || !planId) {
      return NextResponse.json(
        { error: "Missing required fields (First Name, Last Name, Email, Phone, Plan)." },
        { status: 400 }
      );
    }

    // Check duplicate email
    const existing = await prisma.member.findUnique({
      where: { email },
    });
    if (existing) {
      return NextResponse.json(
        { error: "A member with this email address already exists." },
        { status: 400 }
      );
    }

    // Generate unique Member Code: PLS-100X
    const lastMember = await prisma.member.findFirst({
      orderBy: { createdAt: "desc" },
    });
    let nextNum = 1001;
    if (lastMember && lastMember.memberCode) {
      const match = lastMember.memberCode.match(/\d+/);
      if (match) {
        nextNum = parseInt(match[0], 10) + 1;
      }
    }
    let memberCode = `PLS-${nextNum}`;
    while (await prisma.member.findUnique({ where: { memberCode } })) {
      nextNum++;
      memberCode = `PLS-${nextNum}`;
    }

    // Fetch Plan details
    const plan = await prisma.membershipPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Selected membership plan not found." },
        { status: 404 }
      );
    }

    // Calculate End Date
    const start = startDate ? new Date(startDate) : new Date();
    const end = new Date(start);
    if (plan.durationMonths) {
      end.setMonth(end.getMonth() + plan.durationMonths);
    } else {
      end.setDate(end.getDate() + (plan.durationDays || 30));
    }

    const price = amountPaid !== undefined ? parseFloat(amountPaid) : plan.price;

    // Atomic Transaction to create Member, Subscription, and Payment
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Member
      const member = await tx.member.create({
        data: {
          memberCode,
          firstName,
          lastName,
          email,
          phone,
          gender: gender || null,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          address: address || null,
          emergencyName: emergencyName || null,
          emergencyPhone: emergencyPhone || null,
          emergencyRelation: emergencyRelation || null,
          medicalNotes: medicalNotes || null,
          fitnessGoals: fitnessGoals || null,
          status: "ACTIVE",
          signature: signature || null,
          waiverSignedAt: signature ? new Date() : null,
        },
      });

      // 2. Create Subscription
      const subscription = await tx.subscription.create({
        data: {
          memberId: member.id,
          planId: plan.id,
          startDate: start,
          endDate: end,
          status: "ACTIVE",
          pricePaid: price,
        },
      });

      // 3. Create Payment Transaction
      const payment = await tx.payment.create({
        data: {
          memberId: member.id,
          subscriptionId: subscription.id,
          amount: price,
          currency: "KES",
          method: paymentMethod || "MPESA",
          status: "PAID",
          receiptNumber: `REC-${Math.floor(100000 + Math.random() * 900000)}`,
          invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          notes: `Initial registration for ${plan.name}`,
          paidAt: new Date(),
        },
      });

      return { member, subscription, payment };
    });

    return NextResponse.json({ success: true, ...result }, { status: 201 });
  } catch (error: any) {
    console.error("Error registering member:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to register new member." },
      { status: 500 }
    );
  }
}
