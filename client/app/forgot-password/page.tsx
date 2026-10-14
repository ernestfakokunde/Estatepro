import type { Metadata } from 'next';
import { AuthCard } from '@/components/auth/auth-form';
import { ForgotPasswordForm } from '@/components/auth/email-actions';

export const metadata: Metadata = { title: 'Account recovery | EstatePro' };
export default function ForgotPasswordPage() {
  return <AuthCard heading="Recover your account." description="We’ll email you a secure link to reset your password or verify a new account."><ForgotPasswordForm /></AuthCard>;
}
