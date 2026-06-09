import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-xl border border-line bg-white px-3.5 text-sm text-ink outline-none transition placeholder:text-muted/80 focus:border-[#6b7a90] focus:ring-4 focus:ring-[#2563eb]/8",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
