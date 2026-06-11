import type { FeaturesSection, BenefitsSection, Brand } from "@/lib/schema/page-schema";
import { cn } from "@/lib/utils";

interface FeaturesBlockProps {
  section: FeaturesSection | BenefitsSection;
  brand: Brand;
}

const bgMap: Record<string, string> = {
  white: "bg-white",
  light: "bg-gray-50",
  dark: "bg-gray-950 text-white",
  brand: "text-white",
  gradient: "text-white",
};

export function FeaturesBlock({ section, brand }: FeaturesBlockProps) {
  const isDark = section.background === "dark" || section.background === "brand" || section.background === "gradient";
  const layout = "layout" in section ? section.layout : "grid-3";

  const gridClass =
    layout === "grid-2"
      ? "grid-cols-1 sm:grid-cols-2"
      : layout === "list"
        ? "grid-cols-1 max-w-2xl mx-auto"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section
      className={cn("py-20", bgMap[section.background ?? "light"])}
      style={
        section.background === "brand"
          ? { backgroundColor: brand.primaryColor }
          : section.background === "gradient"
            ? {
                background: `linear-gradient(135deg, ${brand.primaryColor}, ${brand.secondaryColor})`,
              }
            : undefined
      }
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2
            className={cn(
              "text-3xl md:text-4xl font-bold tracking-tight",
              isDark ? "text-white" : "text-gray-900"
            )}
          >
            {section.headline}
          </h2>
          {"subheadline" in section && section.subheadline && (
            <p className={cn("mt-4 text-lg max-w-2xl mx-auto", isDark ? "text-white/70" : "text-gray-500")}>
              {section.subheadline}
            </p>
          )}
        </div>

        <div className={cn("grid gap-6", gridClass)}>
          {section.items.map((item, i) => (
            <FeatureCard key={i} item={item} isDark={isDark} brand={brand} layout={layout} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  item,
  isDark,
  brand,
  layout,
}: {
  item: { icon: string; title: string; description: string };
  isDark: boolean;
  brand: Brand;
  layout: string;
}) {
  if (layout === "list") {
    return (
      <div className="flex gap-4 items-start p-4">
        <span
          className="text-2xl flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl"
          style={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : `${brand.primaryColor}15` }}
        >
          {item.icon}
        </span>
        <div>
          <h3 className={cn("font-semibold text-lg", isDark ? "text-white" : "text-gray-900")}>
            {item.title}
          </h3>
          <p className={cn("text-sm mt-1 leading-relaxed", isDark ? "text-white/70" : "text-gray-500")}>
            {item.description}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "p-6 rounded-2xl transition-all duration-200 hover:-translate-y-1",
        isDark
          ? "bg-white/10 border border-white/10 hover:bg-white/15"
          : "bg-white border border-gray-100 shadow-sm hover:shadow-md"
      )}
    >
      <span
        className="text-3xl mb-4 w-14 h-14 flex items-center justify-center rounded-2xl"
        style={{ backgroundColor: isDark ? "rgba(255,255,255,0.15)" : `${brand.primaryColor}15` }}
      >
        {item.icon}
      </span>
      <h3 className={cn("font-semibold text-lg mb-2", isDark ? "text-white" : "text-gray-900")}>
        {item.title}
      </h3>
      <p className={cn("text-sm leading-relaxed", isDark ? "text-white/70" : "text-gray-500")}>
        {item.description}
      </p>
    </div>
  );
}
