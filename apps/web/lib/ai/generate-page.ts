import Anthropic from "@anthropic-ai/sdk";
import { buildGenerationPrompt, SYSTEM_PROMPT } from "./prompts";
import type { PageSchema, WizardInput, Section } from "@/lib/schema/page-schema";
import { generateId, slugify } from "@/lib/utils";

// Azure-hosted Anthropic endpoint.
// The SDK sends x-api-key automatically — no custom headers needed.
// Strip the /anthropic suffix if present; the SDK appends /v1/messages itself.
const AZURE_BASE_URL = (process.env.ANTHROPIC_BASE_URL ?? "")
  .replace(/\/anthropic\/?$/, "")
  .replace(/\/$/, "");

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
  ...(AZURE_BASE_URL && { baseURL: `${AZURE_BASE_URL}/anthropic` }),
});

const MODEL = process.env.ANTHROPIC_DEPLOYMENT ?? "claude-sonnet-4-6";

interface GeneratedContent {
  brand: PageSchema["brand"];
  seo: PageSchema["seo"];
  sections: Section[];
}

async function callModel(prompt: string): Promise<string> {
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  const block = msg.content[0];
  return block.type === "text" ? block.text : "";
}

export async function generatePageContent(input: WizardInput): Promise<GeneratedContent> {
  const prompt = buildGenerationPrompt(input);
  const raw = await callModel(prompt);

  const jsonText = raw
    .replace(/^```(?:json)?\n?/m, "")
    .replace(/\n?```$/m, "")
    .trim();

  try {
    return JSON.parse(jsonText) as GeneratedContent;
  } catch {
    throw new Error(`AI returned invalid JSON. Preview: ${jsonText.slice(0, 200)}`);
  }
}

export async function buildFullPage(input: WizardInput): Promise<PageSchema> {
  const generated = await generatePageContent(input);
  const brandName = input.brand.name || input.extracted?.name || "My Page";
  const slug = slugify(`${brandName}-${input.productName}`) || generateId("page");

  return {
    id: generateId("pg"),
    slug,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    brand: {
      ...generated.brand,
      logo: input.brand.logo || input.extracted?.logo,
      primaryColor: input.brand.primaryColor || input.extracted?.primaryColor || "#6366f1",
      secondaryColor: input.brand.secondaryColor || "#0f172a",
    },
    template: "modern",
    pageType: input.pageType,
    sections: generated.sections,
    payment: {
      razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
      amount: input.price || 0,
      currency: input.currency || "INR",
      name: input.productName,
      description: input.productDescription,
      theme: {
        color: input.brand.primaryColor || input.extracted?.primaryColor || "#6366f1",
      },
    },
    seo: generated.seo || {
      title: `${input.productName} — ${brandName}`,
      description: input.productDescription,
    },
  };
}
