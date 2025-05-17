import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import "../styles/pokemon.css"
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Facundo Uferer - Senior Software Developer",
  description: "Desarrollador Full Stack especializado en soluciones web",
  keywords: ["Desarrollador", "Full Stack", "React", "Next.js", "JavaScript"],
  authors: [{ name: "Facundo Uferer" }],
  openGraph: {
    title: "Facundo Uferer - Senior Software Developer",
    description: "Desarrollador Full Stack especializado en soluciones web",
    url: "https://facundouferer.ar",
    siteName: "Facundo Uferer",
    images: [
      {
        url: "https://www.facundouferer.ar/img/foto.png",
        width: 1200,
        height: 630,
        alt: "Facundo Uferer",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
