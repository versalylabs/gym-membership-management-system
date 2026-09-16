import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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
      isActive,
    } = body;

    const updated = await prisma.membershipPlan.update({
      where: { id },
      data: {
        name,
        description: description ?? undefined,
        durationMonths: durationMonths !== undefined ? parseInt(durationMonths) : undefined,
        durationDays: durationDays !== undefined ? parseInt(durationDays) : undefined,
        price: price !== undefined ? parseFloat(price) : undefined,
        signupFee: signupFee !== undefined ? parseFloat(signupFee) : undefined,
        sessionLimit: sessionLimit !== undefined ? (sessionLimit ? parseInt(sessionLimit) : null) : undefined,
        isGroupClass: isGroupClass !== undefined ? isGroupClass : undefined,
        isPersonalTraining: isPersonalTraining !== undefined ? isPersonalTraining : undefined,
        features: Array.isArray(features) ? features.join(",") : features,
        isActive: isActive !== undefined ? isActive : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating plan:", error);
    return NextResponse.json({ error: "Failed to update plan" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    // Toggle inactive instead of hard delete to preserve historical subscriptions
    const plan = await prisma.membershipPlan.update({
      where: { id },
      data: { isActive: false },
    });
    return NextResponse.json({ success: true, plan });
  } catch (error) {
    console.error("Error archiving plan:", error);
    return NextResponse.json({ error: "Failed to delete plan" }, { status: 500 });
  }
}
