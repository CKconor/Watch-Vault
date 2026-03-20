"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WatchCard } from "./watch-card";
import { WatchForm } from "./watch-form";
import { useWatches } from "@/hooks/use-watches";
import { useWearLog } from "@/hooks/use-wear-log";
import type { Watch, StrapType } from "@/lib/types";

const TODAY = new Date().toISOString().split("T")[0];

export function WatchGrid() {
  const { watches, addWatch, updateWatch, deleteWatch } = useWatches();
  const { wearLog, logWear } = useWearLog();
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Watch | undefined>();

  function openAdd() {
    setEditTarget(undefined);
    setFormOpen(true);
  }

  function openEdit(watch: Watch) {
    setEditTarget(watch);
    setFormOpen(true);
  }

  async function handleSubmit(values: Parameters<typeof addWatch>[0]) {
    if (editTarget) {
      await updateWatch({ id: editTarget._id, ...values });
    } else {
      await addWatch(values);
    }
  }

  if (watches.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center gap-5 py-28 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-sm border border-border text-xl text-muted-foreground/40">
            ◈
          </div>
          <div>
            <h2
              className="text-2xl text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              No watches yet
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Add your first piece to begin tracking your collection.
            </p>
          </div>
          <Button onClick={openAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            Add watch
          </Button>
        </div>
        <WatchForm
          open={formOpen}
          onOpenChange={setFormOpen}
          onSubmit={handleSubmit}
          defaultValues={editTarget}
        />
      </>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-end justify-between border-b border-border/50 pb-5">
        <div>
          <h2
            className="text-3xl text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Collection
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {watches.length} {watches.length === 1 ? "timepiece" : "timepieces"}
          </p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add watch
        </Button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {(watches as Watch[]).map((watch) => {
          const todayEntry = wearLog.find(
            (e) => e.watchId === watch._id && e.date === TODAY,
          );
          return (
            <WatchCard
              key={watch._id}
              watch={watch}
              wearLog={wearLog}
              onEdit={openEdit}
              onDelete={(id) => deleteWatch({ id: id as Watch["_id"] })}
              onLogToday={(strapType: StrapType) =>
                logWear({ watchId: watch._id, date: TODAY, strapType })
              }
              onSaveCrop={(imagePositionX, imagePosition, imageScale) =>
                updateWatch({ id: watch._id, imagePositionX, imagePosition, imageScale })
              }
              todayEntry={todayEntry}
            />
          );
        })}
      </div>

      <WatchForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        defaultValues={editTarget}
      />
    </div>
  );
}
