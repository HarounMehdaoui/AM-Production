import Image from "next/image";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectsGrid } from "@/components/projects/ProjectsGrid";
import { CircleTicker } from "@/components/home/CircleTicker";
import { projects } from "@/content";
import { copy } from "@/content/copy";

export function ProjectsTeaser() {
  return (
    <section
      id="projects"
      className="relative flex w-full scroll-mt-24 flex-col items-center gap-10 overflow-hidden px-6 pb-16 pt-10 sm:px-12"
    >
      <Image
        src="/assets/circle-ticker/light-rays-bg.png"
        alt=""
        fill
        aria-hidden
        className="pointer-events-none -z-20 object-cover object-top opacity-70"
      />

      {/*
        Heading now renders INSIDE CircleTicker (as an overlay centered in
        the space the arc curves around), not as a separate flowed section
        below it -- ss/how_wheel_should_look.png shows it nested inside
        the wheel's embrace. The large pt-[260/360/480px] this section used
        to carry existed only to push the heading below the ring's old
        short clipped box; removed along with that box.
      */}
      <CircleTicker>
        <Reveal className="flex max-w-[574px] flex-col items-center gap-[10px] px-4 text-center">
          <Tag>{copy.projectsTeaser.tag}</Tag>
          <div className="flex flex-col items-center gap-10 pt-6">
            <h2 className="text-[32px] font-bold leading-[1.3] text-white sm:text-[length:var(--text-h1)]">
              {copy.projectsTeaser.heading[0]}
              <br />
              {copy.projectsTeaser.heading[1]}
            </h2>
            <p className="text-[length:var(--text-h5)] tracking-[-0.5px] text-white/50">{copy.projectsTeaser.body}</p>
            <Button href="/projects" variant="primary">
              {copy.projectsTeaser.cta}
            </Button>
          </div>
        </Reveal>
      </CircleTicker>

      <div className="w-full max-w-[1160px] px-4 sm:px-8">
        <ProjectsGrid projects={projects} limit={6} seeAllHref="/projects" />
      </div>
    </section>
  );
}
