import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string; bookingId: string } }
) {
  try {
    const { bookingId } = params;
    const { status } = await req.json();

    if (!["CONFIRMED", "ATTENDED", "CANCELLED", "NO_SHOW"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid attendance status value." },
        { status: 400 }
      );
    }

    const updated = await prisma.classBooking.update({
      where: { id: bookingId },
      data: { status },
      include: { member: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating booking status:", error);
    return NextResponse.json(
      { error: "Failed to update booking status." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string; bookingId: string } }
) {
  try {
    const { bookingId } = params;
    await prisma.classBooking.delete({
      where: { id: bookingId },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { error: "Failed to remove booking." },
      { status: 500 }
    );
  }
}
