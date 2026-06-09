"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRight, Check, ShieldCheck, Store } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

const schema = z.object({
  shopName: z.string().min(2, "Shop name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

type FormValues = z.infer<typeof schema>;

const bootstrapNotes = [
  "Creates the shop record",
  "Creates the first ADMIN user",
  "Routes that user into the app"
];

export function RegisterForm() {
  const router = useRouter();
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (values: FormValues) => {
    const message = await api.register(values);
    setServerMessage(message);
    router.push("/login?registered=1");
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
            <Link href="/login" className="pb-1 text-[#7b8796] transition hover:text-[#111827]">
              Login
            </Link>
            <span className="border-b border-[#111827] pb-1 text-[#111827]">Register</span>
          </div>
        </div>

        <div className="space-y-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#6b7280]">
            Shop bootstrap
          </p>
          <div className="space-y-4">
            <h1 className="font-display text-[clamp(2.8rem,6vw,4.4rem)] font-medium leading-[0.9] tracking-[-0.06em] text-[#0f1722]">
              Create the first admin.
            </h1>
            <p className="max-w-[34ch] text-[15px] leading-8 text-[#5d6776]">
              Backend registration creates the shop and its first admin account in one request.
              Keep it direct, then move straight into operations.
            </p>
          </div>
        </div>

        <div className="border-y border-[#e5ebf2] py-4">
          <div className="grid gap-2">
            {bootstrapNotes.map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-[#526173]">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#eef4ff] text-[#2563eb]">
                  <Check className="h-3 w-3" />
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-5">
          <div className="space-y-2">
            <label className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[#6b7280]">
              Shop name
            </label>
            <Input
              placeholder="Mercantile House"
              className="h-14 rounded-2xl border-[#d8e0e9] bg-[#fbfcfd] px-4 text-[15px] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
              {...register("shopName")}
            />
            {errors.shopName ? (
              <p className="text-sm text-[#b45309]">{errors.shopName.message}</p>
            ) : null}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
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
                Email
              </label>
              <Input
                placeholder="admin@shop.com"
                className="h-14 rounded-2xl border-[#d8e0e9] bg-[#fbfcfd] px-4 text-[15px] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
                {...register("email")}
              />
              {errors.email ? (
                <p className="text-sm text-[#b45309]">{errors.email.message}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[#6b7280]">
              Password
            </label>
            <Input
              type="password"
              placeholder="At least 6 characters"
              className="h-14 rounded-2xl border-[#d8e0e9] bg-[#fbfcfd] px-4 text-[15px] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
              {...register("password")}
            />
            {errors.password ? (
              <p className="text-sm text-[#b45309]">{errors.password.message}</p>
            ) : null}
          </div>
        </div>

        {serverMessage ? (
          <div className="flex items-start gap-3 rounded-2xl border border-[#cfe3da] bg-[#f3fbf7] px-4 py-3 text-sm text-[#255c49]">
            <ShieldCheck className="mt-0.5 h-4 w-4 flex-none" />
            <span>{serverMessage}</span>
          </div>
        ) : null}

        <Button
          type="submit"
          className="h-14 w-full rounded-2xl bg-[#111827] text-white shadow-[0_18px_35px_rgba(15,23,34,0.18)] hover:bg-[#0b1320]"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating shop..." : "Create shop"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        <div className="flex items-start justify-between gap-4 border-t border-[#e5ebf2] pt-5">
          <p className="max-w-[19rem] text-sm leading-7 text-[#6b7280]">
            Already registered? Use the existing admin account and continue into the workspace.
          </p>
          <Link
            href="/login"
            className="pt-1 text-sm font-medium text-[#111827] underline decoration-[#c6cfda] underline-offset-4 transition hover:decoration-[#111827]"
          >
            Sign in
          </Link>
        </div>
      </form>
    </motion.div>
  );
}
