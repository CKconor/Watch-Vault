import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import type { CostPerWear } from "@/lib/analytics";

export function CostPerWearTable({ data }: { data: CostPerWear[] }) {
  if (data.length === 0) {
    return <p className="py-6 text-center text-sm text-muted-foreground">No data yet.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Watch</TableHead>
          <TableHead className="text-right">Wears</TableHead>
          <TableHead className="text-right">Purchase</TableHead>
          <TableHead className="text-right">Cost/Wear</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.watchId}>
            <TableCell>
              <div>
                <p className="font-medium">{row.watchName}</p>
                <p className="text-xs text-muted-foreground">{row.brand}</p>
              </div>
            </TableCell>
            <TableCell className="text-right">{row.wearCount}</TableCell>
            <TableCell className="text-right">{formatCurrency(row.purchasePrice)}</TableCell>
            <TableCell className="text-right font-medium">
              {row.wearCount > 0 ? formatCurrency(row.costPerWear) : "—"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
