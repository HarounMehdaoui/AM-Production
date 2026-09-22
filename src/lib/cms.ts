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

/**
 * Same as fetchFromCms, but a 404 resolves to `null` instead of throwing --
 * for singleton entities (hero media) that legitimately don't exist yet
 * during initial CMS setup. A brand-new CMS with nothing configured should
 * degrade that one section to its default, not 500 the whole page it's on.
 * Any other non-2xx status still throws; only "not created yet" is expected.
 */
export async function fetchFromCmsOptional<T>(path: string, schema: z.ZodType<T>): Promise<T | null> {
  const res = await fetch(`${CMS_API_URL}${path}`, { next: { revalidate: 60 } });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`CMS request failed: GET ${path} -> ${res.status}`);
  }
  return schema.parse(await res.json());
}
