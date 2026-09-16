import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Members count
    const totalMembers = await prisma.member.count();
    const activeMembers = await prisma.member.count({
      where: { status: "ACTIVE" },
    });
    const expiredMembers = await prisma.member.count({
      where: { status: "EXPIRED" },
    });
    const pendingLeads = await prisma.lead.count({
      where: { status: { in: ["NEW_INQUIRY", "TRIAL_BOOKED"] } },
    });

    // 2. Today's attendances
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todayAttendances = await prisma.attendance.findMany({
      where: {
        checkInTime: { gte: startOfToday },
      },
      include: {
        member: true,
      },
      orderBy: { checkInTime: "desc" },
      take: 8,
    });

    const todayCheckinCount = await prisma.attendance.count({
      where: { checkInTime: { gte: startOfToday } },
    });

    // 3. Monthly Revenue
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyPayments = await prisma.payment.findMany({
      where: {
        status: "PAID",
        paidAt: { gte: startOfMonth },
      },
    });

    const monthlyRevenue = monthlyPayments.reduce(
      (sum, p) => sum + p.amount,
      0
    );

    // 4. Expiring subscriptions (next 7 days)
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);

    const expiringSubscriptions = await prisma.subscription.findMany({
      where: {
        status: "ACTIVE",
        endDate: {
          gte: now,
          lte: nextWeek,
        },
      },
      include: {
        member: true,
        plan: true,
      },
      take: 5,
    });

    // 5. Recent Payments
    const recentPayments = await prisma.payment.findMany({
      where: { status: "PAID" },
      include: {
        member: true,
      },
      orderBy: { paidAt: "desc" },
      take: 5,
    });

    // 6. Upcoming Classes Today
    const classes = await prisma.classSchedule.findMany({
      where: { isActive: true },
      take: 4,
    });

    return NextResponse.json({
      stats: {
        totalMembers,
        activeMembers,
        expiredMembers,
        todayCheckinCount,
        monthlyRevenue,
        pendingLeads,
      },
      todayAttendances,
      expiringSubscriptions,
      recentPayments,
      classes,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      {
        stats: {
          totalMembers: 0,
          activeMembers: 0,
          expiredMembers: 0,
          todayCheckinCount: 0,
          monthlyRevenue: 0,
          pendingLeads: 0,
        },
        todayAttendances: [],
        expiringSubscriptions: [],
        recentPayments: [],
        classes: [],
      },
      { status: 200 }
    );
  }
}
