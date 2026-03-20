"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WearCalendar } from "./wear-calendar";
import { WearHistory } from "./wear-history";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useWearLog, useWearLogByWatch } from "@/hooks/use-wear-log";
import { useMemo } from "react";

interface WatchDetailPageProps {
  watchId: string;
}

export function WatchDetailPage({ watchId }: WatchDetailPageProps) {
  const watches = useQuery(api.watches.list);
  const watch = watches?.find((w: { _id: string }) => w._id === watchId);
  const entries = useWearLogByWatch(watchId as Id<"watches">);
  const { logWear, removeWear } = useWearLog();

  const wearCount = entries.length;
  const cpw = wearCount > 0 && watch ? watch.purchasePrice / wearCount : null;
  const lastWorn = useMemo(
    () => [...entries].sort((a, b) => b.date.localeCompare(a.date))[0],
    [entries],
  );

  if (!watch) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        {watches === undefined ? "Loading..." : "Watch not found."}
      </div>
    );
  }

  const stats = [
    { label: "Purchase price", value: formatCurrency(watch.purchasePrice), accent: false },
    { label: "Total wears", value: String(wearCount), accent: false },
    { label: "Cost per wear", value: cpw !== null ? formatCurrency(cpw) : "—", accent: true },
    { label: "Last worn", value: lastWorn ? formatDate(lastWorn.date) : "Never", accent: false },
  ];

  return (
    <div className="space-y-8">
      <Link
        href="/collection"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to collection
      </Link>

      {/* Header */}
      <div className="flex gap-6">
        {watch.imageUrl && (
          <div className="relative hidden h-36 w-36 shrink-0 overflow-hidden rounded-sm border border-border sm:block">
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
        )}
        <div className="flex flex-col justify-center">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
            {watch.brand}
          </p>
          <h1
            className="text-4xl leading-tight text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {watch.name}
          </h1>
          {watch.reference && (
            <p className="mt-2 font-mono text-sm text-muted-foreground">{watch.reference}</p>
          )}
        </div>
      </div>

      {/* Stats grid — borderless inset style */}
      <div className="grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4">
        {stats.map(({ label, value, accent }) => (
          <div key={label} className="bg-card px-5 py-4">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {label}
            </p>
            <p
              className={`mt-2 font-mono text-2xl font-semibold ${accent ? "text-primary" : "text-foreground"}`}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle
            className="text-xl font-normal"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Log Wear
          </CardTitle>
        </CardHeader>
        <CardContent>
          <WearCalendar
            watchId={watchId as Id<"watches">}
            entries={entries}
            onLog={logWear}
            onRemove={(id) => removeWear({ id: id as Id<"wearLog"> })}
          />
        </CardContent>
      </Card>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle
            className="text-xl font-normal"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Wear History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <WearHistory
            entries={entries}
            onRemove={(id) => removeWear({ id: id as Id<"wearLog"> })}
          />
        </CardContent>
      </Card>
    </div>
  );
}
