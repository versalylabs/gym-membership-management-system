import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const totalMembers = await prisma.member.count();
    const activeMembers = await prisma.member.count({ where: { status: "ACTIVE" } });
    const expiredMembers = await prisma.member.count({ where: { status: "EXPIRED" } });
    const frozenMembers = await prisma.member.count({ where: { status: "FROZEN" } });

    // Payments
    const payments = await prisma.payment.findMany({
      where: { status: "PAID" },
      include: { member: true },
      orderBy: { paidAt: "desc" },
    });

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    // POS Sales
    const sales = await prisma.sale.findMany({
      include: {
        items: { include: { product: true } },
      },
    });

    const totalPosRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
    const subscriptionRevenue = totalRevenue - totalPosRevenue;

    // Top Selling Products
    const saleItems = await prisma.saleItem.findMany({
      include: { product: true },
    });

    const productSalesMap: Record<string, { name: string; units: number; revenue: number }> = {};
    for (const item of saleItems) {
      if (!productSalesMap[item.productId]) {
        productSalesMap[item.productId] = {
          name: item.product.name,
          units: 0,
          revenue: 0,
        };
      }
      productSalesMap[item.productId].units += item.quantity;
      productSalesMap[item.productId].revenue += item.subtotal;
    }

    const topProducts = Object.values(productSalesMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Churn calculation
    const churnRate =
      totalMembers > 0
        ? ((expiredMembers / totalMembers) * 100).toFixed(1)
        : "0.0";

    // Peak Hours calculation from Attendance
    const attendances = await prisma.attendance.findMany();
    const hourlyCounts: Record<number, number> = {};
    for (let h = 6; h <= 22; h++) hourlyCounts[h] = 0;

    for (const att of attendances) {
      const hour = new Date(att.checkInTime).getHours();
      if (hourlyCounts[hour] !== undefined) {
        hourlyCounts[hour]++;
      }
    }

    return NextResponse.json({
      metrics: {
        totalRevenue,
        subscriptionRevenue: subscriptionRevenue > 0 ? subscriptionRevenue : totalRevenue,
        posRevenue: totalPosRevenue,
        totalMembers,
        activeMembers,
        expiredMembers,
        frozenMembers,
        churnRate: `${churnRate}%`,
        totalCheckins: attendances.length,
      },
      topProducts,
      hourlyTraffic: hourlyCounts,
      recentPayments: payments.slice(0, 50),
    });
  } catch (error) {
    console.error("Reports API error:", error);
    return NextResponse.json(
      {
        metrics: {
          totalRevenue: 0,
          subscriptionRevenue: 0,
          posRevenue: 0,
          totalMembers: 0,
          activeMembers: 0,
          expiredMembers: 0,
          frozenMembers: 0,
          churnRate: "0%",
          totalCheckins: 0,
        },
        topProducts: [],
        hourlyTraffic: {},
        recentPayments: [],
      },
      { status: 500 }
    );
  }
}
