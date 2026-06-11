import type { AgendaSection, Brand } from "@/lib/schema/page-schema";
import { cn } from "@/lib/utils";

interface AgendaBlockProps {
  section: AgendaSection;
  brand: Brand;
}

export function AgendaBlock({ section, brand }: AgendaBlockProps) {
  return (
    <section className={cn("py-20", section.background === "light" ? "bg-gray-50" : "bg-white")}>
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            {section.headline}
          </h2>
          {section.date && (
            <p className="mt-3 text-lg font-medium" style={{ color: brand.primaryColor }}>
              📅 {section.date}
            </p>
          )}
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div
            className="absolute left-6 top-0 bottom-0 w-0.5 hidden md:block"
            style={{ backgroundColor: `${brand.primaryColor}30` }}
          />

          <div className="flex flex-col gap-4">
            {section.items.map((item, i) => (
              <div key={i} className="relative flex gap-6 items-start">
                {/* Dot */}
                <div
                  className="hidden md:flex items-center justify-center w-12 h-12 rounded-full text-white font-bold text-sm flex-shrink-0 z-10 shadow-md"
                  style={{ backgroundColor: brand.primaryColor }}
                >
                  {i + 1}
                </div>

                <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: `${brand.primaryColor}15`,
                        color: brand.primaryColor,
                      }}
                    >
                      {item.time}
                    </span>
                    {item.speaker && (
                      <span className="text-xs text-gray-400">🎤 {item.speaker}</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mt-1">{item.title}</h3>
                  {item.description && (
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
