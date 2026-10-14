'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { ArrowUpRight, CirclePlus, RefreshCw, Trash2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { formatNaira, titleCase } from '@/lib/utils';
import type { Property } from '@/types/property';
import { PropertyCardSkeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { toast } from '@/components/ui/toast';

export function AgentListings() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [retry, setRetry] = useState(0);
  const [remove, setRemove] = useState<Property | null>(null);
  const [removing, setRemoving] = useState(false);
  const load = useCallback(() => {
    setStatus('loading');
    apiFetch<Property[]>('/properties/mine?limit=50')
      .then((result) => {
        setProperties(result.data);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [retry]);
  useEffect(() => {
    load();
  }, [load]);

  async function confirmRemove() {
    if (!remove) return;
    setRemoving(true);
    try {
      await apiFetch(`/properties/${remove.id}`, { method: 'DELETE' });
      toast('The listing has been removed.', 'success');
      setRemove(null);
      setRetry((value) => value + 1);
    } catch (error) {
      toast(error instanceof Error ? error.message : 'The listing could not be removed.', 'error');
    } finally {
      setRemoving(false);
    }
  }

  return (
    <section className="border border-line bg-white p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold">My listings</h2>
          <p className="mt-1 text-xs text-muted">Edit a home or check its review status.</p>
        </div>
        <Button href="/dashboard/listings/new">
          <CirclePlus size={15} />
          New listing
        </Button>
      </div>
      {status === 'loading' && (
        <div className="mt-5 grid gap-4">
          {[0, 1, 2].map((item) => (
            <PropertyCardSkeleton key={item} />
          ))}
        </div>
      )}
      {status === 'error' && (
        <div className="empty-state mt-5">
          <span className="empty-mark">
            <RefreshCw />
          </span>
          <h3>Your homes could not be loaded.</h3>
          <Button type="button" variant="secondary" onClick={() => setRetry((value) => value + 1)}>
            Try again
          </Button>
        </div>
      )}
      {status === 'ready' && properties.length === 0 && (
        <div className="empty-state mt-5">
          <span className="empty-mark">⌂</span>
          <h3>There are no listings here yet.</h3>
          <p>Create your first listing and our team will review it.</p>
          <Button href="/dashboard/listings/new">
            Create a listing <ArrowUpRight size={15} />
          </Button>
        </div>
      )}
      {status === 'ready' && properties.length > 0 && (
        <div className="mt-5 divide-y divide-line">
          {properties.map((property) => (
            <article key={property.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
              <div className="min-w-[12rem] flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold">{property.title}</h3>
                  <span className={`status-chip status-${property.status.toLowerCase()}`}>
                    {titleCase(property.status)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  {property.city}, {property.state} · {property.type === 'SALE' ? 'Sale' : 'Annual rent'} ·{' '}
                  {formatNaira(property.price)}
                </p>
                <p className="mt-1 text-[10px] text-muted">
                  Updated{' '}
                  {new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium' }).format(
                    new Date(property.updatedAt),
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard/listings/${property.id}/edit`}
                  className="inline-flex min-h-9 items-center border border-line px-3 text-xs font-medium hover:bg-canvas"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  aria-label={`Remove ${property.title}`}
                  onClick={() => setRemove(property)}
                  className="grid h-9 w-9 place-items-center border border-line text-rose-700 hover:bg-rose-50"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
      <Modal open={Boolean(remove)} title="Remove this listing?" onClose={() => !removing && setRemove(null)}>
        <p className="text-sm leading-6 text-muted">
          This will permanently remove <strong className="text-ink">{remove?.title}</strong> and its saved
          listing details.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => setRemove(null)} disabled={removing}>
            Keep listing
          </Button>
          <Button type="button" variant="danger" onClick={() => void confirmRemove()} disabled={removing}>
            {removing ? 'Removing…' : 'Remove listing'}
          </Button>
        </div>
      </Modal>
    </section>
  );
}
