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
    const { name, email, phone, role, isActive } = body;

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        name: name !== undefined ? name : undefined,
        email: email !== undefined ? email : undefined,
        phone: phone !== undefined ? phone : undefined,
        role: role !== undefined ? role : undefined,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating trainer:", error);
    return NextResponse.json(
      { error: "Failed to update trainer details." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const existing = await prisma.user.findUnique({
      where: { id },
      include: { trainers: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 });
    }

    // Delete associated trainer-client assignment records first
    await prisma.trainerClient.deleteMany({
      where: { trainerId: id },
    });

    // Delete the trainer user record
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Trainer removed successfully." });
  } catch (error) {
    console.error("Error deleting trainer:", error);
    return NextResponse.json(
      { error: "Failed to delete trainer." },
      { status: 500 }
    );
  }
}
