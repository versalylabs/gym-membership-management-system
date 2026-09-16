import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const classes = await prisma.classSchedule.findMany({
      where: { isActive: true },
      include: {
        bookings: {
          include: { member: true },
        },
      },
      orderBy: { startTime: "asc" },
    });
    return NextResponse.json(classes);
  } catch (error) {
    console.error("Error fetching classes:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
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

    if (!title || !instructorName || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Title, instructor, and start/end times are required." },
        { status: 400 }
      );
    }

    const newClass = await prisma.classSchedule.create({
      data: {
        title,
        description: description || "",
        instructorName,
        startTime,
        endTime,
        daysOfWeek: daysOfWeek || "MON,WED,FRI",
        capacity: capacity ? parseInt(capacity) : 20,
        room: room || "Studio A",
        color: color || "#3b82f6",
        isActive: true,
      },
    });

    return NextResponse.json(newClass, { status: 201 });
  } catch (error) {
    console.error("Error creating class:", error);
    return NextResponse.json(
      { error: "Failed to create class schedule." },
      { status: 500 }
    );
  }
}
