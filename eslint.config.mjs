import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const compat = new FlatCompat({ baseDirectory: path.dirname(fileURLToPath(import.meta.url)) });

export default [
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
  {
    ignores: [
      '**/.next/**',
      '**/node_modules/**',
      '**/dist/**',
      'apps/**',
      'package-lock.json',
      'client/next-env.d.ts',
    ],
  },
];
