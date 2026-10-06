import { z } from "zod";
import projectsRaw from "./projects.json";
import servicesRaw from "./services.json";
import testimonialsRaw from "./testimonials.json";
import clientsRaw from "./clients.json";
import circleTickerRaw from "./circle-ticker.json";
import heroMediaRaw from "./hero-media.json";
import teamRaw from "./team.json";
import {
  projectSchema,
  serviceSchema,
  testimonialSchema,
  clientSchema,
  circleTickerImageSchema,
  heroMediaSchema,
  teamMemberSchema,
} from "./schema";
import { isCmsConfigured, fetchFromCms, fetchFromCmsOptional } from "@/lib/cms";

/**
 * One async getter per content type -- the seam between "static JSON
 * shipped in this repo" and "live data from the external CMS". Every getter
 * fetches from the CMS's public read API when CMS_API_URL is configured,
 * otherwise falls back to the local JSON, validated through the exact same
 * zod schema either way. Call sites are Server Components/generateStaticParams,
 * so `await`ing these is idiomatic App Router, not a workaround.
 *
 * `published`/`order` are enforced here as a defense-in-depth boundary check
 * (the CMS's own public API is expected to only ever return published rows,
 * already ordered) rather than trusted blindly.
 */

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

export async function getProjects() {
  const data = isCmsConfigured
    ? await fetchFromCms("/v1/projects", z.array(projectSchema))
    : z.array(projectSchema).parse(projectsRaw);
  return data.filter((p) => p.published).sort(byOrder);
}

export async function getServices() {
  const data = isCmsConfigured
    ? await fetchFromCms("/v1/services", z.array(serviceSchema))
    : z.array(serviceSchema).parse(servicesRaw);
  return data.filter((s) => s.published).sort(byOrder);
}

export async function getTestimonials() {
  const data = isCmsConfigured
    ? await fetchFromCms("/v1/testimonials", z.array(testimonialSchema))
    : z.array(testimonialSchema).parse(testimonialsRaw);
  return data.filter((t) => t.published).sort(byOrder);
}

export async function getClients() {
  const data = isCmsConfigured
    ? await fetchFromCms("/v1/clients", z.array(clientSchema))
    : z.array(clientSchema).parse(clientsRaw);
  return data.sort(byOrder);
}

export async function getCircleTickerImages() {
  const data = isCmsConfigured
    ? await fetchFromCms("/v1/circle-ticker", z.array(circleTickerImageSchema))
    : z.array(circleTickerImageSchema).parse(circleTickerRaw);
  return data.sort(byOrder);
}

export async function getTeamMembers() {
  const data = isCmsConfigured
    ? await fetchFromCms("/v1/team-members", z.array(teamMemberSchema))
    : z.array(teamMemberSchema).parse(teamRaw);
  return data.filter((m) => m.published).sort(byOrder);
}

export async function getHeroMedia() {
  const localDefault = heroMediaSchema.parse(heroMediaRaw);
  if (!isCmsConfigured) return localDefault;
  const cmsValue = await fetchFromCmsOptional("/v1/hero-media", heroMediaSchema);
  return cmsValue ?? localDefault;
}
