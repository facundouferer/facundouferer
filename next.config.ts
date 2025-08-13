import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Vercel Blob default domain pattern
      { protocol: 'https', hostname: '**.public.blob.vercel-storage.com' },
      // Allow any https image if needed
      { protocol: 'https', hostname: '**' }
    ]
  },

  // Configuraciones para mejorar SEO
  trailingSlash: false,

  // Configuración de headers para SEO
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Configuración de redirects para SEO
  async redirects() {
    return [
      // Ejemplo: redireccionar URLs antiguas si las hubiera
      // {
      //   source: '/old-page',
      //   destination: '/new-page',
      //   permanent: true,
      // },
    ];
  },

  // Otras optimizaciones (sin experimentales problemáticas)
  // experimental: {
  //   optimizeCss: true, // Requiere dependencias adicionales
  // },
};

export default nextConfig;
