import type { Metadata } from 'next';
import { AuthCard } from '@/components/auth/auth-form';
import { ResetPasswordForm } from '@/components/auth/email-actions';

export const metadata: Metadata = { title: 'Reset password | EstatePro' };
export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return <AuthCard heading="Choose a new password." description="Use a strong password you have not used on another site."><ResetPasswordForm token={token} /></AuthCard>;
}
