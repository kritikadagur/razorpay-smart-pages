import type { PageType, WizardInput } from "@/lib/schema/page-schema";

export const SYSTEM_PROMPT = `You are an elite conversion copywriter and brand strategist for Razorpay Smart Pages.
You combine the best practices from Gumroad, Stripe, Shopify, and direct-response marketing to generate
landing pages that convert browsers into buyers.

Your output must always be valid JSON matching the requested schema exactly.
Be specific, compelling, and authentic. Avoid generic filler. Write like you know the brand.
Use the merchant's own language and terminology from the provided context.`;

function getSectionsByPageType(pageType: PageType): string[] {
  const sectionMap: Record<PageType, string[]> = {
    event: ["hero", "trust", "stats", "agenda", "speakers", "testimonials", "faq", "cta"],
    workshop: ["hero", "trust", "features", "agenda", "testimonials", "faq", "cta"],
    course: ["hero", "trust", "features", "agenda", "testimonials", "faq", "cta"],
    product: ["hero", "trust", "product", "features", "testimonials", "faq", "cta"],
    service: ["hero", "trust", "benefits", "features", "testimonials", "faq", "cta"],
    consultation: ["hero", "trust", "benefits", "testimonials", "faq", "cta"],
    saas: ["hero", "stats", "features", "testimonials", "faq", "cta"],
    subscription: ["hero", "trust", "benefits", "features", "testimonials", "faq", "cta"],
  };
  return sectionMap[pageType] || ["hero", "features", "testimonials", "faq", "cta"];
}

export function buildGenerationPrompt(input: WizardInput): string {
  const { brand, pageType, businessDescription, productName, productDescription, extracted, price, currency = "INR" } = input;
  const sections = getSectionsByPageType(pageType);
  const priceFormatted = price ? `₹${(price / 100).toLocaleString("en-IN")}` : "to be determined";

  return `Generate a complete Smart Page JSON for the following business.

## Business Context
- Business Name: ${brand.name || extracted?.name || "Unknown"}
- Page Type: ${pageType}
- Product/Offering: ${productName}
- Product Description: ${productDescription}
- Business Description: ${businessDescription}
- Price: ${priceFormatted} (${currency})
- Primary Color: ${brand.primaryColor || extracted?.primaryColor || "#6366f1"}
${extracted?.content ? `\n## Extracted Website Content (use this for authentic copy)\n${extracted.content.slice(0, 3000)}` : ""}

## Required Sections (in order)
${sections.map((s, i) => `${i + 1}. ${s}`).join("\n")}

## Instructions
1. Generate COMPELLING, specific copy (not generic placeholder text)
2. Use the business context and extracted content to write authentic copy
3. The hero headline should be outcome-focused and specific
4. Include realistic testimonials that sound real (not "John D., satisfied customer")
5. FAQ should address real objections buyers have
6. CTA copy should create urgency without being spammy
7. Each section needs an "id" (s1, s2, s3...), "type", "visible": true, and "background"

## Output Format
Return a JSON object with this structure:
{
  "brand": { "name", "primaryColor", "secondaryColor", "tagline" },
  "seo": { "title", "description" },
  "sections": [array of section objects per type specs below]
}

## Section Type Specs

### hero
{ id, type:"hero", visible, background:"gradient", variant:"centered", headline, subheadline, ctaText, badge(optional urgency badge), urgency(optional one-liner) }

### trust
{ id, type:"trust", visible, background:"white", items:[{icon:emoji, label:string}] } — 4 trust signals

### features / benefits
{ id, type:"features"|"benefits", visible, background, headline, subheadline?, layout:"grid-3", items:[{icon:emoji, title, description}] }

### testimonials
{ id, type:"testimonials", visible, background:"white", headline, layout:"grid", items:[{name, title?, company?, rating:5, text}] } — 2-3 items

### faq
{ id, type:"faq", visible, background:"light", headline, items:[{question, answer}] } — 4-5 items

### agenda (event/workshop/course only)
{ id, type:"agenda", visible, background:"light", headline, date?, items:[{time, title, description?, speaker?}] }

### speakers (event only)
{ id, type:"speakers", visible, background:"white", headline, items:[{name, title, company, bio}] }

### product (product only)
{ id, type:"product", visible, background:"white", headline, images:[], description, highlights:[string] }

### stats
{ id, type:"stats", visible, background:"brand", items:[{value:string, label:string}] } — 3-4 items

### cta (always last)
{ id, type:"cta", visible, background:"brand", variant:"banner", headline, subheadline?, ctaText, urgency?, offer? }

Generate the JSON now. Return ONLY valid JSON, no markdown wrapping.`;
}
