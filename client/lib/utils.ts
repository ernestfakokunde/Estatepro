import { clsx, type ClassValue } from 'clsx';

export function cn(...values: ClassValue[]) {
  return clsx(values);
}

export function formatNaira(value: number | string, options?: { compact?: boolean }) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '₦—';
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
    notation: options?.compact ? 'compact' : 'standard',
  }).format(amount);
}

export function formatArea(value: number | string) {
  return `${new Intl.NumberFormat('en-NG', { maximumFractionDigits: 0 }).format(Number(value))} m²`;
}

export function titleCase(value: string) {
  return value
    .toLowerCase()
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function propertyUrl(property: { id: string; slug?: string }) {
  return `/listings/${encodeURIComponent(property.id)}`;
}
