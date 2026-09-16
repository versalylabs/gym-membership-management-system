"use client";

import React from "react";
import { useBrand } from "@/lib/brand-context";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Printer, X, CheckCircle, ShieldCheck } from "lucide-react";

interface ReceiptItem {
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface PrintableReceiptProps {
  payment?: any;
  member?: any;
  receiptNumber?: string;
  invoiceNumber?: string;
  date?: Date | string;
  customerName?: string;
  customerCode?: string;
  items?: ReceiptItem[];
  subtotal?: number;
  taxAmount?: number;
  total?: number;
  paymentMethod?: string;
  amountTendered?: number;
  changeDue?: number;
  notes?: string;
  onClose: () => void;
}

export default function PrintableReceipt(props: PrintableReceiptProps) {
  const { brand } = useBrand();

  const {
    payment,
    member,
    onClose,
  } = props;

  // Derive values from payment object or individual props
  const receiptNum =
    props.receiptNumber ||
    payment?.receiptNumber ||
    `REC-${Math.floor(100000 + Math.random() * 900000)}`;

  const invoiceNum =
    props.invoiceNumber ||
    payment?.invoiceNumber ||
    `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const txDate = props.date || payment?.paidAt || payment?.createdAt || new Date();

  const custName =
    props.customerName ||
    (payment?.member ? `${payment.member.firstName} ${payment.member.lastName}` : undefined) ||
    (member ? `${member.firstName} ${member.lastName}` : undefined) ||
    payment?.customerName ||
    "Walk-in Guest";

  const custCode =
    props.customerCode ||
    payment?.member?.memberCode ||
    member?.memberCode ||
    payment?.customerCode;

  const receiptItems: ReceiptItem[] =
    props.items ||
    payment?.items ||
    (payment?.saleItems
      ? payment.saleItems.map((si: any) => ({
          name: si.product?.name || "Retail Item",
          quantity: si.quantity,
          unitPrice: si.unitPrice,
          subtotal: si.subtotal,
        }))
      : [
          {
            name: payment?.description || "Gym Membership Subscription",
            quantity: 1,
            unitPrice: payment?.amount || 0,
            subtotal: payment?.amount || 0,
          },
        ]);

  const totalAmount = props.total ?? payment?.amount ?? payment?.total ?? 0;
  const subtotalAmount = props.subtotal ?? payment?.subtotal ?? (totalAmount * 0.92);
  const tax = props.taxAmount ?? payment?.taxAmount ?? (totalAmount - subtotalAmount);
  const payMethod = props.paymentMethod || payment?.method || payment?.paymentMethod || "CARD";
  const tendered = props.amountTendered ?? payment?.amountTendered;
  const change = props.changeDue ?? payment?.changeDue;

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 animate-in zoom-in-95 my-8">
        {/* Top Control Bar (Hidden during print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Printable Tax Receipt
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* RECEIPT CONTENT AREA */}
        <div id="printable-receipt-content" className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black uppercase tracking-tight text-[#111315]">
              {brand.gymName}
            </h2>
            <p className="text-xs font-medium text-slate-500">
              {brand.tagline}
            </p>
            <p className="text-[11px] text-slate-400">
              Tax ID / Reg: #8942-TAX-CA &bull; Tel: +1 (800) 555-IRON
            </p>
          </div>

          <div className="border-t border-b border-slate-200 py-3 space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span className="font-semibold text-slate-500">Receipt No:</span>
              <span className="font-mono font-bold text-slate-900">{receiptNum}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-500">Date & Time:</span>
              <span className="text-slate-800">{formatDate(txDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-500">Customer:</span>
              <span className="font-bold text-slate-900">{custName}</span>
            </div>
            {custCode && (
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Member ID:</span>
                <span className="font-mono font-bold text-slate-800">{custCode}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-semibold text-slate-500">Payment Tender:</span>
              <span className="font-bold uppercase text-slate-800">{payMethod}</span>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="space-y-3">
            <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase border-b border-slate-100 pb-1">
              <span>Description / Item</span>
              <span>Total</span>
            </div>

            <div className="space-y-2">
              {receiptItems.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-800">{item.name}</p>
                    <p className="text-[10px] text-slate-500">
                      {item.quantity} &times; {formatCurrency(item.unitPrice, brand.currencySymbol)}
                    </p>
                  </div>
                  <span className="font-bold text-slate-900">
                    {formatCurrency(item.subtotal, brand.currencySymbol)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Subtotal, Tax & Total */}
          <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-bold">{formatCurrency(subtotalAmount, brand.currencySymbol)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax ({brand.taxRate || 8}%):</span>
              <span className="font-bold">{formatCurrency(tax, brand.currencySymbol)}</span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
              <span>Total Paid:</span>
              <span className="text-emerald-700">
                {formatCurrency(totalAmount, brand.currencySymbol)}
              </span>
            </div>

            {payMethod === "CASH" && tendered !== undefined && (
              <div className="pt-2 border-t border-dashed border-slate-200 text-[11px] space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>Amount Tendered:</span>
                  <span>{formatCurrency(tendered, brand.currencySymbol)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-800">
                  <span>Change Due:</span>
                  <span>{formatCurrency(change || 0, brand.currencySymbol)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="text-center pt-3 border-t border-slate-200 space-y-1">
            <p className="text-xs font-bold text-slate-800">Thank you for training with us!</p>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Keep this receipt for membership verification and tax records.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
