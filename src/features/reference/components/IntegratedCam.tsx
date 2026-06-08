import * as React from "react";

import * as Shared from "@/shared";
import * as Components from "@/components";

export function IntegratedCams() {
  // handle tab change using useState and switch case
  const [activeTab, setActiveTab] = React.useState<"2G" | "4G" | "5G">("2G");

  const handleTabChange = (value: "2G" | "4G" | "5G") => {
    setActiveTab(value);
  };

  // handle column based on selected tab
  const columns = React.useMemo(() => {
    switch (activeTab) {
      case "2G":
        return Shared.Reference2GNetworkColumns;
      case "4G":
        return Shared.Reference4GNetworkColumns;
      case "5G":
        return Shared.Reference5GNetworkColumns;
      default:
        return Shared.Reference2GNetworkColumns;
    }
  }, [activeTab]);

  // handle filter options based on selected tab
  const filterOptions = React.useMemo(() => {
    switch (activeTab) {
      case "2G":
        return Shared.DATA_REFERENCE_2G_FILTER_OPTIONS;
      case "4G":
        return Shared.DATA_REFERENCE_4G_FILTER_OPTIONS;
      case "5G":
        return Shared.DATA_REFERENCE_5G_FILTER_OPTIONS;
      default:
        return Shared.DATA_REFERENCE_2G_FILTER_OPTIONS;
    }
  }, [activeTab]);

  // handle filter empty based on selected tab
  const emptyFilter = React.useMemo(() => {
    switch (activeTab) {
      case "2G":
        return Shared.EMPTY_DATA_REFERENCE_2G_FILTERS;
      case "4G":
        return Shared.EMPTY_DATA_REFERENCE_4G_FILTERS;
      case "5G":
        return Shared.EMPTY_DATA_REFERENCE_5G_FILTERS;
      default:
        return Shared.EMPTY_DATA_REFERENCE_2G_FILTERS;
    }
  }, [activeTab]);

  return (
    <div>
      {/* Tabs Line */}
      <Components.Tabs defaultValue="2G" className="px-6">
        <Components.TabsList variant="line">
          <Components.TabsTrigger value="2G" onClick={() => handleTabChange("2G")}>
            2G Network
          </Components.TabsTrigger>
          <Components.TabsTrigger value="4G" onClick={() => handleTabChange("4G")}>
            4G Network
          </Components.TabsTrigger>
          <Components.TabsTrigger value="5G" onClick={() => handleTabChange("5G")}>
            5G Network
          </Components.TabsTrigger>
        </Components.TabsList>
      </Components.Tabs>

      {/* ── Toolbar: Search + Filter ─────────────────── */}
      <Components.EstablishedTable
        showTableOptions
        emptyFilter={emptyFilter}
        filterOptions={filterOptions}
        columns={columns}
      />
    </div>
  );
}
