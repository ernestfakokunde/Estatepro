'use client';

import { Search, SlidersHorizontal } from 'lucide-react';
import type { PropertyFilters } from '@/types/property';
import { propertyCategories } from '@/lib/constants';
import { titleCase } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function PropertyFilters({
  value,
  onChange,
  onApply,
  compact = false,
}: {
  value: PropertyFilters;
  onChange: (next: PropertyFilters) => void;
  onApply: () => void;
  compact?: boolean;
}) {
  function update(key: keyof PropertyFilters, next: string) {
    onChange({ ...value, [key]: next } as PropertyFilters);
  }
  const invalidRange = Boolean(
    value.minPrice && value.maxPrice && Number(value.minPrice) > Number(value.maxPrice),
  );
  return (
    <form
      className="grid gap-3 border border-line bg-white p-4 sm:grid-cols-2 xl:grid-cols-7"
      onSubmit={(event) => {
        event.preventDefault();
        if (!invalidRange) onApply();
      }}
    >
      <label className="grid gap-1.5 text-[10px] font-semibold tracking-[.09em] text-[#858d85]">
        <span>LOCATION</span>
        <input
          value={value.location ?? ''}
          onChange={(event) => update('location', event.target.value)}
          placeholder="City or state"
          className="h-10 border-b border-line bg-transparent text-sm font-normal tracking-normal text-ink outline-none placeholder:text-muted focus:border-forest"
        />
      </label>
      <label className="grid gap-1.5 text-[10px] font-semibold tracking-[.09em] text-[#858d85]">
        <span>LOOKING FOR</span>
        <select
          value={value.type ?? ''}
          onChange={(event) => update('type', event.target.value)}
          className="h-10 border-b border-line bg-transparent text-sm font-normal tracking-normal text-ink outline-none focus:border-forest"
        >
          <option value="">Buy or rent</option>
          <option value="SALE">Buy a home</option>
          <option value="RENT">Rent a home</option>
        </select>
      </label>
      <label className="grid gap-1.5 text-[10px] font-semibold tracking-[.09em] text-[#858d85]">
        <span>PROPERTY TYPE</span>
        <select
          value={value.category ?? ''}
          onChange={(event) => update('category', event.target.value)}
          className="h-10 border-b border-line bg-transparent text-sm font-normal tracking-normal text-ink outline-none focus:border-forest"
        >
          <option value="">Any property</option>
          {propertyCategories.map((category) => (
            <option key={category} value={category}>
              {titleCase(category)}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1.5 text-[10px] font-semibold tracking-[.09em] text-[#858d85]">
        <span>MINIMUM PRICE</span>
        <input
          type="number"
          min="0"
          inputMode="numeric"
          value={value.minPrice ?? ''}
          onChange={(event) => update('minPrice', event.target.value)}
          placeholder="₦ min"
          className="h-10 border-b border-line bg-transparent text-sm font-normal tracking-normal text-ink outline-none placeholder:text-muted focus:border-forest"
        />
      </label>
      <label className="grid gap-1.5 text-[10px] font-semibold tracking-[.09em] text-[#858d85]">
        <span>MAXIMUM PRICE</span>
        <input
          type="number"
          min="0"
          inputMode="numeric"
          value={value.maxPrice ?? ''}
          onChange={(event) => update('maxPrice', event.target.value)}
          placeholder="₦ max"
          className="h-10 border-b border-line bg-transparent text-sm font-normal tracking-normal text-ink outline-none placeholder:text-muted focus:border-forest"
        />
      </label>
      <label className="grid gap-1.5 text-[10px] font-semibold tracking-[.09em] text-[#858d85]">
        <span>BEDROOMS</span>
        <select
          value={value.bedrooms ?? ''}
          onChange={(event) => update('bedrooms', event.target.value)}
          className="h-10 border-b border-line bg-transparent text-sm font-normal tracking-normal text-ink outline-none focus:border-forest"
        >
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="5">5+</option>
        </select>
      </label>
      {!compact && (
        <label className="grid gap-1.5 text-[10px] font-semibold tracking-[.09em] text-[#858d85]">
          <span>SORT BY</span>
          <select
            value={value.sort ?? 'newest'}
            onChange={(event) => update('sort', event.target.value)}
            className="h-10 border-b border-line bg-transparent text-sm font-normal tracking-normal text-ink outline-none focus:border-forest"
          >
            <option value="newest">Recently added</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
            <option value="oldest">Oldest first</option>
          </select>
        </label>
      )}
      {invalidRange && (
        <p role="alert" className="text-xs text-rose-700 sm:col-span-2 xl:col-span-7">
          Maximum price must be at least the minimum price.
        </p>
      )}
      <div className={`flex items-end ${compact ? 'sm:col-span-2' : 'xl:col-span-7'}`}>
        <Button type="submit" disabled={invalidRange} className="w-full sm:w-auto">
          <Search size={16} />
          {compact ? (
            'Search homes'
          ) : (
            <>
              <SlidersHorizontal size={15} />
              Apply filters
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
