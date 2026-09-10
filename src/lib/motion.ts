/**
 * Shared Framer Motion variants.
 *
 * IMPORTANT: get_motion_context returned no keyframe/prototype data for any
 * node checked in this Figma file (Home hero, "Reveal Text", Card hover,
 * NavigationDrawer, Testimonials) — either because the file has no Smart
 * Animate prototype wired up, or because it requires an active Figma desktop
 * selection this session didn't have. There is no extracted duration/easing
 * to match. The values below are a reasonable, tasteful approximation
 * (standard "ease-out" easing, ~0.5-0.8s durations) driven by each
 * component's Figma *name* (e.g. "Reveal Text", "Circle Wrap → Circle",
 * card Default/Focus variants) rather than real keyframe data. This is
 * flagged again in the final report.
 */
import type { Variants, Transition } from "framer-motion";

export const easeOut: Transition["ease"] = [0.16, 1, 0.3, 1];

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: easeOut } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: easeOut },
  },
};

export const staggerContainer = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

export const drawerSlide: Variants = {
  hidden: { x: "100%" },
  visible: { x: 0, transition: { duration: 0.45, ease: easeOut } },
  exit: { x: "100%", transition: { duration: 0.35, ease: easeOut } },
};

/**
 * Figma's Card "Focus" variant (14:18514) does NOT recolor the card's own
 * border -- it stays the same subtle rgba(255,255,255,0.1) in both states.
 * The only purple accent is a separate 170px-wide gradient line pinned to
 * the top edge ("Blue Highlighter", 14:18533), rendered directly in
 * ProjectCard.tsx. An earlier version animated `borderColor` here too,
 * which colored the entire card outline purple on hover -- not what the
 * design does.
 */
export const cardFocus: Variants = {
  rest: { y: 0 },
  hover: {
    y: -6,
    transition: { duration: 0.3, ease: easeOut },
  },
};
