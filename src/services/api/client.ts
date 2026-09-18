import { config } from '@/app/config';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly messages: string[] = [],
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
}

let authToken: string | null = null;

export function setAuthToken(token: string | null): void {
  authToken = token;
}

function getErrorDetails(
  errorBody: string,
  status: number,
): { message: string; messages: string[] } {
  try {
    const error = JSON.parse(errorBody);

    if (Array.isArray(error.message)) {
      return {
        message: error.message.join(', '),
        messages: error.message,
      };
    }

    if (typeof error.message === 'string') {
      return {
        message: error.message,
        messages: [error.message],
      };
    }

    if (typeof error.error === 'string') {
      return {
        message: error.error,
        messages: [error.error],
      };
    }
  } catch {}

  const message =
    status >= 500
      ? 'Something went wrong. Please try again later.'
      : 'Request failed. Please try again.';

  return {
    message,
    messages: [message],
  };
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const response = await fetch(`${config.apiBaseUrl}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    const errorDetails = getErrorDetails(errorBody, response.status);

    throw new ApiError(
      errorDetails.message,
      response.status,
      errorDetails.messages,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

async function requestForm<T>(
  path: string,
  formData: FormData,
  method: 'POST' | 'PATCH' = 'POST',
): Promise<T> {
  const response = await fetch(`${config.apiBaseUrl}${path}`, {
    method,
    headers: {
      'ngrok-skip-browser-warning': 'true',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    const errorDetails = getErrorDetails(errorBody, response.status);

    throw new ApiError(
      errorDetails.message,
      response.status,
      errorDetails.messages,
    );
  }

  return (await response.json()) as T;
}

export const apiClient = {
  get: <T>(path: string, headers?: Record<string, string>) =>
    request<T>(path, { method: 'GET', headers }),

  post: <T>(
    path: string,
    body?: unknown,
    headers?: Record<string, string>,
  ) => request<T>(path, { method: 'POST', body, headers }),

  put: <T>(
    path: string,
    body?: unknown,
    headers?: Record<string, string>,
  ) => request<T>(path, { method: 'PUT', body, headers }),

  patch: <T>(
    path: string,
    body?: unknown,
    headers?: Record<string, string>,
  ) => request<T>(path, { method: 'PATCH', body, headers }),

  delete: <T>(path: string, headers?: Record<string, string>) =>
    request<T>(path, { method: 'DELETE', headers }),

  postForm: <T>(path: string, formData: FormData) =>
    requestForm<T>(path, formData, 'POST'),

  patchForm: <T>(path: string, formData: FormData) =>
    requestForm<T>(path, formData, 'PATCH'),
};