import axios from "axios";

import { API_ENDPOINTS } from "@/shared";

const axiosInstance = axios.create();

const USER_API_URL = import.meta.env.VITE_USER_API_URL;
const LICENSE_API_URL = import.meta.env.VITE_LICENSE_API_URL;

axiosInstance.interceptors.request.use(
  (config) => {
    const url = config.url || "";

    if (url.startsWith("user/api/") || url.startsWith("/user/api/")) {
      config.baseURL = USER_API_URL;
    } else if (url.startsWith("v1/") || url.startsWith("/v1/")) {
      config.baseURL = LICENSE_API_URL;
    } else {
      config.baseURL = import.meta.env.VITE_API_URL;
    }

    const isPublicEndpoint = config.url?.includes("/public/");
    const auth = localStorage.getItem("auth");

    if (auth) {
      try {
        const parsedAuth = JSON.parse(auth);
        if (parsedAuth?.token) {
          config.headers.Authorization = `Bearer ${parsedAuth.token}`;
        } else if (!isPublicEndpoint) {
          return Promise.reject(new Error("No auth token found. Request prevented."));
        }
      } catch {
        localStorage.removeItem("auth");
        if (!isPublicEndpoint) {
          return Promise.reject(new Error("Invalid auth data. Request prevented."));
        }
      }
    } else if (!isPublicEndpoint) {
      return Promise.reject(new Error("No auth string found in local storage. Request prevented."));
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 401 || error.statusCode === 401) &&
      originalRequest &&
      !originalRequest._isRetry &&
      !originalRequest.url?.includes(API_ENDPOINTS.AUTH.RE_REQUEST_TOKEN)
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._isRetry = true;
      isRefreshing = true;

      const authData = localStorage.getItem("auth");
      const parsedAuth = authData ? JSON.parse(authData) : null;
      const refreshToken = parsedAuth?.refreshToken;

      if (!refreshToken) {
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(API_ENDPOINTS.AUTH.RE_REQUEST_TOKEN, null, {
          baseURL: USER_API_URL,
          params: { refreshToken },
        });

        const newAccessToken =
          response.data?.accessToken ||
          response.data?.data?.accessToken ||
          response.data?.token ||
          response.data?.data?.token;

        const newRefreshToken = response.data?.refreshToken || response.data?.data?.refreshToken;

        if (newAccessToken) {
          localStorage.setItem(
            "auth",
            JSON.stringify({
              ...parsedAuth,
              token: newAccessToken,
              refreshToken: newRefreshToken || refreshToken,
            })
          );

          processQueue(null, newAccessToken);

          // If the URL passes bearerToken directly (like in check session), we must swap it out too!
          if (originalRequest.url?.includes("bearerToken=")) {
            originalRequest.url = originalRequest.url.replace(
              /bearerToken=[^&]+/,
              `bearerToken=${newAccessToken}`
            );
          }

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } else {
          processQueue(new Error("Token refresh response missing token."));
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    const customError = {
      ...error,
      message: error.response?.data?.message || error.message || "An unexpected error occurred",
      statusCode: error.response?.status || error.statusCode || 500,
      errors: error.response?.data?.errors,
    };

    return Promise.reject(customError);
  }
);

export { axiosInstance };
