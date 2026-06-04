export type TTableColumn<T> = {
  key: keyof T;
  label: string;
  className?: string;
};
