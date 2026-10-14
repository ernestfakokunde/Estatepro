import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { PageTransition } from '@/components/layout/page-transition';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined,
  title: { default: 'EstatePro | Reliable homes for stable investments', template: '%s | EstatePro' },
  description:
    'Explore thoughtfully selected homes for sale and rent across Lagos, Abuja, and Nigeria with EstatePro.',
  applicationName: 'EstatePro',
  openGraph: {
    type: 'website',
    siteName: 'EstatePro',
    title: 'EstatePro | Reliable homes for stable investments',
    description: 'Find a home that feels like you, with local guidance from EstatePro.',
  },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#ffffff' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-NG">
      <body>
        <Providers>
          <Navbar />
          <PageTransition>
            <div className="min-h-[55vh]">{children}</div>
          </PageTransition>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
