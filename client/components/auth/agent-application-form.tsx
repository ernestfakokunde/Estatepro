'use client';

import { useState } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { agentRegisterSchema, type AgentRegisterValues } from '@/lib/schemas';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';

export function AgentApplicationForm() {
  const { applyAsAgent } = useAuth();
  const [success, setSuccess] = useState('');
  const form = useForm<AgentRegisterValues>({
    resolver: zodResolver(agentRegisterSchema),
    defaultValues: { name: '', email: '', password: '', phone: '', agency: '', licenseNumber: '', bio: '' },
  });

  async function submit(values: AgentRegisterValues) {
    try {
      const result = await applyAsAgent(values);
      setSuccess(result.message);
    } catch (error) {
      form.setError('root', { message: error instanceof Error ? error.message : 'Your application could not be sent.' });
    }
  }

  if (success)
    return (
      <div className="grid gap-4" role="status">
        <p className="border border-[#dce6dc] bg-[#f3f7f2] px-4 py-3 text-sm leading-6 text-forest">{success}</p>
        <p className="text-sm leading-6 text-muted">Email verification is temporarily disabled. An EstatePro admin must approve your application before you can list homes.</p>
        <Button href="/login" variant="secondary">Go to sign in</Button>
      </div>
    );

  return (
    <form noValidate onSubmit={form.handleSubmit(submit)} className="grid gap-4">
      <Input label="Full name" required autoComplete="name" {...form.register('name')} error={form.formState.errors.name?.message} />
      <Input label="Email address" required type="email" autoComplete="email" {...form.register('email')} error={form.formState.errors.email?.message} />
      <Input label="Phone number (used for WhatsApp contact)" required type="tel" autoComplete="tel" placeholder="+234 803 000 0000" {...form.register('phone')} error={form.formState.errors.phone?.message} />
      <Input label="Agency (optional)" {...form.register('agency')} error={form.formState.errors.agency?.message} />
      <Input label="License or registration number (optional)" {...form.register('licenseNumber')} error={form.formState.errors.licenseNumber?.message} />
      <Textarea label="Short professional bio (optional)" rows={4} {...form.register('bio')} error={form.formState.errors.bio?.message} />
      <Input label="Password" required type="password" autoComplete="new-password" hint="Use at least 8 characters." {...form.register('password')} error={form.formState.errors.password?.message} />
      {form.formState.errors.root?.message && <p role="alert" className="text-sm text-rose-700">{form.formState.errors.root.message}</p>}
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? 'Submitting…' : 'Submit agent application'}
      </Button>
      <p className="text-center text-sm text-muted">Already have an account? <Link className="text-forest underline" href="/login">Sign in</Link></p>
    </form>
  );
}
