import type { Metadata } from 'next';
import { AuthCard } from '@/components/auth/auth-form';
import { AgentApplicationForm } from '@/components/auth/agent-application-form';

export const metadata: Metadata = {
  title: 'Apply as an agent | EstatePro',
  description: 'Apply to represent properties on EstatePro.',
};

export default function AgentRegistrationPage() {
  return (
    <AuthCard register agentApplication>
      <AgentApplicationForm />
    </AuthCard>
  );
}
