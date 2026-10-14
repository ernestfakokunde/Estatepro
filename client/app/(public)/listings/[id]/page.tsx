import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, BadgeCheck, Bath, BedDouble, Maximize2 } from 'lucide-react';
import { apiFetch, ApiError } from '@/lib/api';
import { formatArea, formatNaira, titleCase } from '@/lib/utils';
import type { Property } from '@/types/property';
import { PropertyGallery } from '@/components/property/property-gallery';
import { PropertyMap } from '@/components/property/property-map';
import { InquiryForm } from '@/components/property/inquiry-form';
import { ShareButton } from '@/components/property/share-button';
import { PropertyCard } from '@/components/property/property-card';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';
type RouteParams = { params: Promise<{ id: string }> };

async function fetchProperty(id: string) {
  return apiFetch<Property>(`/properties/${encodeURIComponent(id)}`);
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { id } = await params;
  try {
    const result = await fetchProperty(id);
    return { title: `${result.data.title} | EstatePro`, description: result.data.description.slice(0, 155) };
  } catch {
    return {
      title: 'Home details | EstatePro',
      description: 'Explore a carefully selected home with EstatePro.',
    };
  }
}

export default async function ListingDetailPage({ params }: RouteParams) {
  const { id } = await params;
  let property: Property;
  try {
    property = (await fetchProperty(id)).data;
  } catch (error) {
    if (error instanceof ApiError && error.code === 'NOT_FOUND') notFound();
    return (
      <main className="page-container py-24">
        <Link className="inline-flex items-center gap-2 text-sm text-forest" href="/listings">
          <ArrowLeft size={15} /> Back to homes
        </Link>
        <div role="alert" className="empty-state mt-8">
          <h1>We could not load this home.</h1>
          <p>Check your connection and try again, or contact our local team for help.</p>
          <Button href="/contact">Speak with our team</Button>
        </div>
      </main>
    );
  }
  const related = await apiFetch<Property[]>(`/properties/${encodeURIComponent(property.id)}/related`)
    .then((result) => result.data)
    .catch(() => []);
  const location = `${property.city}, ${property.state}`;
  return (
    <main className="page-container py-7 md:py-10">
      <Link
        className="mb-5 inline-flex items-center gap-2 text-xs font-medium text-[#59685d] hover:text-forest"
        href="/listings"
      >
        <ArrowLeft size={14} /> Back to homes
      </Link>
      <PropertyGallery images={property.images} title={property.title} />
      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_350px] xl:gap-12">
        <div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#eff3ed] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[.08em] text-forest">
                  {property.type === 'SALE' ? 'For sale' : 'For rent'}
                </span>
                <span className="px-1 py-1 text-[10px] uppercase tracking-[.08em] text-muted">
                  {titleCase(property.category)}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-[#748174]">
                  <BadgeCheck size={13} /> EstatePro reviewed
                </span>
              </div>
              <h1 className="mt-3 font-display text-3xl font-medium tracking-tight sm:text-4xl">
                {property.title}
              </h1>
              <p className="mt-2 text-sm text-muted">
                {property.address}, {location}
              </p>
            </div>
            <ShareButton title={property.title} />
          </div>
          <div className="mt-6 grid grid-cols-3 border-y border-line py-4">
            <div className="grid gap-1">
              <span className="text-[10px] uppercase tracking-[.08em] text-muted">Interior</span>
              <strong className="flex items-center gap-2 text-sm font-medium">
                <Maximize2 size={15} />
                {formatArea(property.area)}
              </strong>
            </div>
            <div className="grid gap-1">
              <span className="text-[10px] uppercase tracking-[.08em] text-muted">Bedrooms</span>
              <strong className="flex items-center gap-2 text-sm font-medium">
                <BedDouble size={15} />
                {property.bedrooms ?? '—'}
              </strong>
            </div>
            <div className="grid gap-1">
              <span className="text-[10px] uppercase tracking-[.08em] text-muted">Bathrooms</span>
              <strong className="flex items-center gap-2 text-sm font-medium">
                <Bath size={15} />
                {property.bathrooms ?? '—'}
              </strong>
            </div>
          </div>
          <section className="py-7">
            <h2 className="font-display text-xl font-semibold">About this home</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#68726a]">
              {property.description}
            </p>
          </section>
          {property.features.length > 0 && (
            <section className="border-t border-line py-7">
              <h2 className="font-display text-xl font-semibold">Home features</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {property.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-[#657067]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#7e927f]" />
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          )}
          <div className="border-t border-line pt-6">
            <PropertyMap property={property} />
          </div>
        </div>
        <aside className="grid gap-4 lg:sticky lg:top-24">
          <div className="border border-line bg-white p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[.12em] text-muted">
              {property.type === 'SALE' ? 'ASKING PRICE' : 'ANNUAL RENT'}
            </p>
            <p className="mt-2 font-display text-3xl font-semibold tracking-tight">
              {formatNaira(property.price)}
            </p>
            {property.type === 'RENT' && <p className="mt-1 text-xs text-muted">per year</p>}
            <p className="mt-4 border-t border-line pt-4 text-xs leading-5 text-muted">
              A local property advisor can share more about this home and help arrange a viewing.
            </p>
            <InquiryForm propertyId={property.id} agentName={property.agent.name} />
          </div>
        </aside>
        <div className="lg:col-span-2">
          {related.length > 0 && (
            <section className="mt-9 border-t border-line pt-8">
              <div className="mb-5 flex items-end justify-between gap-3">
                <div>
                  <p className="eyebrow">
                    <span className="eyebrow-rule" /> MORE TO EXPLORE
                  </p>
                  <h2 className="mt-3 font-display text-2xl font-medium">Similar homes nearby</h2>
                </div>
                <Link className="text-xs font-medium text-forest" href="/listings">
                  View all <ArrowUpRight className="ml-1 inline" size={14} />
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {related.map((item, index) => (
                  <PropertyCard key={item.id} property={item} index={index} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
