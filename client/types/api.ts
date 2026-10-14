export type ApiSuccess<T> = {
  success: true;
  data: T;
  meta?: { page: number; limit: number; total: number; totalPages: number };
};
export type ApiFailure = {
  success: false;
  error: { code: string; message: string; details?: Record<string, string[]> };
};
export type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;
export type ApiUser = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: 'USER' | 'AGENT' | 'ADMIN';
  avatarUrl?: string | null;
};
