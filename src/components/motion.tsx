"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

const SPRING = { type: "spring", stiffness: 300, damping: 30 } as const;

/**
 * Decides whether a block should animate in.
 *
 * The server must never ship `opacity: 0` - if JavaScript fails, that content
 * would be invisible for good. So we render plain markup first, then on mount
 * opt in to the animation only for blocks that are still below the fold.
 * Anything already on screen stays as rendered, which also avoids a flash.
 */
function useRevealPhase() {
  const ref = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top > window.innerHeight) setAnimate(true);
  }, []);

  return { ref, animate };
}

/**
 * Enters once, on scroll. Animates opacity and transform only, and stays put
 * when the viewer has asked for reduced motion.
 */
export function Reveal({
  children,
  delay = 0,
  y = 16,
  className = "",
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "header";
}) {
  const reduced = useReducedMotion();
  const { ref, animate } = useRevealPhase();
  const Static = as;

  if (reduced || !animate) {
    return (
      <Static ref={ref as never} className={className}>
        {children}
      </Static>
    );
  }

  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ ...SPRING, delay }}
    >
      {children}
    </Tag>
  );
}

const listVariants: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  shown: { opacity: 1, y: 0, transition: SPRING },
};

/**
 * Staggers its children in. Cap the list at ~6 items. Children opt in via
 * StaggerItem; when the list is not animating they render as plain elements.
 */
export function Stagger({
  children,
  className = "",
  as = "ul",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "ul" | "div";
}) {
  const reduced = useReducedMotion();
  const { ref, animate } = useRevealPhase();
  const Static = as;

  if (reduced || !animate) {
    return (
      <Static ref={ref as never} className={className}>
        {children}
      </Static>
    );
  }

  const Tag = motion[as];
  return (
    <Tag
      className={className}
      variants={listVariants}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-60px" }}
    >
      {children}
    </Tag>
  );
}

/**
 * A stagger child. Motion drives it through the parent's variants; with no
 * animating parent the variant names resolve to nothing and it renders as-is.
 */
export function StaggerItem({
  children,
  className = "",
  as = "li",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "li" | "div";
}) {
  const reduced = useReducedMotion();
  if (reduced) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  const Tag = motion[as];
  return (
    <Tag className={className} variants={itemVariants}>
      {children}
    </Tag>
  );
}

/** Gesture feedback for cards and links. */
export function Press({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={SPRING}
    >
      {children}
    </motion.div>
  );
}
