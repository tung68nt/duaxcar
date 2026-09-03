import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Image optimization ENABLED — serves WebP/AVIF, responsive sizes
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.in',
      },
      {
        protocol: 'https',
        hostname: 'www.w3schools.com', // Demo video thumbnail
      },
    ],
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/ve-chung-toi",
        destination: "/ve-duaxcar",
        permanent: true,
      },
      {
        source: "/doi-ngu",
        destination: "/ve-duaxcar",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
