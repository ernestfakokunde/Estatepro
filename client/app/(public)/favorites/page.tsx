import type { Metadata } from 'next';
import { FavoritesList } from '@/components/property/favorites-list';

export const metadata: Metadata = {
  title: 'Saved homes | EstatePro',
  description: 'Review the homes you have saved with EstatePro.',
};
export default function FavoritesPage() {
  return (
    <main className="page-container min-h-[60vh] py-12 md:py-16">
      <p className="eyebrow">
        <span className="eyebrow-rule" /> YOUR SHORTLIST
      </p>
      <h1 className="page-title">
        Homes you <em>love.</em>
      </h1>
      <p className="page-lede">A considered shortlist of places you would like to come back to.</p>
      <div className="mt-8">
        <FavoritesList />
      </div>
    </main>
  );
}
