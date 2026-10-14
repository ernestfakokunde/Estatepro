'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import type { Property } from '@/types/property';
import { PropertyCard } from '@/components/property/property-card';
import { PropertyCardSkeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export function FavoritesList() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'empty' | 'error'>('loading');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login?next=%2Ffavorites');
      return;
    }
    apiFetch<Property[]>('/favorites')
      .then((result) => {
        setProperties(result.data);
        setStatus(result.data.length ? 'ready' : 'empty');
      })
      .catch(() => setStatus('error'));
  }, [user, loading, router, retry]);
  if (loading || status === 'loading')
    return (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <PropertyCardSkeleton key={item} />
        ))}
      </div>
    );
  if (!user)
    return (
      <div className="empty-state">
        <span className="empty-mark">
          <Heart />
        </span>
        <h2>Sign in to see your saved homes.</h2>
      </div>
    );
  if (status === 'error')
    return (
      <div role="alert" className="empty-state">
        <span className="empty-mark">
          <RefreshCw />
        </span>
        <h2>Your saved homes could not be loaded.</h2>
        <Button variant="secondary" type="button" onClick={() => setRetry((value) => value + 1)}>
          Try again
        </Button>
      </div>
    );
  if (!properties.length)
    return (
      <div className="empty-state">
        <span className="empty-mark">
          <Heart />
        </span>
        <h2>Your saved list starts here.</h2>
        <p>Save homes that catch your eye and compare them whenever you are ready.</p>
        <Button href="/listings">Explore homes</Button>
      </div>
    );
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {properties.map((property, index) => (
        <PropertyCard key={property.id} property={property} index={index} />
      ))}
    </div>
  );
}
