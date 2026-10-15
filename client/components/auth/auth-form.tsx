'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { loginSchema, registerSchema, type LoginValues, type RegisterValues } from '@/lib/schemas';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type Props = { mode: 'login' | 'register'; nextPath?: string };

export function AuthForm({ mode, nextPath }: Props) {
  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState('');
  const isRegister = mode === 'register';
  const login = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });
  const register = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', phone: '' },
  });
  const form = isRegister ? register : login;
  const errors = form.formState.errors;

  async function submit(values: LoginValues | RegisterValues) {
    try {
      if (isRegister) {
        const result = await signUp(values as RegisterValues);
        setSuccessMessage(result.message);
        toast('Account created. You can now sign in.', 'success');
        return;
      }
      const user = await signIn(values as LoginValues);
      toast('Welcome back.', 'success');
      const destination =
        nextPath && nextPath.startsWith('/') && !nextPath.startsWith('//')
          ? nextPath
          : user.role === 'ADMIN'
            ? '/admin'
            : user.role === 'AGENT'
              ? '/dashboard'
              : '/listings';
      router.replace(destination);
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'We could not sign you in. Please try again.';
      form.setError('root', { message });
    }
  }

  if (successMessage)
    return (
      <div className="grid gap-4" role="status">
        <p className="border border-[#dce6dc] bg-[#f3f7f2] px-4 py-3 text-sm leading-6 text-forest">{successMessage}</p>
        <Button href="/login" variant="ghost">Go to sign in</Button>
      </div>
    );

  return (
    <form
      noValidate
      onSubmit={
        isRegister
          ? register.handleSubmit(submit as (values: RegisterValues) => Promise<void>)
          : login.handleSubmit(submit as (values: LoginValues) => Promise<void>)
      }
      className="grid gap-4"
    >
      {isRegister && (
        <Input
          label="Full name"
          required
          autoComplete="name"
          {...register.register('name')}
          error={register.formState.errors.name?.message}
        />
      )}
      <Input
        label="Email address"
        required
        type="email"
        autoComplete="email"
        {...(isRegister ? register.register('email') : login.register('email'))}
        error={errors.email?.message}
      />
      {isRegister && (
        <Input
          label="Phone number"
          type="tel"
          autoComplete="tel"
          placeholder="+234"
          {...register.register('phone')}
          error={register.formState.errors.phone?.message}
        />
      )}
      <Input
        label="Password"
        required
        type="password"
        autoComplete={isRegister ? 'new-password' : 'current-password'}
        {...(isRegister ? register.register('password') : login.register('password'))}
        error={errors.password?.message}
        hint={isRegister ? 'Use at least 8 characters.' : undefined}
      />
      {errors.root?.message && (
        <p
          role="alert"
          className="border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs leading-5 text-rose-800"
        >
          {errors.root.message}
        </p>
      )}
      <Button type="submit" disabled={form.formState.isSubmitting} className="mt-1 w-full">
        {form.formState.isSubmitting ? 'Please wait…' : isRegister ? 'Create your account' : 'Sign in'}{' '}
        <ArrowUpRight size={15} />
      </Button>
      <p className="text-center text-xs text-muted">
        {isRegister ? (
          <>
            Already have an account?{' '}
            <Link className="font-medium text-forest underline underline-offset-4" href="/login">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New to EstatePro?{' '}
            <Link className="font-medium text-forest underline underline-offset-4" href="/register">
              Create an account
            </Link>
          </>
        )}
      </p>
      {isRegister && (
        <p className="text-center text-sm text-muted">
          Want to represent homes? <Link className="font-medium text-forest underline" href="/register/agent">Apply as an agent</Link>
        </p>
      )}
      {!isRegister && <p className="text-center text-xs text-muted">Password recovery is temporarily unavailable while email delivery is disabled.</p>}
    </form>
  );
}

export function AuthAside({ register = false }: { register?: boolean }) {
  return (
    <aside className="auth-aside">
      <div className="auth-aside-photo" />
      <div className="relative z-10 max-w-sm">
        <p className="eyebrow !text-white/80">
          <span className="eyebrow-rule !bg-white/80" /> A PLACE TO BEGIN
        </p>
        <h2 className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight text-white">
          {register
            ? 'A clearer way to find your next home.'
            : 'Your next chapter starts with a good conversation.'}
        </h2>
        <ul className="mt-7 grid gap-3 text-xs text-white/85">
          {[
            'Homes selected with care',
            'Local advisors who know the details',
            'A smoother move from first look to keys',
          ].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <CheckCircle2 size={15} />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <span className="relative z-10 mt-auto text-[10px] text-white/70">
        Thoughtful homes. Lasting value.
      </span>
    </aside>
  );
}

export function AuthCard({
  children,
  register = false,
  agentApplication = false,
  heading,
  description,
}: {
  children: React.ReactNode;
  register?: boolean;
  agentApplication?: boolean;
  heading?: string;
  description?: string;
}) {
  return (
    <main className="auth-page">
      <div className={cn('auth-card', register && 'auth-card-wide')}>
        <div className="auth-form-side">
          <Link href="/" className="brand">
            <span className="brand-symbol">e</span>
            <span>
              estate<span className="brand-pro">pro</span>
              <span className="brand-dot">.</span>
            </span>
          </Link>
          <div className="mt-12">
            <p className="eyebrow">
              <span className="eyebrow-rule" /> {register ? 'A GOOD PLACE TO START' : 'WELCOME BACK'}
            </p>
            <h1 className="mt-4 font-display text-3xl font-medium tracking-tight">
              {heading ??
                (agentApplication
                  ? 'Apply to join our agent team.'
                  : register
                    ? 'Create your account.'
                    : 'Sign in to EstatePro.')}
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted">
              {description ??
                (agentApplication
                  ? 'Tell us about your experience. We review every agent application before granting listing access.'
                  : register
                    ? 'Save homes and talk with the people who know them best.'
                    : 'Pick up where you left off and keep moving forward.')}
            </p>
          </div>
          <div className="mt-7">{children}</div>
          <p className="mt-9 text-[10px] leading-4 text-muted">
            Your details are used to manage your account and support your home search.{' '}
            <Link className="text-forest underline underline-offset-2" href="/contact">
              Contact us
            </Link>
          </p>
        </div>
        <AuthAside register={register} />
      </div>
    </main>
  );
}
