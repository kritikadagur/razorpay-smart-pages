import { NextRequest, NextResponse } from "next/server";
import { buildFullPage } from "@/lib/ai/generate-page";
import { savePage } from "@/lib/store/pages";
import type { WizardInput } from "@/lib/schema/page-schema";

export async function POST(req: NextRequest) {
  try {
    const input: WizardInput = await req.json();

    if (!input.pageType || !input.productName) {
      return NextResponse.json(
        { error: "pageType and productName are required" },
        { status: 400 }
      );
    }

    const page = await buildFullPage(input);
    await savePage(page);

    return NextResponse.json({ success: true, data: page });
  } catch (error) {
    console.error("Generation error:", error);
    const message = error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
