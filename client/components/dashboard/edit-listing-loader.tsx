'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiError, apiFetch } from '@/lib/api';
import type { Property } from '@/types/property';
import { ListingEditor } from '@/components/dashboard/listing-editor';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export function EditListingLoader({ id }: { id: string }) {
  const [property, setProperty] = useState<Property | null>(null);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const router = useRouter();
  useEffect(() => {
    apiFetch<Property>(`/properties/${encodeURIComponent(id)}`)
      .then((result) => setProperty(result.data))
      .catch((reason: unknown) => {
        if (reason instanceof ApiError && reason.code === 'NOT_FOUND') {
          router.replace('/dashboard/listings');
          return;
        }
        setError(reason instanceof Error ? reason.message : 'This listing could not be loaded.');
      });
  }, [id, retry, router]);
  if (error)
    return (
      <div role="alert" className="empty-state border border-line bg-white">
        <h2>Listing unavailable.</h2>
        <p>{error}</p>
        <div className="mt-4 flex justify-center gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setError('');
              setRetry((value) => value + 1);
            }}
          >
            Try again
          </Button>
          <Button href="/dashboard/listings">Back to listings</Button>
        </div>
      </div>
    );
  if (!property)
    return (
      <div className="grid gap-4">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  return <ListingEditor initial={property} />;
}
