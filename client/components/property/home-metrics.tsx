'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { formatNaira } from '@/lib/utils';

type Insights = { homes: number; markets: number; lowestPrice: string | null; forRent: number };
const bars = [5, 8, 6, 11, 7, 14, 9, 12, 6, 15, 11, 17, 12];

function Metric({ label, value, barsOffset = 0 }: { label: string; value: string; barsOffset?: number }) {
  return (
    <article className="metric-card min-w-0">
      <span className="metric-label">{label}</span>
      <strong className="metric-value">{value}</strong>
      <div aria-hidden="true" className="mt-3 flex h-8 items-end gap-1">
        {bars.map((bar, index) => (
          <i
            key={index}
            style={{ height: `${Math.max(3, bar + ((index + barsOffset) % 3) * 2)}px` }}
            className="flex-1 bg-[#e3e7e2]"
          />
        ))}
      </div>
    </article>
  );
}

export function HomeMetrics() {
  const [data, setData] = useState<Insights | null>(null);
  useEffect(() => {
    apiFetch<Insights>('/properties/insights')
      .then((result) => setData(result.data))
      .catch(() => setData({ homes: 0, markets: 0, lowestPrice: null, forRent: 0 }));
  }, []);
  return (
    <div className="metrics-grid" aria-label="EstatePro home overview">
      <Metric label="AVAILABLE HOMES TO EXPLORE" value={data ? `${data.homes}` : '—'} />
      <Metric label="NIGERIAN MARKETS COVERED" value={data ? `${data.markets}` : '—'} barsOffset={1} />
      <Metric label="HOMES AVAILABLE TO RENT" value={data ? `${data.forRent}` : '—'} barsOffset={2} />
      <span className="sr-only">
        {data?.lowestPrice ? `Current listings start at ${formatNaira(data.lowestPrice)}.` : ''}
      </span>
    </div>
  );
}
