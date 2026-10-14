import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="page-container grid min-h-[70vh] place-content-center py-16 text-center">
      <p className="eyebrow justify-center">
        <span className="eyebrow-rule" /> THIS HOME HAS MOVED ON
      </p>
      <h1 className="mt-5 font-display text-5xl font-medium tracking-tight">
        A new <em>direction.</em>
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
        The page you are looking for is unavailable. Explore our current homes or let our team help you find
        something similar.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button href="/listings">
          <ArrowUpRight size={15} />
          Explore homes
        </Button>
        <Link className="inline-flex min-h-11 items-center gap-2 border border-line px-5 text-sm" href="/">
          <ArrowLeft size={15} />
          Return home
        </Link>
      </div>
    </main>
  );
}
