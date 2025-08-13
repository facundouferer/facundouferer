import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import "../styles/pokemon.css"
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://facundouferer.ar'),
  title: {
    default: "Facundo Uferer - Desarrollador Full Stack | React, Next.js, Node.js",
    template: "%s | Facundo Uferer - Desarrollador Full Stack"
  },
  description: "Desarrollador Full Stack especializado en JavaScript, React, Next.js, Node.js y tecnologías modernas. Creando soluciones web escalables e innovadoras con inteligencia artificial.",
  keywords: [
    "Desarrollador Full Stack",
    "React Developer",
    "Next.js",
    "JavaScript",
    "TypeScript",
    "Node.js",
    "MongoDB",
    "Desarrollador Web Argentina",
    "Frontend Developer",
    "Backend Developer",
    "Facundo Uferer"
  ],
  authors: [{ name: "Facundo Uferer", url: "https://facundouferer.ar" }],
  creator: "Facundo Uferer",
  publisher: "Facundo Uferer",
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
  openGraph: {
    type: "website",
    title: "Facundo Uferer - Desarrollador Full Stack | React, Next.js, Node.js",
    description: "Desarrollador Full Stack especializado en JavaScript, React, Next.js, Node.js y tecnologías modernas. Creando soluciones web escalables e innovadoras.",
    url: "https://facundouferer.ar",
    siteName: "Facundo Uferer Portfolio",
    images: [
      {
        url: "/img/foto.png",
        width: 1200,
        height: 630,
        alt: "Facundo Uferer - Desarrollador Full Stack",
      },
    ],
    locale: "es_AR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Facundo Uferer - Desarrollador Full Stack",
    description: "Desarrollador Full Stack especializado en JavaScript, React, Next.js y tecnologías modernas.",
    creator: "@facundouferer",
    images: ["/img/foto.png"],
  },
  verification: {
    google: "google-site-verification-code", // Reemplazar con el código real de Google Search Console
  },
  alternates: {
    canonical: "https://facundouferer.ar",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="canonical" href="https://facundouferer.ar" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/img/foto.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="format-detection" content="telephone=no" />

        {/* Datos estructurados JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Facundo Uferer",
              "jobTitle": "Desarrollador Full Stack",
              "description": "Desarrollador Full Stack especializado en JavaScript, React, Next.js, Node.js y tecnologías modernas",
              "url": "https://facundouferer.ar",
              "image": "https://facundouferer.ar/img/foto.png",
              "sameAs": [
                "https://github.com/facundouferer",
                "https://linkedin.com/in/facundouferer",
                "https://x.com/facundouferer",
                "https://www.instagram.com/facundouferer"
              ],
              "knowsAbout": [
                "JavaScript",
                "TypeScript",
                "React",
                "Next.js",
                "Node.js",
                "MongoDB",
                "Full Stack Development"
              ],
              "alumniOf": {
                "@type": "Organization",
                "name": "Universidad Tecnológica Nacional"
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <Navbar />
        <main className="pt-16 min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
