"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PencilLine, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageIntro } from "@/components/ui/page-intro";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export function CategoriesPage() {
  const queryClient = useQueryClient();
  const { session, hasAuthority } = useAuth();
  const token = session?.accessToken || "";
  const canWrite = hasAuthority("category:write");
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.getCategories(token),
    enabled: Boolean(token)
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingId) {
        return api.updateCategory(token, editingId, { name });
      }
      return api.createCategory(token, { name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setEditingId(null);
      setName("");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.deleteCategory(token, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] })
  });

  return (
    <div className="space-y-10">
      <PageIntro
        eyebrow="Categories"
        title="A taxonomy page with less chrome and more rhythm."
        description="Categories are intentionally simple in the backend, so the UI should feel like a restrained index sheet rather than a full dashboard in disguise."
      />
      <section className="section-frame grid overflow-hidden lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="grid grid-cols-[1fr_auto] border-b border-line px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.32em] text-muted sm:px-8">
            <span>Category ledger</span>
            <span>ID</span>
          </div>
          {(categoriesQuery.data || []).map((category) => (
            <div
              key={category.id}
              className="ledger-row grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-line px-6 py-5 transition hover:bg-white/35 sm:px-8"
            >
              <div>
                <p className="font-semibold text-ink">{category.name}</p>
              </div>
              <span className="text-sm text-muted">{category.id}</span>
              {canWrite ? (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setEditingId(category.id);
                      setName(category.name);
                    }}
                  >
                    <PencilLine className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-ember"
                    onClick={() => deleteMutation.mutate(category.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <aside className="border-t border-line bg-[#14181d] text-white lg:border-l lg:border-t-0">
          <div className="px-6 py-6 sm:px-8">
            <p className="text-[11px] uppercase tracking-[0.38em] text-white/40">Workbench</p>
            <h2 className="mt-4 font-display text-4xl leading-[0.95]">
              {editingId ? "Rename category" : "Add category"}
            </h2>
          </div>
          <div className="space-y-5 border-t border-white/10 px-6 py-6 sm:px-8">
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/42">
                Category name
              </label>
              <Input
                className="border-white/18 text-white placeholder:text-white/35 focus:border-white"
                value={name}
                onChange={(event) => setName(event.target.value)}
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
                      setName("");
                    }}
                  >
                    Cancel
                  </Button>
                ) : null}
              </div>
            ) : (
              <div className="border-l-2 border-white/40 bg-white/5 px-4 py-4 text-sm text-white/70">
                This account only has read access for categories.
              </div>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}
