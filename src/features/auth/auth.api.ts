// src/features/auth/auth.api.ts
import axios from "axios";
import { axiosInstance } from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constant/apiEndpoints";
import type { LoginPayload, LoginResponse, User } from "./auth.types";

export async function login(payload: LoginPayload) {
  const response = await axiosInstance.post<LoginResponse>("/user/api/v1/public/login", payload);

  return response.data;
}

export async function logout(payload: any) {
  const response = await axiosInstance.post("/user/api/v1/public/logout", payload);

  return response.data;
}

export async function getMe() {
  const response = await axiosInstance.get<User>("/auth/me");

  return response.data;
}

/**
 * Attempt to refresh the session using the refreshToken stored in localStorage.
 * Uses a plain axios instance (not axiosInstance) to avoid triggering the
 * auth interceptor which would reject requests without a valid token.
 * Returns the new token data on success, or throws on failure.
 */
export async function refreshSession(): Promise<LoginResponse["data"]> {
  const authData = localStorage.getItem("auth");
  if (!authData) {
    throw new Error("No auth data in localStorage");
  }

  const parsed = JSON.parse(authData);
  const refreshToken = parsed?.refreshToken;

  if (!refreshToken) {
    throw new Error("No refreshToken found");
  }

  const API_URL = import.meta.env.VITE_API_URL;

  const response = await axios.post(
    API_ENDPOINTS.AUTH.RE_REQUEST_TOKEN,
    null,
    { baseURL: API_URL, params: { refreshToken } }
  );

  const data = response.data?.data ?? response.data;

  // Update tokens in localStorage
  const newToken = data.accessToken || data.token;
  const newRefreshToken = data.refreshToken || refreshToken;

  if (!newToken) {
    throw new Error("Refresh response missing token");
  }

  localStorage.setItem(
    "auth",
    JSON.stringify({
      ...parsed,
      token: newToken,
      refreshToken: newRefreshToken,
    })
  );

  return data;
}

/**
 * Check if the current session is still valid using the stored bearer token.
 * Calls /user/api/v1/public/check-session with the token as a query param.
 * Returns the session data on success, or throws on failure.
 */
export async function checkSession(): Promise<LoginResponse["data"]> {
  const authData = localStorage.getItem("auth");
  if (!authData) {
    throw new Error("No auth data in localStorage");
  }

  const parsed = JSON.parse(authData);
  const token = parsed?.token;

  if (!token) {
    throw new Error("No token found");
  }

  const API_URL = import.meta.env.VITE_API_URL;

  const response = await axios.get(
    API_ENDPOINTS.AUTH.CHECK_SESSION,
    { baseURL: API_URL, params: { bearerToken: token } }
  );

  const data = response.data?.data ?? response.data;

  return data;
}
