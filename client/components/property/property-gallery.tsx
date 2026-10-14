'use client';

import Image from 'next/image';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import type { PropertyImage } from '@/types/property';
import { Modal } from '@/components/ui/modal';

export function PropertyGallery({ images, title }: { images: PropertyImage[]; title: string }) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const image = images[active];
  function move(direction: number) {
    setActive((index) => (index + direction + images.length) % images.length);
  }

  if (!images.length)
    return (
      <div className="grid h-[min(62vw,510px)] min-h-64 place-items-center bg-gradient-to-br from-[#dbe2d8] to-[#f0eee6] text-sm text-muted">
        This home has no photos yet.
      </div>
    );
  return (
    <div>
      <div className="relative h-[min(62vw,510px)] min-h-64 overflow-hidden bg-[#e9ece6]">
        <AnimatePresence mode="wait">
          <motion.div
            key={image.url}
            initial={{ opacity: 0.45 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.45 }}
            transition={{ duration: 0.22 }}
            className="absolute inset-0"
          >
            <Image
              src={image.url}
              alt={image.alt || title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 70vw"
              unoptimized
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Previous photo"
              className="absolute left-4 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink"
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Next photo"
              className="absolute right-4 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink"
            >
              <ChevronRight />
            </button>
          </>
        )}
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label="Open photo viewer"
          className="absolute bottom-4 right-4 z-10 flex min-h-10 items-center gap-2 bg-white/95 px-3 text-xs font-medium text-ink"
        >
          <Expand size={15} /> View photos{' '}
          <span className="text-muted">
            {active + 1}/{images.length}
          </span>
        </button>
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
          {images.slice(0, 6).map((item, index) => (
            <button
              key={item.id ?? item.url}
              type="button"
              aria-label={`Show photo ${index + 1}`}
              aria-pressed={active === index}
              onClick={() => setActive(index)}
              className={`relative h-16 overflow-hidden bg-canvas ${active === index ? 'ring-2 ring-forest ring-offset-1' : 'opacity-75 hover:opacity-100'}`}
            >
              <Image
                src={item.url}
                alt={item.alt || `${title}, photo ${index + 1}`}
                fill
                sizes="100px"
                unoptimized
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
      <Modal
        open={lightboxOpen}
        title={`${title} · ${active + 1} of ${images.length}`}
        onClose={() => setLightboxOpen(false)}
      >
        <div className="relative h-[min(65vh,34rem)] w-full bg-canvas">
          {image && (
            <Image
              src={image.url}
              alt={image.alt || title}
              fill
              sizes="80vw"
              unoptimized
              className="object-contain"
            />
          )}
          {images.length > 1 && (
            <div className="absolute inset-x-0 bottom-3 flex justify-center gap-3">
              <button
                className="grid h-10 w-10 place-items-center rounded-full bg-white shadow"
                aria-label="Previous photo"
                onClick={() => move(-1)}
              >
                <ChevronLeft />
              </button>
              <button
                className="grid h-10 w-10 place-items-center rounded-full bg-white shadow"
                aria-label="Next photo"
                onClick={() => move(1)}
              >
                <ChevronRight />
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
