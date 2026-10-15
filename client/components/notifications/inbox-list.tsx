'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, CheckCheck, RefreshCw } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/toast';

type InboxItem = {
  id: string;
  title: string;
  message: string;
  href: string;
  readAt: string | null;
  createdAt: string;
};

type InboxData = { items: InboxItem[]; unreadCount: number };

export function InboxList() {
  const [data, setData] = useState<InboxData>({ items: [], unreadCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);

  const load = useCallback(() => {
    let active = true;
    setLoading(true);
    setError(false);
    apiFetch<InboxData>('/notifications')
      .then((result) => {
        if (active) setData(result.data);
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

  useEffect(() => load(), [load]);

  async function markRead(id: string) {
    try {
      await apiFetch(`/notifications/${encodeURIComponent(id)}/read`, { method: 'PATCH' });
      setData((current) => ({
        ...current,
        unreadCount: Math.max(0, current.unreadCount - (current.items.find((item) => item.id === id && !item.readAt) ? 1 : 0)),
        items: current.items.map((item) => item.id === id ? { ...item, readAt: new Date().toISOString() } : item),
      }));
    } catch {
      toast('This notification could not be marked as read.', 'error');
    }
  }

  async function markAllRead() {
    try {
      await apiFetch('/notifications/read-all', { method: 'PATCH' });
      const now = new Date().toISOString();
      setData((current) => ({
        unreadCount: 0,
        items: current.items.map((item) => ({ ...item, readAt: item.readAt ?? now })),
      }));
      toast('All notifications marked as read.', 'success');
    } catch {
      toast('Notifications could not be marked as read.', 'error');
    }
  }

  if (loading) return <div className="mt-6 grid gap-3"><Skeleton className="h-28 w-full" /><Skeleton className="h-28 w-full" /></div>;
  if (error) {
    return (
      <div role="alert" className="empty-state mt-6">
        <span className="empty-mark"><RefreshCw /></span>
        <h2>Your inbox could not be loaded.</h2>
        <Button type="button" variant="secondary" onClick={() => setRetry((value) => value + 1)}>Try again</Button>
      </div>
    );
  }

  return (
    <section className="mt-6">
      {data.unreadCount > 0 && (
        <div className="mb-3 flex justify-end">
          <Button type="button" variant="secondary" onClick={() => void markAllRead()}>
            <CheckCheck size={16} /> Mark all as read
          </Button>
        </div>
      )}
      {data.items.length === 0 ? (
        <div className="empty-state">
          <span className="empty-mark"><Bell /></span>
          <h2>Your inbox is clear.</h2>
          <p>Updates about your inquiries will show up here.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {data.items.map((item) => (
            <article key={item.id} className={`border bg-white p-4 sm:p-5 ${item.readAt ? 'border-line' : 'border-[#9dad9e]'}`}>
              <div className="flex items-start gap-3">
                <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${item.readAt ? 'bg-[#d8ddd8]' : 'bg-forest'}`} aria-label={item.readAt ? 'Read' : 'Unread'} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h2 className="font-semibold">{item.title}</h2>
                    <time className="text-xs text-muted" dateTime={item.createdAt}>
                      {new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(item.createdAt))}
                    </time>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted">{item.message}</p>
                  <Link
                    href={item.href}
                    onClick={() => { if (!item.readAt) void markRead(item.id); }}
                    className="mt-3 inline-flex min-h-10 items-center font-medium text-forest underline underline-offset-4"
                  >
                    View details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
