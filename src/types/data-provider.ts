export type BaseKey = string | number;

export interface BaseRecord {
  id?: BaseKey;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export type CrudOperators =
  | "eq"
  | "ne"
  | "eqs"
  | "nes"
  | "lt"
  | "gt"
  | "lte"
  | "gte"
  | "in"
  | "nin"
  | "ina"
  | "nina"
  | "contains"
  | "ncontains"
  | "containss"
  | "ncontainss"
  | "between"
  | "nbetween"
  | "null"
  | "nnull"
  | "startswith"
  | "nstartswith"
  | "startswiths"
  | "nstartswiths"
  | "endswith"
  | "nendswith"
  | "endswiths"
  | "nendswiths"
  | "or"
  | "and";

export interface CrudSort {
  field: string;
  order: "asc" | "desc";
}

export type LogicalFilter = {
  field: string;
  operator: Exclude<CrudOperators, "or" | "and">;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
};

export type ConditionalFilter = {
  key?: string;
  operator: Extract<CrudOperators, "or" | "and">;
  value: (LogicalFilter | ConditionalFilter)[];
};

export type CrudFilter = LogicalFilter | ConditionalFilter;

export interface Pagination {
  currentPage?: number;
  pageSize?: number;
  mode?: "client" | "server" | "off";
}

export type MetaQuery = Record<string, unknown>;

export interface HttpError extends Error {
  statusCode?: number;
  errors?: Record<string, string[] | string>;
}

export type CustomResponseType =
  | "arraybuffer"
  | "blob"
  | "document"
  | "formdata"
  | "json"
  | "stream"
  | "text";

export interface GetListParams {
  resource: string;
  pagination?: Pagination;
  filters?: CrudFilter[];
  sorters?: CrudSort[];
  meta?: MetaQuery;
  dataProviderName?: string;
}

export interface GetOneParams {
  resource: string;
  id: BaseKey;
  meta?: MetaQuery;
  dataProviderName?: string;
}

export interface GetManyParams {
  resource: string;
  ids: BaseKey[];
  meta?: MetaQuery;
  dataProviderName?: string;
}

export interface CreateParams<TVariables = unknown> {
  resource: string;
  variables: TVariables;
  meta?: MetaQuery;
  dataProviderName?: string;
}

export interface CreateManyParams<TVariables = unknown> {
  resource: string;
  variables: TVariables[];
  meta?: MetaQuery;
  dataProviderName?: string;
}

export interface UpdateParams<TVariables = unknown> {
  resource: string;
  id: BaseKey;
  variables: TVariables;
  meta?: MetaQuery;
  dataProviderName?: string;
}

export interface UpdateManyParams<TVariables = unknown> {
  resource: string;
  ids: BaseKey[];
  variables: TVariables;
  meta?: MetaQuery;
  dataProviderName?: string;
}

export interface DeleteOneParams<TVariables = unknown> {
  resource: string;
  id: BaseKey;
  variables?: TVariables;
  meta?: MetaQuery;
  dataProviderName?: string;
}

export interface DeleteManyParams<TVariables = unknown> {
  resource: string;
  ids: BaseKey[];
  variables?: TVariables;
  meta?: MetaQuery;
  dataProviderName?: string;
}

export interface CustomParams<TQuery = unknown, TPayload = unknown> {
  url: string;
  method: "get" | "delete" | "head" | "options" | "post" | "put" | "patch";
  sorters?: CrudSort[];
  filters?: CrudFilter[];
  payload?: TPayload;
  query?: TQuery;
  headers?: Record<string, string>;
  responseType?: CustomResponseType;
  meta?: MetaQuery;
}

export interface ApiResponse<T = BaseRecord> {
  data: T;
  status: string;
  message: string;
}

export interface GetListResponse<TData extends BaseRecord = BaseRecord> {
  data: TData[];
  total: number;
  status?: string;
  message?: string;
}

export type GetManyResponse<TData extends BaseRecord = BaseRecord> = ApiResponse<TData[]>;

export type GetOneResponse<TData extends BaseRecord = BaseRecord> = ApiResponse<TData>;

export type CreateResponse<TData extends BaseRecord = BaseRecord> = ApiResponse<TData>;

export type CreateManyResponse<TData extends BaseRecord = BaseRecord> = ApiResponse<TData[]>;

export type UpdateResponse<TData extends BaseRecord = BaseRecord> = ApiResponse<TData>;

export type UpdateManyResponse<TData extends BaseRecord = BaseRecord> = ApiResponse<TData[]>;

export type DeleteOneResponse<TData extends BaseRecord = BaseRecord> = ApiResponse<TData>;

export type DeleteManyResponse<TData extends BaseRecord = BaseRecord> = ApiResponse<TData[]>;

export type CustomResponse<TData = BaseRecord> = TData extends ArrayBuffer | Blob | string
  ? TData
  : ApiResponse<TData>;

export type DataProvider = {
  getList: <TData extends BaseRecord = BaseRecord>(
    params: GetListParams & { id?: BaseKey } // Allow id for custom nested resource routing
  ) => Promise<GetListResponse<TData>>;
  getMany?: <TData extends BaseRecord = BaseRecord>(
    params: GetManyParams
  ) => Promise<GetManyResponse<TData>>;
  getOne: <TData extends BaseRecord = BaseRecord>(
    params: GetOneParams
  ) => Promise<GetOneResponse<TData>>;
  create: <TData extends BaseRecord = BaseRecord, TVariables = unknown>(
    params: CreateParams<TVariables>
  ) => Promise<CreateResponse<TData>>;
  createMany?: <TData extends BaseRecord = BaseRecord, TVariables = unknown>(
    params: CreateManyParams<TVariables>
  ) => Promise<CreateManyResponse<TData>>;
  update: <TData extends BaseRecord = BaseRecord, TVariables = unknown>(
    params: UpdateParams<TVariables>
  ) => Promise<UpdateResponse<TData>>;
  updateMany?: <TData extends BaseRecord = BaseRecord, TVariables = unknown>(
    params: UpdateManyParams<TVariables>
  ) => Promise<UpdateManyResponse<TData>>;
  deleteOne: <TData extends BaseRecord = BaseRecord, TVariables = unknown>(
    params: DeleteOneParams<TVariables>
  ) => Promise<DeleteOneResponse<TData>>;
  deleteMany?: <TData extends BaseRecord = BaseRecord, TVariables = unknown>(
    params: DeleteManyParams<TVariables>
  ) => Promise<DeleteManyResponse<TData>>;
  getApiUrl: () => string;
  custom?: <TData = BaseRecord, TQuery = unknown, TPayload = unknown>(
    params: CustomParams<TQuery, TPayload>
  ) => Promise<CustomResponse<TData>>;
};
