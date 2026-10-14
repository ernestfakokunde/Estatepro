'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { toast } from '@/components/ui/toast';

type FavoritesContextValue = {
  ids: string[];
  loading: boolean;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => Promise<void>;
  refreshFavorites: () => Promise<void>;
};
const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const [ids, setIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshFavorites = useCallback(async () => {
    if (!user) {
      setIds([]);
      return;
    }
    setLoading(true);
    try {
      const result = await apiFetch<Array<{ id: string }>>('/favorites');
      setIds(result.data.map((property) => property.id));
    } catch {
      setIds([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void refreshFavorites();
  }, [refreshFavorites]);

  const toggleFavorite = useCallback(
    async (id: string) => {
      if (!user) {
        toast('Sign in to save homes to your favorites.', 'info');
        router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
        return;
      }
      const wasSaved = ids.includes(id);
      setIds((current) => (wasSaved ? current.filter((item) => item !== id) : [...current, id]));
      try {
        await apiFetch(`/favorites/${encodeURIComponent(id)}`, { method: wasSaved ? 'DELETE' : 'POST' });
        toast(wasSaved ? 'Removed from your favorites.' : 'Saved to your favorites.', 'success');
      } catch (error) {
        setIds((current) => (wasSaved ? [...current, id] : current.filter((item) => item !== id)));
        toast(error instanceof Error ? error.message : 'Your favorite could not be updated.', 'error');
      }
    },
    [ids, router, user],
  );

  const value = useMemo(
    () => ({ ids, loading, isFavorite: (id: string) => ids.includes(id), toggleFavorite, refreshFavorites }),
    [ids, loading, toggleFavorite, refreshFavorites],
  );
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used inside FavoritesProvider.');
  return context;
}
