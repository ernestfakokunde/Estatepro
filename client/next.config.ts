import type { NextConfig } from 'next';
import path from 'node:path';

const apiProxyTarget = process.env.API_PROXY_TARGET?.replace(/\/+$/, '');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // The client is part of an npm workspaces monorepo; Next.js is installed at the repo root.
  outputFileTracingRoot: path.resolve(__dirname, '..'),
  async rewrites() {
    if (!apiProxyTarget) return [];
    return [
      {
        source: '/api-proxy/:path*',
        destination: `${apiProxyTarget}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;