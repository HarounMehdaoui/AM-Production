import { z } from "zod";

/**
 * Runtime shape of every content/*.json file, validated once at import time
 * (see index.ts) rather than trusted via `as Project[]`-style casts. A
 * malformed entry now fails the build loudly instead of rendering
 * `undefined` silently -- the same boundary a future CMS API response would
 * need to be checked against, so these schemas double as that contract.
 */
export const projectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  media: z.string().nullable(),
  link: z.string(),
});

export const serviceSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  image: z.string(),
  icon: z.string(),
  layout: z.enum(["wide", "tall"]),
});

export const testimonialSchema = z.object({
  quote: z.string(),
  name: z.string(),
  company: z.string(),
  avatar: z.string(),
});

export const clientSchema = z.object({
  name: z.string(),
  image: z.string(),
});

export type Project = z.infer<typeof projectSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
export type Client = z.infer<typeof clientSchema>;
