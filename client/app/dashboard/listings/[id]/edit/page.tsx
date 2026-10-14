import type { Metadata } from 'next';
import { EditListingLoader } from '@/components/dashboard/edit-listing-loader';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { RoleGate } from '@/components/dashboard/role-gate';

export const metadata: Metadata = {
  title: 'Edit listing | EstatePro',
  description: 'Update your EstatePro home listing.',
};
export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <RoleGate roles={['AGENT']}>
      <DashboardShell>
        <div className="border border-line bg-white p-5 sm:p-7">
          <EditListingLoader id={id} />
        </div>
      </DashboardShell>
    </RoleGate>
  );
}
