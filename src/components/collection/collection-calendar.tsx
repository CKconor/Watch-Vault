"use client";

import { useState } from "react";
import Image from "next/image";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  format,
  addMonths,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { StrapBadge } from "./strap-badge";
import { STRAP_TYPES, type StrapType, type Watch, type WearLogEntry } from "@/lib/types";
import type { Id } from "../../../convex/_generated/dataModel";

interface CollectionCalendarProps {
  watches: Watch[];
  wearLog: WearLogEntry[];
  onLog: (args: { watchId: Id<"watches">; date: string; strapType: StrapType; notes?: string }) => Promise<unknown>;
  onRemove: (id: string) => Promise<unknown>;
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CollectionCalendar({ watches, wearLog, onLog, onRemove }: CollectionCalendarProps) {
  const [viewDate, setViewDate] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [watchId, setWatchId] = useState<Id<"watches"> | "">("");
  const [strap, setStrap] = useState<StrapType>("Bracelet");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const watchMap = new Map(watches.map((w) => [w._id, w]));
  const wearByDate = new Map(wearLog.map((e) => [e.date, e]));

  const days = eachDayOfInterval({ start: viewDate, end: endOfMonth(viewDate) });
  const startOffset = getDay(viewDate);

  const cells: (Date | null)[] = [
    ...Array.from({ length: startOffset }, () => null),
    ...days,
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  function handleDayClick(dateStr: string) {
    if (selectedDate === dateStr) {
      setSelectedDate(null);
      return;
    }
    const existing = wearByDate.get(dateStr);
    setSelectedDate(dateStr);
    setNotes("");
    if (existing) {
      setStrap(existing.strapType);
      setWatchId(existing.watchId);
    } else {
      setStrap("Bracelet");
      setWatchId(watches[0]?._id ?? "");
    }
  }

  async function handleLog() {
    if (!selectedDate || !watchId) return;
    setSaving(true);
    try {
      await onLog({ watchId: watchId as Id<"watches">, date: selectedDate, strapType: strap, notes: notes || undefined });
      setSelectedDate(null);
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove() {
    if (!selectedDate) return;
    const entry = wearByDate.get(selectedDate);
    if (!entry) return;
    setSaving(true);
    try {
      await onRemove(entry._id);
      setSelectedDate(null);
    } finally {
      setSaving(false);
    }
  }

  const selectedEntry = selectedDate ? wearByDate.get(selectedDate) : undefined;
  const selectedWatch = selectedEntry ? watchMap.get(selectedEntry.watchId) : undefined;

  return (
    <div className="space-y-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" aria-label="Previous month" onClick={() => setViewDate(subMonths(viewDate, 1))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium tracking-wide">
          {format(viewDate, "MMMM yyyy")}
        </span>
        <Button variant="ghost" size="icon" aria-label="Next month" onClick={() => setViewDate(addMonths(viewDate, 1))}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 gap-px">
        {DAY_LABELS.map((d) => (
          <div key={d} className="py-1 text-center text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px rounded-sm border border-border/40 bg-border/20 overflow-hidden">
        {cells.map((day, i) => {
          if (!day) {
            return <div key={`empty-${i}`} className="min-h-[64px] bg-background/40" />;
          }

          const dateStr = format(day, "yyyy-MM-dd");
          const entry = wearByDate.get(dateStr);
          const watch = entry ? watchMap.get(entry.watchId) : undefined;
          const isSelected = selectedDate === dateStr;
          const isToday = dateStr === format(new Date(), "yyyy-MM-dd");

          return (
            <div
              key={dateStr}
              className={`relative min-h-[64px] bg-background p-1.5 cursor-pointer transition-colors ${isSelected ? "ring-1 ring-inset ring-foreground/40 bg-muted/40" : "hover:bg-muted/30"}`}
              onClick={() => handleDayClick(dateStr)}
            >
              <span
                className={`text-[11px] font-medium leading-none ${isToday ? "flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background" : "text-muted-foreground"}`}
              >
                {format(day, "d")}
              </span>

              {watch && (
                <div className="mt-1.5 flex justify-center">
                  {watch.imageUrl ? (
                    <div className="relative h-7 w-7 overflow-hidden rounded-sm border border-border">
                      <Image
                        src={watch.imageUrl}
                        alt={`${watch.brand} ${watch.name}`}
                        fill
                        className="object-cover"
                        style={{
                          objectPosition: `${watch.imagePositionX ?? 50}% ${watch.imagePosition ?? 0}%`,
                          transform: `scale(${watch.imageScale ?? 1})`,
                          transformOrigin: `${watch.imagePositionX ?? 50}% ${watch.imagePosition ?? 0}%`,
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-sm border border-border bg-muted text-[10px] text-muted-foreground/40">
                      ◈
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Day detail panel */}
      {selectedDate && (
        <div className="rounded-lg border bg-card p-4 shadow-sm space-y-3">
          <p className="font-medium">{format(new Date(selectedDate + "T00:00:00"), "d MMMM yyyy")}</p>

          {selectedEntry && selectedWatch ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Worn with</span>
                <StrapBadge strapType={selectedEntry.strapType} />
              </div>
              <p className="text-sm text-muted-foreground">{selectedWatch.brand} {selectedWatch.name}</p>
              {selectedEntry.notes && (
                <p className="text-sm text-muted-foreground">{selectedEntry.notes}</p>
              )}
              <Button variant="destructive" size="sm" onClick={handleRemove} disabled={saving}>
                Remove wear log
              </Button>
            </>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Watch</Label>
                <Select value={watchId} onValueChange={(v) => setWatchId(v as Id<"watches">)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a watch" />
                  </SelectTrigger>
                  <SelectContent>
                    {watches.map((w) => (
                      <SelectItem key={w._id} value={w._id}>
                        {w.brand} {w.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Strap type</Label>
                <Select value={strap} onValueChange={(v) => setStrap(v as StrapType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STRAP_TYPES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Notes (optional)</Label>
                <Textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any notes..."
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleLog} disabled={saving || !watchId}>
                  {saving ? "Logging..." : "Log wear"}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setSelectedDate(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
