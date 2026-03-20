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
import type { Watch } from "@/lib/types";

const schema = z.object({
  brand: z.string().min(1, "Brand is required"),
  name: z.string().min(1, "Model name is required"),
  reference: z.string().min(1, "Reference is required"),
  purchasePrice: z.coerce.number().min(0, "Price must be positive"),
  purchaseDate: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface WatchFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: FormValues) => Promise<void>;
  defaultValues?: Partial<Watch>;
}

export function WatchForm({ open, onOpenChange, onSubmit, defaultValues }: WatchFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues, unknown, FormValues>({
    resolver: zodResolver(schema) as never,
    defaultValues: {
      brand: defaultValues?.brand ?? "",
      name: defaultValues?.name ?? "",
      reference: defaultValues?.reference ?? "",
      purchasePrice: defaultValues?.purchasePrice ?? undefined,
      purchaseDate: defaultValues?.purchaseDate ?? "",
      imageUrl: defaultValues?.imageUrl ?? "",
      notes: defaultValues?.notes ?? "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        brand: defaultValues?.brand ?? "",
        name: defaultValues?.name ?? "",
        reference: defaultValues?.reference ?? "",
        purchasePrice: defaultValues?.purchasePrice ?? undefined,
        purchaseDate: defaultValues?.purchaseDate ?? "",
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
          <DialogTitle>{defaultValues?._id ? "Edit Watch" : "Add Watch"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" placeholder="Rolex" {...register("brand")} />
              {errors.brand && <p className="text-xs text-destructive">{errors.brand.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="name">Model</Label>
              <Input id="name" placeholder="Submariner" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="reference">Reference</Label>
              <Input id="reference" placeholder="126610LN" {...register("reference")} />
              {errors.reference && <p className="text-xs text-destructive">{errors.reference.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="purchasePrice">Purchase Price (£)</Label>
              <Input
                id="purchasePrice"
                type="number"
                min={0}
                step={1}
                placeholder="9500"
                {...register("purchasePrice")}
              />
              {errors.purchasePrice && (
                <p className="text-xs text-destructive">{errors.purchasePrice.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="purchaseDate">Purchase Date (optional)</Label>
            <Input id="purchaseDate" type="date" {...register("purchaseDate")} />
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
              {isSubmitting ? "Saving..." : defaultValues?._id ? "Save changes" : "Add watch"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
