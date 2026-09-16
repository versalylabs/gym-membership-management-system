import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { category: "asc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      sku,
      category,
      price,
      costPrice,
      stockQuantity,
      minStockAlert,
    } = body;

    if (!name || !sku || price === undefined) {
      return NextResponse.json(
        { error: "Product name, SKU, and price are required." },
        { status: 400 }
      );
    }

    const existing = await prisma.product.findUnique({
      where: { sku: sku.toUpperCase() },
    });
    if (existing) {
      return NextResponse.json(
        { error: "A product with this SKU already exists." },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        sku: sku.toUpperCase(),
        category: category || "Supplements",
        price: parseFloat(price),
        costPrice: costPrice ? parseFloat(costPrice) : 0.0,
        stockQuantity: stockQuantity ? parseInt(stockQuantity) : 0,
        minStockAlert: minStockAlert ? parseInt(minStockAlert) : 5,
        isActive: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product." },
      { status: 500 }
    );
  }
}
