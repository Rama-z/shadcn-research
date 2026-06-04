import * as Components from "@/components";
import {
  IDataQualityRow,
  Reference2GNetworkColumns,
  DATA_QUALITY_FILTER_OPTIONS,
  EMPTY_DATA_QUALITY_FILTERS,
} from "@/shared";

type SortDir = "asc" | "desc" | null;

export function IntegratedCams({
  sort,
  handleSort,
  searchQuery,
  setSearchQuery,
  currentPage,
  setCurrentPage,
  rowsPerPage,
  setRowsPerPage,
  getPageNumbers,
  pagedData,
  totalPages,
}: {
  sort: { key: string; dir: SortDir };
  handleSort: (key: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  currentPage: number;
  setCurrentPage: (value: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (value: number) => void;
  getPageNumbers: () => (number | "ellipsis")[];
  pagedData: IDataQualityRow[];
  totalPages: number;
}) {
  return (
    <div>
      {/* Tabs Line */}
      <Components.Tabs defaultValue="2G">
        <Components.TabsList variant="line">
          <Components.TabsTrigger value="2G">2G Network</Components.TabsTrigger>
          <Components.TabsTrigger value="4G">4G Network</Components.TabsTrigger>
          <Components.TabsTrigger value="5G">5G Network</Components.TabsTrigger>
        </Components.TabsList>
      </Components.Tabs>

      {/* ── Toolbar: Search + Filter ─────────────────── */}
      <Components.EstablishedTable
        emptyFilter={EMPTY_DATA_QUALITY_FILTERS}
        filterOptions={DATA_QUALITY_FILTER_OPTIONS}
        columns={Reference2GNetworkColumns}
        sort={sort}
        handleSort={handleSort}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        getPageNumbers={getPageNumbers}
        pagedData={pagedData}
        totalPages={totalPages}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </div>
  );
}
