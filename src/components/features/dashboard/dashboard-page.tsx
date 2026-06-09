"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Boxes, CircleDollarSign, ReceiptText } from "lucide-react";

import { PageIntro } from "@/components/ui/page-intro";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";

const STAT_ITEMS = [
  {
    label: "Revenue",
    key: "revenue",
    icon: <CircleDollarSign className="h-4 w-4" />
  },
  {
    label: "Orders",
    key: "orders",
    icon: <ReceiptText className="h-4 w-4" />
  },
  {
    label: "Catalog",
    key: "catalog",
    icon: <Boxes className="h-4 w-4" />
  },
  {
    label: "Low stock",
    key: "alerts",
    icon: <AlertTriangle className="h-4 w-4" />
  }
] as const;

export function DashboardPage() {
  const { session, hasAuthority } = useAuth();
  const token = session?.accessToken || "";

  const statsQuery = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => api.getDashboardStats(token),
    enabled: Boolean(token) && hasAuthority("dashboard:read")
  });

  const lowStockQuery = useQuery({
    queryKey: ["low-stock"],
    queryFn: () => api.getLowStockProducts(token),
    enabled: Boolean(token) && hasAuthority("dashboard:read")
  });

  const productsQuery = useQuery({
    queryKey: ["products-preview"],
    queryFn: () => api.getProducts(token),
    enabled: Boolean(token) && hasAuthority("inventory:read")
  });

  const stats = statsQuery.data || { totalRevenue: 0, totalOrders: 0 };
  const productCount = productsQuery.data?.length || 0;
  const lowStockCount = lowStockQuery.data?.length || 0;

  const statValues = {
    revenue: formatCurrency(stats.totalRevenue),
    orders: String(stats.totalOrders),
    catalog: String(productCount),
    alerts: String(lowStockCount)
  };

  return (
    <div className="space-y-10">
      <PageIntro
        eyebrow="Dashboard"
        title="A sharper command view of stock, money, and movement."
        description="The backend already exposes the operational signals that matter. This redesign treats them like a living briefing sheet: fewer panels, stronger hierarchy, and more deliberate whitespace."
      />

      <section className="section-frame grid overflow-hidden lg:grid-cols-[1.2fr_0.8fr]">
        <div className="border-b border-line px-6 py-8 sm:px-8 lg:border-b-0 lg:border-r lg:px-10">
          <div className="max-w-2xl space-y-5">
            <p className="text-[11px] uppercase tracking-[0.38em] text-muted">Shop pulse</p>
            <h2 className="font-display text-[clamp(2.3rem,5vw,4.6rem)] leading-[0.94] text-ink">
              Live numbers arranged as one continuous briefing rail.
            </h2>
            <p className="max-w-xl text-sm leading-7 text-muted">
              Replace the familiar four-card SaaS trope with one long statistic ribbon that reads like a market terminal and a merchandiser’s morning note.
            </p>
          </div>
          <div className="mt-8 grid border-t border-line sm:grid-cols-2 xl:grid-cols-4">
            {STAT_ITEMS.map((item) => (
              <div key={item.key} className="border-b border-line px-0 py-5 sm:border-r sm:px-5 xl:border-b-0">
                <div className="flex items-center gap-3 text-muted">
                  {item.icon}
                  <span className="text-[11px] font-semibold uppercase tracking-[0.3em]">
                    {item.label}
                  </span>
                </div>
                <p className="mt-5 font-display text-4xl leading-none text-ink">
                  {statValues[item.key]}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#14181d] px-6 py-8 text-white sm:px-8 lg:px-10">
          <p className="text-[11px] uppercase tracking-[0.38em] text-white/40">Briefing note</p>
          <div className="mt-6 space-y-6">
            <div>
              <p className="text-white/55">Threshold logic</p>
              <p className="mt-2 text-sm leading-7 text-white/72">
                Low stock still follows the backend’s global rule of quantity below `10`, not each product’s threshold.
              </p>
            </div>
            <div>
              <p className="text-white/55">Inventory breadth</p>
              <p className="mt-2 text-sm leading-7 text-white/72">
                Product volume, supplier links, and category mapping are all visible from the inventory workspace once data is seeded.
              </p>
            </div>
            <div className="border-t border-white/10 pt-6">
              <p className="text-[10px] uppercase tracking-[0.36em] text-white/38">
                Session
              </p>
              <p className="mt-3 text-2xl font-semibold">{session?.username}</p>
              <p className="text-sm text-white/60">{session?.email}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-frame grid overflow-hidden xl:grid-cols-[1.35fr_0.65fr]">
        <div className="border-b border-line xl:border-b-0 xl:border-r">
          <div className="grid grid-cols-[1.2fr_0.7fr_0.6fr] border-b border-line px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.32em] text-muted sm:px-8">
            <span>Product</span>
            <span>Category</span>
            <span className="text-right">Stock</span>
          </div>
          <div>
            {(productsQuery.data || []).slice(0, 8).map((product) => (
              <div
                key={product.id}
                className="ledger-row grid grid-cols-[1.2fr_0.7fr_0.6fr] gap-4 border-b border-line px-6 py-5 transition hover:bg-white/40 sm:px-8"
              >
                <div>
                  <p className="font-semibold text-ink">{product.name}</p>
                  <p className="mt-1 text-sm text-muted">{product.sku}</p>
                </div>
                <div className="text-sm text-muted">{product.categoryName || "Uncategorized"}</div>
                <div className="text-right">
                  <p className="font-semibold text-ink">{product.stockQuantity}</p>
                  <p className="text-sm text-muted">{formatCurrency(product.price)}</p>
                </div>
              </div>
            ))}
            {!productsQuery.data?.length ? (
              <div className="px-6 py-12 text-sm text-muted sm:px-8">
                No products yet. Seed the backend or populate the inventory workspace.
              </div>
            ) : null}
          </div>
        </div>

        <div className="px-6 py-6 sm:px-8">
          <p className="text-[11px] uppercase tracking-[0.38em] text-muted">Alert rail</p>
          <div className="mt-6 space-y-0 border-t border-line">
            {(lowStockQuery.data || []).map((product) => (
              <div key={product.id} className="ledger-row border-b border-line py-4 pl-4 pr-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-ink">{product.name}</p>
                    <p className="mt-1 text-sm text-muted">{product.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-ember">
                      {product.stockQuantity} left
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {!lowStockQuery.data?.length ? (
              <div className="py-10 text-sm text-muted">No low-stock alerts are active right now.</div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
