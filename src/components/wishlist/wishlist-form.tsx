"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WATCH_TYPES, PRIORITIES, type WishlistItem } from "@/lib/types";

const schema = z.object({
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  reference: z.string().optional(),
  estimatedPrice: z.coerce.number().min(0, "Price must be positive"),
  watchType: z.enum(WATCH_TYPES),
  priority: z.enum(PRIORITIES),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface WishlistFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: FormValues) => Promise<void>;
  defaultValues?: Partial<WishlistItem>;
}

export function WishlistForm({ open, onOpenChange, onSubmit, defaultValues }: WishlistFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues, unknown, FormValues>({
    resolver: zodResolver(schema) as never,
    defaultValues: {
      brand: defaultValues?.brand ?? "",
      model: defaultValues?.model ?? "",
      reference: defaultValues?.reference ?? "",
      estimatedPrice: defaultValues?.estimatedPrice ?? undefined,
      watchType: defaultValues?.watchType ?? "Diver",
      priority: defaultValues?.priority ?? "Medium",
      imageUrl: defaultValues?.imageUrl ?? "",
      notes: defaultValues?.notes ?? "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        brand: defaultValues?.brand ?? "",
        model: defaultValues?.model ?? "",
        reference: defaultValues?.reference ?? "",
        estimatedPrice: defaultValues?.estimatedPrice ?? undefined,
        watchType: defaultValues?.watchType ?? "Diver",
        priority: defaultValues?.priority ?? "Medium",
        imageUrl: defaultValues?.imageUrl ?? "",
        notes: defaultValues?.notes ?? "",
      });
    }
  }, [open, defaultValues, reset]);

  async function handleFormSubmit(values: FormValues) {
    await onSubmit(values);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{defaultValues?._id ? "Edit Item" : "Add to Wishlist"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" placeholder="Omega" {...register("brand")} />
              {errors.brand && <p className="text-xs text-destructive">{errors.brand.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="model">Model</Label>
              <Input id="model" placeholder="Seamaster" {...register("model")} />
              {errors.model && <p className="text-xs text-destructive">{errors.model.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="reference">Reference (optional)</Label>
              <Input id="reference" placeholder="210.30.42.20.01.001" {...register("reference")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="estimatedPrice">Estimated Price (£)</Label>
              <Input
                id="estimatedPrice"
                type="number"
                min={0}
                step={1}
                placeholder="5000"
                {...register("estimatedPrice")}
              />
              {errors.estimatedPrice && (
                <p className="text-xs text-destructive">{errors.estimatedPrice.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select
                value={watch("watchType")}
                onValueChange={(v) => setValue("watchType", v as FormValues["watchType"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WATCH_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select
                value={watch("priority")}
                onValueChange={(v) => setValue("priority", v as FormValues["priority"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="imageUrl">Image URL (optional)</Label>
            <Input id="imageUrl" type="url" placeholder="https://..." {...register("imageUrl")} />
            {errors.imageUrl && <p className="text-xs text-destructive">{errors.imageUrl.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea id="notes" rows={2} placeholder="Any notes..." {...register("notes")} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : defaultValues?._id ? "Save changes" : "Add to wishlist"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
