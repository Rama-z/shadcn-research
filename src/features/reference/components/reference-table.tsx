import React, { useState, useMemo } from "react";

import { Separator } from "@/components/ui/separator";
import { DateTimeRangePicker, type DateTimeRange } from "@/components/ui/date-time-range-picker";
import { IntegratedCams } from "./IntegratedCam";

// ─── Types ──────────────────────────────────────────
type TabKey = "integratedCam" | "configurationManagement";

// ─── Main component ─────────────────────────────────
export function ReferenceTable() {
  const [activeTab, setActiveTab] = useState<TabKey>("integratedCam");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "integratedCam", label: "Integrated Cam" },
    { key: "configurationManagement", label: "Configuration Management" },
  ];

  const [dateRange, setDateRange] = React.useState<DateTimeRange>({
    from: new Date(2026, 0, 20, 20, 0, 0),
    to: new Date(2026, 0, 24, 20, 0, 0),
  });

  const displayedDataQuality = useMemo(() => {
    switch (activeTab) {
      case "integratedCam":
        return <IntegratedCams />;

      case "configurationManagement":
        return <></>;

      default:
        return <></>;
    }
  }, [activeTab]);

  return (
    <div className="rounded-xl bg-card" id="data-quality-table">
      {/* ── Header: Title + Tabs + DatePicker ─────────── */}
      <div className="flex flex-col gap-4 px-6 pb-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-general-foreground">Reference</h2>
          {/* Tabs */}
          <div className="inline-flex items-center rounded-lg border border-border bg-muted/40 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  // setCurrentPage(1);
                }}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Date time range picker */}
          <DateTimeRangePicker value={dateRange} onChange={setDateRange} />
        </div>
      </div>

      <Separator className="mt-4" />

      {displayedDataQuality}
    </div>
  );
}
