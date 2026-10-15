'use client';

import { useEffect, useState } from 'react';
import { BadgeCheck, CircleAlert, RefreshCw, Users } from 'lucide-react';
import { apiFetch, jsonBody } from '@/lib/api';
import type { ApiUser } from '@/types/api';
import type { Property, PropertyStatus, UserRole } from '@/types/property';
import { formatNaira, titleCase } from '@/lib/utils';
import { toast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useAuth } from '@/context/AuthContext';

type Summary = {
  users: number;
  properties: number;
  pendingReview: number;
  newInquiries: number;
  agentApplications: number;
};
type ManagedUser = ApiUser & { isActive: boolean; createdAt: string };
type AgentApplication = {
  id: string;
  agency: string | null;
  licenseNumber: string | null;
  bio: string | null;
  user: { id: string; name: string; email: string; phone: string | null; createdAt: string };
};
type Tab = 'properties' | 'agents' | 'users';

export function AdminPanel() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [agents, setAgents] = useState<AgentApplication[]>([]);
  const [tab, setTab] = useState<Tab>('properties');
  const [status, setStatus] = useState<PropertyStatus | ''>('PENDING');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [userQuery, setUserQuery] = useState('');
  const debouncedUserQuery = useDebouncedValue(userQuery, 250);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    Promise.all([
      apiFetch<Summary>('/admin/summary'),
      tab === 'properties'
        ? apiFetch<Property[]>(`/admin/properties?limit=50${status ? `&status=${status}` : ''}`)
        : Promise.resolve(null),
      tab === 'users'
        ? apiFetch<ManagedUser[]>(
            `/admin/users?limit=50${debouncedUserQuery ? `&q=${encodeURIComponent(debouncedUserQuery)}` : ''}`,
          )
        : Promise.resolve(null),
      tab === 'agents' ? apiFetch<AgentApplication[]>('/admin/agents') : Promise.resolve(null),
    ])
      .then(([summaryResult, propertyResult, userResult, agentResult]) => {
        if (!active) return;
        setSummary(summaryResult.data);
        if (propertyResult) setProperties(propertyResult.data);
        if (userResult) setUsers(userResult.data);
        if (agentResult) setAgents(agentResult.data);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [tab, status, retry, debouncedUserQuery]);

  async function moderate(id: string, next: PropertyStatus) {
    try {
      await apiFetch(`/admin/properties/${id}/status`, { method: 'PATCH', body: jsonBody({ status: next }) });
      toast(`Listing marked ${titleCase(next).toLowerCase()}.`, 'success');
      setRetry((value) => value + 1);
    } catch (error) {
      toast(error instanceof Error ? error.message : 'The listing could not be updated.', 'error');
    }
  }

  async function updateUser(id: string, input: { role?: UserRole; isActive?: boolean }) {
    try {
      await apiFetch(`/admin/users/${id}`, { method: 'PATCH', body: jsonBody(input) });
      toast('Account updated.', 'success');
      setRetry((value) => value + 1);
    } catch (error) {
      toast(error instanceof Error ? error.message : 'The account could not be updated.', 'error');
    }
  }

  async function reviewAgent(id: string, status: 'APPROVED' | 'REJECTED') {
    try {
      await apiFetch(`/admin/agents/${id}/status`, { method: 'PATCH', body: jsonBody({ status }) });
      toast(`Agent application ${status.toLowerCase()}.`, 'success');
      setRetry((value) => value + 1);
    } catch (error) {
      toast(error instanceof Error ? error.message : 'The application could not be updated.', 'error');
    }
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ['People', summary?.users, Users],
          ['All homes', summary?.properties, BadgeCheck],
          ['Awaiting review', summary?.pendingReview, CircleAlert],
          ['New inquiries', summary?.newInquiries, RefreshCw],
          ['Agent applications', summary?.agentApplications, Users],
        ].map(([label, value, Icon]) => {
          const StatIcon = Icon as typeof Users;
          return (
            <article key={String(label)} className="border border-line bg-white p-4">
              <StatIcon size={17} className="text-[#829184]" />
              <p className="mt-3 text-[10px] uppercase tracking-[.1em] text-muted">{String(label)}</p>
              {loading ? (
                <Skeleton className="mt-2 h-7 w-14" />
              ) : (
                <strong className="mt-1 block font-display text-2xl font-medium">{String(value ?? 0)}</strong>
              )}
            </article>
          );
        })}
      </div>
      <section className="border border-line bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold">Review and manage</h2>
            <p className="mt-1 text-xs text-muted">Keep the marketplace accurate and useful.</p>
          </div>
          <div role="tablist" aria-label="Admin records" className="flex border border-line p-1">
            <button
              role="tab"
              aria-selected={tab === 'agents'}
              onClick={() => setTab('agents')}
              className={`min-h-9 px-3 text-xs ${tab === 'agents' ? 'bg-forest text-white' : 'text-muted'}`}
            >
              Agent applications{summary?.agentApplications ? ` (${summary.agentApplications})` : ''}
            </button>
            <button
              role="tab"
              aria-selected={tab === 'properties'}
              onClick={() => setTab('properties')}
              className={`min-h-9 px-3 text-xs ${tab === 'properties' ? 'bg-forest text-white' : 'text-muted'}`}
            >
              Listings
            </button>
            <button
              role="tab"
              aria-selected={tab === 'users'}
              onClick={() => setTab('users')}
              className={`min-h-9 px-3 text-xs ${tab === 'users' ? 'bg-forest text-white' : 'text-muted'}`}
            >
              People
            </button>
          </div>
        </div>
        {tab === 'properties' && (
          <div className="mt-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-xs font-medium">
                Review status
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value as PropertyStatus | '')}
                  className="min-h-9 border border-line bg-white px-2"
                >
                  <option value="">All statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </label>
              <span className="text-xs text-muted">{properties.length} shown</span>
            </div>
            {loading && (
              <div className="mt-4 grid gap-3">
                {[0, 1].map((item) => (
                  <Skeleton key={item} className="h-24 w-full" />
                ))}
              </div>
            )}
            {!loading && error && (
              <div role="alert" className="empty-state mt-4">
                <h3>Listings could not be loaded.</h3>
                <Button type="button" variant="secondary" onClick={() => setRetry((value) => value + 1)}>
                  Try again
                </Button>
              </div>
            )}
            {!loading && !error && properties.length === 0 && (
              <div className="empty-state mt-4">
                <span className="empty-mark">
                  <BadgeCheck />
                </span>
                <h3>No listings need attention.</h3>
                <p>New agent submissions will appear here for review.</p>
              </div>
            )}
            {!loading && !error && properties.length > 0 && (
              <div className="mt-3 divide-y divide-line">
                {properties.map((property) => (
                  <article
                    key={property.id}
                    className="flex flex-wrap items-center justify-between gap-4 py-4"
                  >
                    <div className="min-w-[14rem] flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold">{property.title}</h3>
                        <span className={`status-chip status-${property.status.toLowerCase()}`}>
                          {titleCase(property.status)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted">
                        {property.city}, {property.state} · {formatNaira(property.price)} ·{' '}
                        {property.agent.name}
                      </p>
                      <p className="mt-1 max-w-2xl text-xs leading-5 text-[#69736c]">
                        {property.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {property.status !== 'APPROVED' && (
                        <Button
                          type="button"
                          className="min-h-9 px-3 text-xs"
                          onClick={() => void moderate(property.id, 'APPROVED')}
                        >
                          Approve
                        </Button>
                      )}
                      {property.status !== 'REJECTED' && (
                        <Button
                          type="button"
                          variant="secondary"
                          className="min-h-9 px-3 text-xs"
                          onClick={() => void moderate(property.id, 'REJECTED')}
                        >
                          Reject
                        </Button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
        {tab === 'users' && (
          <div className="mt-5">
            <p className="text-xs text-muted">Manage account access and agent permissions.</p>
            <div className="mt-4 max-w-sm">
              <Input
                label="Find a person"
                value={userQuery}
                onChange={(event) => setUserQuery(event.target.value)}
                placeholder="Name or email address"
              />
            </div>
            {loading && (
              <div className="mt-4 grid gap-3">
                {[0, 1, 2].map((item) => (
                  <Skeleton key={item} className="h-16 w-full" />
                ))}
              </div>
            )}
            {!loading && error && (
              <div role="alert" className="empty-state mt-4">
                <h3>Accounts could not be loaded.</h3>
                <Button type="button" variant="secondary" onClick={() => setRetry((value) => value + 1)}>
                  Try again
                </Button>
              </div>
            )}
            {!loading && !error && users.length === 0 && (
              <div className="empty-state mt-4">
                <span className="empty-mark">
                  <Users />
                </span>
                <h3>No accounts were found.</h3>
              </div>
            )}
            {!loading &&
              !error &&
              users.map((person) => {
                const isSelf = person.id === user?.id;
                return (
                  <article
                    key={person.id}
                    className="flex flex-wrap items-center justify-between gap-4 border-b border-line py-4"
                  >
                    <div>
                      <h3 className="text-sm font-semibold">
                        {person.name}
                        {isSelf && <span className="ml-2 text-[10px] font-normal text-muted">You</span>}
                      </h3>
                      <p className="mt-1 text-xs text-muted">
                        {person.email} · Joined{' '}
                        {new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium' }).format(
                          new Date(person.createdAt),
                        )}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="text-[10px] text-muted">
                        Role
                        <select
                          aria-label={`Role for ${person.name}`}
                          disabled={isSelf}
                          value={person.role}
                          onChange={(event) =>
                            void updateUser(person.id, { role: event.target.value as UserRole })
                          }
                          className="ml-2 min-h-9 border border-line bg-white px-2 text-xs disabled:opacity-60"
                        >
                          <option value="USER">User</option>
                          <option value="AGENT" disabled={person.role !== 'AGENT'}>Agent (approved)</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </label>
                      <Button
                        type="button"
                        variant={person.isActive ? 'secondary' : 'primary'}
                        className="min-h-9 px-3 text-xs"
                        disabled={isSelf}
                        onClick={() => void updateUser(person.id, { isActive: !person.isActive })}
                      >
                        {person.isActive ? 'Suspend' : 'Restore'}
                      </Button>
                    </div>
                  </article>
                );
              })}
          </div>
        )}
        {tab === 'agents' && (
          <div className="mt-5">
            <p className="text-xs text-muted">Review verified email addresses before granting listing access.</p>
            {loading && <Skeleton className="mt-4 h-20 w-full" />}
            {!loading && error && (
              <div role="alert" className="empty-state mt-4">
                <h3>Agent applications could not be loaded.</h3>
                <Button type="button" variant="secondary" onClick={() => setRetry((value) => value + 1)}>
                  Try again
                </Button>
              </div>
            )}
            {!loading && !error && agents.length === 0 && (
              <div className="empty-state mt-4">
                <span className="empty-mark"><Users /></span>
                <h3>No agent applications to review.</h3>
              </div>
            )}
            {!loading && !error && agents.map((application) => (
              <article key={application.id} className="mt-4 flex flex-wrap items-start justify-between gap-4 border border-line p-4">
                <div className="min-w-[14rem] flex-1">
                  <h3 className="text-sm font-semibold">{application.user.name}</h3>
                  <p className="mt-1 text-xs text-muted">
                    {application.user.email} · {application.user.phone}
                  </p>
                  {application.agency && <p className="mt-2 text-sm">Agency: {application.agency}</p>}
                  {application.licenseNumber && <p className="mt-1 text-sm">License: {application.licenseNumber}</p>}
                  {application.bio && <p className="mt-2 text-sm leading-6 text-muted">{application.bio}</p>}
                </div>
                <div className="flex gap-2">
                  <Button type="button" onClick={() => void reviewAgent(application.id, 'APPROVED')}>
                    Approve
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => void reviewAgent(application.id, 'REJECTED')}>
                    Reject
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
