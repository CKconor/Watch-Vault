"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { StrapBadge } from "./strap-badge";
import { formatDate } from "@/lib/utils";
import type { WearLogEntry } from "@/lib/types";

interface WearHistoryProps {
  entries: WearLogEntry[];
  onRemove: (id: string) => void;
}

export function WearHistory({ entries, onRemove }: WearHistoryProps) {
  if (entries.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No wear history yet. Log a day from the calendar above.
      </p>
    );
  }

  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Strap</TableHead>
          <TableHead>Notes</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((entry) => (
          <TableRow key={entry._id}>
            <TableCell className="font-medium">{formatDate(entry.date)}</TableCell>
            <TableCell>
              <StrapBadge strapType={entry.strapType} />
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">{entry.notes ?? "—"}</TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Remove entry"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={() => onRemove(entry._id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
