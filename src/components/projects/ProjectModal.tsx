"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import { copy } from "@/content/copy";
import type { Project } from "@/content/types";

export function ProjectModal({
  project,
  onClose,
  onPrev,
  onNext,
}: {
  project: Project | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [project, onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
          data-testid="project-modal"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReduced ? 0 : 0.25 }}
          onClick={onClose}
        >
          <motion.div
            className="flex w-full max-w-[1206px] flex-col overflow-hidden rounded-3xl border border-white/10 sm:flex-row"
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            animate={prefersReduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            transition={{ duration: prefersReduced ? 0 : 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex h-[280px] w-full items-center justify-center bg-gradient-to-br from-[var(--color-secondary)]/30 via-black to-[var(--color-primary)]/20 sm:h-[507px] sm:flex-1">
              <span className="rounded-full bg-black/40 px-3 py-1 text-[length:var(--text-caption1)] uppercase tracking-widest text-white/60">
                {project.category}
              </span>
              <div className="absolute right-4 top-4 flex gap-3">
                <a
                  href="/contact"
                  className="rounded-[10px] bg-white/10 px-4 py-2 text-[length:var(--text-button3)] font-medium text-white backdrop-blur-[2px]"
                >
                  {copy.projectModal.getInTouch}
                </a>
                <button
                  type="button"
                  aria-label="Close project"
                  onClick={onClose}
                  className="flex size-10 items-center justify-center rounded-full bg-[var(--color-alpha-20)]"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex w-full flex-col gap-6 bg-[var(--color-alpha)] p-[30px] sm:w-[306px]">
              <div className="flex flex-col gap-2">
                <h2 className="text-[length:var(--text-h5)] font-bold text-white">{project.title}</h2>
                <p className="text-[length:var(--text-body3)] text-white/60">{project.description}</p>
                <a href={project.link} className="text-[length:var(--text-button4)] font-medium text-white underline">
                  {copy.projectModal.viewCaseStudy}
                </a>
              </div>
              <div className="mt-auto flex items-center justify-between">
                <button
                  type="button"
                  aria-label="Previous project"
                  onClick={onPrev}
                  className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-[var(--color-alpha-20)]"
                >
                  ‹
                </button>
                <button
                  type="button"
                  aria-label="Next project"
                  onClick={onNext}
                  className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-[var(--color-alpha-20)]"
                >
                  ›
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
