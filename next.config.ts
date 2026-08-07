import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
