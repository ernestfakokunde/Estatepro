import type { Metadata } from 'next';
import { AuthCard, AuthForm } from '@/components/auth/auth-form';

export const metadata: Metadata = {
  title: 'Create an account | EstatePro',
  description: 'Create an EstatePro account to save homes and talk with local advisors.',
};
export default function RegisterPage() {
  return (
    <AuthCard register>
      <AuthForm mode="register" />
    </AuthCard>
  );
}
