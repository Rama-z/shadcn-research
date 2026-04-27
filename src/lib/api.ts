import { sleep } from "./utils";

// Simulated API client with mock data
const API_DELAY = 500;

export async function apiClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
  await sleep(API_DELAY);

  // In production, this would be a real fetch call:
  // const response = await fetch(`${BASE_URL}${endpoint}`, options);
  // return response.json();

  throw new Error(`API not implemented: ${endpoint}`);
}

export { API_DELAY };
