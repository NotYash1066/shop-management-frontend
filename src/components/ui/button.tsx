import { forwardRef, type ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex min-h-10 items-center justify-center rounded-xl border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/25 disabled:cursor-not-allowed disabled:opacity-50",
          variant === "primary" &&
            "border-[#0f1722] bg-[#0f1722] text-white hover:bg-[#0b1018]",
          variant === "secondary" &&
            "border-line bg-white text-ink hover:border-[#9aa5b3] hover:bg-[#f8fafc]",
          variant === "ghost" &&
            "border-transparent bg-transparent text-ink hover:border-line hover:bg-white/70",
          variant === "danger" &&
            "border-[#8b2b1f] bg-[#8b2b1f] text-white hover:bg-[#712318]",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
