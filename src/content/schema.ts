import { z } from "zod";

/**
 * Runtime shape of every content dataset, validated once at the content
 * boundary (see index.ts) whether that data comes from the local JSON
 * fallback or a live CMS API response -- a malformed entry fails loudly
 * instead of rendering `undefined` silently either way.
 */
export const projectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  media: z.string().nullable(),
  // Raw HTML embed (a Vimeo <iframe>, typically) rendered as-is in the
  // project modal. CMS-authored only -- see ProjectModal.tsx for why that
  // matters before touching this field.
  videoEmbed: z.string().nullable(),
  published: z.boolean().default(true),
  order: z.number().default(0),
});

export const serviceSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  image: z.string(),
  icon: z.string(),
  layout: z.enum(["wide", "tall"]),
  published: z.boolean().default(true),
  order: z.number().default(0),
});

export const testimonialSchema = z.object({
  id: z.string(),
  quote: z.string(),
  name: z.string(),
  company: z.string(),
  avatar: z.string(),
  published: z.boolean().default(true),
  order: z.number().default(0),
});

export const clientSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string(),
  order: z.number().default(0),
});

// The rotating photo ring on Home ("the scrolling wheel") -- an unbounded,
// CMS-managed image list. The ring doubles whatever count it's given (see
// CircleTicker.tsx) so it isn't tied to exactly 12.
export const circleTickerImageSchema = z.object({
  id: z.string(),
  imageUrl: z.string(),
  order: z.number().default(0),
});

export const heroMediaSchema = z.object({
  videoUrl: z.string(),
});

export type Project = z.infer<typeof projectSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
export type Client = z.infer<typeof clientSchema>;
export type CircleTickerImage = z.infer<typeof circleTickerImageSchema>;
export type HeroMedia = z.infer<typeof heroMediaSchema>;
