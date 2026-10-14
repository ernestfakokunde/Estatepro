import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto grid w-[min(1160px,calc(100%-38px))] gap-9 py-10 md:w-[calc(100%-64px)] md:grid-cols-[1.2fr_.8fr_.8fr] md:py-12">
        <div>
          <Link className="brand" href="/">
            <span className="brand-symbol">e</span>
            <span>
              estate<span className="brand-pro">pro</span>
              <span className="brand-dot">.</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-muted">
            Thoughtfully selected homes, guided by local knowledge and a lasting point of view.
          </p>
        </div>
        <div>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[.12em] text-ink">Explore</h2>
          <div className="grid gap-3 text-sm text-muted">
            <Link href="/listings">All homes</Link>
            <Link href="/about">Our approach</Link>
            <Link href="/contact">Speak with our team</Link>
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[.12em] text-ink">Your account</h2>
          <div className="grid gap-3 text-sm text-muted">
            <Link href="/register">
              Create an account <ArrowUpRight className="ml-1 inline" size={13} />
            </Link>
            <Link href="/login">Sign in</Link>
            <span>Lagos &middot; Abuja &middot; Niger State</span>
          </div>
        </div>
      </div>
      <div className="mx-auto flex w-[min(1160px,calc(100%-38px))] flex-wrap items-center justify-between gap-3 border-t border-line py-4 text-[11px] text-muted md:w-[calc(100%-64px)]">
        <span>&copy; {new Date().getFullYear()} EstatePro. All rights reserved.</span>
        <Link href="/contact" className="inline-flex items-center gap-1 font-medium text-forest">
          A thoughtful move begins here <ArrowUpRight size={13} />
        </Link>
      </div>
    </footer>
  );
}
