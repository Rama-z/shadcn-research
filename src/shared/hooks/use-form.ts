import { zodResolver } from "@hookform/resolvers/zod";
import type { UseMutationResult, UseQueryOptions } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";
import {
  type DefaultValues,
  type FieldValues,
  type Path,
  type Resolver,
  type SubmitHandler,
  useForm as useHookForm,
  type UseFormProps,
  type UseFormReturn,
} from "react-hook-form";

import { useCreate, useOne, useUpdate } from "@/shared/hooks/use-crud";
import { useParsed, useRouter } from "@/shared/hooks/use-router";
import type {
  BaseRecord,
  CreateResponse,
  GetOneResponse,
  HttpError,
  UpdateResponse,
} from "@/types/data-provider";

export interface UseFormConfig<
  TVariables extends FieldValues = FieldValues,
  TQueryFnData extends BaseRecord = BaseRecord,
  TError = HttpError,
  TResponse = CreateResponse<TQueryFnData> | UpdateResponse<TQueryFnData>,
  TMutationVariables = TVariables,
> extends UseFormProps<TVariables> {
  resource?: string;
  action?: "create" | "edit";
  id?: string | number;
  meta?: Record<string, unknown>;
  schema?: Parameters<typeof zodResolver>[0];
  redirect?: boolean | string;
  successNotification?: { message?: string; description?: string } | false;
  onSuccess?: (data: TResponse, variables: TMutationVariables, context: unknown) => void;
  onError?: (error: TError) => void;
  mapVariables?: (variables: TVariables) => TMutationVariables;
  queryOptions?: Partial<
    UseQueryOptions<GetOneResponse<TQueryFnData>, TError, GetOneResponse<TQueryFnData>>
  >;
  mutationOptions?: object;
  mutation?: UseMutationResult<TResponse, TError, TMutationVariables, unknown>;
  initData?: boolean;
}

export interface UseFormReturnType<
  TVariables extends FieldValues = FieldValues,
  TQueryFnData extends BaseRecord = BaseRecord,
  TError = HttpError,
  TResponse = CreateResponse<TQueryFnData> | UpdateResponse<TQueryFnData>,
  TMutationVariables = TVariables,
> extends UseFormReturn<TVariables> {
  formLoading: boolean;
  onFinish: (e?: React.BaseSyntheticEvent) => Promise<void>;
  mutationResult: UseMutationResult<TResponse, TError, TMutationVariables, unknown>;
  onError?: (error: TError) => void;
  saveButtonProps: {
    disabled: boolean;
    loading: boolean;
    onClick: () => void;
  };
}

export const useForm = <
  TVariables extends FieldValues = FieldValues,
  TQueryFnData extends BaseRecord = BaseRecord,
  TError = HttpError,
  TResponse = CreateResponse<TQueryFnData> | UpdateResponse<TQueryFnData>,
  TMutationVariables = TVariables,
>({
  resource: resourceFromProps,
  action: actionFromProps,
  id: idFromProps,
  meta,
  schema,
  defaultValues,
  redirect = true,
  onSuccess,
  queryOptions,
  mutationOptions,
  onError,
  mapVariables,
  initData = true,
  ...props
}: UseFormConfig<
  TVariables,
  TQueryFnData,
  TError,
  TResponse,
  TMutationVariables
>): UseFormReturnType<TVariables, TQueryFnData, TError, TResponse, TMutationVariables> => {
  const router = useRouter();
  const parsed = useParsed();

  const resource = resourceFromProps || parsed.resource;
  const action = actionFromProps || (parsed.action as "create" | "edit");
  const id = idFromProps || "";

  const resolver = useMemo(() => (schema ? zodResolver(schema) : undefined), [schema]);

  const form = useHookForm<TVariables>({
    defaultValues,
    resolver: resolver as unknown as Resolver<TVariables>,
    ...props,
  });

  const queryResult = useOne<TQueryFnData, TError>({
    resource: resource || "",
    id: id || "",
    meta,
    queryOptions: {
      enabled: action === "edit" && !!id,
      ...queryOptions,
    },
  });

  const createMutation = useCreate<TQueryFnData, TError, TVariables>();
  const updateMutation = useUpdate<TQueryFnData, TError, TVariables>();

  type MutationVariables =
    | TVariables
    | TMutationVariables
    | {
        resource?: string;
        variables: TVariables;
        meta?: Record<string, unknown>;
      }
    | {
        resource: string;
        id: string | number;
        variables: TVariables;
        meta?: Record<string, unknown>;
      }
    | void;

  const mutation = (props.mutation ||
    (action === "create" ? createMutation : updateMutation)) as UseMutationResult<
    TResponse,
    TError,
    TMutationVariables,
    unknown
  >;

  useEffect(() => {
    if (initData && action === "edit" && queryResult.data?.data) {
      form.reset(queryResult.data.data as unknown as DefaultValues<TVariables>);
    }
  }, [action, queryResult.data, form, initData]);

  const onFinish: SubmitHandler<TVariables> = useCallback(
    async (values) => {
      try {
        const mappedValues = mapVariables ? mapVariables(values) : values;

        const mutationVariables: MutationVariables = props.mutation
          ? (mappedValues as TMutationVariables)
          : {
              resource,
              id,
              variables: mappedValues as TVariables,
              meta,
            };

        return await mutation.mutateAsync(mutationVariables as unknown as TMutationVariables, {
          onSuccess: (data: TResponse, variables: TMutationVariables, context: unknown) => {
            if (onSuccess) {
              const hookVariables =
                variables && typeof variables === "object" && "variables" in variables
                  ? (variables as Record<string, unknown>).variables
                  : variables;
              onSuccess(data, hookVariables as TMutationVariables, context);
            }

            if (redirect) {
              const path =
                typeof redirect === "string" ? redirect : resource ? `/${resource}` : "/";
              router.navigate({ to: path });
            }
          },
          onError: (error: TError) => {
            if (onError) {
              onError(error);
            } else {
              const validationErrors = (error as HttpError)?.errors;
              if (validationErrors) {
                Object.entries(validationErrors).forEach(([key, value]) => {
                  form.setError(key as Path<TVariables>, {
                    type: "server",
                    message: Array.isArray(value) ? value.join(", ") : (value as string),
                  });
                });
              }

              console.error("Mutation failed:", error);
            }
          },
          ...mutationOptions,
        });
      } catch (error: unknown) {
        if (onError && !mutation.isError) {
          onError(error as TError);
        }
        throw error;
      }
    },
    [
      mapVariables,
      props.mutation,
      resource,
      id,
      meta,
      mutation,
      onSuccess,
      redirect,
      router,
      onError,
      mutationOptions,
      form,
    ]
  );

  const formLoading = queryResult.isLoading || mutation.isPending;

  const handleSubmit = useMemo(() => form.handleSubmit(onFinish), [form, onFinish]);

  return useMemo(
    () =>
      ({
        ...form,
        formLoading,
        onFinish: handleSubmit,
        mutationResult: mutation,
        saveButtonProps: {
          disabled: formLoading,
          loading: formLoading,
          onClick: handleSubmit,
        },
      }) as unknown as UseFormReturnType<
        TVariables,
        TQueryFnData,
        TError,
        TResponse,
        TMutationVariables
      >,
    [form, formLoading, handleSubmit, mutation]
  );
};
