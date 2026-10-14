import type { Metadata } from 'next';
import { AuthCard } from '@/components/auth/auth-form';
import { VerifyEmail } from '@/components/auth/email-actions';

export const metadata: Metadata = { title: 'Verify email | EstatePro' };
export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return <AuthCard heading="Verify your email address." description="Confirm your email to activate your EstatePro account."><VerifyEmail token={token} /></AuthCard>;
}
