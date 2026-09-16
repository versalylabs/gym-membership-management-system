import { NextResponse } from "next/server";
import { runRecurringBillingCycle } from "@/lib/stripe";

export async function POST() {
  try {
    const results = await runRecurringBillingCycle();
    return NextResponse.json({
      success: true,
      message: `Recurring billing executed. Evaluated ${results.totalEvaluated} accounts, successfully charged ${results.renewedCount}, failed ${results.failedCount}.`,
      results,
    });
  } catch (error: any) {
    console.error("Recurring Billing Cron Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to run recurring billing cycle." },
      { status: 500 }
    );
  }
}
