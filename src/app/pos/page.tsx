"use client";

import React, { useState, useEffect } from "react";
import { useBrand } from "@/lib/brand-context";
import { formatCurrency, formatDate } from "@/lib/utils";
import PrintableReceipt from "@/components/PrintableReceipt";
import {
  ShoppingBag,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  CreditCard,
  Banknote,
  Sparkles,
  Package,
  Receipt,
  AlertTriangle,
  CheckCircle,
  X,
  User,
  RefreshCw,
  Printer,
  ArrowRight,
  ChevronRight,
  Layers,
  Coins,
  Edit2,
} from "lucide-react";

export default function POSPage() {
  const { brand } = useBrand();

  const [activeTab, setActiveTab] = useState<"register" | "inventory" | "ledger">("register");
  const [products, setProducts] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [cart, setCart] = useState<{ product: any; quantity: number }[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Cash tender state
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "CARD" | "TRANSFER">("CARD");
  const [cashTendered, setCashTendered] = useState<string>("");
  const [checkingOut, setCheckingOut] = useState(false);

  // Completed Receipt Modal State
  const [completedSale, setCompletedSale] = useState<any>(null);

  // Refund Modal State
  const [refundTarget, setRefundTarget] = useState<any>(null);
  const [refundReason, setRefundReason] = useState("Customer cancellation / request");
  const [refunding, setRefunding] = useState(false);

  // Add & Edit Product Modals
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState<any | null>(null);
  const [submittingProduct, setSubmittingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    category: "Supplements",
    price: 29.99,
    costPrice: 15.0,
    stockQuantity: 25,
    minStockAlert: 5,
  });

  const loadData = async () => {
    try {
      const [prodRes, memRes, invRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/members"),
        fetch("/api/invoices"),
      ]);

      if (prodRes.ok) setProducts(await prodRes.json());
      if (memRes.ok) setMembers(await memRes.json());
      if (invRes.ok) setInvoices(await invRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addToCart = (product: any) => {
    if (product.stockQuantity <= 0) {
      alert("This item is currently out of stock.");
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stockQuantity) {
          alert(`Cannot add more than ${product.stockQuantity} in stock.`);
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty > item.product.stockQuantity) {
              alert(`Only ${item.product.stockQuantity} items in stock.`);
              return item;
            }
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as { product: any; quantity: number }[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const taxRate = brand.taxRate || 8.0;
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  const tenderedNum = parseFloat(cashTendered) || 0;
  const changeDue = tenderedNum > total ? tenderedNum - total : 0;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (paymentMethod === "CASH" && tenderedNum > 0 && tenderedNum < total) {
      alert("Tendered cash amount is less than total balance due.");
      return;
    }

    setCheckingOut(true);

    try {
      const itemsPayload = cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: item.product.price,
      }));

      const res = await fetch("/api/pos/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: itemsPayload,
          memberId: selectedMemberId || undefined,
          paymentMethod,
          totalAmount: total,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Checkout failed.");
        setCheckingOut(false);
        return;
      }

      const customer = members.find((m) => m.id === selectedMemberId);

      setCompletedSale({
        receiptNumber: data.receiptNumber || `POS-${Math.floor(100000 + Math.random() * 900000)}`,
        invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: customer ? `${customer.firstName} ${customer.lastName}` : "Walk-in Guest",
        customerCode: customer?.memberCode,
        items: cart.map((i) => ({
          name: i.product.name,
          quantity: i.quantity,
          unitPrice: i.product.price,
          subtotal: i.product.price * i.quantity,
        })),
        subtotal,
        taxAmount,
        total,
        paymentMethod,
        amountTendered: paymentMethod === "CASH" ? (tenderedNum || total) : undefined,
        changeDue: paymentMethod === "CASH" ? changeDue : undefined,
      });

      setCart([]);
      setCashTendered("");
      setSelectedMemberId("");
      loadData();
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred during checkout.");
    } finally {
      setCheckingOut(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      if (res.ok) {
        setShowAddProductModal(false);
        setNewProduct({
          name: "",
          sku: "",
          category: "Supplements",
          price: 29.99,
          costPrice: 15.0,
          stockQuantity: 25,
          minStockAlert: 5,
        });
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditProductModal) return;
    setSubmittingProduct(true);
    try {
      const res = await fetch(`/api/products/${showEditProductModal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(showEditProductModal),
      });
      if (res.ok) {
        setShowEditProductModal(null);
        loadData();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update product.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating product.");
    } finally {
      setSubmittingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove '${name}' from inventory?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        loadData();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to delete product.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting product.");
    }
  };

  const categories = ["ALL", "Supplements", "Drinks", "Apparel", "Snacks", "Passes"];

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === "ALL" || p.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#202427] border border-[#8C9390]/25 text-xs text-[#8C9390] mb-2">
            <ShoppingBag className="w-3.5 h-3.5 text-[#C8FF3D]" />
            <span>Retail & Front-Desk Commerce</span>
          </div>
          <h1 className="text-3xl font-black text-[#F4F3EE] tracking-tight uppercase">
            Point of Sale Terminal
          </h1>
          <p className="text-xs text-[#8C9390] mt-1">
            Merchandise, supplements, day passes, member tab checkout, and instant printable tax receipts.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="inline-flex p-1.5 rounded-2xl bg-[#202427] border border-[#8C9390]/25">
          {[
            { id: "register", label: "POS Terminal", icon: ShoppingBag },
            { id: "inventory", label: "Stock Manager", icon: Package },
            { id: "ledger", label: "Sales Ledger", icon: Receipt },
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? "text-[#111315] font-black shadow"
                    : "text-[#8C9390] hover:text-[#F4F3EE]"
                }`}
                style={{
                  backgroundColor: isSelected ? brand.primaryColor : undefined,
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. REGISTER TAB */}
      {activeTab === "register" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Product Catalog Grid (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Search & Category Filter */}
            <div className="p-4 rounded-2xl bg-[#202427] border border-[#8C9390]/25 space-y-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C9390]" />
                <input
                  type="text"
                  placeholder="Search products by title or barcode / SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-xs text-[#F4F3EE] placeholder-[#8C9390]/50 focus:outline-none focus:border-[#C8FF3D]"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      selectedCategory === cat
                        ? "bg-[#C8FF3D] text-[#111315] font-black shadow-sm"
                        : "bg-[#111315] border border-[#8C9390]/20 text-[#8C9390] hover:text-[#F4F3EE]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filteredProducts.map((p) => {
                const isOutOfStock = p.stockQuantity <= 0;
                return (
                  <button
                    key={p.id}
                    onClick={() => addToCart(p)}
                    disabled={isOutOfStock}
                    className={`p-4 rounded-2xl bg-[#202427] border text-left flex flex-col justify-between transition-all group relative overflow-hidden ${
                      isOutOfStock
                        ? "opacity-50 border-[#8C9390]/15 cursor-not-allowed"
                        : "border-[#8C9390]/25 hover:border-[#C8FF3D]/50 hover:scale-[1.02] active:scale-[0.98]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono text-[#8C9390] font-bold">
                          {p.sku || "SKU-001"}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                            isOutOfStock
                              ? "bg-rose-500/20 text-rose-400"
                              : p.stockQuantity <= (p.minStockAlert || 5)
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-emerald-500/20 text-emerald-400"
                          }`}
                        >
                          {isOutOfStock ? "Out of Stock" : `${p.stockQuantity} in stock`}
                        </span>
                      </div>

                      <h3 className="text-xs font-bold text-[#F4F3EE] line-clamp-2 group-hover:text-[#C8FF3D] transition-colors">
                        {p.name}
                      </h3>
                    </div>

                    <div className="mt-4 pt-2 border-t border-[#8C9390]/20 flex items-center justify-between">
                      <span className="text-sm font-black text-[#F4F3EE]">
                        {formatCurrency(p.price, brand.currencySymbol)}
                      </span>
                      <span className="w-7 h-7 rounded-lg bg-[#111315] border border-[#8C9390]/25 group-hover:bg-[#C8FF3D] group-hover:text-[#111315] text-[#F4F3EE] font-bold flex items-center justify-center text-xs transition-colors">
                        +
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Cart & Order Tender Drawer (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl bg-[#202427] border border-[#8C9390]/25 p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#8C9390]/20">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-[#C8FF3D]" />
                <h2 className="text-sm font-bold text-[#F4F3EE] uppercase tracking-wider">
                  Current Order Tab
                </h2>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={() => setCart([])}
                  className="text-xs text-rose-400 hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Link to Member Account */}
            <div>
              <label className="block text-xs font-semibold text-[#F4F3EE] mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#8C9390]" />
                Link to Member Profile (Optional)
              </label>
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#111315] border border-[#8C9390]/25 text-xs text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
              >
                <option value="" className="bg-[#111315] text-[#F4F3EE]">Walk-in Guest / Quick Sale</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id} className="bg-[#111315] text-[#F4F3EE]">
                    {m.firstName} {m.lastName} ({m.memberCode})
                  </option>
                ))}
              </select>
            </div>

            {/* Cart Items List */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {cart.length > 0 ? (
                cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-[#111315] border border-[#8C9390]/20"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-bold text-[#F4F3EE] truncate">
                        {item.product.name}
                      </p>
                      <p className="text-[10px] text-[#8C9390]">
                        {formatCurrency(item.product.price, brand.currencySymbol)} each
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Stepper */}
                      <div className="flex items-center rounded-lg bg-[#202427] border border-[#8C9390]/25 p-0.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="w-6 h-6 flex items-center justify-center text-[#8C9390] hover:text-[#F4F3EE]"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-[#F4F3EE]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="w-6 h-6 flex items-center justify-center text-[#8C9390] hover:text-[#F4F3EE]"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-bold text-[#F4F3EE] min-w-[50px] text-right">
                        {formatCurrency(
                          item.product.price * item.quantity,
                          brand.currencySymbol
                        )}
                      </span>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-[#8C9390] hover:text-rose-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-[#8C9390] text-xs">
                  <ShoppingCart className="w-8 h-8 mx-auto text-[#8C9390]/40 mb-2" />
                  Your cart is empty. Click any product to add.
                </div>
              )}
            </div>

            {/* Calculations & Summary */}
            <div className="pt-4 border-t border-[#8C9390]/20 space-y-2 text-xs">
              <div className="flex justify-between text-[#8C9390]">
                <span>Subtotal:</span>
                <span className="font-bold text-[#F4F3EE]">
                  {formatCurrency(subtotal, brand.currencySymbol)}
                </span>
              </div>
              <div className="flex justify-between text-[#8C9390]">
                <span>Estimated Tax ({taxRate}%):</span>
                <span className="font-bold text-[#F4F3EE]">
                  {formatCurrency(taxAmount, brand.currencySymbol)}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-[#F4F3EE] pt-2 border-t border-[#8C9390]/20">
                <span>Total Due:</span>
                <span className="text-[#C8FF3D]">
                  {formatCurrency(total, brand.currencySymbol)}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-[#F4F3EE] uppercase tracking-wider block">
                Tender Payment Method
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "CARD", label: "Card", icon: CreditCard },
                  { id: "CASH", label: "Cash", icon: Banknote },
                  { id: "TRANSFER", label: "Transfer", icon: Coins },
                ].map((m) => {
                  const isSelected = paymentMethod === m.id;
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`py-2.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all ${
                        isSelected
                          ? "bg-[#111315] border-[#C8FF3D] text-[#C8FF3D] shadow"
                          : "bg-[#111315] border-[#8C9390]/20 text-[#8C9390] hover:text-[#F4F3EE]"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Cash Change Calculator */}
              {paymentMethod === "CASH" && (
                <div className="p-3.5 rounded-2xl bg-[#111315] border border-[#8C9390]/20 space-y-2 animate-in fade-in duration-200">
                  <label className="block text-xs font-semibold text-[#F4F3EE]">
                    Cash Tendered Amount
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 50"
                    value={cashTendered}
                    onChange={(e) => setCashTendered(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#202427] border border-[#8C9390]/25 text-xs text-[#F4F3EE] font-mono font-bold focus:border-[#C8FF3D] outline-none"
                  />
                  {tenderedNum > 0 && (
                    <div className="flex justify-between text-xs pt-1">
                      <span className="text-[#8C9390]">Change Due:</span>
                      <span className="font-mono font-black text-amber-400">
                        {formatCurrency(changeDue, brand.currencySymbol)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Complete Transaction Button */}
            <button
              onClick={handleCheckout}
              disabled={cart.length === 0 || checkingOut}
              className="w-full py-4 rounded-2xl text-xs font-black uppercase tracking-wider text-[#111315] shadow-xl hover:opacity-95 active:scale-98 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
              style={{ backgroundColor: brand.primaryColor }}
            >
              {checkingOut ? (
                <span>Processing Sale...</span>
              ) : (
                <>
                  <span>Complete Sale & Print Receipt</span>
                  <ArrowRight className="w-4 h-4 text-[#111315]" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 3. INVENTORY TAB */}
      {activeTab === "inventory" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#F4F3EE] uppercase tracking-tight">
              Inventory & Retail Stock Manager
            </h2>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-[#111315] shadow transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              style={{ backgroundColor: brand.primaryColor }}
            >
              <Plus className="w-4 h-4 text-[#111315]" />
              <span>Add Product</span>
            </button>
          </div>

          <div className="rounded-3xl bg-[#202427] border border-[#8C9390]/25 overflow-hidden shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#8C9390]/25 bg-[#111315]/80 text-[10px] font-black text-[#8C9390] uppercase tracking-wider">
                  <th className="py-4 px-5">Item Name</th>
                  <th className="py-4 px-5">SKU / Code</th>
                  <th className="py-4 px-5">Category</th>
                  <th className="py-4 px-5">Unit Price</th>
                  <th className="py-4 px-5">Cost Price</th>
                  <th className="py-4 px-5">Stock Count</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#8C9390]/15 text-xs">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#111315]/50 transition-colors">
                    <td className="py-4 px-5 font-bold text-[#F4F3EE]">{p.name}</td>
                    <td className="py-4 px-5 font-mono text-[#8C9390]">{p.sku}</td>
                    <td className="py-4 px-5">
                      <span className="px-2.5 py-1 rounded-md bg-[#111315] border border-[#8C9390]/20 text-[11px] font-semibold text-[#F4F3EE]">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-4 px-5 font-bold text-[#F4F3EE]">
                      {formatCurrency(p.price, brand.currencySymbol)}
                    </td>
                    <td className="py-4 px-5 text-[#8C9390]">
                      {formatCurrency(p.costPrice || 0, brand.currencySymbol)}
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          p.stockQuantity <= 0
                            ? "bg-rose-500/20 text-rose-400"
                            : p.stockQuantity <= 5
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-emerald-500/20 text-emerald-400"
                        }`}
                      >
                        {p.stockQuantity} units
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setShowEditProductModal({ ...p })}
                          className="p-1.5 rounded-lg text-[#8C9390] hover:text-[#C8FF3D] hover:bg-[#111315] transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 rounded-lg text-[#8C9390] hover:text-rose-400 hover:bg-[#111315] transition-colors cursor-pointer"
                          title="Remove Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. LEDGER TAB */}
      {activeTab === "ledger" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#F4F3EE] uppercase tracking-tight">
              Master Sales & Invoicing Ledger
            </h2>
          </div>

          <div className="rounded-3xl bg-[#202427] border border-[#8C9390]/25 overflow-hidden shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#8C9390]/25 bg-[#111315]/80 text-[10px] font-black text-[#8C9390] uppercase tracking-wider">
                  <th className="py-4 px-5">Receipt #</th>
                  <th className="py-4 px-5">Customer</th>
                  <th className="py-4 px-5">Method</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5">Amount</th>
                  <th className="py-4 px-5">Date</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#8C9390]/15 text-xs">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#111315]/50 transition-colors">
                    <td className="py-4 px-5 font-mono font-bold text-amber-400">
                      {inv.receiptNumber}
                    </td>
                    <td className="py-4 px-5 text-[#F4F3EE]">
                      {inv.member
                        ? `${inv.member.firstName} ${inv.member.lastName}`
                        : "Walk-in Guest"}
                    </td>
                    <td className="py-4 px-5 text-[#F4F3EE]/80">
                      <span className="px-2 py-0.5 rounded-md bg-[#111315] border border-[#8C9390]/25 text-[10px] font-bold">
                        {inv.method}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        inv.status === "REFUNDED"
                          ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                          : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      }`}>
                        {inv.status || "PAID"}
                      </span>
                    </td>
                    <td className={`py-4 px-5 font-black ${inv.status === "REFUNDED" ? "text-rose-400 line-through" : "text-emerald-400"}`}>
                      {inv.status === "REFUNDED" ? "-" : "+"}{formatCurrency(inv.amount, brand.currencySymbol)}
                    </td>
                    <td className="py-4 px-5 text-[#8C9390]">{formatDate(inv.paidAt)}</td>
                    <td className="py-4 px-5 text-right space-x-1.5">
                      {inv.status !== "REFUNDED" && (
                        <button
                          onClick={() => setRefundTarget(inv)}
                          className="px-2.5 py-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-[11px] font-bold text-rose-400 border border-rose-500/25 transition-colors cursor-pointer"
                        >
                          Refund
                        </button>
                      )}
                      <button
                        onClick={() => setCompletedSale(inv)}
                        className="px-3 py-1.5 rounded-xl bg-[#111315] hover:bg-[#202427] text-[11px] font-bold text-[#F4F3EE] border border-[#8C9390]/25 transition-colors cursor-pointer"
                      >
                        Print
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REFUND CONFIRMATION MODAL */}
      {refundTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-[#202427] border border-[#8C9390]/25 p-6 shadow-2xl text-left space-y-4">
            <button
              onClick={() => setRefundTarget(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-[#111315] text-[#8C9390] hover:text-[#F4F3EE]"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 font-mono mb-2">
                <span>Transaction Refund</span>
              </div>
              <h3 className="text-xl font-black text-[#F4F3EE] uppercase tracking-tight">
                Issue Payment Refund
              </h3>
              <p className="text-xs text-[#8C9390] mt-1">
                Receipt #{refundTarget.receiptNumber} &bull; {formatCurrency(refundTarget.amount, brand.currencySymbol)}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#111315] border border-[#8C9390]/25 space-y-2 text-xs">
              <div className="flex justify-between text-[#8C9390]">
                <span>Customer:</span>
                <span className="font-bold text-[#F4F3EE]">{refundTarget.member ? `${refundTarget.member.firstName} ${refundTarget.member.lastName}` : "Walk-in Guest"}</span>
              </div>
              <div className="flex justify-between text-[#8C9390]">
                <span>Payment Method:</span>
                <span className="font-bold text-[#F4F3EE]">{refundTarget.method}</span>
              </div>
              <div className="flex justify-between text-[#8C9390]">
                <span>Refund Amount:</span>
                <span className="font-bold text-rose-400 font-mono">{formatCurrency(refundTarget.amount, brand.currencySymbol)}</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#8C9390] uppercase tracking-wider mb-1">
                Reason for Refund
              </label>
              <input
                type="text"
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="e.g. Returned unopened merchandise / Customer request"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#111315] border border-[#8C9390]/25 text-xs text-[#F4F3EE] focus:border-[#C8FF3D] outline-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRefundTarget(null)}
                className="flex-1 py-3 rounded-2xl bg-[#111315] hover:bg-[#111315]/80 text-[#8C9390] hover:text-[#F4F3EE] text-xs font-bold border border-[#8C9390]/25"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={refunding}
                onClick={async () => {
                  setRefunding(true);
                  try {
                    const res = await fetch(`/api/invoices/${refundTarget.id}/refund`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ reason: refundReason }),
                    });
                    if (res.ok) {
                      setRefundTarget(null);
                      loadData();
                    }
                  } catch (e) {
                    console.error(e);
                  } finally {
                    setRefunding(false);
                  }
                }}
                className="flex-1 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-black uppercase tracking-wider shadow transition-all disabled:opacity-50 cursor-pointer"
              >
                {refunding ? "Refunding..." : "Confirm Refund"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE RECEIPT MODAL */}
      {completedSale && (
        <PrintableReceipt
          payment={completedSale}
          onClose={() => setCompletedSale(null)}
        />
      )}

      {/* ADD PRODUCT MODAL */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-[#202427] border border-[#8C9390]/25 p-6 shadow-2xl text-left">
            <button
              onClick={() => setShowAddProductModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-[#111315] text-[#8C9390] hover:text-[#F4F3EE]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-[#F4F3EE] uppercase tracking-tight">
              Add Retail Product
            </h3>

            <form onSubmit={handleCreateProduct} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block text-[#F4F3EE] font-semibold mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Whey Protein Isolate 2kg"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#111315] border border-[#8C9390]/25 text-[#F4F3EE] focus:border-[#C8FF3D] outline-none placeholder-[#8C9390]/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#F4F3EE] font-semibold mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    placeholder="PROT-001"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#111315] border border-[#8C9390]/25 text-[#F4F3EE] font-mono focus:border-[#C8FF3D] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#F4F3EE] font-semibold mb-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#111315] border border-[#8C9390]/25 text-[#F4F3EE] focus:border-[#C8FF3D] outline-none"
                  >
                    <option value="Supplements" className="bg-[#111315] text-[#F4F3EE]">Supplements</option>
                    <option value="Drinks" className="bg-[#111315] text-[#F4F3EE]">Drinks</option>
                    <option value="Apparel" className="bg-[#111315] text-[#F4F3EE]">Apparel</option>
                    <option value="Snacks" className="bg-[#111315] text-[#F4F3EE]">Snacks</option>
                    <option value="Passes" className="bg-[#111315] text-[#F4F3EE]">Passes</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#F4F3EE] font-semibold mb-1">Retail Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#111315] border border-[#8C9390]/25 text-[#F4F3EE] font-bold focus:border-[#C8FF3D] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#F4F3EE] font-semibold mb-1">Stock Units</label>
                  <input
                    type="number"
                    required
                    value={newProduct.stockQuantity}
                    onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#111315] border border-[#8C9390]/25 text-[#F4F3EE] font-bold focus:border-[#C8FF3D] outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-xs font-black text-[#111315] shadow-xl hover:opacity-90"
                style={{ backgroundColor: brand.primaryColor }}
              >
                Save Product to Inventory
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT MODAL */}
      {showEditProductModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#202427] border border-[#8C9390]/25 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 relative">
            <button
              onClick={() => setShowEditProductModal(null)}
              className="absolute top-5 right-5 text-[#8C9390] hover:text-[#F4F3EE]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-[#F4F3EE] uppercase tracking-tight flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-[#C8FF3D]" />
              Edit Retail Product
            </h3>

            <form onSubmit={handleEditProduct} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-[#F4F3EE] font-semibold mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={showEditProductModal.name}
                  onChange={(e) =>
                    setShowEditProductModal({ ...showEditProductModal, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#111315] border border-[#8C9390]/25 text-[#F4F3EE] focus:border-[#C8FF3D] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#F4F3EE] font-semibold mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={showEditProductModal.sku}
                    onChange={(e) =>
                      setShowEditProductModal({ ...showEditProductModal, sku: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#111315] border border-[#8C9390]/25 text-[#F4F3EE] font-mono focus:border-[#C8FF3D] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#F4F3EE] font-semibold mb-1">Category</label>
                  <select
                    value={showEditProductModal.category}
                    onChange={(e) =>
                      setShowEditProductModal({ ...showEditProductModal, category: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#111315] border border-[#8C9390]/25 text-[#F4F3EE] focus:border-[#C8FF3D] outline-none"
                  >
                    <option value="Supplements" className="bg-[#111315] text-[#F4F3EE]">Supplements</option>
                    <option value="Drinks" className="bg-[#111315] text-[#F4F3EE]">Drinks</option>
                    <option value="Apparel" className="bg-[#111315] text-[#F4F3EE]">Apparel</option>
                    <option value="Snacks" className="bg-[#111315] text-[#F4F3EE]">Snacks</option>
                    <option value="Passes" className="bg-[#111315] text-[#F4F3EE]">Passes</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#F4F3EE] font-semibold mb-1">Retail Price ({brand.currencySymbol})</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={showEditProductModal.price}
                    onChange={(e) =>
                      setShowEditProductModal({ ...showEditProductModal, price: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#111315] border border-[#8C9390]/25 text-[#F4F3EE] font-bold focus:border-[#C8FF3D] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#F4F3EE] font-semibold mb-1">Cost Price ({brand.currencySymbol})</label>
                  <input
                    type="number"
                    step="0.01"
                    value={showEditProductModal.costPrice ?? 0}
                    onChange={(e) =>
                      setShowEditProductModal({ ...showEditProductModal, costPrice: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#111315] border border-[#8C9390]/25 text-[#F4F3EE] font-bold focus:border-[#C8FF3D] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#F4F3EE] font-semibold mb-1">Stock Units</label>
                  <input
                    type="number"
                    required
                    value={showEditProductModal.stockQuantity}
                    onChange={(e) =>
                      setShowEditProductModal({ ...showEditProductModal, stockQuantity: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#111315] border border-[#8C9390]/25 text-[#F4F3EE] font-bold focus:border-[#C8FF3D] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#F4F3EE] font-semibold mb-1">Min Stock Alert</label>
                  <input
                    type="number"
                    value={showEditProductModal.minStockAlert ?? 5}
                    onChange={(e) =>
                      setShowEditProductModal({ ...showEditProductModal, minStockAlert: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#111315] border border-[#8C9390]/25 text-[#F4F3EE] font-bold focus:border-[#C8FF3D] outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditProductModal(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#111315] border border-[#8C9390]/25 text-[#F4F3EE] hover:bg-[#202427]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingProduct}
                  className="px-5 py-2.5 rounded-xl text-xs font-black text-[#111315] shadow-xl hover:opacity-90 disabled:opacity-40"
                  style={{ backgroundColor: brand.primaryColor }}
                >
                  {submittingProduct ? "Saving..." : "Update Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
