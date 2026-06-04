import * as Components from "@/components";

import useEstablishedTable from "../hooks";
import { IFilterSheetProps } from "../types";

export function FilterSheet({ ...props }: IFilterSheetProps) {
  const { handleApply, handleOpenChange, handleReset, filterKeys, draft, toggleValue } =
    useEstablishedTable({ ...props });

  return (
    <Components.Sheet open={props.open} onOpenChange={handleOpenChange}>
      <Components.SheetContent
        side="right"
        className="m-5 flex h-[calc(100vh-2.5rem)] flex-col rounded-lg p-0 sm:max-w-md"
        showCloseButton
      >
        {/* ── Header ─────────────────────────────────── */}
        <Components.SheetHeader className="px-4 pb-0 pt-4">
          <Components.SheetTitle className="text-base font-semibold">Filters</Components.SheetTitle>
          <Components.SheetDescription>
            Filter the data based on your preferences
          </Components.SheetDescription>
        </Components.SheetHeader>

        {/* ── Body ───────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="flex flex-col gap-4">
            {filterKeys.map((key, idx) => {
              const group = props.filterOptions[key];
              console.log(group);
              return (
                <div key={key}>
                  {/* Separator between groups */}
                  {idx > 0 && <Components.Separator className="mb-4" />}

                  {/* Group label */}
                  <Components.Label className="mb-1 block text-sm font-medium text-foreground">
                    {group.label}
                  </Components.Label>

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
                          <Components.Checkbox
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
        <Components.SheetFooter className="flex-row justify-end gap-4 border-t px-4 py-4">
          <Components.Button variant="outline" size="lg" onClick={handleReset}>
            Reset Filters
          </Components.Button>
          <Components.Button
            size="lg"
            className="bg-blue-950 text-neutral-50 hover:bg-blue-900"
            onClick={handleApply}
          >
            Apply Filters
          </Components.Button>
        </Components.SheetFooter>
      </Components.SheetContent>
    </Components.Sheet>
  );
}
