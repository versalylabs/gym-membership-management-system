"use client";

import React, { useState } from "react";
import { useBrand } from "@/lib/brand-context";
import { formatCurrency } from "@/lib/utils";
import {
  Activity,
  Palette,
  Building,
  DollarSign,
  Save,
  Check,
  Dumbbell,
  RefreshCw,
  Eye,
  Database,
  RotateCcw,
} from "lucide-react";

export default function SettingsPage() {
  const { brand, updateBrand } = useBrand();
  const [formData, setFormData] = useState({ ...brand });
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resettingDemo, setResettingDemo] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Sync if brand changes
  React.useEffect(() => {
    setFormData({ ...brand });
  }, [brand]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateBrand(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleResetDemoData = async () => {
    if (!confirm("This will reset all records to the default demo data (members, classes, attendance, sales). Proceed?")) return;
    setResettingDemo(true);
    try {
      const res = await fetch("/api/demo/reset", { method: "POST" });
      if (res.ok) {
        setResetSuccess(true);
        setTimeout(() => setResetSuccess(false), 3000);
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setResettingDemo(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F4F3EE] tracking-tight flex items-center gap-3">
            <Palette className="w-7 h-7 text-[#C8FF3D]" />
            Facility & Brand Settings
          </h1>
          <p className="text-[#8C9390] text-sm mt-1">
            Configure gym facility information, location, currency, and tax rates.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Form Inputs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Brand Identity Card */}
          <div className="p-6 rounded-3xl bg-[#202427] border border-[#8C9390]/25 space-y-5 shadow-xl">
            <h2 className="text-sm font-bold text-[#F4F3EE] flex items-center gap-2 border-b border-[#8C9390]/20 pb-3">
              <Building className="w-4 h-4 text-[#8C9390]" />
              Brand Identity & Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#F4F3EE] mb-1.5">
                  Gym / Facility Name
                </label>
                <input
                  type="text"
                  name="gymName"
                  value={formData.gymName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-xs text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F4F3EE] mb-1.5">
                  Tagline / Motto
                </label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-xs text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F4F3EE] mb-1.5">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-xs text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F4F3EE] mb-1.5">
                  Official Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-xs text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#F4F3EE] mb-1.5">
                  Facility Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-xs text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                />
              </div>
            </div>
          </div>

          {/* Financial & Currency Settings */}
          <div className="p-6 rounded-3xl bg-[#202427] border border-[#8C9390]/25 space-y-5 shadow-xl">
            <h2 className="text-sm font-bold text-[#F4F3EE] flex items-center gap-2 border-b border-[#8C9390]/20 pb-3">
              <DollarSign className="w-4 h-4 text-[#8C9390]" />
              Currency & Tax Configuration
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#F4F3EE] mb-1.5">
                  Currency Symbol
                </label>
                <select
                  name="currencySymbol"
                  value={formData.currencySymbol}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-xs text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                >
                  <option value="KSh" className="bg-[#111315] text-[#F4F3EE]">KSh (Kenyan Shilling - KSh)</option>
                  <option value="KES" className="bg-[#111315] text-[#F4F3EE]">KES (Kenyan Shilling - KES)</option>
                  <option value="$" className="bg-[#111315] text-[#F4F3EE]">$ (USD / AUD / CAD / SGD)</option>
                  <option value="€" className="bg-[#111315] text-[#F4F3EE]">€ (EUR - Eurozone)</option>
                  <option value="£" className="bg-[#111315] text-[#F4F3EE]">£ (GBP - British Pound)</option>
                  <option value="₹" className="bg-[#111315] text-[#F4F3EE]">₹ (INR - Indian Rupee)</option>
                  <option value="AED" className="bg-[#111315] text-[#F4F3EE]">AED (Emirati Dirham)</option>
                  <option value="ZAR" className="bg-[#111315] text-[#F4F3EE]">R (South African Rand)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F4F3EE] mb-1.5">
                  Currency Code
                </label>
                <input
                  type="text"
                  name="currencyCode"
                  value={formData.currencyCode}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-xs text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F4F3EE] mb-1.5">
                  Sales Tax / GST / VAT (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="taxRate"
                  value={formData.taxRate}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#111315] border border-[#8C9390]/25 rounded-xl text-xs text-[#F4F3EE] focus:outline-none focus:border-[#C8FF3D]"
                />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {savedSuccess && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <Check className="w-4 h-4" /> Changes Applied & Persisted!
              </span>
            )}
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black text-[#111315] shadow-xl transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: brand.primaryColor }}
            >
              {saving ? (
                <RefreshCw className="w-4 h-4 animate-spin text-[#111315]" />
              ) : (
                <Save className="w-4 h-4 text-[#111315]" />
              )}
              <span>Save & Apply Settings</span>
            </button>
          </div>
        </div>

        {/* Right Col: Live Preview & Pitch Tools */}
        <div className="space-y-6">
          <div className="sticky top-24 space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold text-[#8C9390] uppercase tracking-wider">
              <Eye className="w-4 h-4 text-[#C8FF3D]" />
              Live Brand Preview
            </div>

            {/* Simulated Member Digital Pass */}
            <div className="rounded-3xl overflow-hidden bg-[#202427] border border-[#8C9390]/25 shadow-2xl p-6 relative">
              <div
                className="absolute top-0 left-0 right-0 h-28 opacity-90"
                style={{
                  background: `linear-gradient(135deg, ${formData.primaryColor}, ${formData.accentColor})`,
                }}
              />

              <div className="relative z-10 pt-10">
                <div className="w-16 h-16 rounded-full bg-[#111315] p-2 shadow-2xl border border-[#8C9390]/25 flex items-center justify-center text-white mb-4">
                  <Activity
                    className="w-8 h-8 stroke-[2.5]"
                    style={{ color: formData.primaryColor }}
                  />
                </div>

                <h3 className="text-lg font-black text-[#F4F3EE]">
                  {formData.gymName || "Your Gym Name"}
                </h3>
                <p className="text-xs text-[#8C9390] mt-0.5">
                  {formData.tagline || "Your Tagline"}
                </p>

                <div className="mt-6 pt-4 border-t border-[#8C9390]/20 space-y-2.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#8C9390]">Sample Member:</span>
                    <span className="font-bold text-[#F4F3EE]">Brian Ochieng</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#8C9390]">Membership Tier:</span>
                    <span
                      className="font-black text-xs px-2 py-0.5 rounded-full text-[#111315]"
                      style={{ backgroundColor: formData.primaryColor }}
                    >
                      VIP All-Access
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#8C9390]">Monthly Dues:</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      {formatCurrency(6500, formData.currencySymbol)} / mo
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className="w-full py-2.5 rounded-xl text-xs font-black text-[#111315] shadow-lg transition-transform"
                    style={{ backgroundColor: formData.primaryColor }}
                  >
                    Check In Now
                  </button>
                </div>
              </div>
            </div>

            {/* Pitch Demo Reset Tool */}
            <div className="p-5 rounded-3xl bg-[#202427] border border-[#8C9390]/25 shadow-xl space-y-3">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#C8FF3D]" />
                <h3 className="text-xs font-bold text-[#F4F3EE] uppercase tracking-wider">
                  Pitch Demo Manager
                </h3>
              </div>
              <p className="text-[11px] text-[#8C9390] leading-relaxed">
                Before presenting to a new gym client, reset the database to restore pristine demo members, classes, and revenue metrics.
              </p>

              {resetSuccess && (
                <p className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Database reset successfully!
                </p>
              )}

              <button
                type="button"
                disabled={resettingDemo}
                onClick={handleResetDemoData}
                className="w-full py-2.5 rounded-xl bg-[#111315] hover:bg-[#202427] border border-[#8C9390]/25 text-[#F4F3EE] font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {resettingDemo ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Database className="w-4 h-4 text-blue-400" />
                )}
                <span>Reset Platform to Demo State</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
