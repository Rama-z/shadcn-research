import { useState, useCallback } from "react";

import { TFilterKey } from "./types";
import { TFilterOptions, TFilters } from "@/shared";

const useEstablishedTable = ({ ...props }: any) => {
  // Local draft state so changes aren't applied until user clicks "Apply"
  const [draft, setDraft] = useState<TFilters<TFilterOptions>>(props.emptyFilter);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [filters, setFilters] = useState<TFilters<TFilterOptions>>();

  // Sync draft when the sheet opens
  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) setDraft(props.filters);
      props.onOpenChange(nextOpen);
    },
    [props]
  );

  // Toggle a single checkbox value
  const toggleValue = (key: TFilterKey, value: string) => {
    setDraft((prev) => {
      const current = prev[key];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
  };

  const handleReset = () => {
    setDraft(props.emptyFilter);
  };

  const handleApply = () => {
    props.onApply(draft);
    props.onOpenChange(false);
  };

  const filterKeys = Object.keys(props.filterOptions) as TFilterKey[];
  return {
    draft,
    filters,
    setDraft,
    setFilters,
    filterKeys,
    toggleValue,
    handleReset,
    handleApply,
    handleOpenChange,
    setFilterSheetOpen,
    filterSheetOpen,
  };
};

export default useEstablishedTable;
