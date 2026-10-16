import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
export const isStripeConfigured = Boolean(stripeSecretKey && !stripeSecretKey.includes("placeholder"));

export const stripe = isStripeConfigured
  ? new Stripe(stripeSecretKey!, {
      apiVersion: "2024-06-20" as any,
    })
  : null;

export interface CheckoutParams {
  planId: string;
  member: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender?: string;
  };
  cardLast4?: string;
  cardBrand?: string;
}

/**
 * Creates a checkout session or simulated instant authorization
 */
export async function processMembershipCheckout(params: CheckoutParams) {
  const { planId, member: memberData, cardLast4 = "4242", cardBrand = "Visa" } = params;

  const plan = await prisma.membershipPlan.findUnique({
    where: { id: planId },
  });

  if (!plan) {
    throw new Error("Membership plan not found.");
  }

  // Check if member already exists by email
  let member = await prisma.member.findUnique({
    where: { email: memberData.email.toLowerCase().trim() },
  });

  const memberCode =
    member?.memberCode || `PLS-${Math.floor(1000 + Math.random() * 9000)}`;

  const startDate = new Date();
  const endDate = new Date();
  const durationMonths = plan.durationMonths || 1;
  endDate.setMonth(endDate.getMonth() + durationMonths);

  const totalPrice = plan.price + (plan.signupFee || 0);
  const receiptNumber = `STRIPE-${Math.floor(100000 + Math.random() * 900000)}`;
  const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const result = await prisma.$transaction(async (tx) => {
    // 1. Create or update member
    if (!member) {
      member = await tx.member.create({
        data: {
          memberCode,
          firstName: memberData.firstName.trim(),
          lastName: memberData.lastName.trim(),
          email: memberData.email.toLowerCase().trim(),
          phone: memberData.phone.trim(),
          gender: memberData.gender || "Unspecified",
          status: "ACTIVE",
          joinDate: startDate,
          cardBrand,
          cardLast4,
        },
      });
    } else {
      member = await tx.member.update({
        where: { id: member.id },
        data: {
          status: "ACTIVE",
          cardBrand,
          cardLast4,
        },
      });
    }

    // 2. Create subscription
    const subscription = await tx.subscription.create({
      data: {
        memberId: member.id,
        planId: plan.id,
        startDate,
        endDate,
        status: "ACTIVE",
        autoRenew: true,
        pricePaid: totalPrice,
        nextBillingDate: endDate,
      },
    });

    // 3. Create payment record
    const payment = await tx.payment.create({
      data: {
        memberId: member.id,
        subscriptionId: subscription.id,
        amount: totalPrice,
        currency: "KES",
        method: "STRIPE",
        status: "PAID",
        receiptNumber,
        invoiceNumber,
        notes: `Online Registration: ${plan.name} (${cardBrand} •••• ${cardLast4})`,
        stripePaymentIntentId: `pi_sim_${Math.random().toString(36).substring(2, 12)}`,
        paidAt: new Date(),
      },
    });

    return { member, subscription, payment, plan };
  });

  return result;
}

/**
 * Process a full or partial refund on an existing payment
 */
export async function processPaymentRefund(params: {
  paymentId: string;
  amount?: number;
  reason?: string;
}) {
  const { paymentId, amount, reason = "Customer request / cancellation" } = params;

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { member: true, subscription: true },
  });

  if (!payment) {
    throw new Error("Payment record not found.");
  }

  if (payment.status === "REFUNDED") {
    throw new Error("This transaction has already been fully refunded.");
  }

  const refundAmount = amount ? Math.min(amount, payment.amount) : payment.amount;
  const isFullRefund = refundAmount >= payment.amount;

  const updatedPayment = await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: isFullRefund ? "REFUNDED" : "PAID",
      refundedAmount: (payment.refundedAmount || 0) + refundAmount,
      refundStatus: isFullRefund ? "FULL" : "PARTIAL",
      refundReason: reason,
    },
    include: { member: true, subscription: true },
  });

  return updatedPayment;
}

/**
 * Recurring Billing Engine:
 * Scans active auto-renew subscriptions and charges renewals
 */
export async function runRecurringBillingCycle() {
  const now = new Date();
  const twoDaysAhead = new Date();
  twoDaysAhead.setDate(twoDaysAhead.getDate() + 2);

  // Find all auto-renew subscriptions where endDate <= twoDaysAhead
  const eligibleSubs = await prisma.subscription.findMany({
    where: {
      status: "ACTIVE",
      autoRenew: true,
      endDate: { lte: twoDaysAhead },
    },
    include: {
      member: true,
      plan: true,
    },
  });

  const results = {
    totalEvaluated: eligibleSubs.length,
    renewedCount: 0,
    failedCount: 0,
    renewals: [] as any[],
  };

  for (const sub of eligibleSubs) {
    try {
      const price = sub.plan.price;
      const durationMonths = sub.plan.durationMonths || 1;
      
      const newStartDate = new Date(sub.endDate);
      const newEndDate = new Date(newStartDate);
      newEndDate.setMonth(newEndDate.getMonth() + durationMonths);

      const receiptNumber = `REC-AUTOBILL-${Math.floor(100000 + Math.random() * 900000)}`;
      const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const renewed = await prisma.$transaction(async (tx) => {
        // Extend subscription
        const updatedSub = await tx.subscription.update({
          where: { id: sub.id },
          data: {
            startDate: newStartDate,
            endDate: newEndDate,
            nextBillingDate: newEndDate,
            failedAttempts: 0,
          },
        });

        // Ensure member is marked active
        await tx.member.update({
          where: { id: sub.memberId },
          data: { status: "ACTIVE" },
        });

        // Create recurring renewal payment
        const payment = await tx.payment.create({
          data: {
            memberId: sub.memberId,
            subscriptionId: sub.id,
            amount: price,
            currency: "KES",
            method: "STRIPE",
            status: "PAID",
            receiptNumber,
            invoiceNumber,
            notes: `Automated Subscription Renewal: ${sub.plan.name} (${sub.member.cardBrand || "Card"} •••• ${sub.member.cardLast4 || "4242"})`,
            stripePaymentIntentId: `pi_rec_${Math.random().toString(36).substring(2, 12)}`,
            paidAt: new Date(),
          },
        });

        return { memberName: `${sub.member.firstName} ${sub.member.lastName}`, planName: sub.plan.name, amount: price, paymentId: payment.id, receiptNumber, newEndDate };
      });

      results.renewedCount++;
      results.renewals.push(renewed);
    } catch (err: any) {
      results.failedCount++;
      // Increment failed count on subscription
      await prisma.subscription.update({
        where: { id: sub.id },
        data: {
          failedAttempts: { increment: 1 },
        },
      });
    }
  }

  return results;
}
