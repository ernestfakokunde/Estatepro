'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      key={pathname}
      initial={reducedMotion ? false : { opacity: 0, y: 7 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.24, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
