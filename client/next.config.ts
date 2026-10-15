import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // The client is part of an npm workspaces monorepo; Next.js is installed at the repo root.
  outputFileTracingRoot: path.resolve(__dirname, '..'),
};

export default nextConfig;
