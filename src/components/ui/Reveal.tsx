"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { fadeInUp, staggerContainer } from "@/lib/motion";

/**
 * Scroll-triggered reveal wrapper, used for Figma's "Reveal Text" / heading
 * blocks. Animates once when the element enters the viewport. Falls back to
 * a static render when the user has requested reduced motion.
 */
export function Reveal({
  children,
  className = "",
  style,
  as: Component = motion.div,
  delay = 0,
  stagger = false,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: typeof motion.div;
  delay?: number;
  stagger?: boolean;
}) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <Component
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={stagger ? staggerContainer(0.08, delay) : fadeInUp}
      transition={stagger ? undefined : { delay }}
    >
      {children}
    </Component>
  );
}

export function RevealItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={fadeInUp}>
      {children}
    </motion.div>
  );
}
