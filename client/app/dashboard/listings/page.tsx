import type { Metadata } from 'next';
import { AgentListings } from '@/components/dashboard/agent-listings';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { RoleGate } from '@/components/dashboard/role-gate';

export const metadata: Metadata = {
  title: 'My listings | EstatePro',
  description: 'Manage and update your EstatePro listings.',
};
export default function MyListingsPage() {
  return (
    <RoleGate roles={['AGENT']}>
      <DashboardShell>
        <AgentListings />
      </DashboardShell>
    </RoleGate>
  );
}
