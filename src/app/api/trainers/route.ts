import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

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

    // Check if this is a request to create a new trainer
    if (body.action === "CREATE_TRAINER" || (body.name && body.email && !body.memberId)) {
      const { name, email, phone, role } = body;
      if (!name || !email) {
        return NextResponse.json(
          { error: "Name and email are required to add a trainer." },
          { status: 400 }
        );
      }

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json(
          { error: "A staff member or user with this email already exists." },
          { status: 400 }
        );
      }

      const hashedPassword = await hashPassword(body.password || "pulse123");

      const newTrainer = await prisma.user.create({
        data: {
          name,
          email,
          phone: phone || null,
          role: role || "TRAINER",
          passwordHash: hashedPassword,
          isActive: true,
        },
      });

      return NextResponse.json(newTrainer, { status: 201 });
    }

    // Default: Assign PT client
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
    console.error("Error processing trainer request:", error);
    return NextResponse.json(
      { error: "Failed to process trainer request." },
      { status: 500 }
    );
  }
}

