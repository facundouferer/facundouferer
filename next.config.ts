import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Vercel Blob default domain pattern
      { protocol: 'https', hostname: '**.public.blob.vercel-storage.com' },
      // Allow any https image if needed
      { protocol: 'https', hostname: '**' }
    ]
  }
};

export default nextConfig;
