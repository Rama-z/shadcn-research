import { useState, useCallback, useRef } from "react";
import { GripVertical } from "lucide-react";

import * as Components from "@/components";
import { TTableColumn } from "@/shared";

import { ITableOptionsProps } from "../types";

export function TableOptions<T>({ open, onOpenChange, columns, onApply }: ITableOptionsProps<T>) {
  // Draft state: array of { column, visible } to track visibility & order
  const [draft, setDraft] = useState(() => columns.map((col) => ({ ...col, visible: true })));

  console.log(draft);

  // Drag state
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // Sync draft when the sheet opens
  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        setDraft((prev) => {
          // Merge: keep existing order/visibility, add new columns at end
          const prevKeys = new Set(prev.map((p) => p.key));
          const newCols = columns
            .filter((c) => !prevKeys.has(c.key))
            .map((c) => ({ ...c, visible: true }));
          // Keep items that still exist in columns
          const colKeys = new Set(columns.map((c) => c.key));
          const kept = prev.filter((p) => colKeys.has(p.key));
          return [...kept, ...newCols];
        });
      }
      onOpenChange(nextOpen);
    },
    [columns, onOpenChange]
  );

  // Toggle column visibility
  const toggleColumn = (key: keyof T) => {
    setDraft((prev) =>
      prev.map((item) => (item.key === key ? { ...item, visible: !item.visible } : item))
    );
  };

  // Drag handlers
  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const from = dragItem.current;
    const to = dragOverItem.current;
    if (from === to) {
      dragItem.current = null;
      dragOverItem.current = null;
      return;
    }

    setDraft((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated;
    });

    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleReset = () => {
    setDraft(columns.map((col) => ({ ...col, visible: true })));
  };

  const handleApply = () => {
    // Only pass back visible columns in current order
    const visibleColumns = draft
      .filter((item) => item.visible)
      .map(({ visible: _, ...col }) => col as TTableColumn<T>);
    onApply(visibleColumns);
    onOpenChange(false);
  };

  return (
    <Components.Sheet open={open} onOpenChange={handleOpenChange}>
      <Components.SheetContent
        side="right"
        className="m-5 flex h-[calc(100vh-2.5rem)] flex-col rounded-lg p-0 sm:max-w-md"
        showCloseButton
      >
        {/* ── Header ─────────────────────────────────── */}
        <Components.SheetHeader className="px-6 pb-0 pt-6">
          <Components.SheetTitle className="text-base font-semibold">
            Configure Column
          </Components.SheetTitle>
          <Components.SheetDescription className="text-sm text-muted-foreground">
            Choose which column to display
          </Components.SheetDescription>
        </Components.SheetHeader>

        {/* ── Body ───────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="flex flex-col gap-3">
            {draft.map((item, index) => {
              const id = `col-toggle-${String(item.key)}`;
              return (
                <div
                  key={String(item.key)}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnter={() => handleDragEnter(index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  className="flex cursor-grab items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 transition-colors hover:border-foreground/20 hover:bg-muted/40 active:cursor-grabbing"
                >
                  {/* Drag handle */}
                  <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/60" />

                  {/* Column label */}
                  <span className="flex-1 text-sm font-medium text-foreground">{item.label}</span>

                  {/* Visibility checkbox */}
                  <Components.Checkbox
                    id={id}
                    checked={item.visible}
                    onCheckedChange={() => toggleColumn(item.key)}
                    className="shrink-0"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────── */}
        <Components.SheetFooter className="flex-row justify-end gap-4 border-t px-6 py-4">
          <Components.Button variant="outline" size="lg" onClick={handleReset}>
            Reset
          </Components.Button>
          <Components.Button
            size="lg"
            className="bg-blue-950 text-neutral-50 hover:bg-blue-900"
            onClick={handleApply}
          >
            Apply
          </Components.Button>
        </Components.SheetFooter>
      </Components.SheetContent>
    </Components.Sheet>
  );
}
