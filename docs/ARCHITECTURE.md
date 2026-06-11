# Architecture Document — Razorpay Smart Pages

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         MERCHANT FLOW                           │
│                                                                  │
│  [Website URL] → [Extractor API] → [Wizard Form] → [AI Gen API] │
│                                                                  │
│  → [JSON Page Schema] → [Template Renderer] → [/p/slug (live)] │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         BUYER FLOW                               │
│                                                                  │
│  [/p/slug] → [Schema-driven landing page] → [Razorpay Widget]  │
│                                           → [Payment Complete]  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Repository Structure

```
razorpay-smart-pages/
├── apps/
│   └── web/                            # Next.js 15 application
│       ├── app/
│       │   ├── (dashboard)/            # Merchant dashboard (auth-gated)
│       │   │   ├── layout.tsx
│       │   │   ├── page.tsx            # Dashboard home / my pages
│       │   │   ├── create/
│       │   │   │   └── page.tsx        # Page creation wizard
│       │   │   └── edit/[pageId]/
│       │   │       └── page.tsx        # Edit existing page
│       │   ├── (public)/
│       │   │   └── p/[slug]/
│       │   │       └── page.tsx        # Public payment page (buyer view)
│       │   ├── api/
│       │   │   ├── extract/
│       │   │   │   └── route.ts        # Website content extraction
│       │   │   ├── generate/
│       │   │   │   └── route.ts        # AI page generation
│       │   │   └── pages/
│       │   │       ├── route.ts        # List / create pages
│       │   │       └── [id]/
│       │   │           └── route.ts    # Get / update / delete page
│       │   ├── globals.css
│       │   └── layout.tsx
│       │
│       ├── components/
│       │   ├── ui/                     # shadcn/ui primitives (copied)
│       │   │   ├── button.tsx
│       │   │   ├── input.tsx
│       │   │   ├── card.tsx
│       │   │   ├── badge.tsx
│       │   │   └── ...
│       │   │
│       │   ├── blocks/                 # Page section blocks (schema-driven)
│       │   │   ├── HeroBlock.tsx       # Hero section variants
│       │   │   ├── FeaturesBlock.tsx   # Features / benefits grid
│       │   │   ├── TestimonialsBlock.tsx
│       │   │   ├── FAQBlock.tsx
│       │   │   ├── CTABlock.tsx
│       │   │   ├── AgendaBlock.tsx     # Event: agenda/schedule
│       │   │   ├── SpeakersBlock.tsx   # Event: speakers
│       │   │   ├── ProductBlock.tsx    # D2C: product showcase
│       │   │   ├── PricingBlock.tsx    # SaaS: pricing
│       │   │   ├── TrustBadgesBlock.tsx
│       │   │   └── PaymentBlock.tsx    # Razorpay widget wrapper
│       │   │
│       │   ├── templates/             # Full template wrappers
│       │   │   ├── MinimalTemplate.tsx
│       │   │   ├── ModernTemplate.tsx
│       │   │   ├── PremiumTemplate.tsx
│       │   │   ├── EventTemplate.tsx
│       │   │   └── D2CTemplate.tsx
│       │   │
│       │   ├── wizard/                # Creation wizard steps
│       │   │   ├── WizardShell.tsx
│       │   │   ├── Step1Import.tsx    # Website URL → auto-extract
│       │   │   ├── Step2Brand.tsx     # Brand colors, logo review
│       │   │   ├── Step3Details.tsx   # What are customers paying for?
│       │   │   ├── Step4Preview.tsx   # AI-generated preview
│       │   │   └── Step5Publish.tsx   # Final publish
│       │   │
│       │   └── dashboard/
│       │       ├── PageCard.tsx
│       │       └── EmptyState.tsx
│       │
│       ├── lib/
│       │   ├── ai/
│       │   │   ├── generate-page.ts   # Claude prompt + schema output
│       │   │   └── prompts.ts         # Prompt templates per page type
│       │   ├── extract/
│       │   │   ├── jina.ts            # Jina Reader API wrapper
│       │   │   ├── metadata.ts        # Open Graph / meta extraction
│       │   │   └── colors.ts          # Color extraction from images
│       │   ├── schema/
│       │   │   └── page-schema.ts     # TypeScript types for page JSON
│       │   ├── store/
│       │   │   └── pages.ts           # In-memory / localStorage store
│       │   └── utils.ts
│       │
│       ├── package.json
│       ├── tailwind.config.ts
│       ├── tsconfig.json
│       └── next.config.ts
│
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── SCHEMA.md
│   └── ROADMAP.md
│
├── .env.example
├── .gitignore
└── README.md
```

---

## Data Flow

### 1. Website Import Flow
```
POST /api/extract { url: "https://merchant.com" }
  → Jina Reader: r.jina.ai/{url}           (markdown content)
  → fetch metadata: og:image, og:description, theme-color
  → Return: { logo, colors, description, images, content }
```

### 2. AI Generation Flow
```
POST /api/generate { brandData, pageType, details }
  → Build Claude prompt with brand context + page type
  → Claude responds with structured JSON
  → Validate against PageSchema
  → Return: PageSchema JSON
```

### 3. Page Rendering Flow
```
GET /p/[slug]
  → Load PageSchema from store
  → Select template component
  → Render blocks in order from schema.sections[]
  → Inject Razorpay widget at schema.payment position
```

---

## Open Source Reuse Strategy

| Library | Use Case | Approach |
|---------|----------|----------|
| **shadcn/ui** | All UI primitives (buttons, inputs, cards, dialogs) | npx shadcn@latest add — use as-is |
| **Magic UI** | Hero animations, typing effects, beam/gradient components | Copy specific components (MIT) |
| **Aceternity UI** | Premium section components (spotlight, parallax cards) | Copy specific components (MIT) |
| **Next SaaS Starter** | App structure, dashboard patterns | Reference only, build our own |
| **Firecrawl** | Website scraping API | Use hosted API via API key |
| **Jina Reader** | Fast content extraction (free, no API key) | Use r.jina.ai/{url} endpoint directly |
| **GrapesJS** | Drag-drop editor | **Deferred to v2** — too heavy for 24h MVP |
| **Builder.io** | Component architecture | **Pattern reference only** — implement own schema renderer |

---

## AI Architecture

### Claude Model
- `claude-sonnet-4-6` (current model, fast + capable)
- Temperature: 0.7 for creative copy, 0.3 for structured JSON

### Prompt Strategy
1. System prompt: brand strategist + conversion copywriter persona
2. Context injection: extracted website content + merchant inputs
3. Output schema: strict JSON with section-level structure
4. Few-shot examples per page type for consistent output

### JSON Schema Output
See `docs/SCHEMA.md` for full schema definition.

---

## Storage (MVP)
- **No database required for demo**
- Pages stored in `Map<slug, PageSchema>` in-memory (server-side)
- Persisted to `.data/pages.json` via Node.js filesystem API
- This is intentionally simple — swap for Postgres/Redis in v2

---

## Deployment

- **Platform:** Vercel
- **Runtime:** Node.js 18+
- **Env vars:** `ANTHROPIC_API_KEY`, `FIRECRAWL_API_KEY` (optional)
- **Edge runtime:** `/p/[slug]` route can be Edge for fast page loads

---

## Security Considerations

- Website extraction: validate URL format, block local/private IPs
- AI output: validate JSON structure before rendering
- Razorpay widget: use only official embed script, no key exposure on client
- Rate limiting: extraction API limited to 5 req/min per IP
