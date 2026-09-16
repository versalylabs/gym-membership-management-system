import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const {
      title,
      description,
      instructorName,
      startTime,
      endTime,
      daysOfWeek,
      capacity,
      room,
      color,
    } = body;

    const updated = await prisma.classSchedule.update({
      where: { id },
      data: {
        title,
        description: description ?? undefined,
        instructorName,
        startTime,
        endTime,
        daysOfWeek,
        capacity: capacity !== undefined ? parseInt(capacity) : undefined,
        room,
        color,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating class:", error);
    return NextResponse.json({ error: "Failed to update class" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.classSchedule.update({
      where: { id },
      data: { isActive: false },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting class:", error);
    return NextResponse.json({ error: "Failed to delete class" }, { status: 500 });
  }
}
