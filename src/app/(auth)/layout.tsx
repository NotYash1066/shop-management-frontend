import { AuthShowcase } from "@/components/features/auth/auth-showcase";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#edf1f5]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.9),transparent_18%),radial-gradient(circle_at_85%_18%,rgba(37,99,235,0.1),transparent_16%),linear-gradient(180deg,#f7f9fb_0%,#eef2f6_48%,#e9eef3_100%)]" />
      <div className="absolute inset-0 opacity-55 [background-image:linear-gradient(rgba(15,23,34,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,34,0.04)_1px,transparent_1px)] [background-size:120px_120px]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1560px] items-stretch px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-[#d7dee7] bg-white/72 shadow-[0_30px_90px_rgba(15,23,34,0.08)] backdrop-blur-xl lg:grid-cols-[minmax(420px,520px)_1fr]">
          <section className="relative flex items-center justify-center border-b border-[#e2e8f0] px-5 py-8 sm:px-8 lg:border-b-0 lg:border-r lg:border-r-[#e2e8f0] lg:px-10 xl:px-12">
            <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0.7),transparent)]" />
            <div className="relative w-full max-w-[380px]">{children}</div>
          </section>
          <AuthShowcase />
        </div>
      </div>
    </div>
  );
}
