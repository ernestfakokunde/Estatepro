'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowUpRight, Heart, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/listings', label: 'Explore homes' },
  { href: '/about', label: 'Our approach' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleSignOut() {
    try {
      await signOut();
    } finally {
      setMenuOpen(false);
      router.push('/');
      router.refresh();
    }
  }

  const roleHref = user?.role === 'ADMIN' ? '/admin' : user?.role === 'AGENT' ? '/dashboard' : '/favorites';
  return (
    <header className="site-header sticky top-0 z-40 border-b border-[#f0f1ee] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[76px] w-[min(1160px,calc(100%-36px))] items-center justify-between gap-5 md:h-[82px] md:w-[calc(100%-64px)]">
        <Link className="brand" href="/" aria-label="EstatePro home">
          <span className="brand-symbol">e</span>
          <span>
            estate<span className="brand-pro">pro</span>
            <span className="brand-dot">.</span>
          </span>
        </Link>
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-8 text-xs text-[#6f766f] md:flex"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href || pathname.startsWith(`${item.href}/`) ? 'page' : undefined}
              className={`min-h-11 border-b-2 border-transparent py-3 transition hover:text-forest ${pathname === item.href || pathname.startsWith(`${item.href}/`) ? 'border-forest text-forest' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-4 md:flex">
          {user && user.role !== 'USER' && (
            <Link
              className="relative rounded-full p-2 text-[#657268] hover:bg-canvas"
              href="/favorites"
              aria-label="Your favorite homes"
            >
              <Heart size={17} />
            </Link>
          )}
          {user?.role === 'USER' && (
            <Link href="/my-inquiries" className="text-sm font-medium text-ink hover:text-forest">
              My inquiries
            </Link>
          )}
          {loading ? (
            <span className="h-9 w-24 animate-pulse bg-canvas" />
          ) : user ? (
            <>
              <Link href={roleHref} className="text-sm font-medium text-ink hover:text-forest">
                {user.role === 'USER' ? 'Saved homes' : user.name.split(' ')[0]}
              </Link>
              <button onClick={handleSignOut} className="text-xs text-muted hover:text-ink">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-xs font-medium text-ink">
                Sign in
              </Link>
              <Button href="/register" className="min-h-10 px-4 text-xs">
                Join EstatePro <ArrowUpRight size={14} />
              </Button>
            </>
          )}
        </div>
        <button
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          className="rounded-sm p-2 text-ink md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="grid gap-1 border-t border-line bg-white px-5 py-4 md:hidden"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              aria-current={pathname === item.href || pathname.startsWith(`${item.href}/`) ? 'page' : undefined}
              className={`px-2 py-3 text-sm text-ink ${pathname === item.href || pathname.startsWith(`${item.href}/`) ? 'bg-canvas font-medium text-forest' : ''}`}
            >
              {item.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link
                href="/favorites"
                onClick={() => setMenuOpen(false)}
                className="px-2 py-3 text-sm text-ink"
              >
                Saved homes
              </Link>
              {user.role === 'USER' && (
                <Link href="/my-inquiries" onClick={() => setMenuOpen(false)} className="px-2 py-3 text-sm text-ink">
                  My inquiries
                </Link>
              )}
              {user.role !== 'USER' && (
                <Link href={roleHref} onClick={() => setMenuOpen(false)} className="px-2 py-3 text-sm text-ink">
                  My workspace
                </Link>
              )}
              <button onClick={handleSignOut} className="px-2 py-3 text-left text-sm text-ink">
                Sign out
              </button>
            </>
          ) : (
            <div className="flex gap-3 px-2 pt-2">
              <Button href="/login" variant="secondary" className="flex-1">
                Sign in
              </Button>
              <Button href="/register" className="flex-1">
                Create account
              </Button>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
