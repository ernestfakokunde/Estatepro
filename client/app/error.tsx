'use client';

import { useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main className="page-container grid min-h-[65vh] place-content-center py-16 text-center">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#eff3ed] text-forest">
        <RefreshCw />
      </span>
      <h1 className="mt-5 font-display text-2xl font-medium">That did not go as planned.</h1>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
        A page error interrupted this request. Try again or return to the homes page.
      </p>
      <Button type="button" onClick={reset} className="mx-auto mt-5">
        Try again
      </Button>
    </main>
  );
}
