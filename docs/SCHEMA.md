# Page JSON Schema — Razorpay Smart Pages

## Full Schema Definition

```typescript
interface PageSchema {
  // Metadata
  id: string;
  slug: string;
  createdAt: string;
  updatedAt: string;

  // Brand
  brand: {
    name: string;
    logo?: string;           // URL
    tagline?: string;
    primaryColor: string;    // hex
    secondaryColor: string;  // hex
    accentColor?: string;    // hex
    fontFamily?: string;     // e.g. "Inter", "Plus Jakarta Sans"
  };

  // Template
  template: "minimal" | "modern" | "premium" | "event" | "d2c";
  pageType: "event" | "workshop" | "course" | "product" | "service" | "saas" | "consultation" | "subscription";

  // Sections (ordered array — render in sequence)
  sections: Section[];

  // Payment config
  payment: {
    razorpayKeyId: string;
    amount: number;           // in paise
    currency: string;         // "INR"
    name: string;             // product/event name
    description: string;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    theme?: {
      color: string;          // matches brand.primaryColor
    };
  };

  // SEO
  seo: {
    title: string;
    description: string;
    ogImage?: string;
  };
}

// ─── SECTION TYPES ───────────────────────────────────────────────

type Section =
  | HeroSection
  | FeaturesSection
  | BenefitsSection
  | TestimonialsSection
  | FAQSection
  | CTASection
  | AgendaSection
  | SpeakersSection
  | ProductSection
  | PricingSection
  | TrustBadgesSection
  | StatsSection
  | GallerySection;

interface BaseSection {
  id: string;
  type: string;
  visible: boolean;
  background?: "white" | "light" | "dark" | "brand" | "gradient";
}

interface HeroSection extends BaseSection {
  type: "hero";
  variant: "centered" | "split" | "video" | "minimal";
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaSecondaryText?: string;
  image?: string;
  badge?: string;             // e.g. "🔥 Limited Spots"
  urgency?: string;           // e.g. "Only 12 seats left"
}

interface FeaturesSection extends BaseSection {
  type: "features";
  headline: string;
  subheadline?: string;
  layout: "grid-3" | "grid-2" | "list" | "cards";
  items: {
    icon: string;             // emoji or icon name
    title: string;
    description: string;
  }[];
}

interface BenefitsSection extends BaseSection {
  type: "benefits";
  headline: string;
  items: {
    icon: string;
    title: string;
    description: string;
  }[];
}

interface TestimonialsSection extends BaseSection {
  type: "testimonials";
  headline: string;
  layout: "grid" | "carousel" | "wall";
  items: {
    name: string;
    title?: string;
    company?: string;
    avatar?: string;
    rating: number;           // 1-5
    text: string;
  }[];
}

interface FAQSection extends BaseSection {
  type: "faq";
  headline: string;
  items: {
    question: string;
    answer: string;
  }[];
}

interface CTASection extends BaseSection {
  type: "cta";
  variant: "simple" | "banner" | "card";
  headline: string;
  subheadline?: string;
  ctaText: string;
  urgency?: string;
  offer?: string;
}

interface AgendaSection extends BaseSection {
  type: "agenda";
  headline: string;
  date?: string;
  items: {
    time: string;
    title: string;
    description?: string;
    speaker?: string;
  }[];
}

interface SpeakersSection extends BaseSection {
  type: "speakers";
  headline: string;
  items: {
    name: string;
    title: string;
    company: string;
    bio: string;
    avatar?: string;
    linkedin?: string;
  }[];
}

interface ProductSection extends BaseSection {
  type: "product";
  headline: string;
  images: string[];
  description: string;
  highlights: string[];
  price?: string;
  originalPrice?: string;
}

interface PricingSection extends BaseSection {
  type: "pricing";
  headline: string;
  items: {
    name: string;
    price: string;
    period?: string;
    description: string;
    features: string[];
    highlighted: boolean;
    ctaText: string;
  }[];
}

interface TrustBadgesSection extends BaseSection {
  type: "trust";
  items: {
    icon: string;
    label: string;
  }[];
}

interface StatsSection extends BaseSection {
  type: "stats";
  items: {
    value: string;
    label: string;
  }[];
}

interface GallerySection extends BaseSection {
  type: "gallery";
  headline?: string;
  images: string[];
  layout: "grid" | "masonry" | "strip";
}
```

## Example: Workshop Page Schema

```json
{
  "id": "pg_01",
  "slug": "nextjs-workshop-june",
  "brand": {
    "name": "DevCraft Academy",
    "primaryColor": "#6366F1",
    "secondaryColor": "#0F172A",
    "accentColor": "#F59E0B"
  },
  "template": "event",
  "pageType": "workshop",
  "sections": [
    {
      "id": "s1",
      "type": "hero",
      "variant": "centered",
      "visible": true,
      "background": "gradient",
      "headline": "Master Next.js 15 in One Weekend",
      "subheadline": "A hands-on workshop for developers who want to ship faster. Build a production app from zero to deployed in 2 days.",
      "ctaText": "Secure Your Spot — ₹4,999",
      "badge": "🔥 Only 8 seats left",
      "urgency": "Workshop fills up fast. Last batch sold out in 48 hours."
    },
    {
      "id": "s2",
      "type": "trust",
      "visible": true,
      "background": "white",
      "items": [
        { "icon": "✅", "label": "Live Sessions" },
        { "icon": "🎓", "label": "Certificate Included" },
        { "icon": "💻", "label": "Hands-on Projects" },
        { "icon": "♾️", "label": "Lifetime Recording Access" }
      ]
    },
    {
      "id": "s3",
      "type": "agenda",
      "visible": true,
      "background": "light",
      "headline": "What You'll Build & Learn",
      "date": "June 21–22, 2026",
      "items": [
        { "time": "Day 1 · 10:00 AM", "title": "Next.js 15 App Router Deep Dive", "description": "Server components, streaming, and parallel routes" },
        { "time": "Day 1 · 2:00 PM", "title": "Build a Full-Stack App", "description": "Auth, database, API routes — all in one afternoon" },
        { "time": "Day 2 · 10:00 AM", "title": "Performance & Optimization", "description": "Caching strategies, ISR, and Edge runtime" },
        { "time": "Day 2 · 3:00 PM", "title": "Deploy to Production", "description": "Vercel, CI/CD, monitoring — your app goes live" }
      ]
    },
    {
      "id": "s4",
      "type": "testimonials",
      "visible": true,
      "background": "white",
      "headline": "What Past Students Say",
      "layout": "grid",
      "items": [
        { "name": "Priya Sharma", "title": "Senior Developer", "company": "Razorpay", "rating": 5, "text": "Best investment I made this year. The hands-on approach meant I was actually shipping code, not just watching slides." },
        { "name": "Arjun Mehta", "title": "Founder", "company": "YC W25", "rating": 5, "text": "Went from Next.js beginner to shipping my startup's MVP. The workshop pace was perfect." }
      ]
    },
    {
      "id": "s5",
      "type": "faq",
      "visible": true,
      "background": "light",
      "headline": "Frequently Asked Questions",
      "items": [
        { "question": "Do I need prior React experience?", "answer": "Yes, basic React knowledge is recommended. You should be comfortable with components and hooks." },
        { "question": "Will sessions be recorded?", "answer": "Yes, all sessions are recorded and available for lifetime access." },
        { "question": "What if I can't attend live?", "answer": "You'll get the recordings immediately after each session. You can also ask questions async." }
      ]
    }
  ],
  "payment": {
    "razorpayKeyId": "rzp_live_xxxx",
    "amount": 499900,
    "currency": "INR",
    "name": "Next.js Workshop — June 2026",
    "description": "2-day intensive Next.js 15 workshop",
    "theme": { "color": "#6366F1" }
  },
  "seo": {
    "title": "Next.js 15 Workshop — Master Modern React in One Weekend",
    "description": "Hands-on 2-day workshop for developers. Build a production app from zero to deployed. Only 8 seats left.",
    "ogImage": "https://..."
  }
}
```
