"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PencilLine, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageIntro } from "@/components/ui/page-intro";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export function SuppliersPage() {
  const queryClient = useQueryClient();
  const { session, hasAuthority } = useAuth();
  const token = session?.accessToken || "";
  const canWrite = hasAuthority("supplier:write");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState({ name: "", contact: "" });

  const suppliersQuery = useQuery({
    queryKey: ["suppliers"],
    queryFn: () => api.getSuppliers(token),
    enabled: Boolean(token)
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingId) {
        return api.updateSupplier(token, editingId, draft);
      }
      return api.createSupplier(token, draft);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      setEditingId(null);
      setDraft({ name: "", contact: "" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.deleteSupplier(token, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["suppliers"] })
  });

  return (
    <div className="space-y-10">
      <PageIntro
        eyebrow="Suppliers"
        title="Supply records shaped like an index, not a dashboard."
        description="The supplier surface is lightweight. The redesign keeps it direct: clear rows, fewer containers, and a dark-side workbench for edits."
      />
      <section className="section-frame grid overflow-hidden xl:grid-cols-[1.25fr_0.75fr]">
        <div>
          <div className="grid grid-cols-[1fr_1fr_auto] border-b border-line px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.32em] text-muted sm:px-8">
            <span>Name</span>
            <span>Contact</span>
            <span className="text-right">Actions</span>
          </div>
          {(suppliersQuery.data || []).map((supplier) => (
            <div
              key={supplier.id}
              className="ledger-row grid grid-cols-[1fr_1fr_auto] items-center gap-4 border-b border-line px-6 py-5 transition hover:bg-white/35 sm:px-8"
            >
              <p className="font-semibold text-ink">{supplier.name}</p>
              <p className="text-sm text-muted">{supplier.contact}</p>
              {canWrite ? (
                <div className="flex gap-2 justify-self-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setEditingId(supplier.id);
                      setDraft({ name: supplier.name, contact: supplier.contact });
                    }}
                  >
                    <PencilLine className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-ember"
                    onClick={() => deleteMutation.mutate(supplier.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <aside className="border-t border-line bg-[#14181d] text-white xl:border-l xl:border-t-0">
          <div className="px-6 py-6 sm:px-8">
            <p className="text-[11px] uppercase tracking-[0.38em] text-white/40">Workbench</p>
            <h2 className="mt-4 font-display text-4xl leading-[0.95]">
              {editingId ? "Update supplier" : "Add supplier"}
            </h2>
          </div>
          <div className="space-y-5 border-t border-white/10 px-6 py-6 sm:px-8">
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/42">
                Supplier name
              </label>
              <Input
                className="border-white/18 text-white placeholder:text-white/35 focus:border-white"
                value={draft.name}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, name: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/42">
                Contact
              </label>
              <Input
                className="border-white/18 text-white placeholder:text-white/35 focus:border-white"
                value={draft.contact}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, contact: event.target.value }))
                }
              />
            </div>
            {canWrite ? (
              <div className="flex gap-3 border-t border-white/10 pt-5">
                <Button
                  type="button"
                  onClick={() => saveMutation.mutate()}
                  disabled={saveMutation.isPending}
                  className="border-white bg-white text-ink hover:bg-white/85"
                >
                  {editingId ? <PencilLine className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                  {editingId ? "Update" : "Create"}
                </Button>
                {editingId ? (
                  <Button
                    type="button"
                    variant="secondary"
                    className="border-white/14 bg-white/6 text-white hover:bg-white/10"
                    onClick={() => {
                      setEditingId(null);
                      setDraft({ name: "", contact: "" });
                    }}
                  >
                    Cancel
                  </Button>
                ) : null}
              </div>
            ) : (
              <div className="border-l-2 border-white/40 bg-white/5 px-4 py-4 text-sm text-white/70">
                Supplier changes require admin permissions.
              </div>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}
