'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { ArrowUpRight, BedDouble, Bath, MapPin, Maximize2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { formatArea, formatNaira, propertyUrl } from '@/lib/utils';
import type { Property } from '@/types/property';
import { PropertyCardSkeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/property/property-card';

export function HomeFeatured() {
  const [property, setProperty] = useState<Property | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'empty' | 'error'>('loading');
  const [retry, setRetry] = useState(0);
  const load = useCallback(async () => {
    setState('loading');
    try {
      const result = await apiFetch<Property[]>('/properties?sort=newest&limit=1');
      setProperty(result.data[0] ?? null);
      setState(result.data[0] ? 'ready' : 'empty');
    } catch {
      setState('error');
    }
  }, [retry]);
  useEffect(() => {
    void load();
  }, [load]);
  if (state === 'loading')
    return (
      <div className="featured-layout">
        <PropertyCardSkeleton />
        <div className="grid gap-3">
          <div className="h-4 w-2/3 animate-pulse bg-canvas" />
          <div className="h-10 w-full animate-pulse bg-canvas" />
          <div className="h-24 w-full animate-pulse bg-canvas" />
        </div>
      </div>
    );
  if (state === 'empty' || state === 'error')
    return (
      <div className="featured-empty">
        <p className="eyebrow">
          <span className="eyebrow-rule" /> A PLACE TO BEGIN
        </p>
        <h3>{state === 'error' ? 'Homes will appear here shortly.' : 'Your next chapter is waiting.'}</h3>
        <p>
          {state === 'error'
            ? 'We could not load current homes. Check the API connection and try again.'
            : 'Our local advisors are preparing a considered collection of homes.'}
        </p>
        <div className="flex flex-wrap gap-3">
          {state === 'error' && (
            <Button type="button" variant="secondary" onClick={() => setRetry((value) => value + 1)}>
              Try again
            </Button>
          )}
          <Button href="/listings">
            Explore all homes <ArrowUpRight size={15} />
          </Button>
        </div>
      </div>
    );
  const image = property!.images[0];
  return (
    <article className="featured-property">
      <Link
        className="featured-image"
        href={propertyUrl(property!)}
        aria-label={`Explore ${property!.title}`}
      >
        {image ? (
          <Image
            src={image.url}
            alt={image.alt || property!.title}
            fill
            priority
            sizes="(max-width: 700px) 100vw, 50vw"
            unoptimized
            className="object-cover"
          />
        ) : (
          <span className="grid h-full place-items-center bg-gradient-to-br from-[#dbe2d8] to-[#f0eee6] text-sm text-muted">
            Photo coming soon
          </span>
        )}
        <span className="image-count">
          01 <i /> {String(property!.images.length || 1).padStart(2, '0')}
        </span>
      </Link>
      <div className="featured-info">
        <div className="property-overline">
          <span>CURATED OPPORTUNITY</span>
          <span className="status-dot">{property!.type === 'SALE' ? 'FOR SALE' : 'FOR RENT'}</span>
        </div>
        <div className="featured-heading">
          <div>
            <h3>{property!.title}</h3>
            <p>
              <MapPin size={12} /> {property!.city} <span>/</span> {property!.state}
            </p>
          </div>
          <Link className="round-link" href={propertyUrl(property!)} aria-label={`View ${property!.title}`}>
            <ArrowUpRight size={19} />
          </Link>
        </div>
        <div className="property-facts">
          <span>
            <Maximize2 size={14} />
            {formatArea(property!.area)}
          </span>
          {property!.bedrooms !== null && (
            <span>
              <BedDouble size={14} />
              {property!.bedrooms} beds
            </span>
          )}
          {property!.bathrooms !== null && (
            <span>
              <Bath size={14} />
              {property!.bathrooms} baths
            </span>
          )}
        </div>
        <div className="featured-bottom">
          <div>
            <span className="price-label">{property!.type === 'SALE' ? 'ASKING PRICE' : 'ANNUAL RENT'}</span>
            <strong>{formatNaira(property!.price)}</strong>
          </div>
          <Link className="text-link" href={propertyUrl(property!)}>
            Explore this home <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function HomeCollection() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'empty' | 'error'>('loading');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    apiFetch<Property[]>('/properties?sort=newest&limit=3')
      .then((result) => {
        setProperties(result.data);
        setStatus(result.data.length ? 'ready' : 'empty');
      })
      .catch(() => setStatus('error'));
  }, [retry]);
  if (status === 'loading')
    return (
      <div className="property-grid">
        {[0, 1, 2].map((item) => (
          <PropertyCardSkeleton key={item} />
        ))}
      </div>
    );
  if (status !== 'ready')
    return (
      <div className="empty-state">
        <span className="empty-mark">⌂</span>
        <h3>
          {status === 'empty'
            ? 'A thoughtful collection is on its way.'
            : 'We could not load available homes.'}
        </h3>
        <p>
          {status === 'empty'
            ? 'Check back soon or talk to our team about what you are looking for.'
            : 'Please check your connection and try again.'}
        </p>
        {status === 'error' ? (
          <Button type="button" variant="secondary" onClick={() => setRetry((value) => value + 1)}>
            Try again
          </Button>
        ) : (
          <Button href="/contact" variant="secondary">
            Tell us what you need
          </Button>
        )}
      </div>
    );
  return (
    <div className="property-grid">
      {properties.map((item, index) => (
        <PropertyCard key={item.id} property={item} index={index} />
      ))}
    </div>
  );
}
