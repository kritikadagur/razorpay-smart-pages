import type { SpeakersSection, Brand } from "@/lib/schema/page-schema";
import { cn } from "@/lib/utils";

interface SpeakersBlockProps {
  section: SpeakersSection;
  brand: Brand;
}

export function SpeakersBlock({ section, brand }: SpeakersBlockProps) {
  return (
    <section className={cn("py-20", section.background === "light" ? "bg-gray-50" : "bg-white")}>
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            {section.headline}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {section.items.map((speaker, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4 hover:shadow-md transition-shadow"
            >
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-lg"
                  style={{ backgroundColor: brand.primaryColor }}
                >
                  {speaker.name[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{speaker.name}</h3>
                  <p className="text-sm text-gray-500">{speaker.title}</p>
                  <p className="text-xs font-medium" style={{ color: brand.primaryColor }}>
                    {speaker.company}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{speaker.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
