import type { StatsSection, Brand } from "@/lib/schema/page-schema";
import { cn } from "@/lib/utils";

interface StatsBlockProps {
  section: StatsSection;
  brand: Brand;
}

export function StatsBlock({ section, brand }: StatsBlockProps) {
  const isDark = section.background === "dark" || section.background === "brand" || section.background === "gradient";

  return (
    <section
      className={cn("py-16", !isDark && (section.background === "light" ? "bg-gray-50" : "bg-white"))}
      style={
        section.background === "brand"
          ? { backgroundColor: brand.primaryColor }
          : section.background === "gradient"
            ? { background: `linear-gradient(135deg, ${brand.primaryColor}, ${brand.secondaryColor})` }
            : section.background === "dark"
              ? { backgroundColor: "#030712" }
              : undefined
      }
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div
          className={cn(
            "grid gap-8",
            section.items.length <= 2
              ? "grid-cols-2"
              : section.items.length === 3
                ? "grid-cols-3"
                : "grid-cols-2 md:grid-cols-4"
          )}
        >
          {section.items.map((stat, i) => (
            <div key={i} className="text-center">
              <div
                className={cn("text-4xl md:text-5xl font-bold mb-1", isDark ? "text-white" : "text-gray-900")}
                style={!isDark ? { color: brand.primaryColor } : undefined}
              >
                {stat.value}
              </div>
              <div className={cn("text-sm md:text-base", isDark ? "text-white/70" : "text-gray-500")}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
