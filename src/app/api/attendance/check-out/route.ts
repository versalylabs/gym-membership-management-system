import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { attendanceId } = await req.json();

    if (!attendanceId) {
      return NextResponse.json(
        { error: "Attendance ID is required." },
        { status: 400 }
      );
    }

    const attendance = await prisma.attendance.update({
      where: { id: attendanceId },
      data: {
        checkOutTime: new Date(),
      },
      include: { member: true },
    });

    return NextResponse.json({ success: true, attendance });
  } catch (error) {
    console.error("Check-out error:", error);
    return NextResponse.json(
      { error: "Failed to record check-out." },
      { status: 500 }
    );
  }
}
