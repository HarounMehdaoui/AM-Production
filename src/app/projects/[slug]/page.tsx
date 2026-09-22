import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaSection } from "@/components/home/CtaSection";
import { getProjects } from "@/content";

/**
 * Fixes a real dead link: ProjectModal's "View full case study" pointed at
 * `/projects/<id>` with no matching route -- every click 404'd. This is a
 * minimal detail page using the fields the content already has
 * (title/description/category), not a full case-study layout.
 */
export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const projects = await getProjects();
  const project = projects.find((p) => p.id === slug);
  return { title: project ? `${project.title} — Alpha Motion` : "Project — Alpha Motion" };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const projects = await getProjects();
  const project = projects.find((p) => p.id === slug);
  if (!project) notFound();

  return (
    <>
      <section className="flex w-full flex-col items-center gap-10 px-6 py-20 sm:px-12 lg:px-20">
        <div className="flex w-full max-w-[792px] flex-col gap-6">
          <Link href="/projects" className="text-[length:var(--text-body3)] text-white/60 transition-colors hover:text-white">
            ← All projects
          </Link>
          <div className="flex flex-col gap-3">
            <span className="text-[length:var(--text-caption1)] uppercase tracking-widest text-white/50">
              {project.category}
            </span>
            <h1 className="text-[32px] font-bold leading-[1.3] text-white sm:text-[length:var(--text-h1)]">
              {project.title}
            </h1>
          </div>
          <p className="text-[length:var(--text-body2)] text-white/70">{project.description}</p>
          {project.videoEmbed && (
            // CMS-authored HTML only -- see ProjectModal.tsx for why this is safe here
            // but must never accept arbitrary/user-submitted input.
            <div
              className="aspect-video w-full overflow-hidden rounded-2xl [&>iframe]:size-full"
              dangerouslySetInnerHTML={{ __html: project.videoEmbed }}
            />
          )}
        </div>
      </section>
      <CtaSection />
    </>
  );
}
