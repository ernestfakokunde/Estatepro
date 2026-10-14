import type { Metadata } from 'next';
import { AgentDashboard } from '@/components/dashboard/agent-dashboard';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { RoleGate } from '@/components/dashboard/role-gate';

export const metadata: Metadata = {
  title: 'Agent dashboard | EstatePro',
  description: 'Manage your EstatePro home listings.',
};
export default function DashboardPage() {
  return (
    <RoleGate roles={['AGENT']}>
      <DashboardShell>
        <AgentDashboard />
      </DashboardShell>
    </RoleGate>
  );
}
