'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowUpRight, CirclePlus, Home, Hourglass, ListChecks } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import type { Property } from '@/types/property';
import { formatNaira, titleCase } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export function AgentDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  useEffect(() => {
    apiFetch<Property[]>('/properties/mine?limit=50')
      .then((result) => {
        setProperties(result.data);
        setTotal(result.meta?.total ?? result.data.length);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);
  if (status === 'loading')
    return (
      <div className="grid gap-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-36 w-full" />
      </div>
    );
  if (status === 'error')
    return (
      <div role="alert" className="border border-rose-200 bg-white p-5">
        <h2 className="font-semibold">Your listings could not be loaded.</h2>
        <p className="mt-2 text-sm text-muted">Check the API connection and try again.</p>
        <Button type="button" variant="secondary" className="mt-4" onClick={() => window.location.reload()}>
          Try again
        </Button>
      </div>
    );
  const pending = properties.filter((item) => item.status === 'PENDING').length;
  const live = properties.filter((item) => item.status === 'APPROVED').length;
  return (
    <div className="grid gap-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat icon={Home} label="All my listings" value={String(total)} />
        <Stat icon={ListChecks} label="Live homes" value={String(live)} />
        <Stat icon={Hourglass} label="In review" value={String(pending)} />
      </div>
      <section className="border border-line bg-white p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold">A quick look at your homes</h2>
            <p className="mt-1 text-xs text-muted">Manage your current listings and see where they stand.</p>
          </div>
          <Button href="/dashboard/listings/new">
            <CirclePlus size={15} />
            Create listing
          </Button>
        </div>
        {properties.length === 0 ? (
          <div className="py-10 text-center">
            <span className="empty-mark">
              <Home size={23} />
            </span>
            <h3 className="mt-3 font-display text-lg font-semibold">Your first home starts here.</h3>
            <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-muted">
              Create a listing and our team will review it before it is shared with home seekers.
            </p>
            <Button href="/dashboard/listings/new" variant="secondary" className="mt-4">
              Create your first listing <ArrowUpRight size={14} />
            </Button>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-line">
            {properties.slice(0, 5).map((property) => (
              <div key={property.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                <div>
                  <h3 className="text-sm font-semibold">{property.title}</h3>
                  <p className="mt-1 text-xs text-muted">
                    {property.city}, {property.state} · {formatNaira(property.price)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`status-chip status-${property.status.toLowerCase()}`}>
                    {titleCase(property.status)}
                  </span>
                  <Link
                    className="text-xs font-medium text-forest"
                    href={`/dashboard/listings/${property.id}/edit`}
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        <Link
          className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-forest"
          href="/dashboard/listings"
        >
          Manage all listings <ArrowUpRight size={14} />
        </Link>
      </section>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Home; label: string; value: string }) {
  return (
    <article className="border border-line bg-white p-4">
      <span className="text-[#829184]">
        <Icon size={17} />
      </span>
      <p className="mt-3 text-[10px] uppercase tracking-[.1em] text-muted">{label}</p>
      <strong className="mt-1 block font-display text-2xl font-medium">{value}</strong>
    </article>
  );
}
