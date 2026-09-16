import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Gym Management Platform with Demo Data...");

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

  // 2. Default Gym Brand
  const gym = await prisma.gymSetting.create({
    data: {
      id: "default-gym",
      gymName: "Pulse",
      tagline: "Fuel Your Heartbeat. Master Your Strength.",
      logoUrl: "/logo.png",
      primaryColor: "#C8FF3D", // Electric Chartreuse
      accentColor: "#8C9390", // Grey Olive
      currencySymbol: "$",
      currencyCode: "USD",
      taxRate: 8.25,
      contactEmail: "contact@pulsegym.com",
      phone: "+1 (555) 892-4411",
      address: "450 Olympus Way, Suite 100, Austin, TX",
      website: "https://pulsegym.com",
      kioskPin: "1234",
    },
  });

  // 3. Staff / Users
  const adminUser = await prisma.user.create({
    data: {
      email: "manager@pulsegym.com",
      name: "Alex Davis",
      passwordHash: "pulse123",
      role: "MANAGER",
      phone: "+1 (555) 019-2834",
    },
  });

  const frontdeskUser = await prisma.user.create({
    data: {
      email: "frontdesk@pulsegym.com",
      name: "Taylor Reed",
      passwordHash: "pulse123",
      role: "RECEPTIONIST",
      phone: "+1 (555) 014-7721",
    },
  });

  const trainerUser = await prisma.user.create({
    data: {
      email: "marcus.vance@pulsegym.com",
      name: "Marcus Vance",
      passwordHash: "pulse123",
      role: "TRAINER",
      phone: "+1 (555) 018-9922",
    },
  });

  // 4. Membership Plans
  const planGold = await prisma.membershipPlan.create({
    data: {
      name: "Gold All-Access Annual",
      description: "Full 24/7 gym floor, sauna, steam room & unlimited group classes.",
      durationMonths: 12,
      durationDays: 365,
      price: 699.0,
      signupFee: 0.0,
      isGroupClass: true,
      isPersonalTraining: false,
      features: "24/7 Access,Unlimited Classes,Sauna & Steam,Guest Pass (1/mo)",
    },
  });

  const planMonthly = await prisma.membershipPlan.create({
    data: {
      name: "Monthly Flex Plan",
      description: "Month-to-month access to gym floor and locker rooms.",
      durationMonths: 1,
      durationDays: 30,
      price: 69.0,
      signupFee: 25.0,
      isGroupClass: true,
      isPersonalTraining: false,
      features: "Standard Hours Access,Locker Room,No Contract Lock-in",
    },
  });

  const planPunchCard = await prisma.membershipPlan.create({
    data: {
      name: "10-Class Group Pass",
      description: "10 drop-in sessions for any Yoga, HIIT, or CrossFit class.",
      durationMonths: 3,
      durationDays: 90,
      price: 150.0,
      sessionLimit: 10,
      isGroupClass: true,
      isPersonalTraining: false,
      features: "10 Class Credits,Valid for 90 days,Priority Booking",
    },
  });

  const planVIP = await prisma.membershipPlan.create({
    data: {
      name: "VIP Performance + PT",
      description: "All-Access membership + 4 dedicated Personal Training sessions per month.",
      durationMonths: 1,
      durationDays: 30,
      price: 249.0,
      isGroupClass: true,
      isPersonalTraining: true,
      sessionLimit: 4,
      features: "All-Access 24/7,4 PT Sessions/mo,Custom Nutrition Plan,Towel Service",
    },
  });

  // 5. Members
  const membersData = [
    {
      memberCode: "PLS-1001",
      firstName: "Sarah",
      lastName: "Connor",
      email: "sarah.connor@example.com",
      phone: "+1 (555) 301-4491",
      gender: "Female",
      status: "ACTIVE",
      plan: planGold,
      daysAgo: 120,
      daysRemaining: 245,
    },
    {
      memberCode: "PLS-1002",
      firstName: "David",
      lastName: "Miller",
      email: "david.miller@example.com",
      phone: "+1 (555) 442-8812",
      gender: "Male",
      status: "ACTIVE",
      plan: planMonthly,
      daysAgo: 25,
      daysRemaining: 5, // Expiring soon!
    },
    {
      memberCode: "PLS-1003",
      firstName: "Elena",
      lastName: "Rostova",
      email: "elena.rostova@example.com",
      phone: "+1 (555) 771-3329",
      gender: "Female",
      status: "ACTIVE",
      plan: planVIP,
      daysAgo: 10,
      daysRemaining: 20,
    },
    {
      memberCode: "PLS-1004",
      firstName: "James",
      lastName: "Wilson",
      email: "james.wilson@example.com",
      phone: "+1 (555) 993-2114",
      gender: "Male",
      status: "ACTIVE",
      plan: planMonthly,
      daysAgo: 28,
      daysRemaining: 2, // Expiring in 2 days!
    },
    {
      memberCode: "PLS-1005",
      firstName: "Chloe",
      lastName: "Bennett",
      email: "chloe.b@example.com",
      phone: "+1 (555) 662-7744",
      gender: "Female",
      status: "EXPIRED",
      plan: planMonthly,
      daysAgo: 60,
      daysRemaining: -10, // Expired 10 days ago
    },
    {
      memberCode: "PLS-1006",
      firstName: "Tyler",
      lastName: "Durden",
      email: "tyler.d@example.com",
      phone: "+1 (555) 123-9988",
      gender: "Male",
      status: "ACTIVE",
      plan: planPunchCard,
      daysAgo: 15,
      daysRemaining: 75,
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
        emergencyName: "Jane Doe",
        emergencyPhone: "+1 (555) 999-0000",
      },
    });

    // Create Subscription
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

    // Create Payment record
    await prisma.payment.create({
      data: {
        memberId: member.id,
        subscriptionId: subscription.id,
        amount: m.plan.price,
        currency: "USD",
        method: "CARD",
        status: "PAID",
        receiptNumber: `REC-${Math.floor(100000 + Math.random() * 900000)}`,
        paidAt: joinDate,
      },
    });

    // Create Today Attendance for active members
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
        title: "CrossFit HIIT Conditioning",
        instructorName: "Marcus Vance",
        startTime: "06:30 AM",
        endTime: "07:30 AM",
        daysOfWeek: "MON,WED,FRI",
        capacity: 18,
        room: "CrossFit Arena",
        color: "#dc2626",
      },
      {
        title: "Vinyasa Core & Mobility Yoga",
        instructorName: "Maya Lin",
        startTime: "08:00 AM",
        endTime: "09:00 AM",
        daysOfWeek: "TUE,THU,SAT",
        capacity: 15,
        room: "Zen Studio",
        color: "#06b6d4",
      },
      {
        title: "Powerlifting & Barbell Mechanics",
        instructorName: "Alex Davis",
        startTime: "05:30 PM",
        endTime: "06:45 PM",
        daysOfWeek: "MON,WED,FRI",
        capacity: 12,
        room: "Iron Dungeon",
        color: "#f59e0b",
      },
      {
        title: "Evening Spin & Cardio Rush",
        instructorName: "Sarah Connor",
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
        price: 59.99,
        costPrice: 34.0,
        stockQuantity: 28,
        minStockAlert: 5,
      },
      {
        name: "High-Stim Pre-Workout Powder",
        sku: "SUPP-PRE-02",
        category: "Supplements",
        price: 39.99,
        costPrice: 20.0,
        stockQuantity: 15,
        minStockAlert: 4,
      },
      {
        name: "Electrolyte Hydration Drink (500ml)",
        sku: "BEV-ELEC-01",
        category: "Drinks",
        price: 3.5,
        costPrice: 1.2,
        stockQuantity: 94,
        minStockAlert: 20,
      },
      {
        name: "IronPeak Stainless Steel Shaker",
        sku: "APP-SHAKE-01",
        category: "Accessories",
        price: 19.99,
        costPrice: 7.5,
        stockQuantity: 42,
        minStockAlert: 10,
      },
    ],
  });

  // 8. Sales Leads
  await prisma.lead.createMany({
    data: [
      {
        name: "Robert Langdon",
        email: "robert.l@example.com",
        phone: "+1 (555) 431-2901",
        status: "TRIAL_BOOKED",
        source: "INSTAGRAM",
        interest: "Personal Training",
        notes: "Interested in strength training for marathon prep.",
      },
      {
        name: "Jessica Alba",
        email: "jess.a@example.com",
        phone: "+1 (555) 882-1922",
        status: "NEW_INQUIRY",
        source: "WALK_IN",
        interest: "Group Classes & Yoga",
        notes: "Walked in during lunch break, wants morning classes.",
      },
      {
        name: "Michael Scott",
        email: "m.scott@dunder.com",
        phone: "+1 (555) 902-3341",
        status: "TRIAL_COMPLETED",
        source: "REFERRAL",
        interest: "VIP Membership",
        notes: "Trialed yesterday with trainer Marcus. Follow up on Friday.",
      },
    ],
  });

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
