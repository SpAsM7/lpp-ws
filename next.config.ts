import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Enable proper cookie handling in middleware
    serverActions: {
      allowedOrigins: ['localhost:3000'],
      bodySizeLimit: '2mb'
    },
  },
  // Ensure proper module resolution
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': './src',
    }
    return config
  },
};

export default nextConfig;
