'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types/property';
import { Skeleton } from '@/components/ui/skeleton';

export function RoleGate({ roles, children }: { roles: UserRole[]; children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);
  if (loading || !user)
    return (
      <main className="page-container min-h-[60vh] py-12">
        <Skeleton className="h-8 w-52" />
        <Skeleton className="mt-5 h-32 w-full" />
      </main>
    );
  if (!roles.includes(user.role))
    return (
      <main className="page-container grid min-h-[60vh] place-content-center py-12 text-center">
        <h1 className="font-display text-2xl">This space is for your EstatePro team.</h1>
        <p className="mt-2 text-sm text-muted">Your account does not have access to this page.</p>
      </main>
    );
  return children;
}
