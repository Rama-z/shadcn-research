import {
  IReference2GNetwork,
  IReference4GNetwork,
  IReference5GNetwork,
} from "../types/columnsTypes";

export const Reference2GNetworkColumns: {
  key: keyof IReference2GNetwork;
  label: string;
  className?: string;
}[] = [
  { key: "no", label: "No" },
  { key: "id", label: "ID" },
  { key: "date", label: "Date" },
  { key: "vendor", label: "Vendor" },
  { key: "cellName", label: "Cell Name" },
  { key: "siteId", label: "Site ID" },
  { key: "siteName", label: "Site Name" },
  { key: "bscName", label: "BSC Name" },
  { key: "lac", label: "LAC" },
  { key: "ci", label: "CI" },
  { key: "neId", label: "NE ID" },
  { key: "cellNameAlias", label: "Cell Name Alias" },
  { key: "lastUpdate", label: "Last Update" },
  { key: "meId", label: "ME ID" },
];

export const Reference4GNetworkColumns: {
  key: keyof IReference4GNetwork;
  label: string;
  className?: string;
}[] = [
  { key: "no", label: "No" },
  { key: "id", label: "ID" },
  { key: "date", label: "Date" },
  { key: "vendor", label: "Vendor" },
  { key: "cellName", label: "Cell Name" },
  { key: "siteId", label: "Site ID" },
  { key: "siteName", label: "Site Name" },
  { key: "enodebId", label: "ENodeb ID" },
  { key: "enodebName", label: "ENodeb Name" },
  { key: "tac", label: "TAC" },
  { key: "ci", label: "CI" },
  { key: "neId", label: "NE ID" },
  { key: "cellNameAlias", label: "Cell Name Alias" },
  { key: "lastUpdate", label: "Last Update" },
];

export const Reference5GNetworkColumns: {
  key: keyof IReference5GNetwork;
  label: string;
  className?: string;
}[] = [
  { key: "no", label: "No" },
  { key: "id", label: "ID" },
  { key: "date", label: "Date" },
  { key: "vendor", label: "Vendor" },
  { key: "cellName", label: "Cell Name" },
  { key: "siteId", label: "Site ID" },
  { key: "siteName", label: "Site Name" },
  { key: "enodebId", label: "ENodeb ID" },
  { key: "enodebName", label: "ENodeb Name" },
  { key: "tac", label: "TAC" },
  { key: "ci", label: "CI" },
  { key: "neId", label: "NE ID" },
  { key: "cellNameAlias", label: "Cell Name Alias" },
  { key: "lastUpdate", label: "Last Update" },
];
