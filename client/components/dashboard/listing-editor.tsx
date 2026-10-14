'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, ImagePlus, Trash2, Upload } from 'lucide-react';
import { propertySchema, type PropertyFormValues } from '@/lib/schemas';
import type { Property, PropertyImage } from '@/types/property';
import { apiFetch, jsonBody } from '@/lib/api';
import { propertyCategories } from '@/lib/constants';
import { titleCase } from '@/lib/utils';
import { toast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';

type UploadedImage = { url: string; publicId: string; alt: string };
const blank: PropertyFormValues = {
  title: '',
  description: '',
  price: 0,
  type: 'SALE',
  category: 'HOUSE',
  bedrooms: null,
  bathrooms: null,
  area: 0,
  address: '',
  city: '',
  state: '',
  lat: null,
  lng: null,
  featuresText: '',
};

export function ListingEditor({ initial }: { initial?: Property }) {
  const router = useRouter();
  const [values, setValues] = useState<PropertyFormValues>(
    initial
      ? {
          title: initial.title,
          description: initial.description,
          price: Number(initial.price),
          type: initial.type,
          category: initial.category,
          bedrooms: initial.bedrooms,
          bathrooms: initial.bathrooms,
          area: Number(initial.area),
          address: initial.address,
          city: initial.city,
          state: initial.state,
          lat: initial.lat,
          lng: initial.lng,
          featuresText: initial.features.join(', '),
        }
      : blank,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [images, setImages] = useState<PropertyImage[]>(initial?.images ?? []);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [photoError, setPhotoError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  function update<K extends keyof PropertyFormValues>(key: K, value: PropertyFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = propertySchema.safeParse(values);
    if (!parsed.success) {
      setErrors(
        Object.fromEntries(
          Object.entries(parsed.error.flatten().fieldErrors)
            .filter(([, messages]) => messages?.[0])
            .map(([key, messages]) => [key, messages![0]]),
        ),
      );
      return;
    }
    setSaving(true);
    try {
      let uploaded: UploadedImage[] = [];
      if (files.length) {
        const formData = new FormData();
        files.forEach((file) => formData.append('images', file));
        uploaded = (await apiFetch<UploadedImage[]>('/upload', { method: 'POST', body: formData })).data;
      }
      const payload = {
        title: parsed.data.title,
        description: parsed.data.description,
        price: parsed.data.price,
        type: parsed.data.type,
        category: parsed.data.category,
        bedrooms: parsed.data.bedrooms,
        bathrooms: parsed.data.bathrooms,
        area: parsed.data.area,
        address: parsed.data.address,
        city: parsed.data.city,
        state: parsed.data.state,
        lat: parsed.data.lat,
        lng: parsed.data.lng,
        features: (parsed.data.featuresText ?? '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        images: [...images.map(({ url, publicId, alt }) => ({ url, publicId, alt })), ...uploaded],
      };
      const response = await apiFetch<Property>(initial ? `/properties/${initial.id}` : '/properties', {
        method: initial ? 'PUT' : 'POST',
        body: jsonBody(payload),
      });
      toast(
        initial ? 'Your changes were submitted for review.' : 'Your listing was submitted for review.',
        'success',
      );
      router.push(`/dashboard/listings?created=${encodeURIComponent(response.data.id)}`);
      router.refresh();
    } catch (error) {
      toast(error instanceof Error ? error.message : 'The listing could not be saved.', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form noValidate onSubmit={submit} className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[.12em] text-muted">PROPERTY DETAILS</p>
          <h2 className="mt-2 font-display text-xl font-semibold">
            {initial ? 'Edit your home' : 'Tell us about this home'}
          </h2>
        </div>
        <Button href="/dashboard/listings" variant="secondary" className="min-h-9 px-3 text-xs">
          <ArrowLeft size={14} />
          Back to listings
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Input
            label="Listing title"
            required
            maxLength={140}
            value={values.title}
            onChange={(event) => update('title', event.target.value)}
            error={errors.title}
            placeholder="A light-filled family home in Maitama"
          />
        </div>
        <div className="sm:col-span-2">
          <Textarea
            label="Description"
            required
            minLength={30}
            maxLength={12000}
            rows={6}
            value={values.description}
            onChange={(event) => update('description', event.target.value)}
            error={errors.description}
            placeholder="Describe what makes this home and its location special…"
          />
        </div>
        <label className="grid gap-1.5 text-xs font-semibold text-ink">
          Listing purpose
          <select
            value={values.type}
            onChange={(event) => update('type', event.target.value as PropertyFormValues['type'])}
            className="h-11 border border-line bg-white px-3 text-sm font-normal"
          >
            <option value="SALE">For sale</option>
            <option value="RENT">For rent</option>
          </select>
        </label>
        <label className="grid gap-1.5 text-xs font-semibold text-ink">
          Property type
          <select
            value={values.category}
            onChange={(event) => update('category', event.target.value as PropertyFormValues['category'])}
            className="h-11 border border-line bg-white px-3 text-sm font-normal"
          >
            {propertyCategories.map((category) => (
              <option value={category} key={category}>
                {titleCase(category)}
              </option>
            ))}
          </select>
        </label>
        <Input
          label={values.type === 'SALE' ? 'Asking price' : 'Annual rent'}
          required
          type="number"
          min={1}
          value={values.price || ''}
          onChange={(event) => update('price', Number(event.target.value))}
          error={errors.price}
          suffix="₦"
        />
        <Input
          label="Interior area"
          required
          type="number"
          min={1}
          value={values.area || ''}
          onChange={(event) => update('area', Number(event.target.value))}
          error={errors.area}
          suffix="m²"
        />
        <Input
          label="Bedrooms"
          type="number"
          min={0}
          value={values.bedrooms ?? ''}
          onChange={(event) =>
            update('bedrooms', event.target.value === '' ? null : Number(event.target.value))
          }
          error={errors.bedrooms}
        />
        <Input
          label="Bathrooms"
          type="number"
          min={0}
          value={values.bathrooms ?? ''}
          onChange={(event) =>
            update('bathrooms', event.target.value === '' ? null : Number(event.target.value))
          }
          error={errors.bathrooms}
        />
        <div className="sm:col-span-2">
          <Input
            label="Street address"
            required
            value={values.address}
            onChange={(event) => update('address', event.target.value)}
            error={errors.address}
          />
        </div>
        <Input
          label="City or town"
          required
          value={values.city}
          onChange={(event) => update('city', event.target.value)}
          error={errors.city}
        />
        <Input
          label="State or territory"
          required
          value={values.state}
          onChange={(event) => update('state', event.target.value)}
          error={errors.state}
        />
        <Input
          label="Latitude (optional)"
          type="number"
          min={-90}
          max={90}
          step="any"
          value={values.lat ?? ''}
          onChange={(event) => update('lat', event.target.value === '' ? null : Number(event.target.value))}
          error={errors.lat}
          hint="Used to place this home on the map."
        />
        <Input
          label="Longitude (optional)"
          type="number"
          min={-180}
          max={180}
          step="any"
          value={values.lng ?? ''}
          onChange={(event) => update('lng', event.target.value === '' ? null : Number(event.target.value))}
          error={errors.lng}
        />
        <div className="sm:col-span-2">
          <Input
            label="Features"
            hint="Separate each item with a comma."
            value={values.featuresText}
            onChange={(event) => update('featuresText', event.target.value)}
            error={errors.featuresText}
            placeholder="Garden, fitted kitchen, 24-hour security"
          />
        </div>
      </div>
      <section className="grid gap-3 border-t border-line pt-5">
        <div>
          <h3 className="text-sm font-semibold">Photos</h3>
          <p className="mt-1 text-xs text-muted">
            Add up to 12 clear photos. JPG, PNG, WebP or AVIF · maximum 10 MB each.
          </p>
        </div>
        <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-[#cfd6cd] bg-[#fafbf9] text-xs text-[#536459] hover:bg-[#f3f6f2]">
          <ImagePlus size={20} />
          <span>Choose property photos</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            className="sr-only"
            onChange={(event) => {
              const chosen = Array.from(event.target.files ?? []);
              const invalid = chosen.find((file) => file.size > 10 * 1024 * 1024);
              if (invalid) {
                setPhotoError(`${invalid.name} is larger than 10 MB.`);
                event.target.value = '';
                return;
              }
              const allowed = chosen.every((file) =>
                ['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type),
              );
              if (!allowed) {
                setPhotoError('Use JPG, PNG, WebP or AVIF images.');
                event.target.value = '';
                return;
              }
              const available = 12 - images.length - files.length;
              if (chosen.length > available)
                setPhotoError(`You can add ${available} more photo${available === 1 ? '' : 's'}.`);
              else setPhotoError('');
              setFiles((current) => [...current, ...chosen.slice(0, available)]);
              event.target.value = '';
            }}
          />
        </label>
        {photoError && (
          <p role="alert" className="text-xs text-rose-700">
            {photoError}
          </p>
        )}
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((image, index) => (
            <li key={image.id ?? image.publicId} className="relative h-28 overflow-hidden bg-canvas">
              <Image
                src={image.url}
                alt={image.alt}
                fill
                unoptimized
                sizes="200px"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => setImages((current) => current.filter((_, item) => item !== index))}
                aria-label={`Remove ${image.alt}`}
                className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white text-rose-700"
              >
                <Trash2 size={15} />
              </button>
            </li>
          ))}
          {previews.map((preview, index) => (
            <li key={preview} className="relative h-28 overflow-hidden bg-canvas">
              <Image
                src={preview}
                alt={files[index]?.name ?? 'Selected property photo'}
                fill
                unoptimized
                sizes="200px"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => setFiles((current) => current.filter((_, item) => item !== index))}
                aria-label={`Remove ${files[index]?.name ?? 'selected photo'}`}
                className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white text-rose-700"
              >
                <Trash2 size={15} />
              </button>
            </li>
          ))}
        </ul>
      </section>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
        <p className="max-w-lg text-xs leading-5 text-muted">
          New and edited homes are reviewed by our team before they appear publicly.
        </p>
        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Upload size={15} />
              Saving…
            </>
          ) : initial ? (
            'Submit changes for review'
          ) : (
            'Submit listing for review'
          )}
        </Button>
      </div>
    </form>
  );
}
