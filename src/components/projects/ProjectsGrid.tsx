"use client";

import { useState } from "react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectModal } from "@/components/projects/ProjectModal";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import type { Project } from "@/content/types";

export function ProjectsGrid({
  projects,
  limit,
  seeAllHref,
}: {
  projects: Project[];
  limit?: number;
  seeAllHref?: string;
}) {
  const visible = limit ? projects.slice(0, limit) : projects;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex === null ? null : visible[activeIndex];

  return (
    <>
      <Reveal
        stagger
        className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {visible.map((project, i) => (
          <RevealItem key={project.id}>
            <ProjectCard project={project} onOpen={() => setActiveIndex(i)} />
          </RevealItem>
        ))}
      </Reveal>

      {seeAllHref && (
        <div className="flex w-full justify-center pt-6">
          <Button href={seeAllHref} variant="secondary">
            See All
          </Button>
        </div>
      )}

      <ProjectModal
        project={active}
        onClose={() => setActiveIndex(null)}
        onPrev={() => setActiveIndex((i) => (i === null ? null : (i - 1 + visible.length) % visible.length))}
        onNext={() => setActiveIndex((i) => (i === null ? null : (i + 1) % visible.length))}
      />
    </>
  );
}
