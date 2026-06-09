"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageIntro } from "@/components/ui/page-intro";
import { Select } from "@/components/ui/select";
import { StatusPill } from "@/components/ui/status-pill";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { OrderItemInput } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

const EMPTY_ITEM: OrderItemInput = {
  productId: 0,
  quantity: 1
};

export function OrdersPage() {
  const queryClient = useQueryClient();
  const { session, hasAuthority } = useAuth();
  const token = session?.accessToken || "";
  const [items, setItems] = useState<OrderItemInput[]>([{ ...EMPTY_ITEM }]);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: () => api.getProducts(token),
    enabled: Boolean(token)
  });

  const myOrdersQuery = useQuery({
    queryKey: ["my-orders", session?.id],
    queryFn: () => api.getUserOrders(token, Number(session?.id)),
    enabled: Boolean(token && session?.id)
  });

  const adminOrdersQuery = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => api.getAdminOrders(token),
    enabled: Boolean(token) && hasAuthority("dashboard:read")
  });

  const orderDetailQuery = useQuery({
    queryKey: ["order-detail", selectedOrderId],
    queryFn: () => api.getOrderDetail(token, Number(selectedOrderId)),
    enabled: Boolean(token && selectedOrderId)
  });

  const createMutation = useMutation({
    mutationFn: () =>
      api.createOrder(
        token,
        Number(session?.id),
        items.filter((item) => item.productId && item.quantity > 0)
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      setItems([{ ...EMPTY_ITEM }]);
    }
  });

  const previewTotal = useMemo(() => {
    const productMap = new Map((productsQuery.data || []).map((product) => [product.id, product]));

    return items.reduce((sum, item) => {
      const product = productMap.get(item.productId);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);
  }, [items, productsQuery.data]);

  return (
    <div className="space-y-10">
      <PageIntro
        eyebrow="Orders"
        title="Compose orders, then watch reconciliation catch up."
        description="The backend keeps orders honest: they begin as `PENDING`, reconcile stock asynchronously, and then settle. The UI should expose that motion instead of flattening it."
      />

      <section className="section-frame grid overflow-hidden xl:grid-cols-[1fr_0.9fr]">
        <div>
          <div className="border-b border-line px-6 py-5 sm:px-8">
            <p className="text-[11px] uppercase tracking-[0.36em] text-muted">Composer</p>
            <h2 className="mt-3 font-display text-4xl leading-[0.95]">
              Create order for the signed-in account.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
              Current backend order creation requires `userId` and there is no user directory endpoint yet, so the composer stays deliberately scoped to the current session.
            </p>
          </div>
          <div className="px-6 py-6 sm:px-8">
            <div className="grid grid-cols-[1fr_120px_auto] gap-4 border-b border-line pb-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-muted">
              <span>Product</span>
              <span>Quantity</span>
              <span className="text-right">Action</span>
            </div>
            <div>
              {items.map((item, index) => (
                <div
                  key={`${index}-${item.productId}`}
                  className="ledger-row grid grid-cols-[1fr_120px_auto] gap-4 border-b border-line py-4"
                >
                  <Select
                    value={item.productId || ""}
                    onChange={(event) =>
                      setItems((current) =>
                        current.map((entry, entryIndex) =>
                          entryIndex === index
                            ? { ...entry, productId: Number(event.target.value) }
                            : entry
                        )
                      )
                    }
                  >
                    <option value="">Select a product</option>
                    {(productsQuery.data || []).map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} ({product.stockQuantity} in stock)
                      </option>
                    ))}
                  </Select>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(event) =>
                      setItems((current) =>
                        current.map((entry, entryIndex) =>
                          entryIndex === index
                            ? { ...entry, quantity: Number(event.target.value) }
                            : entry
                        )
                      )
                    }
                  />
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-ember"
                      onClick={() =>
                        setItems((current) =>
                          current.length === 1
                            ? [{ ...EMPTY_ITEM }]
                            : current.filter((_, entryIndex) => entryIndex !== index)
                        )
                      }
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-end justify-between gap-6 border-t-2 border-ink pt-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-muted">
                  Preview total
                </p>
                <p className="mt-3 font-display text-5xl leading-none text-ink">
                  {formatCurrency(previewTotal)}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setItems((current) => [...current, { ...EMPTY_ITEM }])}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add line
                </Button>
                <Button
                  type="button"
                  onClick={() => createMutation.mutate()}
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Submitting..." : "Create order"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <aside className="border-t border-line bg-[#14181d] text-white xl:border-l xl:border-t-0">
          <div className="px-6 py-6 sm:px-8">
            <p className="text-[11px] uppercase tracking-[0.38em] text-white/40">My history</p>
            <h2 className="mt-4 font-display text-4xl leading-[0.95]">
              Orders tied to this account.
            </h2>
          </div>
          <div className="border-t border-white/10">
            {(myOrdersQuery.data || []).map((order) => (
              <div
                key={order.id}
                className="ledger-row border-b border-white/10 px-6 py-5 transition hover:bg-white/5 sm:px-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">Order #{order.id}</p>
                    <p className="mt-1 text-sm text-white/55">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">{formatCurrency(order.totalAmount)}</p>
                    <div className="mt-3">
                      <StatusPill status={order.status} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {!myOrdersQuery.data?.length ? (
              <div className="px-6 py-10 text-sm text-white/60 sm:px-8">
                No orders yet. Use the composer to create the first one.
              </div>
            ) : null}
          </div>
        </aside>
      </section>

      <section className="section-frame grid overflow-hidden xl:grid-cols-[1.05fr_0.95fr]">
        <div className="border-b border-line xl:border-b-0 xl:border-r">
          <div className="px-6 py-5 sm:px-8">
            <p className="text-[11px] uppercase tracking-[0.36em] text-muted">Admin queue</p>
            <h2 className="mt-3 font-display text-4xl leading-[0.95]">Shop-wide order visibility.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
              This section lights up fully when the planned backend `GET /orders` and `GET /orders/[id]` endpoints are available.
            </p>
          </div>
          {adminOrdersQuery.data === null ? (
            <div className="px-6 py-10 text-sm leading-7 text-muted sm:px-8">
              The current backend does not yet expose a shop-wide orders feed. The current-user order history is active now, and this queue is ready to connect when those endpoints land.
            </div>
          ) : (
            <div>
              {(adminOrdersQuery.data || []).map((order) => (
                <div
                  key={order.id}
                  className="ledger-row grid grid-cols-[1fr_auto_auto] items-center gap-4 border-t border-line px-6 py-5 transition hover:bg-white/35 sm:px-8"
                >
                  <div>
                    <p className="font-semibold text-ink">Order #{order.id}</p>
                    <p className="mt-1 text-sm text-muted">
                      {order.username || "Unknown user"} • {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <StatusPill status={order.status} />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setSelectedOrderId(order.id)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-6 sm:px-8">
          <p className="text-[11px] uppercase tracking-[0.38em] text-muted">Detail pane</p>
          <div className="mt-6 border-t border-line">
            {orderDetailQuery.data ? (
              <>
                <div className="border-b border-line py-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-ink">Order #{orderDetailQuery.data.id}</p>
                      <p className="mt-1 text-sm text-muted">
                        {formatDate(orderDetailQuery.data.createdAt)}
                      </p>
                    </div>
                    <StatusPill status={orderDetailQuery.data.status} />
                  </div>
                </div>
                {(orderDetailQuery.data.items || []).map((item) => (
                  <div
                    key={`${item.productId}-${item.id}`}
                    className="ledger-row border-b border-line py-4 pl-4"
                  >
                    <p className="font-semibold text-ink">
                      {item.productName || `Product ${item.productId}`}
                    </p>
                    <p className="mt-2 text-sm text-muted">
                      Qty {item.quantity} • {formatCurrency(item.priceAtTimeOfSale)}
                    </p>
                  </div>
                ))}
              </>
            ) : (
              <div className="py-10 text-sm leading-7 text-muted">
                Select an admin order when the supporting backend endpoints are available. Until then, this side stays intentionally quiet.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
