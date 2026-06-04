// Type data untuk column yang dibuat di constant

export interface IDataQualityRow {
  id: number;
  date: string;
  ipAddress: string;
  region: string;
  vendor: string;
  neType: string;
  technology: string;
  rules: string;
  totalFiles: number;
  category: string;
  completion: number;
}

export interface IReference2GNetwork {
  no: number;
  id: string | number;
  date: string;
  vendor: string;
  cellName: string;
  siteId: string;
  siteName: string;
  bscName: string;
  lac: string;
  ci: string;
  neId: string;
  cellNameAlias: string;
  lastUpdate: string;
  meId: number;
}

export interface IReference4GNetwork {
  no: number;
  id: string | number;
  date: string;
  vendor: string;
  cellName: string;
  siteId: string;
  siteName: string;
  enodebId: string;
  enodebName: string;
  tac: string;
  ci: string;
  neId: string;
  cellNameAlias: string;
  lastUpdate: string;
}

export interface IReference5GNetwork {
  no: number;
  id: string | number;
  date: string;
  vendor: string;
  cellName: string;
  siteId: string;
  siteName: string;
  enodebId: string;
  enodebName: string;
  tac: string;
  ci: string;
  neId: string;
  cellNameAlias: string;
  lastUpdate: string;
}
