"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2, CheckCircle2, Crop } from "lucide-react";
import { CropEditorDialog } from "@/components/ui/crop-editor-dialog";
import { formatCurrency, formatDate } from "@/lib/utils";
import { STRAP_TYPES, type Watch, type WearLogEntry, type StrapType } from "@/lib/types";
import { StrapBadge } from "./strap-badge";

interface WatchCardProps {
  watch: Watch;
  wearLog: WearLogEntry[];
  onEdit: (watch: Watch) => void;
  onDelete: (id: string) => void;
  onLogToday: (strapType: StrapType) => Promise<unknown>;
  onSaveCrop: (positionX: number, positionY: number, scale: number) => Promise<unknown>;
  todayEntry: WearLogEntry | undefined;
}

export function WatchCard({ watch, wearLog, onEdit, onDelete, onLogToday, onSaveCrop, todayEntry }: WatchCardProps) {
  const wearCount = wearLog.filter((e) => e.watchId === watch._id).length;
  const cpw = wearCount > 0 ? watch.purchasePrice / wearCount : null;
  const lastWorn = wearLog
    .filter((e) => e.watchId === watch._id)
    .sort((a, b) => b.date.localeCompare(a.date))[0];
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [cropOpen, setCropOpen] = useState(false);

  async function handleLogToday(strap: StrapType) {
    await onLogToday(strap);
    setPopoverOpen(false);
  }

  return (
    <Card className="group relative overflow-hidden pt-0 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/40">
      {/* Image */}
      <div className="relative h-52 w-full overflow-hidden bg-muted">
        {watch.imageUrl ? (
          <Image
            src={watch.imageUrl}
            alt={`${watch.brand} ${watch.name}`}
            fill
            className="object-cover transition-transform duration-500"
            style={{
              objectPosition: `${watch.imagePositionX ?? 50}% ${watch.imagePosition ?? 0}%`,
              transform: `scale(${watch.imageScale ?? 1})`,
              transformOrigin: `${watch.imagePositionX ?? 50}% ${watch.imagePosition ?? 0}%`,
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/60">
            <span className="text-4xl text-muted-foreground/20">◈</span>
          </div>
        )}

        {/* Today worn indicator */}
        {todayEntry && (
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-sm bg-primary px-1.5 py-0.5">
            <CheckCircle2 className="h-3 w-3 text-primary-foreground" />
            <span className="text-[10px] font-semibold text-primary-foreground">Today</span>
          </div>
        )}

        {/* Action buttons — appear on hover */}
        <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          {watch.imageUrl && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Adjust image crop"
              className="h-7 w-7 bg-background/85 backdrop-blur-sm hover:bg-background"
              onClick={() => setCropOpen(true)}
            >
              <Crop className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Edit watch"
            className="h-7 w-7 bg-background/85 backdrop-blur-sm hover:bg-background"
            onClick={() => onEdit(watch)}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Delete watch"
                  className="h-7 w-7 bg-background/85 text-destructive backdrop-blur-sm hover:bg-background hover:text-destructive"
                />
              }
            >
              <Trash2 className="h-3.5 w-3.5" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete watch?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete {watch.brand} {watch.name} and all its wear history.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => onDelete(watch._id)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Brand + name */}
        <div className="mb-3 border-b border-border/50 pb-3">
          <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
            {watch.brand}
          </p>
          <h3
            className="text-lg leading-tight text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {watch.name}
          </h3>
          {watch.reference && (
            <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{watch.reference}</p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-y-0.5">
          <div>
            <p className="text-[9px] uppercase tracking-widest text-muted-foreground">Wears</p>
            <p className="font-mono text-sm font-medium text-foreground">{wearCount}</p>
          </div>
          {cpw !== null && (
            <div className="text-right">
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground">Cost/wear</p>
              <p className="font-mono text-sm font-medium text-primary">{formatCurrency(cpw)}</p>
            </div>
          )}
        </div>

        {lastWorn && (
          <p className="mt-2 text-[10px] text-muted-foreground">
            Last worn {formatDate(lastWorn.date)}
          </p>
        )}

        {/* Today log / link row */}
        <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-3">
          {todayEntry ? (
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3 w-3 text-primary" />
              <StrapBadge strapType={todayEntry.strapType} />
            </div>
          ) : (
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger className="inline-flex h-6 cursor-pointer items-center gap-1 rounded-lg border border-transparent bg-transparent px-2 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground">
                + Log today
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3" align="start">
                <p className="mb-2 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Strap type
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {STRAP_TYPES.map((strap) => (
                    <button
                      key={strap}
                      onClick={() => handleLogToday(strap)}
                      className="cursor-pointer rounded-sm border border-border px-2.5 py-1 text-xs font-medium transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      {strap}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}

          <Link
            href={`/collection/${watch._id}`}
            className="text-[11px] font-medium tracking-wide text-primary/60 transition-colors hover:text-primary"
          >
            View →
          </Link>
        </div>
      </CardContent>

      {watch.imageUrl && (
        <CropEditorDialog
          open={cropOpen}
          onOpenChange={setCropOpen}
          src={watch.imageUrl}
          alt={`${watch.brand} ${watch.name}`}
          positionX={watch.imagePositionX ?? 50}
          positionY={watch.imagePosition ?? 0}
          scale={watch.imageScale ?? 1}
          onSave={onSaveCrop}
        />
      )}
    </Card>
  );
}
