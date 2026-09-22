"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import { siteInfo } from "@/content/site";
import navData from "@/content/nav.json";
import { copy } from "@/content/copy";
import { drawerSlide } from "@/lib/motion";
import { isActiveNavHref } from "@/lib/nav";

export function NavDrawer({
  open,
  onClose,
  activePath,
}: {
  open: boolean;
  onClose: () => void;
  activePath: string;
}) {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="scrim"
            className="fixed inset-0 z-50 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            id="nav-drawer"
            key="drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[393px] flex-col bg-black"
            initial={prefersReduced ? { opacity: 0 } : "hidden"}
            animate={prefersReduced ? { opacity: 1 } : "visible"}
            exit={prefersReduced ? { opacity: 0 } : "exit"}
            variants={prefersReduced ? undefined : drawerSlide}
          >
            <div className="flex h-14 items-center justify-between border-b border-[var(--color-omega-10)] px-6">
              <span className="flex items-center gap-3 text-[length:var(--text-caption1)] text-[var(--color-omega-60)]">
                <span className="size-2 bg-[var(--color-accent)]" aria-hidden />
                {copy.navDrawer.menuLabel}
              </span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={onClose}
                className="flex size-7 items-center justify-center rounded-lg border border-[var(--color-omega-10)]"
              >
                <Image src="/assets/nav-drawer/close.svg" alt="" width={16} height={16} />
              </button>
            </div>

            <nav aria-label="Mobile" className="flex flex-col gap-8 overflow-y-auto px-6 py-10">
              <ul className="flex flex-col">
                {navData.primary.map((item) => {
                  const active = isActiveNavHref(activePath, item.href);
                  return (
                    <li key={item.href} className="flex items-center gap-3 border-b border-[var(--color-omega-10)] py-5">
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="text-[36px] font-bold uppercase leading-[1.3] text-white"
                      >
                        {item.label}
                      </Link>
                      {active && <span className="size-2 rounded-full bg-[var(--color-primary)]" aria-hidden />}
                    </li>
                  );
                })}
              </ul>

              <div className="flex flex-col gap-2.5">
                <span className="text-[length:var(--text-caption1)] text-[var(--color-omega-60)]">{copy.navDrawer.emailLabel}</span>
                <a href={`mailto:${siteInfo.email}`} className="text-[length:var(--text-body2)] text-[var(--color-link)]">
                  {siteInfo.email}
                </a>
              </div>

              <div className="flex flex-col gap-4">
                <span className="text-[length:var(--text-caption1)] text-[var(--color-omega-60)]">{copy.navDrawer.socialsLabel}</span>
                <div className="grid grid-cols-2 gap-4">
                  {siteInfo.socials.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-[length:var(--text-button3)] font-medium text-white"
                    >
                      {social.name}
                      <span aria-hidden>↗</span>
                    </a>
                  ))}
                </div>
              </div>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
