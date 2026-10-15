import type { Metadata } from 'next';
import { InboxList } from '@/components/notifications/inbox-list';
import { RoleGate } from '@/components/dashboard/role-gate';

export const metadata: Metadata = {
  title: 'Inbox | EstatePro',
  description: 'Your EstatePro inquiry notifications.',
};

export default function InboxPage() {
  return (
    <RoleGate roles={['USER', 'AGENT', 'ADMIN']}>
      <main className="page-container min-h-[65vh] py-10 md:py-14">
        <p className="eyebrow"><span className="eyebrow-rule" /> ESTATEPRO UPDATES</p>
        <h1 className="mt-3 font-display text-3xl font-medium">Your inbox.</h1>
        <p className="mt-2 text-sm text-muted">Inquiry updates for your EstatePro account.</p>
        <InboxList />
      </main>
    </RoleGate>
  );
}
