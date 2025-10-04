import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sevienómetro - Oráculo de Tiempo Argentino | Facundo Uferer',
  description: 'El Sevienómetro es un oráculo de tiempo argentino que mide las pulsaciones del destino colectivo. Descubre el SE VIENE, la fuerza que late en la memoria de los gordos se viene.',
  keywords: [
    'sevienómetro',
    'se viene',
    'gordos se viene',
    'tomás rebord',
    'oráculo argentino',
    'reloj argentino',
    'tiempo argentina',
    'destino colectivo',
    'sevienometrinos',
    'profeta',
    'argentina',
    'crisis',
    'felicidad pueblo'
  ],
  authors: [{ name: 'Facundo Uferer' }],
  creator: 'Facundo Uferer',
  publisher: 'Facundo Uferer',
  openGraph: {
    title: 'Sevienómetro - El Oráculo de Tiempo Argentino',
    description: 'Mide las pulsaciones del destino colectivo argentino. Cuando la aguja se acerca a las 12, presagia caos y crisis. Cuando desciende hacia las 0-1, anuncia felicidad y grandeza.',
    url: 'https://facundouferer.com/seviene',
    siteName: 'Facundo Uferer',
    images: [
      {
        url: '/img/sevienometro.png',
        width: 1200,
        height: 630,
        alt: 'Sevienómetro - Oráculo de Tiempo Argentino',
      },
    ],
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sevienómetro - El Oráculo de Tiempo Argentino',
    description: 'Descubre el SE VIENE. El reloj que mide las pulsaciones del destino colectivo argentino.',
    images: ['/img/sevienometro.png'],
    creator: '@facundouferer',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'tu-codigo-de-verificacion-google',
  },
  category: 'Cultura Argentina',
  alternates: {
    canonical: 'https://facundouferer.com/seviene',
  },
}