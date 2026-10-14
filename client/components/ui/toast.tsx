'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, CircleAlert, Info, X } from 'lucide-react';

export type ToastKind = 'success' | 'error' | 'info';
type ToastMessage = { id: number; message: string; kind: ToastKind };
const eventName = 'estatepro:toast';

export function toast(message: string, kind: ToastKind = 'info') {
  if (typeof window !== 'undefined')
    window.dispatchEvent(new CustomEvent(eventName, { detail: { message, kind } }));
}

export function ToastHost() {
  const [messages, setMessages] = useState<ToastMessage[]>([]);
  useEffect(() => {
    const listener = (event: Event) => {
      const detail = (event as CustomEvent<Omit<ToastMessage, 'id'>>).detail;
      const id = Date.now() + Math.random();
      setMessages((current) => [...current, { ...detail, id }]);
      window.setTimeout(() => setMessages((current) => current.filter((item) => item.id !== id)), 4500);
    };
    window.addEventListener(eventName, listener);
    return () => window.removeEventListener(eventName, listener);
  }, []);
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed right-4 top-4 z-[100] grid w-[min(22rem,calc(100vw-2rem))] gap-2"
    >
      {messages.map((item) => (
        <div
          key={item.id}
          role={item.kind === 'error' ? 'alert' : 'status'}
          className="flex items-start gap-3 border border-line bg-white p-3 shadow-soft"
        >
          {item.kind === 'success' ? (
            <CheckCircle2 className="shrink-0 text-forest" size={18} />
          ) : item.kind === 'error' ? (
            <CircleAlert className="shrink-0 text-rose-700" size={18} />
          ) : (
            <Info className="shrink-0 text-sage" size={18} />
          )}
          <p className="flex-1 text-sm leading-5">{item.message}</p>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => setMessages((current) => current.filter((message) => message.id !== item.id))}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
