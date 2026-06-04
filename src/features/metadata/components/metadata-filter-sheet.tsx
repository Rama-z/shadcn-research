import { useState, useCallback } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { EMPTY_METADATA_FILTERS } from "@/shared/constant/filterContent";

// ─── Filter option definitions ──────────────────────
const FILTER_OPTIONS = {
  neName: {
    label: "NE Name",
    options: ["SkyWave", "Next Wave", "Virelia"],
  },
  neType: {
    label: "NE Type",
    options: ["Core", "Non-Core"],
  },
  vendor: {
    label: "Vendor",
    options: ["Ericsson", "Huawei", "ZTE"],
  },
  technology: {
    label: "Technology",
    options: ["2G", "4G", "5G"],
  },
} as const;

// ─── Types ──────────────────────────────────────────
export type FilterKey = keyof typeof FILTER_OPTIONS;

export interface MetadataFilters {
  neName: string[];
  neType: string[];
  vendor: string[];
  technology: string[];
}

interface MetadataFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: MetadataFilters;
  onApply: (filters: MetadataFilters) => void;
}

// ─── Component ──────────────────────────────────────
export function MetadataFilterSheet({
  open,
  onOpenChange,
  filters,
  onApply,
}: MetadataFilterSheetProps) {
  // Local draft state so changes aren't applied until user clicks "Apply"
  const [draft, setDraft] = useState<MetadataFilters>(filters);

  // Sync draft when the sheet opens
  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) setDraft(filters);
      onOpenChange(nextOpen);
    },
    [filters, onOpenChange]
  );

  // Toggle a single checkbox value
  const toggleValue = (key: FilterKey, value: string) => {
    setDraft((prev) => {
      const current = prev[key];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
  };

  const handleReset = () => {
    setDraft(EMPTY_METADATA_FILTERS);
  };

  const handleApply = () => {
    onApply(draft);
    onOpenChange(false);
  };

  const filterKeys = Object.keys(FILTER_OPTIONS) as FilterKey[];

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="m-5 flex h-[calc(100vh-2.5rem)] flex-col rounded-lg p-0 sm:max-w-md"
        showCloseButton
      >
        {/* ── Header ─────────────────────────────────── */}
        <SheetHeader className="px-4 pb-0 pt-4">
          <SheetTitle className="text-base font-semibold">Filters</SheetTitle>
          <SheetDescription>Filter the data based on your preferences</SheetDescription>
        </SheetHeader>

        {/* ── Body ───────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="flex flex-col gap-4">
            {filterKeys.map((key, idx) => {
              const group = FILTER_OPTIONS[key];
              return (
                <div key={key}>
                  {/* Separator between groups */}
                  {idx > 0 && <Separator className="mb-4" />}

                  {/* Group label */}
                  <Label className="mb-1 block text-sm font-medium text-foreground">
                    {group.label}
                  </Label>

                  {/* Checkbox list */}
                  <div className="mt-1 flex flex-col gap-1">
                    {group.options.map((option) => {
                      const checked = draft[key].includes(option);
                      const id = `filter-${key}-${option}`;
                      return (
                        <label
                          key={option}
                          htmlFor={id}
                          className="flex h-6 cursor-pointer items-center gap-2"
                        >
                          <Checkbox
                            id={id}
                            checked={checked}
                            onCheckedChange={() => toggleValue(key, option)}
                          />
                          <span className="text-sm text-muted-foreground">{option}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────── */}
        <SheetFooter className="flex-row justify-end gap-4 border-t px-4 py-4">
          <Button variant="outline" size="lg" onClick={handleReset}>
            Reset Filters
          </Button>
          <Button
            size="lg"
            className="bg-blue-950 text-neutral-50 hover:bg-blue-900"
            onClick={handleApply}
          >
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
