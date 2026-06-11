"use client";

import type { ExtractedBrand, Brand } from "@/lib/schema/page-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Step2BrandProps {
  extracted: ExtractedBrand | null;
  brand: Partial<Brand>;
  onUpdate: (brand: Partial<Brand>) => void;
  onNext: () => void;
  onBack: () => void;
}

const PRESET_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f97316",
  "#10b981", "#0ea5e9", "#f59e0b", "#ef4444",
  "#14b8a6", "#6d28d9", "#1d4ed8", "#059669",
];

export function Step2Brand({ extracted, brand, onUpdate, onNext, onBack }: Step2BrandProps) {
  function set(key: keyof Brand, value: string) {
    onUpdate({ ...brand, [key]: value });
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Your brand</h2>
        <p className="text-gray-500">
          {extracted ? "We extracted these from your website — review and adjust." : "Tell us about your brand."}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col gap-6">
        {/* Logo preview */}
        {(brand.logo || extracted?.logo) && (
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={brand.logo || extracted?.logo}
              alt="Logo"
              className="h-12 w-auto max-w-[180px] object-contain"
            />
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Logo detected</p>
              <button
                onClick={() => set("logo", "")}
                className="text-xs text-red-400 hover:text-red-600 mt-0.5"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        {/* Brand name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Business Name *</label>
          <Input
            value={brand.name || ""}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Acme Inc."
            className="h-11 rounded-xl"
          />
        </div>

        {/* Tagline */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tagline</label>
          <Input
            value={brand.tagline || ""}
            onChange={(e) => set("tagline", e.target.value)}
            placeholder="Making X easier for everyone"
            className="h-11 rounded-xl"
          />
        </div>

        {/* Logo URL */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Logo URL</label>
          <Input
            value={brand.logo || extracted?.logo || ""}
            onChange={(e) => set("logo", e.target.value)}
            placeholder="https://yourbrand.com/logo.png"
            className="h-11 rounded-xl"
          />
        </div>

        {/* Primary color */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Brand Color</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => set("primaryColor", color)}
                className="w-8 h-8 rounded-full border-2 transition-all hover:scale-110"
                style={{
                  backgroundColor: color,
                  borderColor: brand.primaryColor === color ? "#1f2937" : "transparent",
                  boxShadow: brand.primaryColor === color ? `0 0 0 2px white, 0 0 0 4px ${color}` : undefined,
                }}
              />
            ))}
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={brand.primaryColor || "#6366f1"}
              onChange={(e) => set("primaryColor", e.target.value)}
              className="w-11 h-11 rounded-xl cursor-pointer border border-gray-200"
            />
            <Input
              value={brand.primaryColor || "#6366f1"}
              onChange={(e) => set("primaryColor", e.target.value)}
              placeholder="#6366f1"
              className="h-11 rounded-xl w-32 font-mono text-sm"
            />
            <div
              className="flex-1 h-11 rounded-xl border border-gray-200 transition-all"
              style={{ backgroundColor: brand.primaryColor || "#6366f1" }}
            />
          </div>
        </div>

        {/* Secondary color */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Secondary Color</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={brand.secondaryColor || "#0f172a"}
              onChange={(e) => set("secondaryColor", e.target.value)}
              className="w-11 h-11 rounded-xl cursor-pointer border border-gray-200"
            />
            <Input
              value={brand.secondaryColor || "#0f172a"}
              onChange={(e) => set("secondaryColor", e.target.value)}
              placeholder="#0f172a"
              className="h-11 rounded-xl w-32 font-mono text-sm"
            />
          </div>
        </div>

        {/* Preview strip */}
        <div
          className="h-14 rounded-2xl flex items-center justify-center gap-3 text-white font-medium text-sm transition-all"
          style={{
            background: `linear-gradient(135deg, ${brand.primaryColor || "#6366f1"}, ${brand.secondaryColor || "#0f172a"})`,
          }}
        >
          <span>{brand.name || "Your Brand"}</span>
          <span className="opacity-50">·</span>
          <span className="opacity-70 text-xs">Brand preview</span>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Button variant="outline" onClick={onBack} className="flex-1 h-12 rounded-xl">
          ← Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!brand.name}
          className="flex-1 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
        >
          Continue →
        </Button>
      </div>
    </div>
  );
}
