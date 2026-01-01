import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // For localhost:5077
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5077',
        pathname: '/images/**',
      },
      // For localhost without port (if images are served from public folder)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/images/**',
      },
      // For any localhost port (catch-all)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
