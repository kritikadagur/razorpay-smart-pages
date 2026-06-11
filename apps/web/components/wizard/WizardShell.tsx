"use client";

import { useState } from "react";
import { Step1Import } from "./Step1Import";
import { Step2Brand } from "./Step2Brand";
import { Step3Details } from "./Step3Details";
import { Step4Preview } from "./Step4Preview";
import type { ExtractedBrand, WizardInput, PageSchema } from "@/lib/schema/page-schema";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Import" },
  { id: 2, label: "Brand" },
  { id: 3, label: "Details" },
  { id: 4, label: "Preview" },
];

export function WizardShell() {
  const [step, setStep] = useState(1);
  const [extracted, setExtracted] = useState<ExtractedBrand | null>(null);
  const [input, setInput] = useState<Partial<WizardInput>>({
    pageType: "workshop",
    brand: {},
  });
  const [generatedPage, setGeneratedPage] = useState<PageSchema | null>(null);

  function next() { setStep((s) => Math.min(s + 1, STEPS.length)); }
  function back() { setStep((s) => Math.max(s - 1, 1)); }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 max-w-4xl h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-bold text-gray-900">Smart Pages</span>
            <span className="text-gray-300 mx-1">by</span>
            <span className="font-semibold text-blue-600">Razorpay</span>
          </div>

          {/* Step indicators */}
          <div className="hidden sm:flex items-center gap-1">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-1">
                <button
                  onClick={() => step > s.id && setStep(s.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                    step === s.id
                      ? "bg-indigo-600 text-white"
                      : step > s.id
                        ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 cursor-pointer"
                        : "bg-gray-100 text-gray-400 cursor-default"
                  )}
                >
                  <span
                    className={cn(
                      "w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold",
                      step === s.id ? "bg-white text-indigo-600" : ""
                    )}
                  >
                    {step > s.id ? "✓" : s.id}
                  </span>
                  {s.label}
                </button>
                {i < STEPS.length - 1 && (
                  <div className={cn("w-4 h-0.5 rounded", step > s.id ? "bg-indigo-300" : "bg-gray-200")} />
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-gray-200">
        <div
          className="h-full bg-indigo-600 transition-all duration-500"
          style={{ width: `${(step / STEPS.length) * 100}%` }}
        />
      </div>

      {/* Step content */}
      <main className="container mx-auto px-4 max-w-4xl py-10">
        {step === 1 && (
          <Step1Import
            onExtracted={(data) => {
              setExtracted(data);
              setInput((prev) => ({
                ...prev,
                extracted: data,
                brand: {
                  ...prev.brand,
                  name: data.name || prev.brand?.name,
                  primaryColor: data.primaryColor || prev.brand?.primaryColor,
                  logo: data.logo || prev.brand?.logo,
                },
              }));
              next();
            }}
            onSkip={next}
          />
        )}
        {step === 2 && (
          <Step2Brand
            extracted={extracted}
            brand={input.brand || {}}
            onUpdate={(brand) => setInput((p) => ({ ...p, brand }))}
            onNext={next}
            onBack={back}
          />
        )}
        {step === 3 && (
          <Step3Details
            input={input}
            onUpdate={(updates) => setInput((p) => ({ ...p, ...updates }))}
            onNext={next}
            onBack={back}
          />
        )}
        {step === 4 && (
          <Step4Preview
            input={input as WizardInput}
            generatedPage={generatedPage}
            onGenerated={setGeneratedPage}
            onBack={back}
          />
        )}
      </main>
    </div>
  );
}
