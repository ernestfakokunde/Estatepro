'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="modal-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      className="w-[min(92vw,34rem)] rounded-sm border border-line p-0 shadow-soft backdrop:bg-ink/40"
    >
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <h2 id="modal-title" className="font-display text-lg font-semibold">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="rounded-full p-2 text-muted hover:bg-canvas"
        >
          <X size={18} />
        </button>
      </div>
      <div className="p-5">{children}</div>
    </dialog>
  );
}
