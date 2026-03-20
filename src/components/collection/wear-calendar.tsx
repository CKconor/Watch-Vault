"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
import { STRAP_TYPES, type StrapType, type WearLogEntry } from "@/lib/types";
import type { Id } from "../../../convex/_generated/dataModel";

interface WearCalendarProps {
  watchId: Id<"watches">;
  entries: WearLogEntry[];
  onLog: (args: { watchId: Id<"watches">; date: string; strapType: StrapType; notes?: string }) => Promise<unknown>;
  onRemove: (id: string) => Promise<unknown>;
}

export function WearCalendar({ watchId, entries, onLog, onRemove }: WearCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [strap, setStrap] = useState<StrapType>("Bracelet");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const wornDates = new Set(entries.map((e) => e.date));

  function getEntry(date: Date): WearLogEntry | undefined {
    const iso = format(date, "yyyy-MM-dd");
    return entries.find((e) => e.date === iso);
  }

  function handleDayClick(day: Date) {
    setSelectedDate(day);
    setNotes("");
    const existing = getEntry(day);
    if (existing) setStrap(existing.strapType);
    setPopoverOpen(true);
  }

  async function handleLog() {
    if (!selectedDate) return;
    setSaving(true);
    try {
      await onLog({
        watchId,
        date: format(selectedDate, "yyyy-MM-dd"),
        strapType: strap,
        notes: notes || undefined,
      });
      setPopoverOpen(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove() {
    if (!selectedDate) return;
    const entry = getEntry(selectedDate);
    if (!entry) return;
    setSaving(true);
    try {
      await onRemove(entry._id);
      setPopoverOpen(false);
    } finally {
      setSaving(false);
    }
  }

  const selectedEntry = selectedDate ? getEntry(selectedDate) : undefined;

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(day) => day && handleDayClick(day)}
        className="rounded-lg border"
        modifiers={{ worn: (day) => wornDates.has(format(day, "yyyy-MM-dd")) }}
        modifiersClassNames={{
          worn: "bg-primary/15 font-semibold text-primary",
        }}
      />

      {popoverOpen && selectedDate && (
        <div className="rounded-lg border bg-card p-4 shadow-md w-full max-w-xs space-y-3">
          <p className="font-medium">{format(selectedDate, "d MMMM yyyy")}</p>

          {selectedEntry ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Worn with</span>
                <StrapBadge strapType={selectedEntry.strapType} />
              </div>
              {selectedEntry.notes && (
                <p className="text-sm text-muted-foreground">{selectedEntry.notes}</p>
              )}
              <Button
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={handleRemove}
                disabled={saving}
              >
                Remove wear log
              </Button>
            </>
          ) : (
            <>
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
              <Button size="sm" className="w-full" onClick={handleLog} disabled={saving}>
                {saving ? "Logging..." : "Log wear"}
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
