"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PencilLine, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageIntro } from "@/components/ui/page-intro";
import { Select } from "@/components/ui/select";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { ProductInput } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";

const EMPTY_PRODUCT: ProductInput = {
  name: "",
  price: 0,
  stockQuantity: 0,
  sku: "",
  lowStockThreshold: 10,
  categoryId: null,
  supplierId: null
};

export function ProductsPage() {
  const queryClient = useQueryClient();
  const { session, hasAuthority } = useAuth();
  const token = session?.accessToken || "";
  const canWrite = hasAuthority("inventory:write");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<ProductInput>(EMPTY_PRODUCT);

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: () => api.getProducts(token),
    enabled: Boolean(token)
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.getCategories(token),
    enabled: Boolean(token)
  });

  const suppliersQuery = useQuery({
    queryKey: ["suppliers"],
    queryFn: () => api.getSuppliers(token),
    enabled: Boolean(token)
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingId) {
        return api.updateProduct(token, editingId, draft);
      }
      return api.createProduct(token, draft);
    },
    onSuccess: () => {
      setDraft(EMPTY_PRODUCT);
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["low-stock"] });
      queryClient.invalidateQueries({ queryKey: ["products-preview"] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.deleteProduct(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["low-stock"] });
      queryClient.invalidateQueries({ queryKey: ["products-preview"] });
    }
  });

  const filteredProducts = useMemo(() => {
    const list = productsQuery.data || [];
    if (!search.trim()) {
      return list;
    }

    const term = search.toLowerCase();
    return list.filter((product) =>
      [product.name, product.sku, product.categoryName, product.supplierName]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(term))
    );
  }, [productsQuery.data, search]);

  return (
    <div className="space-y-10">
      <PageIntro
        eyebrow="Inventory"
        title="Inventory staged as one long operational ledger."
        description="Inventory is the most tactile part of the backend: SKU uniqueness, stock counts, low-stock thresholds, and category/supplier relationships. This workspace keeps those signals on one long editorial surface."
        action={
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input
              placeholder="Search inventory"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pr-8"
            />
          </div>
        }
      />

      <section className="section-frame grid overflow-hidden xl:grid-cols-[1.35fr_0.65fr]">
        <div>
          <div className="grid grid-cols-[1.3fr_0.7fr_0.55fr_auto] gap-4 border-b border-line px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.32em] text-muted sm:px-8">
            <span>Product</span>
            <span>Category / supplier</span>
            <span>Stock</span>
            <span className="text-right">Actions</span>
          </div>
          <div>
            {filteredProducts.map((product) => {
              const lowStock = product.stockQuantity <= product.lowStockThreshold;
              return (
                <div
                  key={product.id}
                  className="ledger-row grid gap-4 border-b border-line px-6 py-5 transition hover:bg-white/35 sm:px-8 lg:grid-cols-[1.3fr_0.7fr_0.55fr_auto]"
                >
                  <div>
                    <p className="font-semibold text-ink">{product.name}</p>
                    <p className="mt-1 text-sm text-muted">
                      {product.sku} • {formatCurrency(product.price)}
                    </p>
                  </div>
                  <div className="text-sm text-muted">
                    <p>{product.categoryName || "Uncategorized"}</p>
                    <p className="mt-1">{product.supplierName || "No supplier"}</p>
                  </div>
                  <div>
                    <p className={cn("font-semibold", lowStock ? "text-ember" : "text-ink")}>
                      {product.stockQuantity} units
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      Threshold {product.lowStockThreshold}
                    </p>
                  </div>
                  {canWrite ? (
                    <div className="flex items-start justify-end gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setEditingId(product.id);
                          setDraft({
                            name: product.name,
                            price: product.price,
                            stockQuantity: product.stockQuantity,
                            sku: product.sku,
                            lowStockThreshold: product.lowStockThreshold,
                            categoryId: product.categoryId,
                            supplierId: product.supplierId
                          });
                        }}
                      >
                        <PencilLine className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-ember"
                        onClick={() => deleteMutation.mutate(product.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  ) : null}
                </div>
              );
            })}
            {!filteredProducts.length ? (
              <div className="px-6 py-12 text-sm text-muted sm:px-8">
                No products matched the current search.
              </div>
            ) : null}
          </div>
        </div>

        <aside className="border-t border-line bg-[#14181d] text-white xl:border-l xl:border-t-0">
          <div className="px-6 py-6 sm:px-8">
            <p className="text-[11px] uppercase tracking-[0.38em] text-white/40">Workbench</p>
            <h2 className="mt-4 font-display text-4xl leading-[0.95]">
              {editingId ? "Refine product details" : "Add a new product"}
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-7 text-white/62">
              Edit directly against the backend product shape: SKU, price, stock, threshold, category, and supplier.
            </p>
          </div>
          <div className="space-y-5 border-t border-white/10 px-6 py-6 sm:px-8">
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/42">
                Product name
              </label>
              <Input
                className="border-white/18 text-white placeholder:text-white/35 focus:border-white"
                value={draft.name}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, name: event.target.value }))
                }
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/42">
                  SKU
                </label>
                <Input
                  className="border-white/18 text-white placeholder:text-white/35 focus:border-white"
                  value={draft.sku}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, sku: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/42">
                  Price
                </label>
                <Input
                  className="border-white/18 text-white focus:border-white"
                  type="number"
                  min="0"
                  step="0.01"
                  value={draft.price}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      price: Number(event.target.value)
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/42">
                  Stock quantity
                </label>
                <Input
                  className="border-white/18 text-white focus:border-white"
                  type="number"
                  min="0"
                  value={draft.stockQuantity}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      stockQuantity: Number(event.target.value)
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/42">
                  Low-stock threshold
                </label>
                <Input
                  className="border-white/18 text-white focus:border-white"
                  type="number"
                  min="0"
                  value={draft.lowStockThreshold}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      lowStockThreshold: Number(event.target.value)
                    }))
                  }
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/42">
                  Category
                </label>
                <Select
                  className="border-white/18 text-white focus:border-white"
                  value={draft.categoryId ?? ""}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      categoryId: event.target.value ? Number(event.target.value) : null
                    }))
                  }
                >
                  <option value="">No category</option>
                  {(categoriesQuery.data || []).map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/42">
                  Supplier
                </label>
                <Select
                  className="border-white/18 text-white focus:border-white"
                  value={draft.supplierId ?? ""}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      supplierId: event.target.value ? Number(event.target.value) : null
                    }))
                  }
                >
                  <option value="">No supplier</option>
                  {(suppliersQuery.data || []).map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            {canWrite ? (
              <div className="flex flex-wrap gap-3 border-t border-white/10 pt-5">
                <Button
                  type="button"
                  onClick={() => saveMutation.mutate()}
                  disabled={saveMutation.isPending}
                  className="border-white bg-white text-ink hover:bg-white/85"
                >
                  {editingId ? <PencilLine className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                  {saveMutation.isPending
                    ? "Saving..."
                    : editingId
                      ? "Update product"
                      : "Create product"}
                </Button>
                {editingId ? (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setEditingId(null);
                      setDraft(EMPTY_PRODUCT);
                    }}
                  >
                    Reset editor
                  </Button>
                ) : null}
              </div>
            ) : (
              <div className="border-l-2 border-white/40 bg-white/5 px-4 py-4 text-sm text-white/70">
                This account can view inventory but cannot modify it.
              </div>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}
