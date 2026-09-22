import type { Metadata } from "next";
import { ProjectsGrid } from "@/components/projects/ProjectsGrid";
import { CtaSection } from "@/components/home/CtaSection";
import { getProjects } from "@/content";

export const metadata: Metadata = {
  title: "Projects — Alpha Motion",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <section className="flex w-full flex-col items-center gap-10 px-6 py-16 sm:px-12 lg:px-20">
        <div className="w-full max-w-[1160px]">
          <ProjectsGrid projects={projects} />
        </div>
      </section>
      <CtaSection />
    </>
  );
}
