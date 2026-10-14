'use client';

import { Share2 } from 'lucide-react';
import { toast } from '@/components/ui/toast';

export function ShareButton({ title }: { title: string }) {
  async function share() {
    try {
      if (navigator.share) await navigator.share({ title, url: window.location.href });
      else {
        await navigator.clipboard.writeText(window.location.href);
        toast('Home link copied to your clipboard.', 'success');
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast('Home link copied to your clipboard.', 'success');
      } catch {
        toast('This link could not be shared from this browser.', 'error');
      }
    }
  }
  return (
    <button
      type="button"
      className="inline-flex min-h-10 items-center gap-2 border border-line px-3 text-xs font-medium text-[#536459] hover:bg-canvas"
      onClick={() => void share()}
    >
      <Share2 size={14} /> Share
    </button>
  );
}
