import type { Metadata } from 'next';
import { AuthCard } from '@/components/auth/auth-form';
import { ForgotPasswordForm } from '@/components/auth/email-actions';

export const metadata: Metadata = { title: 'Verify your email | EstatePro' };
export default function ResendVerificationPage() {
  return <AuthCard heading="Verify your email address." description="We’ll send a fresh verification link if your account needs one."><ForgotPasswordForm verificationOnly /></AuthCard>;
}
