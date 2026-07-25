import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@cbc/shared', '@cbc/ui'],
};

export default nextConfig;
