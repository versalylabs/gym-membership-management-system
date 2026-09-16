import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status, freezeEndDate } = await req.json();

    if (!["ACTIVE", "FROZEN", "EXPIRED", "CANCELLED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value provided." },
        { status: 400 }
      );
    }

    const member = await prisma.member.update({
      where: { id },
      data: { status },
      include: {
        subscriptions: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    // If freezing, also update active subscription
    if (member.subscriptions.length > 0) {
      const activeSub = member.subscriptions[0];
      await prisma.subscription.update({
        where: { id: activeSub.id },
        data: {
          status,
          freezeStartDate: status === "FROZEN" ? new Date() : null,
          freezeEndDate:
            status === "FROZEN" && freezeEndDate
              ? new Date(freezeEndDate)
              : null,
        },
      });
    }

    return NextResponse.json({ success: true, member });
  } catch (error) {
    console.error("Error updating member status:", error);
    return NextResponse.json(
      { error: "Failed to update member status." },
      { status: 500 }
    );
  }
}
