import type { Metadata } from 'next';
import { BuyerInquiries } from '@/components/property/buyer-inquiries';
import { RoleGate } from '@/components/dashboard/role-gate';

export const metadata: Metadata = {
  title: 'My inquiries | EstatePro',
  description: 'Review the property inquiries you have sent.',
};

export default function MyInquiriesPage() {
  return (
    <RoleGate roles={['USER', 'AGENT', 'ADMIN']}>
      <main className="page-container min-h-[65vh] py-10 md:py-14">
        <p className="eyebrow"><span className="eyebrow-rule" /> YOUR HOME SEARCH</p>
        <h1 className="mt-3 font-display text-3xl font-medium">My inquiries</h1>
        <p className="mt-2 text-sm text-muted">See the messages you have sent about homes.</p>
        <BuyerInquiries />
      </main>
    </RoleGate>
  );
}
