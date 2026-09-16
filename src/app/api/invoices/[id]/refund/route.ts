import { NextRequest, NextResponse } from "next/server";
import { processPaymentRefund } from "@/lib/stripe";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json().catch(() => ({}));
    const { amount, reason } = body;

    const refunded = await processPaymentRefund({
      paymentId: id,
      amount: amount ? parseFloat(amount) : undefined,
      reason: reason || "Customer request / Front desk cancellation",
    });

    return NextResponse.json({
      success: true,
      message: "Refund processed successfully.",
      payment: refunded,
    });
  } catch (error: any) {
    console.error("Refund API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process refund." },
      { status: 500 }
    );
  }
}
