'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { listingPageSize } from '@/lib/constants';
import type { Property, PropertyFilters } from '@/types/property';
import { PropertyCard } from '@/components/property/property-card';
import { PropertyFilters as FilterPanel } from '@/components/property/property-filters';
import { PropertyCardSkeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { formatNaira } from '@/lib/utils';

type PageResponse = {
  data: Property[];
  meta?: { page: number; limit: number; total: number; totalPages: number };
};

export function ListingsExplorer({ initialFilters }: { initialFilters: PropertyFilters }) {
  const [filters, setFilters] = useState<PropertyFilters>(initialFilters);
  const [applied, setApplied] = useState<PropertyFilters>(initialFilters);
  const [properties, setProperties] = useState<Property[]>([]);
  const [meta, setMeta] = useState<PageResponse['meta']>();
  const [state, setState] = useState<'loading' | 'ready' | 'empty' | 'error'>('loading');
  const [retry, setRetry] = useState(0);

  const query = useMemo(() => {
    const params = new URLSearchParams({ page: String(applied.page ?? 1), limit: String(listingPageSize) });
    for (const key of [
      'location',
      'type',
      'category',
      'bedrooms',
      'minPrice',
      'maxPrice',
      'sort',
      'q',
    ] as const) {
      const value = applied[key];
      if (value !== undefined && value !== '') params.set(key, String(value));
    }
    return params.toString();
  }, [applied]);

  useEffect(() => {
    const controller = new AbortController();
    setState('loading');
    apiFetch<Property[]>(`/properties?${query}`, { signal: controller.signal })
      .then((result) => {
        setProperties(result.data);
        setMeta(result.meta);
        setState(result.data.length ? 'ready' : 'empty');
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setState('error');
      });
    return () => controller.abort();
  }, [query, retry]);

  function applyFilters() {
    setApplied({ ...filters, page: 1 });
  }
  function clearFilters() {
    const clean: PropertyFilters = { sort: 'newest', page: 1 };
    setFilters(clean);
    setApplied(clean);
  }

  return (
    <div>
      <FilterPanel value={filters} onChange={setFilters} onApply={applyFilters} />
      <div className="mt-7 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs text-muted">
            {meta ? `${meta.total} ${meta.total === 1 ? 'home' : 'homes'} to explore` : 'Homes to explore'}
          </p>
          {applied.location && <p className="mt-1 text-sm font-medium">Around {applied.location}</p>}
        </div>
        <span className="text-xs text-muted">
          {applied.minPrice || applied.maxPrice
            ? `Prices in naira · from ${applied.minPrice ? formatNaira(applied.minPrice) : 'any'} to ${applied.maxPrice ? formatNaira(applied.maxPrice) : 'any'}`
            : 'Carefully selected homes across Nigeria'}
        </span>
      </div>
      {state === 'loading' && (
        <div aria-label="Loading homes" className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <PropertyCardSkeleton key={index} />
          ))}
        </div>
      )}
      {state === 'ready' && (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {properties.map((property, index) => (
            <PropertyCard key={property.id} property={property} index={index} />
          ))}
        </div>
      )}
      {state === 'empty' && (
        <div className="empty-state mt-5">
          <span className="empty-mark">⌕</span>
          <h2>No homes match those filters.</h2>
          <p>Try another neighbourhood, widen your budget, or start again.</p>
          <Button variant="secondary" type="button" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      )}
      {state === 'error' && (
        <div role="alert" className="empty-state mt-5">
          <span className="empty-mark">
            <RefreshCw size={24} />
          </span>
          <h2>Homes could not be loaded.</h2>
          <p>Check that the API is running and NEXT_PUBLIC_API_URL points to it.</p>
          <Button variant="secondary" type="button" onClick={() => setRetry((value) => value + 1)}>
            Try again
          </Button>
        </div>
      )}
      {state === 'ready' && meta && meta.totalPages > 1 && (
        <nav
          aria-label="Homes pages"
          className="mt-8 flex items-center justify-between border-t border-line pt-5"
        >
          <Button
            variant="secondary"
            type="button"
            disabled={meta.page <= 1}
            onClick={() => {
              const page = meta.page - 1;
              setApplied((current) => ({ ...current, page }));
              setFilters((current) => ({ ...current, page }));
            }}
          >
            <ArrowLeft size={15} /> Previous
          </Button>
          <span className="text-xs text-muted">
            Page {meta.page} of {meta.totalPages}
          </span>
          <Button
            variant="secondary"
            type="button"
            disabled={meta.page >= meta.totalPages}
            onClick={() => {
              const page = meta.page + 1;
              setApplied((current) => ({ ...current, page }));
              setFilters((current) => ({ ...current, page }));
            }}
          >
            Next <ArrowRight size={15} />
          </Button>
        </nav>
      )}
      <p className="mt-7 text-center text-xs text-muted">
        Looking for something specific?{' '}
        <Link className="font-medium text-forest underline underline-offset-4" href="/contact">
          Let our local team help.
        </Link>
      </p>
    </div>
  );
}
