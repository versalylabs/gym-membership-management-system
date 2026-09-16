import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const trainers = await prisma.user.findMany({
      where: { role: { in: ["TRAINER", "MANAGER", "OWNER"] } },
      include: {
        trainers: {
          include: { member: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    return NextResponse.json(trainers);
  } catch (error) {
    console.error("Error fetching trainers:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { trainerId, memberId, sessionsTotal, notes } = body;

    if (!trainerId || !memberId) {
      return NextResponse.json(
        { error: "Trainer ID and Member ID are required." },
        { status: 400 }
      );
    }

    const sessions = sessionsTotal ? parseInt(sessionsTotal) : 10;

    const client = await prisma.trainerClient.create({
      data: {
        trainerId,
        memberId,
        sessionsTotal: sessions,
        sessionsRemaining: sessions,
        notes: notes || "Personal Training Package",
      },
      include: { member: true, trainer: true },
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error("Error assigning PT client:", error);
    return NextResponse.json(
      { error: "Failed to assign personal training client." },
      { status: 500 }
    );
  }
}
