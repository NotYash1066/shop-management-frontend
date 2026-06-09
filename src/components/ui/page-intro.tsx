"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function PageIntro({
  eyebrow,
  title,
  description,
  action
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="grid gap-6 border-b border-line pb-6 lg:grid-cols-[minmax(0,1.25fr)_320px]"
    >
      <div className="max-w-4xl space-y-3">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.24em] text-ember">
          {eyebrow}
        </p>
        <h1 className="max-w-4xl font-display text-[clamp(2rem,4vw,3.5rem)] font-medium leading-[0.95] text-ink">
          {title}
        </h1>
      </div>
      <div className="flex flex-col gap-6 lg:items-start">
        <p className="max-w-sm text-sm leading-7 text-muted">
          {description}
        </p>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </motion.div>
  );
}
