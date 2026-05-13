import { API_ENDPOINTS } from "./constant/apiEndpoints";
import {
  useOne,
  useList,
  useDelete,
  useUpdate,
  useCreate,
  useCustomMutation,
} from "./hooks/use-crud";
import { useDebounce } from "./hooks/use-debounce";
import { useForm } from "./hooks/use-form";
import { useMediaQuery } from "./hooks/use-media-query";
import { usePermission } from "./hooks/use-permission";
import { useParsed, useRouter } from "./hooks/use-router";

export { API_ENDPOINTS };

export {
  useOne,
  useForm,
  useList,
  useParsed,
  useRouter,
  useCreate,
  useDelete,
  useUpdate,
  useDebounce,
  usePermission,
  useMediaQuery,
  useCustomMutation,
};
