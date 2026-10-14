import type { Metadata } from 'next';
import { ListingsExplorer } from '@/components/property/listings-explorer';
import type { PropertyFilters } from '@/types/property';

export const metadata: Metadata = {
  title: 'Homes for sale and rent | EstatePro',
  description: 'Search carefully selected homes for sale and rent across Lagos, Abuja, and Nigeria.',
};

type SearchValues = Record<string, string | string[] | undefined>;
function single(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ListingsPage({ searchParams }: { searchParams: Promise<SearchValues> }) {
  const params = await searchParams;
  const initialFilters: PropertyFilters = {
    location: single(params.location),
    type: (single(params.type) as PropertyFilters['type']) ?? '',
    category: (single(params.category) as PropertyFilters['category']) ?? '',
    q: single(params.q),
    sort: 'newest',
    page: 1,
  };
  return (
    <main className="page-container py-12 md:py-16">
      <div className="page-title-row">
        <div>
          <p className="eyebrow">
            <span className="eyebrow-rule" /> HOMES, CHOSEN WITH CARE
          </p>
          <h1 className="page-title">
            Find your next <em>home.</em>
          </h1>
          <p className="page-lede">
            Explore a considered collection of homes for sale and rent across Nigeria.
          </p>
        </div>
      </div>
      <div className="mt-8">
        <ListingsExplorer initialFilters={initialFilters} />
      </div>
    </main>
  );
}
