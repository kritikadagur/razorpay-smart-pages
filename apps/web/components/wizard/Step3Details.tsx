"use client";

import type { WizardInput, PageType } from "@/lib/schema/page-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Step3DetailsProps {
  input: Partial<WizardInput>;
  onUpdate: (updates: Partial<WizardInput>) => void;
  onNext: () => void;
  onBack: () => void;
}

const PAGE_TYPES: { type: PageType; label: string; emoji: string; description: string }[] = [
  { type: "workshop", label: "Workshop", emoji: "🎓", description: "Hands-on learning event" },
  { type: "event", label: "Event", emoji: "🎤", description: "Conference, meetup, concert" },
  { type: "course", label: "Course", emoji: "📚", description: "Online or offline course" },
  { type: "product", label: "Product", emoji: "📦", description: "Physical or digital product" },
  { type: "service", label: "Service", emoji: "🛠️", description: "Freelance or agency work" },
  { type: "consultation", label: "Consultation", emoji: "💼", description: "1:1 session or call" },
  { type: "saas", label: "SaaS", emoji: "⚡", description: "Software subscription" },
  { type: "subscription", label: "Membership", emoji: "♾️", description: "Recurring access" },
];

export function Step3Details({ input, onUpdate, onNext, onBack }: Step3DetailsProps) {
  const set = (key: keyof WizardInput, value: unknown) =>
    onUpdate({ ...input, [key]: value });

  const canProceed = input.pageType && input.productName && input.productDescription;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">What are customers paying for?</h2>
        <p className="text-gray-500">Tell us what you&apos;re selling so AI can build the perfect page.</p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Page type picker */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">Type of offering</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PAGE_TYPES.map((pt) => (
              <button
                key={pt.type}
                onClick={() => set("pageType", pt.type)}
                className={cn(
                  "flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all text-center hover:bg-indigo-50",
                  input.pageType === pt.type
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-100"
                )}
              >
                <span className="text-2xl">{pt.emoji}</span>
                <span className={cn(
                  "text-xs font-semibold",
                  input.pageType === pt.type ? "text-indigo-700" : "text-gray-700"
                )}>
                  {pt.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Product details */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Name of your offering *
            </label>
            <Input
              value={input.productName || ""}
              onChange={(e) => set("productName", e.target.value)}
              placeholder={`e.g. "Next.js Bootcamp", "Brand Strategy Session"`}
              className="h-11 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Describe what customers get *
            </label>
            <textarea
              value={input.productDescription || ""}
              onChange={(e) => set("productDescription", e.target.value)}
              placeholder="2-day hands-on workshop where you'll learn to build and deploy production Next.js apps..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Business description
            </label>
            <textarea
              value={input.businessDescription || ""}
              onChange={(e) => set("businessDescription", e.target.value)}
              placeholder="Who you are and what you do (AI will use this for authentic copy)"
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Price (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
              <Input
                type="number"
                value={input.price ? (input.price / 100).toString() : ""}
                onChange={(e) => set("price", Math.round(parseFloat(e.target.value || "0") * 100))}
                placeholder="4999"
                className="h-11 rounded-xl pl-8"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Leave blank to hide payment widget in preview</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Button variant="outline" onClick={onBack} className="flex-1 h-12 rounded-xl">
          ← Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="flex-1 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
        >
          Generate my page →
        </Button>
      </div>
    </div>
  );
}
