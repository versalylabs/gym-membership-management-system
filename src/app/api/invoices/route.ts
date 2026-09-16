import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const method = searchParams.get("method");
    const status = searchParams.get("status");

    const where: any = {};
    if (method && method !== "ALL") where.method = method;
    if (status && status !== "ALL") where.status = status;

    const payments = await prisma.payment.findMany({
      where,
      include: {
        member: true,
        subscription: {
          include: { plan: true },
        },
      },
      orderBy: { paidAt: "desc" },
      take: 100,
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json([], { status: 500 });
  }
}
