'use client';

import type { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { ToastHost } from '@/components/ui/toast';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <FavoritesProvider>
        {children}
        <ToastHost />
      </FavoritesProvider>
    </AuthProvider>
  );
}
