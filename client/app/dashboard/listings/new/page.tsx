import type { Metadata } from 'next';
import { ListingEditor } from '@/components/dashboard/listing-editor';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { RoleGate } from '@/components/dashboard/role-gate';

export const metadata: Metadata = {
  title: 'Create a listing | EstatePro',
  description: 'Share a home with the EstatePro community.',
};
export default function NewListingPage() {
  return (
    <RoleGate roles={['AGENT']}>
      <DashboardShell>
        <div className="border border-line bg-white p-5 sm:p-7">
          <ListingEditor />
        </div>
      </DashboardShell>
    </RoleGate>
  );
}
