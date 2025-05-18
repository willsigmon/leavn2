import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Define response types for our API endpoints
export interface NarrativeResponse {
  content: string;
}

export interface ArtworkResponse {
  url: string;
}

export interface TranslationResponse {
  genz: string;
  kids: string;
  devotional?: string;
  scholarly?: string;
}

export interface DidYouKnowResponse {
  content: string;
}

export interface CommentaryResponse {
  content: string;
}

export interface ContextualAnswerResponse {
  content: string;
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export interface ApiRequestOptions {
  url: string;
  method?: string;
  data?: unknown;
}

export async function apiRequest(
  options: ApiRequestOptions | string
): Promise<Response> {
  // Handle both string and object formats
  let url: string;
  let method = 'GET';
  let data: unknown | undefined;
  
  if (typeof options === 'string') {
    url = options;
  } else {
    url = options.url;
    method = options.method || 'GET';
    data = options.data;
  }
  
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
