"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteInfo } from "@/content/site";
import navData from "@/content/nav.json";
import { Button } from "@/components/ui/Button";
import { NavDrawer } from "@/components/layout/NavDrawer";

/**
 * Breakpoint behaviour matches Figma's real Top Nav component variants:
 * "Breakpoint=XS" (375, and by extension the SM/tablet range below 1024)
 * ships logo + a compact CTA + a gradient icon-button hamburger trigger --
 * no inline nav links. "Breakpoint=MD" (1024) and "Breakpoint=LG" (1366)
 * both show the full link row + full CTA, no hamburger. So the cutover is
 * Tailwind's default `lg` (1024px), not a custom "matches the LG frame
 * width" token -- see the note in globals.css for why an earlier 1366px
 * override broke this.
 */
export function TopNav() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header
        data-testid="top-nav"
        className="sticky top-0 z-40 w-full bg-gradient-to-b from-black/0 to-black/30 px-4 py-[5px] backdrop-blur-[var(--blur-glass)] lg:px-[86px] lg:py-6"
      >
        {/* Underline sized to the nav's own max-w-[1366px] content (logo to
            CTA), not the full viewport -- Figma's "HorizontalBorder" is
            `inset-0` on the nav's own content frame, not the page width. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-px w-full max-w-[1366px] bg-[var(--color-omega-10)]"
        />
        {/* `justify-between` with the nav set to `flex-1 justify-center` scales
            fluidly across the whole >=1024px range -- a fixed gap (e.g. tuned
            to exactly 1366px) overflows the viewport at 1024-1365px instead. */}
        <div className="relative mx-auto flex w-full max-w-[1366px] items-center justify-between gap-4">
          <Link href="/" aria-label={`${siteInfo.name} — home`} className="relative inline-block shrink-0">
            {/* Plain <img>, not next/image: this is a real .svg export (see
                site.ts) -- Next's Image optimizer refuses local SVGs unless
                `images.dangerouslyAllowSVG` is set, and there's no
                raster-optimization benefit to gain for a vector asset anyway. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={siteInfo.logo} alt={siteInfo.name} width={147} height={60} className="h-[46px] w-auto lg:h-[60px]" />
            {/* "1 Spray Text Effect by Sko4 2" (see Footer.tsx for the full note). */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/logo/spray-text-media.png"
              alt=""
              aria-hidden
              className="pointer-events-none absolute left-[49.94%] top-[56.4%] w-[41.52%] max-w-none -translate-y-1/2"
              style={{ aspectRatio: "3000/2000" }}
            />
          </Link>

          <nav aria-label="Primary" className="hidden flex-1 items-center justify-center gap-4 lg:flex">
            {navData.primary.map((item) => {
              // Hash items (Studios/About) intentionally never get the
              // "active" treatment here -- pathname alone can't tell us
              // which Home section is currently scrolled into view, and a
              // real scroll-spy is out of scope. Marking them active
              // whenever pathname === "/" would make them permanently bold.
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={
                    active
                      ? "px-4 text-[length:var(--text-button3)] font-bold tracking-[-0.2px] text-white"
                      : "px-4 text-[length:var(--text-button3)] font-medium tracking-[-0.2px] transition-[color] hover:bg-clip-border hover:text-white hover:[background-image:none]"
                  }
                  style={
                    active
                      ? undefined
                      : {
                          // Figma's inactive nav tab (8:8759): a left-to-right
                          // gradient from 80% white fading to transparent,
                          // extended out to 191.38% so the fade barely
                          // registers until the very trailing edge -- not a
                          // flat solid color like the earlier version used.
                          backgroundImage:
                            "linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 191.38%)",
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                          color: "transparent",
                        }
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop/tablet-MD CTA. Wrapped in its own div (rather than
              putting `hidden lg:inline-flex` directly on Button, whose base
              class already carries an unconditional `inline-flex`) --
              two same-specificity display utilities on one element resolve
              by Tailwind's internal stylesheet order, not by which one
              looks more "specific" in the className string, so the
              unconditional one silently won and the CTA showed at every
              width. A wrapper element sidesteps that entirely. */}
          <div className="hidden lg:block">
            <Button href="/contact" variant="primary">
              {siteInfo.ctaPrimary}
            </Button>
          </div>

          {/* Mobile/tablet-SM: compact CTA + gradient hamburger, shown together (matches Figma's XS Top Nav). */}
          <div className="flex items-center gap-4 lg:hidden">
            <Link
              href="/contact"
              className="rounded-[4px] border border-[var(--color-omega-10)] bg-gradient-to-b from-[var(--color-secondary)] to-[var(--color-accent)] px-2 py-0.5 text-[14px] font-medium text-[var(--color-omega-80)] backdrop-blur-[var(--blur-glass)]"
            >
              {siteInfo.ctaPrimary}
            </Link>
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              aria-controls="nav-drawer"
              onClick={() => setDrawerOpen(true)}
              className="flex size-7 items-center justify-center rounded-[8px] border border-[var(--color-omega-10)] bg-gradient-to-b from-[var(--color-secondary)] to-[var(--color-accent)] backdrop-blur-[var(--blur-glass)]"
            >
              <span className="sr-only">Menu</span>
              <span aria-hidden className="flex h-[16px] w-[20px] flex-col justify-between">
                <span className="h-[2px] w-full rounded-full bg-[var(--color-omega-80)]" />
                <span className="h-[2px] w-full rounded-full bg-[var(--color-omega-80)]" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} activePath={pathname} />
    </>
  );
}
