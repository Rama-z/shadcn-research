import * as Components from "@/components";
import {
  DATA_QUALITY_FILTER_OPTIONS,
  EMPTY_DATA_QUALITY_FILTERS,
  Reference4GNetworkColumns,
} from "@/shared";

export function ConfigurationManagement() {
  return (
    <Components.EstablishedTable
      showTableOptions
      emptyFilter={EMPTY_DATA_QUALITY_FILTERS}
      filterOptions={DATA_QUALITY_FILTER_OPTIONS}
      columns={Reference4GNetworkColumns}
    />
  );
}
