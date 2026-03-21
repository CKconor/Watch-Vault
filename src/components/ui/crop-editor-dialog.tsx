"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Move, ZoomIn, ZoomOut } from "lucide-react";

interface CropEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  src: string;
  alt: string;
  positionX: number; // horizontal 0–100, default 50
  positionY: number; // vertical 0–100, default 0
  scale: number;     // zoom 1–3
  onSave: (positionX: number, positionY: number, scale: number) => Promise<unknown>;
}

const MIN_SCALE = 1;
const MAX_SCALE = 3;
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export function CropEditorDialog({
  open,
  onOpenChange,
  src,
  alt,
  positionX,
  positionY,
  scale,
  onSave,
}: CropEditorDialogProps) {
  const [draftX, setDraftX] = useState(positionX);
  const [draftY, setDraftY] = useState(positionY);
  const [draftScale, setDraftScale] = useState(scale);
  const [saving, setSaving] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const dragState = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number } | null>(null);
  const pinchState = useRef<{ startDist: number; startScale: number } | null>(null);

  useEffect(() => {
    if (open) {
      setDraftX(positionX);
      setDraftY(positionY);
      setDraftScale(scale);
    }
  }, [open, positionX, positionY, scale]);

  // ── Mouse ────────────────────────────────────────────────
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragState.current = { startX: e.clientX, startY: e.clientY, startPosX: draftX, startPosY: draftY };
  };

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.current || !containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    // Dragging right → reveal left side → posX decreases
    setDraftX(clamp(dragState.current.startPosX - (dx / width) * 100, 0, 100));
    setDraftY(clamp(dragState.current.startPosY - (dy / height) * 100, 0, 100));
  }, []);

  const onMouseUp = useCallback(() => { dragState.current = null; }, []);

  // ── Scroll to zoom ───────────────────────────────────────
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setDraftScale((s) => clamp(s - e.deltaY * 0.005, MIN_SCALE, MAX_SCALE));
  };

  // ── Touch ────────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      dragState.current = { startX: e.touches[0].clientX, startY: e.touches[0].clientY, startPosX: draftX, startPosY: draftY };
    } else if (e.touches.length === 2) {
      dragState.current = null;
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      pinchState.current = { startDist: dist, startScale: draftScale };
    }
  };

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length === 1 && dragState.current && containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      const dx = e.touches[0].clientX - dragState.current.startX;
      const dy = e.touches[0].clientY - dragState.current.startY;
      setDraftX(clamp(dragState.current.startPosX - (dx / width) * 100, 0, 100));
      setDraftY(clamp(dragState.current.startPosY - (dy / height) * 100, 0, 100));
    } else if (e.touches.length === 2 && pinchState.current) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      setDraftScale(clamp(pinchState.current.startScale * (dist / pinchState.current.startDist), MIN_SCALE, MAX_SCALE));
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    dragState.current = null;
    pinchState.current = null;
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [onMouseMove, onMouseUp, onTouchMove, onTouchEnd]);

  async function handleSave() {
    setSaving(true);
    try {
      await onSave(
        Math.round(draftX),
        Math.round(draftY),
        Math.round(draftScale * 100) / 100,
      );
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "var(--font-display)" }} className="font-normal">
            Adjust Crop
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {/* Preview */}
          <div
            ref={containerRef}
            className="relative h-64 w-full cursor-move select-none overflow-hidden rounded-sm border border-border"
            onMouseDown={onMouseDown}
            onWheel={onWheel}
            onTouchStart={onTouchStart}
          >
            <Image
              src={src}
              alt={alt}
              fill
              draggable={false}
              className="object-cover transition-none"
              style={{
                objectPosition: `${draftX}% ${draftY}%`,
                transform: `scale(${draftScale})`,
                transformOrigin: `${draftX}% ${draftY}%`,
              }}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-gradient-to-t from-black/50 to-transparent pb-3 pt-8">
              <Move className="h-3.5 w-3.5 text-white/80" />
              <span className="text-xs text-white/80">Drag to reposition · Scroll to zoom</span>
            </div>
          </div>

          {/* Zoom slider */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              aria-label="Zoom out"
              className="h-7 w-7 shrink-0"
              onClick={() => setDraftScale((s) => clamp(s - 0.25, MIN_SCALE, MAX_SCALE))}
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <div className="relative h-1.5 flex-1 rounded-full bg-muted">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-primary"
                style={{ width: `${((draftScale - MIN_SCALE) / (MAX_SCALE - MIN_SCALE)) * 100}%` }}
              />
              <input
                type="range"
                min={MIN_SCALE}
                max={MAX_SCALE}
                step={0.01}
                value={draftScale}
                onChange={(e) => setDraftScale(Number(e.target.value))}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              aria-label="Zoom in"
              className="h-7 w-7 shrink-0"
              onClick={() => setDraftScale((s) => clamp(s + 0.25, MIN_SCALE, MAX_SCALE))}
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
            <span className="w-10 shrink-0 text-right font-mono text-xs text-muted-foreground">
              {draftScale.toFixed(2)}×
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save crop"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
