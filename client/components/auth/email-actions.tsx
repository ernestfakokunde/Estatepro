'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { apiFetch, jsonBody } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function VerifyEmail({ token = '' }: { token?: string }) {
  const started = useRef(false);
  const [message, setMessage] = useState('Verifying your email…');
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (!token) {
      setMessage('This verification link is missing its token.');
      setFailed(true);
      return;
    }
    apiFetch<{ message: string }>('/auth/verify-email', { method: 'POST', body: jsonBody({ token }) })
      .then((result) => setMessage(result.data.message))
      .catch((error) => {
        setMessage(error instanceof Error ? error.message : 'This verification link could not be used.');
        setFailed(true);
      });
  }, [token]);
  return (
    <div className="grid gap-4">
      <p role="status" className={`text-sm leading-6 ${failed ? 'text-rose-700' : 'text-muted'}`}>{message}</p>
      {failed && <Link href="/resend-verification" className="text-sm font-medium text-forest underline">Request another verification link</Link>}
      {!failed && message.startsWith('Email verified') && <Button href="/login">Sign in</Button>}
    </div>
  );
}

export function ForgotPasswordForm({ verificationOnly = false }: { verificationOnly?: boolean }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await apiFetch<{ message: string }>(verificationOnly ? '/auth/resend-verification' : '/auth/forgot-password', {
        method: 'POST', body: jsonBody({ email }),
      });
      setMessage(result.data.message);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'The request could not be sent.');
    } finally {
      setLoading(false);
    }
  }
  return message ? (
    <div className="grid gap-4" role="status">
      <p className="text-sm leading-6 text-forest">{message}</p>
      {verificationOnly && <p className="text-sm text-muted">Check your inbox for the verification link.</p>}
      <Button href="/login" variant="secondary">Back to sign in</Button>
    </div>
  ) : (
    <form onSubmit={submit} className="grid gap-4">
      <Input label="Email address" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      {error && <p role="alert" className="text-sm text-rose-700">{error}</p>}
      <Button type="submit" disabled={loading}>{loading ? 'Sending…' : verificationOnly ? 'Send verification link' : 'Send recovery link'}</Button>
      <Button href="/login" variant="ghost">Back to sign in</Button>
    </form>
  );
}

export function ResetPasswordForm({ token = '' }: { token?: string }) {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await apiFetch<{ message: string }>('/auth/reset-password', {
        method: 'POST', body: jsonBody({ token, password }),
      });
      setMessage(result.data.message);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'The password could not be updated.');
    } finally {
      setLoading(false);
    }
  }
  return message ? (
    <div className="grid gap-4" role="status"><p className="text-sm text-forest">{message}</p><Button href="/login">Sign in</Button></div>
  ) : (
    <form onSubmit={submit} className="grid gap-4">
      {!token && <p role="alert" className="text-sm text-rose-700">This reset link is missing its token.</p>}
      <Input label="New password" type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} hint="Use at least 8 characters." />
      {error && <p role="alert" className="text-sm text-rose-700">{error}</p>}
      <Button type="submit" disabled={loading || !token}>{loading ? 'Updating…' : 'Save new password'}</Button>
    </form>
  );
}
