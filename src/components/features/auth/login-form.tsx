"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Store } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { getDefaultAppRoute } from "@/lib/routes";

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required")
});

type FormValues = z.infer<typeof schema>;

const assurance = [
  "JWT-backed client session",
  "Shop-scoped access rules",
  "Authority-aware routing"
];

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { setSession } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (values: FormValues) => {
    const session = await api.login(values);
    setSession(session);
    router.replace(getDefaultAppRoute(session.authorities));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="space-y-8"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 text-[13px] font-medium tracking-[0.18em] text-[#111827]">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#d7dee7] bg-white shadow-[0_8px_20px_rgba(15,23,34,0.05)]">
              <Store className="h-4 w-4 text-[#2563eb]" />
            </span>
            <span className="font-mono uppercase text-[#6b7280]">Ledger House</span>
          </div>

          <div className="flex items-center gap-5 text-[11px] font-medium uppercase tracking-[0.18em]">
            <span className="border-b border-[#111827] pb-1 text-[#111827]">Login</span>
            <Link href="/register" className="pb-1 text-[#7b8796] transition hover:text-[#111827]">
              Register
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#6b7280]">
            Operator access
          </p>
          <div className="space-y-4">
            <h1 className="font-display text-[clamp(2.8rem,6vw,4.4rem)] font-medium leading-[0.9] tracking-[-0.06em] text-[#0f1722]">
              Sign in to run the floor.
            </h1>
            <p className="max-w-[34ch] text-[15px] leading-8 text-[#5d6776]">
              Use the credentials created during shop bootstrap. This frontend stores the
              returned access token locally and routes the workspace from your authorities.
            </p>
          </div>
        </div>

        <div className="border-y border-[#e5ebf2] py-4">
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#526173]">
            {assurance.map((item, index) => (
              <div key={item} className="flex items-center gap-3">
                <span>{item}</span>
                {index < assurance.length - 1 ? <span className="text-[#c1c9d4]">/</span> : null}
              </div>
            ))}
          </div>
        </div>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        {params.get("registered") === "1" ? (
          <div className="flex items-start gap-3 rounded-2xl border border-[#cfe3da] bg-[#f3fbf7] px-4 py-3 text-sm text-[#255c49]">
            <ShieldCheck className="mt-0.5 h-4 w-4 flex-none" />
            <span>Shop registration completed. Sign in with the admin credentials you just created.</span>
          </div>
        ) : null}

        <div className="space-y-2">
          <label className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[#6b7280]">
            Username
          </label>
          <Input
            placeholder="merchant_admin"
            className="h-14 rounded-2xl border-[#d8e0e9] bg-[#fbfcfd] px-4 text-[15px] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
            {...register("username")}
          />
          {errors.username ? (
            <p className="text-sm text-[#b45309]">{errors.username.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[#6b7280]">
            Password
          </label>
          <Input
            type="password"
            placeholder="Enter your password"
            className="h-14 rounded-2xl border-[#d8e0e9] bg-[#fbfcfd] px-4 text-[15px] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
            {...register("password")}
          />
          {errors.password ? (
            <p className="text-sm text-[#b45309]">{errors.password.message}</p>
          ) : null}
        </div>

        <Button
          type="submit"
          className="h-14 w-full rounded-2xl bg-[#111827] text-white shadow-[0_18px_35px_rgba(15,23,34,0.18)] hover:bg-[#0b1320]"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Enter workspace"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        <div className="flex items-start justify-between gap-4 border-t border-[#e5ebf2] pt-5">
          <p className="max-w-[19rem] text-sm leading-7 text-[#6b7280]">
            Need a new shop environment? Bootstrap the store and create the first admin.
          </p>
          <Link
            href="/register"
            className="pt-1 text-sm font-medium text-[#111827] underline decoration-[#c6cfda] underline-offset-4 transition hover:decoration-[#111827]"
          >
            Register the shop
          </Link>
        </div>
      </form>
    </motion.div>
  );
}
