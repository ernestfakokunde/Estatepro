import type { ApiEnvelope, ApiFailure } from '@/types/api';

const apiBase = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  code: string;
  details?: Record<string, string[]>;

  constructor(message: string, code = 'API_ERROR', details?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
  }
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<{ data: T; meta?: { page: number; limit: number; total: number; totalPages: number } }> {
  if (!apiBase)
    throw new ApiError(
      'Set NEXT_PUBLIC_API_URL in client/.env.local to connect to the API.',
      'API_URL_MISSING',
    );
  const isForm = typeof FormData !== 'undefined' && init.body instanceof FormData;
  const headers = new Headers(init.headers);
  if (!isForm && init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  const response = await fetch(`${apiBase.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`, {
    ...init,
    headers,
    credentials: 'include',
    cache: init.cache ?? 'no-store',
  });
  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;
  if (!response.ok || !payload?.success) {
    const failure = payload as ApiFailure | null;
    throw new ApiError(
      failure?.error.message ?? 'The request could not be completed.',
      failure?.error.code,
      failure?.error.details,
    );
  }
  return { data: payload.data, meta: payload.meta };
}

export function jsonBody(value: unknown) {
  return JSON.stringify(value);
}
