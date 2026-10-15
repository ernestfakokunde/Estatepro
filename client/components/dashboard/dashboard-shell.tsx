'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Inbox, LayoutDashboard, ListChecks, PlusCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

export function DashboardShell({ children, admin = false }: { children: React.ReactNode; admin?: boolean }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const items = admin
    ? [
        { href: '/admin', label: 'Overview', icon: LayoutDashboard },
        { href: '/admin', label: 'Review & manage', icon: ListChecks },
      ]
    : [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { href: '/dashboard/listings', label: 'My listings', icon: ListChecks },
        { href: '/dashboard/listings/new', label: 'Create listing', icon: PlusCircle },
        { href: '/dashboard/inquiries', label: 'Inquiries', icon: Inbox },
        { href: '/inbox', label: 'Notifications', icon: Bell },
      ];
  return (
    <main className="dashboard-wrap page-container py-8 md:py-12">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">
            <span className="eyebrow-rule" /> {admin ? 'ESTATEPRO ADMINISTRATION' : 'YOUR PROPERTY SPACE'}
          </p>
          <h1 className="mt-3 font-display text-3xl font-medium tracking-tight">
            {admin ? 'Admin workspace.' : `Welcome, ${user?.name.split(' ')[0]}.`}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {admin
              ? 'Review homes, support agents, and keep the community in good shape.'
              : 'A clear view of the homes you are helping people find.'}
          </p>
        </div>
        {admin && <ShieldCheck size={22} className="text-[#768879]" />}
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav
          aria-label="Workspace navigation"
          className="grid grid-cols-2 gap-2 border border-line bg-white p-2 sm:grid-cols-3 lg:grid-cols-1"
        >
          {items.map(({ href, label, icon: Icon }) => {
            const active =
              href === '/dashboard' || href === '/admin'
                ? pathname === href
                : pathname.startsWith(href.split('?')[0]);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex min-h-11 items-center gap-3 px-3 text-xs font-medium transition',
                  active ? 'bg-[#eff3ed] text-forest' : 'text-[#68726a] hover:bg-canvas',
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="min-w-0">{children}</div>
      </div>
    </main>
  );
}
