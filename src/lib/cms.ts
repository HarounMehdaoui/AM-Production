import type { z } from "zod";

/**
 * Server-only (no NEXT_PUBLIC_ prefix -- this URL is never needed in the
 * browser bundle, since every call site is a Server Component or
 * generateStaticParams/generateMetadata, all of which run on the server or
 * at build time). Unset means "no CMS yet" -- every content getter in
 * content/index.ts falls back to the local JSON in that case, so the site
 * keeps working standalone until a CMS is actually deployed and this is set.
 */
const CMS_API_URL = process.env.CMS_API_URL;

export const isCmsConfigured = Boolean(CMS_API_URL);

/**
 * Fetches one endpoint from the CMS's public read API and validates the
 * response against the same zod schema the local JSON fallback is parsed
 * with (see content/schema.ts) -- the CMS is trusted infrastructure, but a
 * bad deploy on that end should still fail loudly here rather than render
 * `undefined` into the page.
 */
export async function fetchFromCms<T>(path: string, schema: z.ZodType<T>): Promise<T> {
  const res = await fetch(`${CMS_API_URL}${path}`, {
    // ISR: pick up CMS edits within a minute without a full site rebuild.
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`CMS request failed: GET ${path} -> ${res.status}`);
  }
  return schema.parse(await res.json());
}
