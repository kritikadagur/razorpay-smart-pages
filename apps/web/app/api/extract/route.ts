import { NextRequest, NextResponse } from "next/server";
import { extractBrand } from "@/lib/extract/jina";
import { isValidUrl } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const normalized = url.startsWith("http") ? url : `https://${url}`;

    if (!isValidUrl(normalized)) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Block private/local IPs
    const hostname = new URL(normalized).hostname;
    if (
      hostname === "localhost" ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.") ||
      hostname.startsWith("127.")
    ) {
      return NextResponse.json({ error: "Private URLs not allowed" }, { status: 400 });
    }

    const extracted = await extractBrand(normalized);

    return NextResponse.json({ success: true, data: extracted });
  } catch (error) {
    console.error("Extraction error:", error);
    return NextResponse.json(
      { error: "Failed to extract website data. Please try again." },
      { status: 500 }
    );
  }
}
