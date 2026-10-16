import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, memberId, paymentMethod, totalAmount, notes } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart cannot be empty." },
        { status: 400 }
      );
    }

    // Execute atomic checkout transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Check & Deduct Stock
      for (const item of items) {
        const prod = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!prod) {
          throw new Error(`Product ${item.productId} not found.`);
        }

        if (prod.stockQuantity < item.quantity) {
          throw new Error(
            `Insufficient stock for "${prod.name}". Only ${prod.stockQuantity} remaining.`
          );
        }

        await tx.product.update({
          where: { id: prod.id },
          data: {
            stockQuantity: { decrement: item.quantity },
          },
        });
      }

      // 2. Create Sale Record
      const sale = await tx.sale.create({
        data: {
          memberId: memberId || null,
          totalAmount: parseFloat(totalAmount),
          paymentMethod: paymentMethod || "MPESA",
          notes: notes || "POS Front-Desk Register Sale",
        },
      });

      // 3. Create Sale Items
      const createdItems = [];
      for (const item of items) {
        const saleItem = await tx.saleItem.create({
          data: {
            saleId: sale.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: parseFloat(item.unitPrice),
            subtotal: parseFloat(item.unitPrice) * item.quantity,
          },
          include: { product: true },
        });
        createdItems.push(saleItem);
      }

      // 4. Create Payment Transaction Ledger
      const receiptNumber = `POS-${Math.floor(100000 + Math.random() * 900000)}`;
      let payment = null;

      if (memberId) {
        payment = await tx.payment.create({
          data: {
            memberId,
            amount: parseFloat(totalAmount),
            currency: "KES",
            method: paymentMethod || "MPESA",
            status: "PAID",
            receiptNumber,
            invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
            notes: `POS Merchandise Purchase (${items.length} items)`,
            paidAt: new Date(),
          },
        });
      }

      return { sale, items: createdItems, payment, receiptNumber };
    });

    return NextResponse.json({ success: true, ...result }, { status: 201 });
  } catch (error: any) {
    console.error("POS Checkout error:", error);
    return NextResponse.json(
      { error: error?.message || "Checkout failed." },
      { status: 500 }
    );
  }
}
