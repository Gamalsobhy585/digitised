import { env } from "../config/env";
import { toast } from "react-toastify";
import { getServerCookie } from "../features/actions";


type RequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  cookie?: string;
  params?: Record<string, string | number | boolean | undefined | null>;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

function buildUrlWithParams(
  url: string,
  params?: RequestOptions["params"]
): string {
  if (!params) return url;
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null
    )
  );
  if (Object.keys(filteredParams).length === 0) return url;
  const queryString = new URLSearchParams(
    filteredParams as Record<string, string>
  ).toString();
  return `${url}?${queryString}`;
}

export function getServerCookies() {
  if (typeof window !== "undefined") return "";
  
  return import("next/headers").then(({ cookies }) => {
    try {
      const cookieStore = cookies() as unknown as {
        getAll: () => { name: string; value: string }[]
      };
      
      return cookieStore
        .getAll()
        .map((c: { name: string; value: string }) => `${c.name}=${c.value}`)
        .join("; ");
    } catch (error) {
      console.error("Failed to access cookies:", error);
      return "";
    }
  });
}

async function fetchApi<T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    method = "GET",
    headers = {},
    body,
    cookie,
    params,
    cache = "no-store",
    next,
  } = options;
  
  let cookieHeader = cookie;
  if (typeof window === "undefined" && !cookie) {
    cookieHeader = await getServerCookies();
  }
  
  const token = await getServerCookie("token");
  const fullUrl = buildUrlWithParams(`${env.API_URL}${url}`, params);
  
  // Default headers
  const defaultHeaders: Record<string, string> = {
    Accept: "application/json",
    "Accept-Language": "en",
  };
  
  // Only add Content-Type for JSON requests, not for FormData
  if (!(body instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json";
  }
  
  // Add auth and cookies
  if (cookieHeader) defaultHeaders.Cookie = cookieHeader;
  if (token) defaultHeaders.Authorization = `Bearer ${token}`;
  
  // Prepare the request
  const requestOptions: RequestInit = {
    method,
    headers: { ...defaultHeaders, ...headers },
    cache,
    next,
  };
  
  // Handle body based on its type
  if (body) {
    requestOptions.body = body instanceof FormData ? body : JSON.stringify(body);
  }
  
  const response = await fetch(fullUrl, requestOptions);
  
  if (!response.ok) {
    const message = (await response.json()).message || response.statusText;
    if (typeof window !== "undefined") {
      toast.error(message);
    }
    throw new Error(message);
  }
  
  return response.json();
}
export const api = {
  get<T>(url: string, options?: RequestOptions): Promise<T> {
    return fetchApi<T>(url, { ...options, method: "GET" });
  },
  post<T>(url: string, body?: any, options?: RequestOptions): Promise<T> {
    return fetchApi<T>(url, { ...options, method: "POST", body });
  },
  put<T>(url: string, body?: any, options?: RequestOptions): Promise<T> {
    return fetchApi<T>(url, { ...options, method: "PUT", body });
  },
  patch<T>(url: string, body?: any, options?: RequestOptions): Promise<T> {
    return fetchApi<T>(url, { ...options, method: "PATCH", body });
  },
  delete<T>(url: string, options?: RequestOptions): Promise<T> {
    return fetchApi<T>(url, { ...options, method: "DELETE" });
  },
};
