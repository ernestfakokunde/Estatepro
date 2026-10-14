import { MapPin, Navigation } from 'lucide-react';
import type { Property } from '@/types/property';

export function PropertyMap({
  property,
}: {
  property: Pick<Property, 'address' | 'city' | 'state' | 'lat' | 'lng'>;
}) {
  const location = [property.address, property.city, property.state, 'Nigeria'].filter(Boolean).join(', ');
  const destination =
    property.lat !== null && property.lng !== null
      ? `https://www.openstreetmap.org/?mlat=${property.lat}&mlon=${property.lng}#map=15/${property.lat}/${property.lng}`
      : `https://www.openstreetmap.org/search?query=${encodeURIComponent(location)}`;
  return (
    <section aria-labelledby="property-location-title" className="border border-line bg-white">
      <div className="map-illustration relative grid min-h-48 place-items-center overflow-hidden bg-[#eef1eb]">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              'linear-gradient(32deg,transparent 46%,#fff 47%,#fff 50%,transparent 51%),linear-gradient(118deg,transparent 39%,#fff 40%,#fff 43%,transparent 44%),linear-gradient(72deg,transparent 68%,#fff 69%,#fff 72%,transparent 73%)',
            backgroundSize: '140px 100px, 180px 130px, 220px 150px',
          }}
        />
        <span className="relative grid h-12 w-12 place-items-center rounded-full bg-forest text-white shadow-soft">
          <MapPin size={22} />
        </span>
        <span className="absolute bottom-4 left-4 bg-white/95 px-3 py-2 text-xs text-ink">
          {property.city}, {property.state}
        </span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 p-4">
        <div>
          <h2 id="property-location-title" className="text-sm font-semibold">
            {property.address}
          </h2>
          <p className="mt-1 text-xs text-muted">
            {property.city}, {property.state}, Nigeria
          </p>
        </div>
        <a
          href={destination}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-10 items-center gap-2 border border-line px-3 text-xs font-medium text-forest hover:bg-canvas"
        >
          <Navigation size={14} />
          Open map
        </a>
      </div>
    </section>
  );
}
