"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Boxes,
  CircleDot,
  ClipboardList,
  PackageCheck,
  ReceiptText,
  ShieldCheck,
  UsersRound
} from "lucide-react";

const routes = [
  {
    label: "Dashboard",
    detail: "Revenue, alerts, low stock",
    icon: <CircleDot className="h-4 w-4" />
  },
  {
    label: "Products",
    detail: "Catalog, thresholds, suppliers",
    icon: <Boxes className="h-4 w-4" />
  },
  {
    label: "Employees",
    detail: "Staff records and roles",
    icon: <UsersRound className="h-4 w-4" />
  },
  {
    label: "Orders",
    detail: "Pending and completed runs",
    icon: <ReceiptText className="h-4 w-4" />
  }
];

const activity = [
  { title: "Stock threshold triggered", meta: "Canvas Tote / 6 left", tone: "text-[#b45309]" },
  { title: "Purchase order received", meta: "Northline Supply / 42 units", tone: "text-[#0f766e]" },
  { title: "Order batch completed", meta: "17 customer orders reconciled", tone: "text-[#1d4ed8]" },
  { title: "Shift profile updated", meta: "2 employees edited today", tone: "text-[#7c3aed]" }
];

const stockRows = [
  { sku: "CT-204", name: "Canvas Tote", qty: 6, status: "Restock" },
  { sku: "GN-118", name: "Glass Notebooks", qty: 18, status: "Healthy" },
  { sku: "BR-072", name: "Bronze Pen Tray", qty: 11, status: "Watch" }
];

const bars = [46, 64, 58, 72, 88, 67, 94];

export function AuthShowcase() {
  return (
    <section className="relative hidden overflow-hidden bg-[#eef2f6] lg:flex lg:flex-col">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.08),transparent_24%),radial-gradient(circle_at_88%_16%,rgba(15,23,34,0.06),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.58),rgba(238,242,246,0.92))]" />
      <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(15,23,34,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,34,0.045)_1px,transparent_1px)] [background-size:112px_112px]" />

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start justify-between border-b border-[#d9e1ea] px-10 py-10 xl:px-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-[560px]"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#6b7280]">
              Benchmark workspace preview
            </p>
            <h1 className="mt-5 font-display text-[clamp(3rem,4.8vw,4.85rem)] font-medium leading-[0.9] tracking-[-0.05em] text-[#0f1722]">
              Retail software with taste, not template residue.
            </h1>
            <p className="mt-5 max-w-[500px] text-[15px] leading-8 text-[#5d6776]">
              The front door should feel like a serious operating product. Calm structure,
              useful motion, and a workspace preview that looks like the system people are
              about to enter.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
            className="hidden min-w-[210px] border-l border-[#d9e1ea] pl-8 xl:block"
          >
            <div className="space-y-5">
              <div className="border-b border-[#d9e1ea] pb-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#7a8493]">
                  Throughput
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#0f1722]">
                  $48.2k
                </p>
                <p className="mt-1 text-sm text-[#516072]">Weekly processed sales</p>
              </div>
              <div className="border-b border-[#d9e1ea] pb-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#7a8493]">
                  Alerts
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#0f1722]">
                  4 open
                </p>
                <p className="mt-1 text-sm text-[#516072]">Reorder and staffing flags</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#7a8493]">
                  Access
                </p>
                <div className="mt-3 flex items-center gap-3 text-sm text-[#425264]">
                  <ShieldCheck className="h-4 w-4 text-[#2563eb]" />
                  JWT session with authority routing
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid flex-1 grid-cols-[230px_1fr] gap-0 px-10 py-8 xl:px-12">
          <motion.aside
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
            className="border-r border-[#d9e1ea] pr-6"
          >
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#7a8493]">
                Workspace
              </p>
              <div className="mt-4 space-y-2">
                {routes.map((route, index) => (
                  <div
                    key={route.label}
                    className={`flex items-start gap-3 border-b border-[#e5eaf0] py-3 ${
                      index === 0 ? "text-[#0f1722]" : "text-[#526173]"
                    }`}
                  >
                    <div className="mt-0.5 text-[#2563eb]">{route.icon}</div>
                    <div>
                      <p className="text-sm font-medium">{route.label}</p>
                      <p className="mt-1 text-sm leading-6 text-[#7b8796]">{route.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 border-t border-[#d9e1ea] pt-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#7a8493]">
                Today
              </p>
              <div className="mt-4 space-y-4 text-sm text-[#526173]">
                <div className="flex items-center justify-between">
                  <span>Orders processed</span>
                  <span className="font-medium text-[#0f1722]">126</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Low stock count</span>
                  <span className="font-medium text-[#0f1722]">4</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Supplier arrivals</span>
                  <span className="font-medium text-[#0f1722]">2</span>
                </div>
              </div>
            </div>
          </motion.aside>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.12 }}
            className="pl-8"
          >
            <div className="overflow-hidden rounded-[28px] border border-[#d7dee7] bg-white shadow-[0_28px_70px_rgba(15,23,34,0.08)]">
              <div className="flex items-center justify-between border-b border-[#e4eaf1] px-6 py-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#7a8493]">
                    Bench Shop / Operations
                  </p>
                  <p className="mt-2 text-base font-medium text-[#0f1722]">
                    Dashboard preview
                  </p>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#526173]">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#16a34a]" />
                    Live sync
                  </div>
                  <span>Week 13</span>
                </div>
              </div>

              <div className="grid min-h-[560px] grid-rows-[1fr_210px]">
                <div className="grid grid-cols-[1.22fr_0.78fr]">
                  <div className="border-r border-[#e4eaf1] p-6">
                    <div className="flex items-end justify-between border-b border-[#edf1f5] pb-5">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#7a8493]">
                          Weekly throughput
                        </p>
                        <p className="mt-3 text-[2.5rem] font-semibold leading-none tracking-[-0.06em] text-[#0f1722]">
                          $48,200
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-[#0f1722]">+12.4%</p>
                        <p className="mt-1 text-sm text-[#7b8796]">vs previous week</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex h-[250px] items-end gap-3 border-b border-[#edf1f5] pb-5">
                        {bars.map((value, index) => (
                          <motion.div
                            key={`${value}-${index}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: `${value}%`, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.12 + index * 0.05 }}
                            className="relative flex-1 overflow-hidden rounded-t-[18px] bg-[linear-gradient(180deg,#bfd7ff_0%,#88a9ff_52%,#315efb_100%)]"
                          >
                            <div className="absolute inset-x-0 top-0 h-8 bg-white/18" />
                          </motion.div>
                        ))}
                      </div>

                      <div className="mt-5 grid grid-cols-3 gap-5 text-sm">
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#7a8493]">
                            Stock velocity
                          </p>
                          <p className="mt-2 font-medium text-[#0f1722]">71 active SKUs</p>
                          <p className="mt-1 text-[#7b8796]">Fastest movement in bags and stationery.</p>
                        </div>
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#7a8493]">
                            Order state
                          </p>
                          <p className="mt-2 font-medium text-[#0f1722]">12 pending</p>
                          <p className="mt-1 text-[#7b8796]">Most pending orders created after 3pm.</p>
                        </div>
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#7a8493]">
                            Supplier rhythm
                          </p>
                          <p className="mt-2 font-medium text-[#0f1722]">2 arrivals</p>
                          <p className="mt-1 text-[#7b8796]">Inbound window closes at 18:00.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <div className="border-b border-[#e4eaf1] px-6 py-5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#7a8493]">
                        Activity queue
                      </p>
                    </div>
                    <div className="flex-1">
                      {activity.map((item, index) => (
                        <motion.div
                          key={item.title}
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.45, delay: 0.18 + index * 0.06 }}
                          className="flex items-start gap-4 border-b border-[#edf1f5] px-6 py-5 last:border-b-0"
                        >
                          <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f6fb] text-[#315efb]">
                            {index === 0 ? (
                              <PackageCheck className="h-4 w-4" />
                            ) : index === 1 ? (
                              <ArrowUpRight className="h-4 w-4" />
                            ) : index === 2 ? (
                              <ClipboardList className="h-4 w-4" />
                            ) : (
                              <UsersRound className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#0f1722]">{item.title}</p>
                            <p className={`mt-1 text-sm ${item.tone}`}>{item.meta}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-[1.15fr_0.85fr] border-t border-[#e4eaf1]">
                  <div className="p-6">
                    <div className="flex items-center justify-between border-b border-[#edf1f5] pb-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#7a8493]">
                        Inventory watchlist
                      </p>
                      <p className="text-sm text-[#526173]">3 items in focus</p>
                    </div>
                    <div className="divide-y divide-[#edf1f5]">
                      {stockRows.map((row) => (
                        <div
                          key={row.sku}
                          className="grid grid-cols-[90px_1fr_90px_90px] items-center gap-4 py-4 text-sm"
                        >
                          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#7a8493]">
                            {row.sku}
                          </p>
                          <p className="font-medium text-[#0f1722]">{row.name}</p>
                          <p className="text-[#526173]">{row.qty} left</p>
                          <p className="text-right text-[#0f1722]">{row.status}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-l border-[#e4eaf1] p-6">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#7a8493]">
                      Why this feels better
                    </p>
                    <div className="mt-4 space-y-4 text-sm leading-7 text-[#5d6776]">
                      <p>
                        One continuous surface. Fewer decorative containers. Clearer hierarchy.
                      </p>
                      <p>
                        Motion only where it explains state: chart loading, queue reveal, live
                        system status.
                      </p>
                      <p>
                        Typography and spacing stay disciplined so the product feels authored, not
                        assembled.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
