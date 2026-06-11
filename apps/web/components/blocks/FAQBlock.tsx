"use client";

import { useState } from "react";
import type { FAQSection, Brand } from "@/lib/schema/page-schema";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface FAQBlockProps {
  section: FAQSection;
  brand: Brand;
}

export function FAQBlock({ section, brand }: FAQBlockProps) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      className={cn(
        "py-20",
        section.background === "dark"
          ? "bg-gray-950"
          : section.background === "light"
            ? "bg-gray-50"
            : "bg-white"
      )}
    >
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            {section.headline}
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {section.items.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-gray-50 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-medium text-gray-900 text-sm md:text-base">
                  {item.question}
                </span>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200",
                    open === i && "rotate-180"
                  )}
                  style={open === i ? { color: brand.primaryColor } : undefined}
                />
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-50">
                  <div className="pt-4">{item.answer}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
