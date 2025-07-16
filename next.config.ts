import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/proxy',
        destination: 'https://studio--api-navigator-1owsj.us-central1.hosted.app/api/rsi',
      },
    ]
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dd.dexscreener.com',
      }
    ],
  },
};

export default nextConfig;
