"use client";

import { motion } from "framer-motion";
import {
  ChartColumnBig,
  LogOut,
  Menu,
  Package2,
  ReceiptText,
  Shapes,
  Truck,
  UsersRound,
  X
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { getDefaultAppRoute } from "@/lib/routes";
import type { Authority } from "@/lib/types";

type NavItem = {
  href: string;
  label: string;
  authority: Authority;
  icon: ReactNode;
};

const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    authority: "dashboard:read",
    icon: <ChartColumnBig className="h-4 w-4" />
  },
  {
    href: "/products",
    label: "Products",
    authority: "inventory:read",
    icon: <Package2 className="h-4 w-4" />
  },
  {
    href: "/categories",
    label: "Categories",
    authority: "category:read",
    icon: <Shapes className="h-4 w-4" />
  },
  {
    href: "/suppliers",
    label: "Suppliers",
    authority: "supplier:read",
    icon: <Truck className="h-4 w-4" />
  },
  {
    href: "/employees",
    label: "Employees",
    authority: "employee:read",
    icon: <UsersRound className="h-4 w-4" />
  },
  {
    href: "/orders",
    label: "Orders",
    authority: "order:read",
    icon: <ReceiptText className="h-4 w-4" />
  }
];

function AppNav({
  pathname,
  onNavigate
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  const { hasAuthority } = useAuth();

  return (
    <nav className="space-y-1">
      {NAV_ITEMS.filter((item) => hasAuthority(item.authority)).map((item) => {
        const active = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-xl border px-3 py-2.5 transition",
              active
                ? "border-white/12 bg-white/8 text-white"
                : "border-transparent text-white/62 hover:border-white/8 hover:bg-white/4 hover:text-white"
            )}
          >
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg border transition",
                active
                  ? "border-[#4f7cff]/40 bg-[#4f7cff]/15 text-[#8aa6ff]"
                  : "border-white/8 bg-white/5 text-white/72"
              )}
            >
              {item.icon}
            </span>
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { hydrated, session, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (hydrated && !session) {
      router.replace("/login");
    }
  }, [hydrated, router, session]);

  useEffect(() => {
    if (!session) {
      return;
    }

    const currentItem = NAV_ITEMS.find((item) => item.href === pathname);
    if (currentItem && !session.authorities.includes(currentItem.authority)) {
      router.replace(getDefaultAppRoute(session.authorities));
    }
  }, [pathname, router, session]);

  if (!hydrated || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="border border-line bg-white/50 px-6 py-3 text-sm text-muted">
          Loading the floor ledger...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[276px_1fr]">
      <aside className="hidden min-h-screen border-r border-[#101828]/6 bg-[#0f1722] text-white lg:flex lg:flex-col">
        <div className="border-b border-white/10 px-6 py-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/42">
            Ledger House
          </p>
          <div className="mt-5 space-y-3">
            <h1 className="font-display text-[1.65rem] font-medium leading-[1.02] text-white">
              Retail operations
            </h1>
            <p className="max-w-[200px] text-sm leading-6 text-white/58">
              A compact operating system for stock, supply, staff, and orders.
            </p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/38">Mode</p>
              <p className="mt-1 text-sm font-medium text-white/88">Admin</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/38">Scope</p>
              <p className="mt-1 text-sm font-medium text-white/88">Shop</p>
            </div>
          </div>
        </div>
        <div className="px-4 py-4">
          <p className="px-2 pb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/34">
            Workspace
          </p>
          <AppNav pathname={pathname} />
        </div>
        <div className="mt-auto border-t border-white/10 px-6 py-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/34">Signed in</p>
          <p className="mt-3 text-sm font-medium text-white">{session.username}</p>
          <p className="text-sm text-white/52">{session.email}</p>
          <Button
            type="button"
            variant="secondary"
            className="mt-5 w-full border-white/12 bg-white/6 text-white hover:bg-white/10"
            onClick={() => {
              logout();
              router.replace("/login");
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      <section className="min-h-screen">
        <header className="sticky top-0 z-20 border-b border-line bg-paper/86 backdrop-blur-xl">
          <div className="flex items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
            <div>
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
                Shop Management System
              </p>
              <p className="mt-2 text-sm text-muted">
                {session.authorities.length} active authorities
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden rounded-xl border border-line bg-white/70 px-4 py-2 text-sm text-muted sm:block">
                {session.username}
              </div>
              <button
                type="button"
                className="inline-flex rounded-xl border border-line bg-white/70 p-3 text-ink lg:hidden"
                onClick={() => setMobileOpen((current) => !current)}
              >
                {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {mobileOpen ? (
            <motion.div
              initial={{ opacity: 0, y: -18 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-t border-line bg-[#14181d] px-5 py-5 text-white lg:hidden"
            >
              <AppNav pathname={pathname} onNavigate={() => setMobileOpen(false)} />
              <Button
                type="button"
                variant="secondary"
                className="mt-4 w-full border-white/14 bg-white/6 text-white hover:bg-white/10"
                onClick={() => {
                  logout();
                  router.replace("/login");
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </motion.div>
          ) : null}
        </header>

        <main className="min-h-[calc(100vh-81px)] px-5 py-8 sm:px-8 lg:px-10">{children}</main>
      </section>
    </div>
  );
}
