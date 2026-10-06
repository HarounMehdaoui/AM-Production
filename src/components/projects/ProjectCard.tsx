"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cardFocus } from "@/lib/motion";
import { copy } from "@/content/copy";
import type { Project } from "@/content/types";

/**
 * Figma's Card component ("14:18512") ships its image slot as a checkerboard
 * (Figma's own "empty asset" pattern) with literal `{{Headline}}` /
 * `{{Short description}}` placeholder text -- i.e. project media is meant to
 * come from a CMS, there was never a real photo to export here. We render a
 * brand-toned placeholder in its place instead of inventing stock photography.
 *
 * The Focus/hover variant ("14:18514") adds a top gradient accent line and an
 * aperture icon in the top-right corner of the image (exported real asset,
 * `aperture-hover.svg`). get_motion_context returned no keyframe data for
 * this node -- like everywhere else in this file, so the spin below (a
 * continuous rotation while hovered/focused) is a tasteful approximation of
 * "spinning wheel", not an extracted duration/easing.
 */
export function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial="rest"
      whileHover="hover"
      whileFocus="hover"
      animate="rest"
      variants={cardFocus}
      className="group relative flex w-full flex-col items-start gap-[30px] overflow-hidden rounded-[20px] border border-[var(--color-omega-10)] bg-[var(--color-alpha)] p-[30px] text-left"
      data-testid="project-card"
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px w-[170px] -translate-x-1/2 left-1/2 scale-x-0 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-0 transition-all duration-300 ease-out group-hover:scale-x-100 group-hover:opacity-100 group-focus-visible:scale-x-100 group-focus-visible:opacity-100"
      />

      <span className="relative flex h-[188px] w-full items-center justify-center overflow-hidden rounded-xl border border-[var(--color-omega-10)] bg-gradient-to-br from-[var(--color-secondary)]/30 via-[var(--color-alpha)] to-[var(--color-primary)]/20">
        {/* project.media is CMS-managed and was never rendered here -- the
            brand-toned gradient above stayed in place even once real cover
            photos existed, since nothing read the field. Shown when present,
            gradient placeholder (still) covers CMS/local content with none set. */}
        {project.media && (
          <Image src={project.media} alt="" fill className="object-cover" />
        )}

        {/* Viewfinder corner brackets (real exported assets, both Default
            and Focus states carry them per get_design_context on 14:18512/14:18514). */}
        <Image
          src="/assets/card/bracket-left.png"
          alt=""
          width={18}
          height={18}
          className="absolute left-2 top-2"
        />
        <Image
          src="/assets/card/bracket-left.png"
          alt=""
          width={18}
          height={18}
          className="absolute right-2 top-2 -scale-x-100"
        />
        <Image
          src="/assets/card/bracket-left.png"
          alt=""
          width={18}
          height={18}
          className="absolute bottom-2 left-2 -scale-y-100"
        />
        <Image
          src="/assets/card/bracket-left.png"
          alt=""
          width={18}
          height={18}
          className="absolute bottom-2 right-2 -scale-x-100 -scale-y-100"
        />

        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden className="opacity-60">
          <path
            d="M4 7a2 2 0 0 1 2-2h2l1.5-2h5L16 5h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z"
            stroke="white"
            strokeWidth="1.5"
          />
          <circle cx="12" cy="12" r="3.5" stroke="white" strokeWidth="1.5" />
        </svg>

        <span
          data-testid="card-aperture-icon"
          className="absolute right-3 top-3 opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100 group-hover:[animation:spin_2.2s_linear_infinite] group-focus-visible:opacity-100 group-focus-visible:[animation:spin_2.2s_linear_infinite] motion-reduce:group-hover:animate-none"
        >
          <Image src="/assets/card/aperture-hover.svg" alt="" width={16} height={16} />
        </span>

        <span className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center bg-black/40 py-3 text-[length:var(--text-button2)] font-medium text-white opacity-0 backdrop-blur-[2px] transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          {copy.projectCard.viewNow}
        </span>
      </span>

      <span className="flex w-full flex-col gap-2">
        <span
          data-testid="project-card-title"
          className="text-[length:var(--text-body2)] font-medium text-white tracking-[-0.5px]"
        >
          {project.title}
        </span>
        <span className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" aria-hidden />
        <span className="text-[length:var(--text-body3)] text-[var(--color-omega-60)] tracking-[-0.2px]">
          {project.description}
        </span>
      </span>
    </motion.button>
  );
}
