import type { Metadata } from 'next';
import { AdminPanel } from '@/components/dashboard/admin-panel';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { RoleGate } from '@/components/dashboard/role-gate';

export const metadata: Metadata = {
  title: 'Administration | EstatePro',
  description: 'Review property listings and manage EstatePro user accounts.',
};
export default function AdminPage() {
  return (
    <RoleGate roles={['ADMIN']}>
      <DashboardShell admin>
        <AdminPanel />
      </DashboardShell>
    </RoleGate>
  );
}
