'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { inquirySchema, type InquiryValues } from '@/lib/schemas';
import { apiFetch, jsonBody } from '@/lib/api';
import { toast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';

export function InquiryForm({ propertyId, agentName }: { propertyId?: string; agentName?: string }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<InquiryValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { propertyId, name: '', email: '', phone: '', message: '' },
  });
  async function submit(values: InquiryValues) {
    try {
      const result = await apiFetch<{ message: string }>('/inquiries', {
        method: 'POST',
        body: jsonBody(values),
      });
      toast(result.data.message, 'success');
      reset({ propertyId, name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Your inquiry could not be sent.', 'error');
    }
  }
  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="grid gap-4 border border-line bg-white p-5">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#758078]">
          {agentName ? `Speak with ${agentName}` : 'Have a question?'}
        </p>
        <h2 className="mt-2 font-display text-xl font-semibold">Arrange a conversation</h2>
        <p className="mt-2 text-xs leading-5 text-muted">
          Share a few details and a local advisor will be in touch.
        </p>
      </div>
      {propertyId && <input type="hidden" {...register('propertyId')} />}
      <Input
        label="Your name"
        required
        autoComplete="name"
        {...register('name')}
        error={errors.name?.message}
      />
      <Input
        label="Email address"
        required
        type="email"
        autoComplete="email"
        {...register('email')}
        error={errors.email?.message}
      />
      <Input
        label="Phone number"
        type="tel"
        autoComplete="tel"
        {...register('phone')}
        error={errors.phone?.message}
      />
      <Textarea
        label="How can we help?"
        required
        rows={4}
        placeholder="Tell us what you would like to know…"
        {...register('message')}
        error={errors.message?.message}
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending…' : isSubmitSuccessful ? 'Send another inquiry' : 'Send inquiry'}
      </Button>
      <p className="text-[10px] leading-4 text-muted">
        By sending this message, you agree that our team may contact you about your request.
      </p>
    </form>
  );
}
