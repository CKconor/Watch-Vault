"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { WATCH_TYPES, PRIORITIES, type WishlistItem, type WatchType, type Priority } from "@/lib/types";
import { CropEditorDialog } from "@/components/ui/crop-editor-dialog";

type SortField = "brand" | "estimatedPrice" | "priority";
type SortDir = "asc" | "desc";

const priorityOrder: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 };
const priorityStyles: Record<Priority, string> = {
  High: "text-destructive",
  Medium: "text-amber-500 dark:text-amber-400",
  Low: "text-muted-foreground",
};

interface WishlistTableProps {
  items: WishlistItem[];
  onEdit: (item: WishlistItem) => void;
  onDelete: (id: string) => void;
  onSaveCrop: (id: string, positionX: number, positionY: number, scale: number) => Promise<void>;
}

export function WishlistTable({ items, onEdit, onDelete, onSaveCrop }: WishlistTableProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<WatchType | "All">("All");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "All">("All");
  const [sortField, setSortField] = useState<SortField>("priority");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [cropTarget, setCropTarget] = useState<WishlistItem | null>(null);

  function toggleSort(field: SortField) {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  }

  const filtered = items
    .filter((i) => {
      if (search && !`${i.brand} ${i.model}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (typeFilter !== "All" && i.watchType !== typeFilter) return false;
      if (priorityFilter !== "All" && i.priority !== priorityFilter) return false;
      return true;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortField === "brand") cmp = a.brand.localeCompare(b.brand);
      else if (sortField === "estimatedPrice") cmp = a.estimatedPrice - b.estimatedPrice;
      else if (sortField === "priority") cmp = priorityOrder[a.priority] - priorityOrder[b.priority];
      return sortDir === "asc" ? cmp : -cmp;
    });

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Search brand or model..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as WatchType | "All")}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All types</SelectItem>
            {WATCH_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as Priority | "All")}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All priorities</SelectItem>
            {PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-border/50">
            <TableHead>
              <Button variant="ghost" size="sm" className="-ml-3 text-xs uppercase tracking-wide" onClick={() => toggleSort("brand")}>
                Watch <ArrowUpDown className="ml-1 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead className="text-xs uppercase tracking-wide">Type</TableHead>
            <TableHead>
              <Button variant="ghost" size="sm" className="-ml-3 text-xs uppercase tracking-wide" onClick={() => toggleSort("priority")}>
                Priority <ArrowUpDown className="ml-1 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button variant="ghost" size="sm" className="text-xs uppercase tracking-wide" onClick={() => toggleSort("estimatedPrice")}>
                Est. Price <ArrowUpDown className="ml-1 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead className="text-xs uppercase tracking-wide">Notes</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                No items match your filters.
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((item) => (
              <TableRow key={item._id} className="border-border/40">
                <TableCell>
                  <div className="flex items-center gap-3">
                    {item.imageUrl ? (
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-sm border border-border">
                        <Image src={item.imageUrl} alt={`${item.brand} ${item.model}`} fill className="object-cover" style={{ objectPosition: `${item.imagePositionX ?? 50}% ${item.imagePosition ?? 0}%`, transform: `scale(${item.imageScale ?? 1})`, transformOrigin: `${item.imagePositionX ?? 50}% ${item.imagePosition ?? 0}%` }} />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-border bg-muted text-xs text-muted-foreground/30">
                        ◈
                      </div>
                    )}
                    <div>
                      <p
                        className="font-medium text-foreground"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {item.brand} {item.model}
                      </p>
                      {item.reference && (
                        <p className="font-mono text-[11px] text-muted-foreground">{item.reference}</p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[11px] tracking-wide">{item.watchType}</Badge>
                </TableCell>
                <TableCell>
                  <span className={`text-sm font-medium ${priorityStyles[item.priority]}`}>
                    {item.priority}
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono font-medium">
                  {formatCurrency(item.estimatedPrice)}
                </TableCell>
                <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                  {item.notes ?? "—"}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={<Button variant="ghost" size="icon" className="h-7 w-7" />}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(item)}>Edit</DropdownMenuItem>
                      {item.imageUrl && (
                        <DropdownMenuItem onClick={() => setCropTarget(item)}>
                          Adjust crop
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setDeleteTarget(item._id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {cropTarget?.imageUrl && (
        <CropEditorDialog
          open={!!cropTarget}
          onOpenChange={(o) => !o && setCropTarget(null)}
          src={cropTarget.imageUrl}
          alt={`${cropTarget.brand} ${cropTarget.model}`}
          positionX={cropTarget.imagePositionX ?? 50}
          positionY={cropTarget.imagePosition ?? 0}
          scale={cropTarget.imageScale ?? 1}
          onSave={(positionX, positionY, scale) => onSaveCrop(cropTarget._id, positionX, positionY, scale)}
        />
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from wishlist?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => { if (deleteTarget) { onDelete(deleteTarget); setDeleteTarget(null); } }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
