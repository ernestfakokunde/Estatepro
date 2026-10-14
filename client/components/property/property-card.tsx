'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, BedDouble, Bath, Heart, Maximize2, MapPin } from 'lucide-react';
import type { Property } from '@/types/property';
import { formatArea, formatNaira, propertyUrl, titleCase } from '@/lib/utils';
import { useFavorites } from '@/context/FavoritesContext';

export function PropertyCard({ property, index = 0 }: { property: Property; index?: number }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const image = property.images[0];
  const saved = isFavorite(property.id);
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay: Math.min(index * 0.045, 0.22) }}
      whileHover={{ y: -3 }}
      className="property-card overflow-hidden border border-line bg-white"
    >
      <div className="relative block h-56 overflow-hidden bg-[#e9ece6]">
        <Link
          href={propertyUrl(property)}
          aria-label={`View ${property.title}`}
          className="absolute inset-0 z-0"
        >
          {image ? (
            <Image
              src={image.url}
              alt={image.alt || property.title}
              fill
              sizes="(max-width: 640px) 100vw,(max-width: 1024px) 50vw,33vw"
              unoptimized
              className="object-cover transition duration-500 hover:scale-[1.035]"
            />
          ) : (
            <span
              aria-label="No property photo available"
              className="absolute inset-0 grid place-items-center bg-gradient-to-br from-[#dbe2d8] to-[#f0eee6] text-xs text-muted"
            >
              Photo coming soon
            </span>
          )}
        </Link>
        <span className="absolute left-3 top-3 z-10 bg-white/95 px-2.5 py-1.5 text-[10px] font-medium text-forest">
          {property.type === 'SALE' ? 'For sale' : 'For rent'}
        </span>
        <button
          type="button"
          aria-label={
            saved ? `Remove ${property.title} from favorites` : `Save ${property.title} to favorites`
          }
          aria-pressed={saved}
          onClick={() => void toggleFavorite(property.id)}
          className={`absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full border bg-white/95 transition ${saved ? 'border-rose-200 text-rose-600' : 'border-white text-[#56645a] hover:text-rose-600'}`}
        >
          <Heart size={17} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-base font-semibold leading-snug tracking-[-.02em]">
              <Link href={propertyUrl(property)} className="hover:text-forest">
                {property.title}
              </Link>
            </h3>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted">
              <MapPin size={12} />
              {property.city}, {property.state}
            </p>
          </div>
          <span className="whitespace-nowrap bg-[#f4f6f2] px-2 py-1 text-[10px] font-semibold text-[#55705b]">
            {titleCase(property.category)}
          </span>
        </div>
        <div className="flex items-center gap-4 border-y border-line py-3 text-[11px] text-muted">
          <span className="flex items-center gap-1">
            <Maximize2 size={13} />
            {formatArea(property.area)}
          </span>
          {property.bedrooms !== null && (
            <span className="flex items-center gap-1">
              <BedDouble size={13} />
              {property.bedrooms} beds
            </span>
          )}
          {property.bathrooms !== null && (
            <span className="flex items-center gap-1">
              <Bath size={13} />
              {property.bathrooms} baths
            </span>
          )}
        </div>
        <div className="flex items-center justify-between pt-3">
          <strong className="font-display text-lg font-semibold tracking-tight">
            {formatNaira(property.price)}
            {property.type === 'RENT' && (
              <small className="ml-1 text-[10px] font-normal text-muted">/ year</small>
            )}
          </strong>
          <Link
            href={propertyUrl(property)}
            aria-label={`View details for ${property.title}`}
            className="grid h-8 w-8 place-items-center rounded-full border border-line text-[#657268] transition hover:bg-canvas hover:text-forest"
          >
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
