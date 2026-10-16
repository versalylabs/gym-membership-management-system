import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { planId, paymentMethod, amountPaid, durationMonths } = await req.json();

    const member = await prisma.member.findUnique({
      where: { id },
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const plan = await prisma.membershipPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    // Determine new start date: from now or if current subscription hasn't ended yet
    const latestSub = await prisma.subscription.findFirst({
      where: { memberId: id, status: "ACTIVE" },
      orderBy: { endDate: "desc" },
    });

    let startDate = new Date();
    if (latestSub && new Date(latestSub.endDate) > new Date()) {
      startDate = new Date(latestSub.endDate);
    }

    const endDate = new Date(startDate);
    const months = durationMonths || plan.durationMonths || 1;
    endDate.setMonth(endDate.getMonth() + months);

    const price = amountPaid !== undefined ? parseFloat(amountPaid) : plan.price;

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create new active subscription
      const subscription = await tx.subscription.create({
        data: {
          memberId: id,
          planId: plan.id,
          startDate,
          endDate,
          status: "ACTIVE",
          pricePaid: price,
        },
      });

      // 2. Mark member as active
      await tx.member.update({
        where: { id },
        data: { status: "ACTIVE" },
      });

      // 3. Create payment record
      const payment = await tx.payment.create({
        data: {
          memberId: id,
          subscriptionId: subscription.id,
          amount: price,
          currency: "KES",
          method: paymentMethod || "MPESA",
          status: "PAID",
          receiptNumber: `REC-${Math.floor(100000 + Math.random() * 900000)}`,
          invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          notes: `Membership Renewal: ${plan.name}`,
          paidAt: new Date(),
        },
      });

      return { subscription, payment };
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error("Renewal error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process renewal." },
      { status: 500 }
    );
  }
}
