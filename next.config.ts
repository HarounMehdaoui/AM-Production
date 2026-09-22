import type { NextConfig } from "next";

/**
 * CMS-uploaded media (client logos, project covers, testimonial avatars,
 * circle-ticker photos) is served from the CMS's own host under /uploads/*,
 * per its API contract -- next/image refuses any remote src whose host isn't
 * explicitly allowlisted. Derived from CMS_API_URL (the same env var that
 * turns on live CMS fetching in src/lib/cms.ts) rather than hardcoded, so
 * this doesn't silently break when the CMS moves from localhost to a real
 * production domain. Only the origin is kept -- CMS_API_URL itself is never
 * expected to carry a path.
 */
const cmsOrigin = process.env.CMS_API_URL ? new URL(process.env.CMS_API_URL) : undefined;
const cmsUploadsPattern = cmsOrigin
  ? {
      protocol: cmsOrigin.protocol.replace(":", "") as "http" | "https",
      hostname: cmsOrigin.hostname,
      port: cmsOrigin.port,
      pathname: "/uploads/**",
    }
  : undefined;

// Next.js separately blocks fetching from any hostname that resolves to a
// loopback/private IP (SSRF protection) even once it's in remotePatterns --
// which is exactly what CMS_API_URL is in local dev (both apps on
// localhost). Only lifted for that specific case, not globally: a real
// production CMS_API_URL is a public domain and should keep the protection.
const LOCAL_CMS_HOSTNAMES = new Set(["localhost", "127.0.0.1", "::1"]);
const isLocalCmsOrigin = cmsOrigin ? LOCAL_CMS_HOSTNAMES.has(cmsOrigin.hostname) : false;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: cmsUploadsPattern ? [cmsUploadsPattern] : [],
    ...(isLocalCmsOrigin ? { dangerouslyAllowLocalIP: true } : {}),
  },
};

export default nextConfig;
