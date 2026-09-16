import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const bookings = await prisma.classBooking.findMany({
      where: { classId: id },
      include: { member: true },
      orderBy: { bookingDate: "desc" },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching class bookings:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { memberId } = await req.json();

    if (!memberId) {
      return NextResponse.json(
        { error: "Member ID is required." },
        { status: 400 }
      );
    }

    const classObj = await prisma.classSchedule.findUnique({
      where: { id },
      include: { bookings: true },
    });

    if (!classObj) {
      return NextResponse.json({ error: "Class not found." }, { status: 404 });
    }

    // Check capacity
    if (classObj.bookings.length >= classObj.capacity) {
      return NextResponse.json(
        { error: `This class is at full capacity (${classObj.capacity} spots).` },
        { status: 400 }
      );
    }

    // Check duplicate booking
    const existing = await prisma.classBooking.findFirst({
      where: { classId: id, memberId },
    });

    if (existing) {
      return NextResponse.json(
        { error: "This member is already registered for this class." },
        { status: 400 }
      );
    }

    const booking = await prisma.classBooking.create({
      data: {
        classId: id,
        memberId,
        status: "CONFIRMED",
      },
      include: { member: true },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error creating class booking:", error);
    return NextResponse.json(
      { error: "Failed to book class." },
      { status: 500 }
    );
  }
}
