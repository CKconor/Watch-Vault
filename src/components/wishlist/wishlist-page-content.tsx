"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WishlistTable } from "./wishlist-table";
import { WishlistForm } from "./wishlist-form";
import { WishlistStats } from "./wishlist-stats";
import { useWishlist } from "@/hooks/use-wishlist";
import type { WishlistItem } from "@/lib/types";

export function WishlistPageContent() {
  const { wishlist, addItem, updateItem, deleteItem } = useWishlist();
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<WishlistItem | undefined>();

  function openAdd() {
    setEditTarget(undefined);
    setFormOpen(true);
  }

  function openEdit(item: WishlistItem) {
    setEditTarget(item);
    setFormOpen(true);
  }

  async function handleSubmit(values: Parameters<typeof addItem>[0]) {
    if (editTarget) {
      await updateItem({ id: editTarget._id, ...values });
    } else {
      await addItem(values);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between border-b border-border/50 pb-5">
        <div>
          <h1
            className="text-3xl text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Wishlist
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {wishlist.length === 0
              ? "Track watches you want to acquire"
              : `${wishlist.length} ${wishlist.length === 1 ? "timepiece" : "timepieces"} on your list`}
          </p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add watch
        </Button>
      </div>

      {wishlist.length > 0 && <WishlistStats items={wishlist} />}

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-5 py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-sm border border-border text-xl text-muted-foreground/40">
            ◎
          </div>
          <div>
            <h2
              className="text-2xl text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Wishlist is empty
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Start tracking watches you want to acquire.
            </p>
          </div>
          <Button onClick={openAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            Add watch
          </Button>
        </div>
      ) : (
        <WishlistTable
          items={wishlist}
          onEdit={openEdit}
          onDelete={(id) => deleteItem({ id: id as WishlistItem["_id"] })}
          onSaveCrop={(id, imagePositionX, imagePosition, imageScale) =>
            updateItem({ id: id as WishlistItem["_id"], imagePositionX, imagePosition, imageScale })
          }
        />
      )}

      <WishlistForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        defaultValues={editTarget}
      />
    </div>
  );
}
