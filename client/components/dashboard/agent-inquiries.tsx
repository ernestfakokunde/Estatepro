'use client';

import { useEffect, useState } from 'react';
import { Mail, Phone, RefreshCw } from 'lucide-react';
import { apiFetch, jsonBody } from '@/lib/api';
import { toast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: 'NEW' | 'CONTACTED' | 'CLOSED';
  createdAt: string;
  property: { id: string; title: string } | null;
};

export function AgentInquiries() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    apiFetch<Inquiry[]>('/inquiries?limit=50')
      .then((result) => {
        if (active) setItems(result.data);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [retry]);
  async function update(id: string, status: Inquiry['status']) {
    try {
      await apiFetch(`/inquiries/${id}/status`, { method: 'PATCH', body: jsonBody({ status }) });
      setItems((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
      toast('Inquiry updated.', 'success');
    } catch (reason) {
      toast(reason instanceof Error ? reason.message : 'The inquiry could not be updated.', 'error');
    }
  }
  return (
    <section className="border border-line bg-white p-5">
      <div>
        <h2 className="font-display text-xl font-semibold">Home inquiries</h2>
        <p className="mt-1 text-xs text-muted">Follow up with people who are interested in your listings.</p>
      </div>
      {loading && (
        <div className="mt-5 grid gap-3">
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} className="h-28 w-full" />
          ))}
        </div>
      )}
      {error && (
        <div role="alert" className="empty-state mt-4">
          <span className="empty-mark">
            <RefreshCw />
          </span>
          <h3>Inquiries could not be loaded.</h3>
          <Button type="button" variant="secondary" onClick={() => setRetry((value) => value + 1)}>
            Try again
          </Button>
        </div>
      )}
      {!loading && !error && items.length === 0 && (
        <div className="empty-state mt-4">
          <span className="empty-mark">
            <Mail />
          </span>
          <h3>No inquiries yet.</h3>
          <p>New messages about your homes will appear here.</p>
        </div>
      )}
      {!loading &&
        !error &&
        items.map((item) => (
          <article key={item.id} className="mt-4 border border-line p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[.1em] text-[#738078]">
                  {item.property?.title ?? 'General inquiry'}
                </p>
                <h3 className="mt-1 text-sm font-semibold">{item.name}</h3>
                <p className="mt-1 text-[10px] text-muted">
                  {new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium', timeStyle: 'short' }).format(
                    new Date(item.createdAt),
                  )}
                </p>
              </div>
              <span
                className={`status-chip status-${item.status === 'CLOSED' ? 'approved' : item.status === 'NEW' ? 'pending' : 'rejected'}`}
              >
                {item.status === 'CONTACTED' ? 'Contacted' : item.status === 'CLOSED' ? 'Closed' : 'New'}
              </span>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#68726a]">{item.message}</p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
              <a
                className="inline-flex items-center gap-1.5 text-forest"
                href={`mailto:${encodeURIComponent(item.email)}`}
              >
                <Mail size={13} />
                {item.email}
              </a>
              {item.phone && (
                <a
                  className="inline-flex items-center gap-1.5 text-forest"
                  href={`tel:${encodeURIComponent(item.phone)}`}
                >
                  <Phone size={13} />
                  {item.phone}
                </a>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                className="min-h-9 px-3 text-xs"
                disabled={item.status === 'CONTACTED'}
                onClick={() => void update(item.id, 'CONTACTED')}
              >
                Mark contacted
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="min-h-9 px-3 text-xs"
                disabled={item.status === 'CLOSED'}
                onClick={() => void update(item.id, 'CLOSED')}
              >
                Close inquiry
              </Button>
            </div>
          </article>
        ))}
    </section>
  );
}
