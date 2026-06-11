import type { ExtractedBrand } from "@/lib/schema/page-schema";

interface JinaResult {
  content: string;
  title?: string;
  description?: string;
  url: string;
}

export async function fetchWithJina(url: string): Promise<JinaResult> {
  const jinaUrl = `https://r.jina.ai/${url}`;
  const res = await fetch(jinaUrl, {
    headers: {
      Accept: "application/json",
      "X-Return-Format": "markdown",
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Jina fetch failed: ${res.status}`);
  }

  const text = await res.text();
  return {
    content: text,
    url,
  };
}

export async function extractMetadata(url: string): Promise<{
  title?: string;
  description?: string;
  ogImage?: string;
  themeColor?: string;
  favicon?: string;
  ogTitle?: string;
}> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; RazorpaySmartPages/1.0; +https://razorpay.com)",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return {};

    const html = await res.text();

    const extract = (pattern: RegExp) => {
      const match = html.match(pattern);
      return match ? match[1] : undefined;
    };

    return {
      title: extract(/<title[^>]*>([^<]+)<\/title>/i),
      description:
        extract(/meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
        extract(/meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i),
      ogImage:
        extract(/meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
        extract(/meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i),
      ogTitle:
        extract(/meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
        extract(/meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i),
      themeColor:
        extract(/meta[^>]+name=["']theme-color["'][^>]+content=["']([^"']+)["']/i) ||
        extract(/meta[^>]+content=["']([^"']+)["'][^>]+name=["']theme-color["']/i),
      favicon: resolveUrl(
        url,
        extract(/rel=["'](?:shortcut )?icon["'][^>]+href=["']([^"']+)["']/i) ||
          extract(/href=["']([^"']+)["'][^>]+rel=["'](?:shortcut )?icon["']/i) ||
          "/favicon.ico"
      ),
    };
  } catch {
    return {};
  }
}

function resolveUrl(base: string, path?: string): string | undefined {
  if (!path) return undefined;
  try {
    return new URL(path, base).href;
  } catch {
    return path;
  }
}

export async function extractBrand(url: string): Promise<ExtractedBrand> {
  const [jinaResult, metadata] = await Promise.allSettled([
    fetchWithJina(url),
    extractMetadata(url),
  ]);

  const content = jinaResult.status === "fulfilled" ? jinaResult.value.content : "";
  const meta = metadata.status === "fulfilled" ? metadata.value : {};

  // Extract brand name from domain
  const domain = new URL(url).hostname.replace(/^www\./, "");
  const brandName =
    meta.ogTitle?.split(/[-|–]/)[0]?.trim() ||
    meta.title?.split(/[-|–]/)[0]?.trim() ||
    domain.split(".")[0];

  // Extract images from markdown content
  const imageMatches = content.matchAll(/!\[.*?\]\((https?:\/\/[^)]+)\)/g);
  const images = Array.from(imageMatches)
    .map((m) => m[1])
    .filter((img) => !img.includes("icon") && !img.includes("logo"))
    .slice(0, 6);

  // Add OG image if available
  if (meta.ogImage && !images.includes(meta.ogImage)) {
    images.unshift(meta.ogImage);
  }

  // Extract favicon/logo
  const logo = meta.favicon || `https://www.google.com/s2/favicons?domain=${url}&sz=128`;

  return {
    name: formatBrandName(brandName || ""),
    logo,
    description: meta.description || extractFirstParagraph(content),
    primaryColor: meta.themeColor || "#6366f1",
    images: images.slice(0, 5),
    content: content.slice(0, 8000),
  };
}

function formatBrandName(raw: string): string {
  return raw
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function extractFirstParagraph(markdown: string): string {
  const lines = markdown.split("\n").filter((l) => {
    const trimmed = l.trim();
    return (
      trimmed.length > 40 &&
      !trimmed.startsWith("#") &&
      !trimmed.startsWith("!") &&
      !trimmed.startsWith("[") &&
      !trimmed.startsWith("|")
    );
  });
  return lines[0]?.slice(0, 200) || "";
}
