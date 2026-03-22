"use client";

import { useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { WearChart } from "./wear-chart";
import { StrapBreakdownPanel } from "./strap-breakdown";
import { CostPerWearTable } from "./cost-per-wear-table";
import { WearTrendsChart } from "./wear-trends-chart";
import { mostWorn, strapBreakdown, calcCostPerWear, wearsByMonth } from "@/lib/analytics";
import type { Watch, WearLogEntry } from "@/lib/types";

interface AnalyticsPanelProps {
  watches: Watch[];
  wearLog: WearLogEntry[];
}

export function AnalyticsPanel({ watches, wearLog }: AnalyticsPanelProps) {
  const wearCounts = useMemo(() => mostWorn(watches, wearLog), [watches, wearLog]);
  const straps = useMemo(() => strapBreakdown(wearLog), [wearLog]);
  const cpw = useMemo(() => calcCostPerWear(watches, wearLog), [watches, wearLog]);
  const trends = useMemo(() => wearsByMonth(wearLog), [wearLog]);

  if (watches.length === 0) return null;

  return (
    <div className="mt-12 border-t border-border/50 pt-8">
      <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Analytics
      </p>
      <Accordion defaultValue={["wear"]}>
        <AccordionItem value="wear" className="border-border/50">
          <AccordionTrigger
            className="text-base font-normal hover:no-underline"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Most Worn
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4">
              <WearChart data={wearCounts} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="strap" className="border-border/50">
          <AccordionTrigger
            className="text-base font-normal hover:no-underline"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Strap Usage
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4">
              <StrapBreakdownPanel data={straps} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="trends" className="border-border/50">
          <AccordionTrigger
            className="text-base font-normal hover:no-underline"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Wear Trends
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4">
              <WearTrendsChart data={trends} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="cpw" className="border-border/50">
          <AccordionTrigger
            className="text-base font-normal hover:no-underline"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Cost Per Wear
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4">
              <CostPerWearTable data={cpw} />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
