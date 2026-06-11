"use client";

import type { PageSchema } from "@/lib/schema/page-schema";
import { SectionRenderer } from "@/components/blocks/SectionRenderer";
import { PaymentBlock } from "@/components/blocks/PaymentBlock";
import { cn } from "@/lib/utils";
import { useRef } from "react";

interface PageRendererProps {
  page: PageSchema;
  isPreview?: boolean;
}

export function PageRenderer({ page, isPreview = false }: PageRendererProps) {
  const paymentRef = useRef<HTMLDivElement>(null);

  function scrollToPayment() {
    paymentRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  const { brand, sections, payment, template } = page;

  const wrapperClass = cn(
    "min-h-screen font-sans antialiased",
    isPreview && "pointer-events-auto"
  );

  // Inject brand CSS variables at the page level
  const brandStyle = {
    "--brand-primary": brand.primaryColor,
    "--brand-secondary": brand.secondaryColor,
    "--brand-accent": brand.accentColor || brand.primaryColor,
    fontFamily: brand.fontFamily || "var(--font-inter), Inter, system-ui, sans-serif",
  } as React.CSSProperties;

  return (
    <div className={wrapperClass} style={brandStyle}>
      {/* Brand nav bar */}
      <PageNavBar brand={brand} onCtaClick={scrollToPayment} />

      {/* Sections */}
      {sections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          brand={brand}
          onCtaClick={scrollToPayment}
        />
      ))}

      {/* Payment block */}
      <div ref={paymentRef}>
        <PaymentBlock payment={payment} brand={brand} pageTitle={page.seo.title} />
      </div>

      {/* Footer */}
      <PageFooter brand={brand} />
    </div>
  );
}

function PageNavBar({
  brand,
  onCtaClick,
}: {
  brand: PageSchema["brand"];
  onCtaClick: () => void;
}) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 max-w-6xl h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {brand.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={brand.logo} alt={brand.name} className="h-8 w-auto object-contain" />
          ) : (
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: brand.primaryColor }}
            >
              {brand.name[0]}
            </div>
          )}
          <span className="font-semibold text-gray-900">{brand.name}</span>
        </div>
        <button
          onClick={onCtaClick}
          className="px-5 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
          style={{ backgroundColor: brand.primaryColor }}
        >
          Get Started
        </button>
      </div>
    </header>
  );
}

function PageFooter({ brand }: { brand: PageSchema["brand"] }) {
  return (
    <footer className="bg-gray-950 text-white py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {brand.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={brand.logo} alt={brand.name} className="h-7 w-auto object-contain opacity-80" />
            ) : (
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                style={{ backgroundColor: brand.primaryColor }}
              >
                {brand.name[0]}
              </div>
            )}
            <span className="text-white/60 text-sm">{brand.name}</span>
          </div>

          <div className="flex items-center gap-2 text-white/40 text-xs">
            <span>Secure payments by</span>
            <span className="font-semibold text-white/60">Razorpay</span>
          </div>

          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
