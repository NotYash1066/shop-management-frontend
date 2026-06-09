import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: "border-gold/40 bg-gold/10 text-[#7a5a1f]",
  COMPLETED: "border-moss/30 bg-moss/10 text-[#146c5a]",
  FAILED: "border-ember/30 bg-ember/10 text-ember"
};

export function StatusPill({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold tracking-[0.2em]",
        STATUS_STYLES[status]
      )}
    >
      {status}
    </span>
  );
}
