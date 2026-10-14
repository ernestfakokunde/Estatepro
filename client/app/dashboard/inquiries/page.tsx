import type { Metadata } from 'next';
import { AgentInquiries } from '@/components/dashboard/agent-inquiries';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { RoleGate } from '@/components/dashboard/role-gate';

export const metadata: Metadata = {
  title: 'Home inquiries | EstatePro',
  description: 'Reply to inquiries from people interested in your homes.',
};
export default function InquiriesPage() {
  return (
    <RoleGate roles={['AGENT']}>
      <DashboardShell>
        <AgentInquiries />
      </DashboardShell>
    </RoleGate>
  );
}
