import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const defaultPasswordHash = await bcrypt.hash("pulse123", 10);

    // 1. Clean existing records
    await prisma.saleItem.deleteMany();
    await prisma.sale.deleteMany();
    await prisma.product.deleteMany();
    await prisma.classBooking.deleteMany();
    await prisma.classSchedule.deleteMany();
    await prisma.trainerClient.deleteMany();
    await prisma.attendance.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.subscription.deleteMany();
    await prisma.membershipPlan.deleteMany();
    await prisma.member.deleteMany();
    await prisma.lead.deleteMany();
    await prisma.user.deleteMany();
    await prisma.gymSetting.deleteMany();

    // 2. Default Gym Brand (Kenya / Nairobi)
    await prisma.gymSetting.create({
      data: {
        id: "default-gym",
        gymName: "Pulse",
        tagline: "Fuel Your Heartbeat. Master Your Strength.",
        logoUrl: "/logo.png",
        primaryColor: "#C8FF3D",
        accentColor: "#8C9390",
        currencySymbol: "KSh",
        currencyCode: "KES",
        taxRate: 16.0,
        contactEmail: "versalylabs@gmail.com",
        phone: "+254 704 611 033 / +254 929 868 25",
        address: "Woodvale Grove, Westlands, Nairobi, Kenya",
        website: "https://pulsefitness.co.ke",
        kioskPin: "1234",
      },
    });

    // 3. Staff / Trainers (Kenyan Staff & Coaches)
    await prisma.user.create({
      data: {
        email: "manager@pulsefitness.co.ke",
        name: "Alex Kiprotich",
        passwordHash: defaultPasswordHash,
        role: "MANAGER",
        phone: "+254 722 101 202",
      },
    });

    await prisma.user.create({
      data: {
        email: "frontdesk@pulsefitness.co.ke",
        name: "Faith Chebet",
        passwordHash: defaultPasswordHash,
        role: "RECEPTIONIST",
        phone: "+254 733 456 789",
      },
    });

    const trainerBrian = await prisma.user.create({
      data: {
        email: "brian.k@pulsefitness.co.ke",
        name: "Brian Kipchumba",
        passwordHash: defaultPasswordHash,
        role: "TRAINER",
        phone: "+254 711 987 654",
      },
    });

    const trainerWanjiku = await prisma.user.create({
      data: {
        email: "wanjiku.m@pulsefitness.co.ke",
        name: "Wanjiku Mwangi",
        passwordHash: defaultPasswordHash,
        role: "TRAINER",
        phone: "+254 720 555 444",
      },
    });

    const trainerDennis = await prisma.user.create({
      data: {
        email: "dennis.o@pulsefitness.co.ke",
        name: "Dennis Otieno",
        passwordHash: defaultPasswordHash,
        role: "TRAINER",
        phone: "+254 705 111 222",
      },
    });

    // 4. Membership Plans
    const planGold = await prisma.membershipPlan.create({
      data: {
        name: "Gold All-Access Annual",
        description: "Full 24/7 gym floor, sauna, steam room & unlimited group classes.",
        durationMonths: 12,
        durationDays: 365,
        price: 75000.0,
        signupFee: 0.0,
        isGroupClass: true,
        isPersonalTraining: false,
        features: "24/7 Access,Unlimited Classes,Sauna & Steam,Guest Pass (2/mo),Complimentary Towel Service",
      },
    });

    const planMonthly = await prisma.membershipPlan.create({
      data: {
        name: "Monthly Flex Plan",
        description: "Month-to-month access to gym floor, weights, and locker rooms.",
        durationMonths: 1,
        durationDays: 30,
        price: 6500.0,
        signupFee: 1500.0,
        isGroupClass: true,
        isPersonalTraining: false,
        features: "Peak & Off-Peak Access,Locker Room,No Contract Lock-in,Free Induction",
      },
    });

    const planPunchCard = await prisma.membershipPlan.create({
      data: {
        name: "10-Class Group Pass",
        description: "10 drop-in sessions for any Yoga, HIIT, or CrossFit class.",
        durationMonths: 3,
        durationDays: 90,
        price: 12000.0,
        sessionLimit: 10,
        isGroupClass: true,
        isPersonalTraining: false,
        features: "10 Class Credits,Valid for 90 days,Priority App Booking",
      },
    });

    const planVIP = await prisma.membershipPlan.create({
      data: {
        name: "VIP Performance + PT",
        description: "All-Access membership + 4 dedicated Personal Training sessions per month.",
        durationMonths: 1,
        durationDays: 30,
        price: 18500.0,
        isGroupClass: true,
        isPersonalTraining: true,
        sessionLimit: 4,
        features: "All-Access 24/7,4 PT Sessions/mo,Custom Nutrition Plan,Towel Service,Recovery Lounge Access",
      },
    });

    // 5. Members
    const membersData = [
      {
        memberCode: "PLS-1001",
        firstName: "Brian",
        lastName: "Ochieng",
        email: "brian.ochieng@gmail.com",
        phone: "+254 722 349 201",
        gender: "Male",
        status: "ACTIVE",
        plan: planGold,
        daysAgo: 120,
        daysRemaining: 245,
        emergencyName: "Grace Ochieng",
        emergencyPhone: "+254 722 000 111",
        paymentMethod: "MPESA",
      },
      {
        memberCode: "PLS-1002",
        firstName: "Stacy",
        lastName: "Chebet",
        email: "stacy.chebet@outlook.com",
        phone: "+254 734 567 890",
        gender: "Female",
        status: "ACTIVE",
        plan: planMonthly,
        daysAgo: 25,
        daysRemaining: 5,
        emergencyName: "Joseph Chebet",
        emergencyPhone: "+254 733 999 888",
        paymentMethod: "MPESA",
      },
      {
        memberCode: "PLS-1003",
        firstName: "Kevin",
        lastName: "Otieno",
        email: "kevin.otieno@gmail.com",
        phone: "+254 705 432 109",
        gender: "Male",
        status: "ACTIVE",
        plan: planVIP,
        daysAgo: 10,
        daysRemaining: 20,
        emergencyName: "Mary Otieno",
        emergencyPhone: "+254 705 888 777",
        paymentMethod: "CARD",
      },
      {
        memberCode: "PLS-1004",
        firstName: "Maureen",
        lastName: "Wanjiku",
        email: "maureen.w@gmail.com",
        phone: "+254 718 234 567",
        gender: "Female",
        status: "ACTIVE",
        plan: planMonthly,
        daysAgo: 28,
        daysRemaining: 2,
        emergencyName: "David Mwangi",
        emergencyPhone: "+254 718 999 000",
        paymentMethod: "MPESA",
      },
      {
        memberCode: "PLS-1005",
        firstName: "Dennis",
        lastName: "Kiprono",
        email: "dennis.k@gmail.com",
        phone: "+254 729 876 543",
        gender: "Male",
        status: "EXPIRED",
        plan: planMonthly,
        daysAgo: 60,
        daysRemaining: -10,
        emergencyName: "Lilian Kiprono",
        emergencyPhone: "+254 729 111 222",
        paymentMethod: "CASH",
      },
      {
        memberCode: "PLS-1006",
        firstName: "Amina",
        lastName: "Hassan",
        email: "amina.h@gmail.com",
        phone: "+254 714 888 999",
        gender: "Female",
        status: "ACTIVE",
        plan: planPunchCard,
        daysAgo: 15,
        daysRemaining: 75,
        emergencyName: "Farah Hassan",
        emergencyPhone: "+254 714 333 444",
        paymentMethod: "MPESA",
      },
    ];

    for (const m of membersData) {
      const joinDate = new Date();
      joinDate.setDate(joinDate.getDate() - m.daysAgo);

      const endDate = new Date();
      endDate.setDate(endDate.getDate() + m.daysRemaining);

      const member = await prisma.member.create({
        data: {
          memberCode: m.memberCode,
          firstName: m.firstName,
          lastName: m.lastName,
          email: m.email,
          phone: m.phone,
          gender: m.gender,
          status: m.status,
          joinDate: joinDate,
          emergencyName: m.emergencyName,
          emergencyPhone: m.emergencyPhone,
        },
      });

      const subscription = await prisma.subscription.create({
        data: {
          memberId: member.id,
          planId: m.plan.id,
          startDate: joinDate,
          endDate: endDate,
          status: m.status === "EXPIRED" ? "EXPIRED" : "ACTIVE",
          pricePaid: m.plan.price,
        },
      });

      await prisma.payment.create({
        data: {
          memberId: member.id,
          subscriptionId: subscription.id,
          amount: m.plan.price,
          currency: "KES",
          method: m.paymentMethod,
          status: "PAID",
          receiptNumber: `REC-${m.paymentMethod}-${Math.floor(100000 + Math.random() * 900000)}`,
          paidAt: joinDate,
        },
      });

      if (m.status === "ACTIVE" && Math.random() > 0.3) {
        const checkIn = new Date();
        checkIn.setMinutes(checkIn.getMinutes() - Math.floor(Math.random() * 180));
        await prisma.attendance.create({
          data: {
            memberId: member.id,
            checkInTime: checkIn,
            method: "QR_SCAN",
          },
        });
      }
    }

    // 6. Group Classes Schedule
    await prisma.classSchedule.createMany({
      data: [
        {
          title: "High-Altitude Aerobic Conditioning",
          instructorName: "Brian Kipchumba",
          startTime: "06:30 AM",
          endTime: "07:30 AM",
          daysOfWeek: "MON,WED,FRI",
          capacity: 20,
          room: "CrossFit Arena",
          color: "#dc2626",
        },
        {
          title: "Vinyasa Core & Mobility Flow",
          instructorName: "Wanjiku Mwangi",
          startTime: "08:00 AM",
          endTime: "09:00 AM",
          daysOfWeek: "TUE,THU,SAT",
          capacity: 15,
          room: "Zen Studio",
          color: "#06b6d4",
        },
        {
          title: "Rugby Strength & Barbell Power",
          instructorName: "Dennis Otieno",
          startTime: "05:30 PM",
          endTime: "06:45 PM",
          daysOfWeek: "MON,WED,FRI",
          capacity: 14,
          room: "Iron Dungeon",
          color: "#f59e0b",
        },
        {
          title: "Sunset Spin & Cardio Sprint",
          instructorName: "Faith Chebet",
          startTime: "07:00 PM",
          endTime: "08:00 PM",
          daysOfWeek: "MON,TUE,THU",
          capacity: 22,
          room: "Cycle Studio",
          color: "#8b5cf6",
        },
      ],
    });

    // 7. POS Products
    await prisma.product.createMany({
      data: [
        {
          name: "100% Whey Isolate Protein (2kg)",
          sku: "SUPP-WHEY-01",
          category: "Supplements",
          price: 6500.0,
          costPrice: 4200.0,
          stockQuantity: 28,
          minStockAlert: 5,
        },
        {
          name: "High-Stim Pre-Workout Powder (300g)",
          sku: "SUPP-PRE-02",
          category: "Supplements",
          price: 3850.0,
          costPrice: 2400.0,
          stockQuantity: 20,
          minStockAlert: 4,
        },
        {
          name: "Electrolyte Hydration Drink (1L)",
          sku: "BEV-ELEC-01",
          category: "Drinks",
          price: 200.0,
          costPrice: 80.0,
          stockQuantity: 120,
          minStockAlert: 25,
        },
        {
          name: "Pulse Performance Shaker Bottle",
          sku: "APP-SHAKE-01",
          category: "Accessories",
          price: 1200.0,
          costPrice: 600.0,
          stockQuantity: 45,
          minStockAlert: 10,
        },
        {
          name: "Microfiber Quick-Dry Gym Towel",
          sku: "APP-TOWL-01",
          category: "Accessories",
          price: 850.0,
          costPrice: 400.0,
          stockQuantity: 35,
          minStockAlert: 8,
        },
        {
          name: "High Protein Energy Bar (Choc Peanut)",
          sku: "SNK-BAR-01",
          category: "Supplements",
          price: 350.0,
          costPrice: 180.0,
          stockQuantity: 60,
          minStockAlert: 15,
        },
      ],
    });

    // 8. Sales Leads
    await prisma.lead.createMany({
      data: [
        {
          name: "Collins Koech",
          email: "c.koech@gmail.com",
          phone: "+254 721 431 290",
          status: "TRIAL_BOOKED",
          source: "INSTAGRAM",
          interest: "Personal Training",
          notes: "Interested in strength conditioning for Nairobi marathon prep.",
        },
        {
          name: "Brenda Nekesa",
          email: "brenda.n@gmail.com",
          phone: "+254 733 882 192",
          status: "NEW_INQUIRY",
          source: "WALK_IN",
          interest: "Group Classes & Yoga",
          notes: "Walked in from Westlands commercial hub, wants 06:30 AM morning classes.",
        },
        {
          name: "Victor Mutua",
          email: "v.mutua@business.co.ke",
          phone: "+254 708 902 334",
          status: "TRIAL_COMPLETED",
          source: "REFERRAL",
          interest: "Annual VIP Membership",
          notes: "Trialed yesterday with coach Brian Kipchumba. Ready to register VIP tier.",
        },
      ],
    });

    return NextResponse.json({ success: true, message: "Demo data reset successfully with Kenyan configuration." });
  } catch (error) {
    console.error("Demo reset error:", error);
    return NextResponse.json({ error: "Failed to reset demo data" }, { status: 500 });
  }
}
