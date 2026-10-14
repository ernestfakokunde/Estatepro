import type { Metadata } from 'next';
import { AuthCard, AuthForm } from '@/components/auth/auth-form';

export const metadata: Metadata = {
  title: 'Sign in | EstatePro',
  description: 'Sign in to save homes and keep your search moving.',
};
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <AuthCard>
      <AuthForm mode="login" nextPath={next} />
    </AuthCard>
  );
}
