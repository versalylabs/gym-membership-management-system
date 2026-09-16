import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { clientId, workoutNotes } = await req.json();

    if (!clientId) {
      return NextResponse.json(
        { error: "Client ID is required." },
        { status: 400 }
      );
    }

    const client = await prisma.trainerClient.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      return NextResponse.json({ error: "Client pack not found." }, { status: 404 });
    }

    if (client.sessionsRemaining <= 0) {
      return NextResponse.json(
        { error: "No sessions remaining in this client pack. Please renew PT package." },
        { status: 400 }
      );
    }

    const updated = await prisma.trainerClient.update({
      where: { id: clientId },
      data: {
        sessionsRemaining: { decrement: 1 },
        notes: workoutNotes
          ? `${client.notes || ""}\n[${new Date().toLocaleDateString()}]: ${workoutNotes}`
          : client.notes,
      },
      include: { member: true },
    });

    return NextResponse.json({ success: true, client: updated });
  } catch (error) {
    console.error("Error debiting PT session:", error);
    return NextResponse.json(
      { error: "Failed to debit session." },
      { status: 500 }
    );
  }
}
