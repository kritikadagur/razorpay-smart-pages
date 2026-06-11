import { writeFile, readFile, mkdir } from "fs/promises";
import path from "path";
import type { PageSchema } from "@/lib/schema/page-schema";

const DATA_DIR = path.join(process.cwd(), ".data");
const PAGES_FILE = path.join(DATA_DIR, "pages.json");

async function ensureDataDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

async function readPages(): Promise<Record<string, PageSchema>> {
  try {
    const content = await readFile(PAGES_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    return {};
  }
}

async function writePages(pages: Record<string, PageSchema>) {
  await ensureDataDir();
  await writeFile(PAGES_FILE, JSON.stringify(pages, null, 2), "utf-8");
}

export async function savePage(page: PageSchema): Promise<void> {
  const pages = await readPages();
  pages[page.slug] = page;
  await writePages(pages);
}

export async function getPage(slug: string): Promise<PageSchema | null> {
  const pages = await readPages();
  return pages[slug] || null;
}

export async function getAllPages(): Promise<PageSchema[]> {
  const pages = await readPages();
  return Object.values(pages).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function deletePage(slug: string): Promise<void> {
  const pages = await readPages();
  delete pages[slug];
  await writePages(pages);
}

export async function updatePage(
  slug: string,
  updates: Partial<PageSchema>
): Promise<PageSchema | null> {
  const pages = await readPages();
  if (!pages[slug]) return null;
  pages[slug] = { ...pages[slug], ...updates, updatedAt: new Date().toISOString() };
  await writePages(pages);
  return pages[slug];
}
