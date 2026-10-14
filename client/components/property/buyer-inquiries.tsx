'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

type BuyerInquiry = {
  id: string;
  message: string;
  status: 'NEW' | 'CONTACTED' | 'CLOSED';
  createdAt: string;
  property: { id: string; title: string; city: string; state: string } | null;
};

export function BuyerInquiries() {
  const [items, setItems] = useState<BuyerInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    apiFetch<BuyerInquiry[]>('/inquiries/mine?limit=50')
      .then((result) => setItems(result.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="mt-6 grid gap-3"><Skeleton className="h-28 w-full" /></div>;
  if (error)
    return <div role="alert" className="empty-state mt-6"><h2>We could not load your inquiries.</h2></div>;
  if (!items.length)
    return (
      <div className="empty-state mt-6">
        <h2>You have not sent any inquiries yet.</h2>
        <p>When you ask about a home while signed in, it will appear here.</p>
        <Button href="/listings" className="mt-3">Explore homes</Button>
      </div>
    );

  return (
    <div className="mt-6 grid gap-3">
      {items.map((item) => (
        <article key={item.id} className="border border-line bg-white p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              {item.property ? (
                <Link href={`/listings/${item.property.id}`} className="font-medium text-forest underline underline-offset-4">
                  {item.property.title}
                </Link>
              ) : <h2 className="font-medium">General inquiry</h2>}
              {item.property && <p className="mt-1 text-sm text-muted">{item.property.city}, {item.property.state}</p>}
            </div>
            <span className="text-sm text-muted">{item.status === 'NEW' ? 'Sent' : item.status === 'CONTACTED' ? 'Advisor contacted you' : 'Closed'}</span>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted">{item.message}</p>
          <time className="mt-3 block text-xs text-muted" dateTime={item.createdAt}>
            {new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium' }).format(new Date(item.createdAt))}
          </time>
        </article>
      ))}
    </div>
  );
}
