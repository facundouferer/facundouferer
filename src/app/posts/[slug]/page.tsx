import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { conectionDB } from '@/libs/mongodb';
import Post, { IPost } from '@/models/post';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import Link from 'next/link';

// Función para generar un excerpt del contenido
function generateExcerpt(content: string, maxLength: number = 160): string {
  // Remover markdown básico
  const cleanContent = content
    .replace(/[#*`_~\[\]()]/g, '') // Remover caracteres de markdown
    .replace(/\n/g, ' ') // Reemplazar saltos de línea con espacios
    .trim();

  if (cleanContent.length <= maxLength) return cleanContent;

  // Encontrar el último espacio antes del límite para no cortar palabras
  const truncated = cleanContent.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  return lastSpace > 0
    ? truncated.substring(0, lastSpace) + '...'
    : truncated + '...';
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    await conectionDB();
    const { slug } = await params;
    const post = await Post.findOne({ slug }).lean<IPost>();

    if (!post) {
      return {
        title: 'Post no encontrado',
        description: 'El artículo que buscas no existe o ha sido eliminado.',
      };
    }

    const excerpt = generateExcerpt(post.content);
    const baseUrl = 'https://facundouferer.ar';
    const postUrl = `${baseUrl}/posts/${slug}`;

    // Imagen por defecto si no hay featuredImage
    const defaultImage = `${baseUrl}/img/blog.png`;
    const featuredImage = post.featuredImage
      ? (post.featuredImage.startsWith('http') ? post.featuredImage : `${baseUrl}${post.featuredImage}`)
      : defaultImage;

    return {
      title: `${post.title} | Blog de Facundo Uferer`,
      description: excerpt,
      keywords: [
        ...(post.tags || []),
        'blog',
        'desarrollo web',
        'programación',
        'javascript',
        'react',
        'next.js',
        'Facundo Uferer'
      ],
      authors: [{ name: 'Facundo Uferer', url: baseUrl }],
      creator: 'Facundo Uferer',
      publisher: 'Facundo Uferer',

      // Open Graph para redes sociales
      openGraph: {
        type: 'article',
        title: post.title,
        description: excerpt,
        url: postUrl,
        siteName: 'Blog de Facundo Uferer',
        images: [
          {
            url: featuredImage,
            width: 1200,
            height: 630,
            alt: post.title,
            type: 'image/png',
          },
        ],
        locale: 'es_AR',
        authors: ['Facundo Uferer'],
        tags: post.tags,
        publishedTime: post.createdAt ? new Date(post.createdAt).toISOString() : undefined,
        modifiedTime: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
      },

      // Twitter Cards
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: excerpt,
        creator: '@facundouferer',
        images: [featuredImage],
      },

      // Configuraciones adicionales
      alternates: {
        canonical: postUrl,
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
    };
  } catch (error) {
    console.error('Error generating metadata for post:', error);
    return {
      title: 'Error al cargar el post',
      description: 'Hubo un problema al cargar el artículo solicitado.',
    };
  }
}

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  await conectionDB();
  const { slug } = await params;
  const post = await Post.findOne({ slug }).lean<IPost>();
  if (!post) return notFound();

  const baseUrl = 'https://facundouferer.ar';
  const postUrl = `${baseUrl}/posts/${slug}`;
  const excerpt = generateExcerpt(post.content);

  const defaultImage = `${baseUrl}/img/blog.png`;
  const featuredImage = post.featuredImage
    ? (post.featuredImage.startsWith('http') ? post.featuredImage : `${baseUrl}${post.featuredImage}`)
    : defaultImage;

  // JSON-LD para datos estructurados del artículo
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": excerpt,
    "image": featuredImage,
    "url": postUrl,
    "datePublished": post.createdAt ? new Date(post.createdAt).toISOString() : undefined,
    "dateModified": post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
    "author": {
      "@type": "Person",
      "name": "Facundo Uferer",
      "url": baseUrl,
      "jobTitle": "Desarrollador Full Stack"
    },
    "publisher": {
      "@type": "Person",
      "name": "Facundo Uferer",
      "url": baseUrl
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": postUrl
    },
    "keywords": post.tags ? post.tags.join(', ') : '',
    "articleSection": "Desarrollo Web",
    "inLanguage": "es-AR"
  };

  return (
    <>
      {/* Datos estructurados JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd)
        }}
      />

      <div className='max-w-3xl mx-auto py-8 px-4'>
        <h1 className='text-3xl font-bold mt-2 mb-6'>{post.title}</h1>
        {post.featuredImage && (
          <div className='mb-6'>
            <Image
              src={post.featuredImage.startsWith('http') ? post.featuredImage : `${process.env.NEXT_PUBLIC_BASE_URL}${post.featuredImage}`}
              alt={post.title}
              width={1280}
              height={540}
              className='w-full max-h-96 object-cover rounded-lg shadow-md'
              priority
              quality={90}
            />
          </div>
        )}
        <div className='prose prose-sm max-w-none text-gray-700 bg-white rounded-lg shadow-md p-6'>
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
        {Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className='flex flex-wrap gap-2 mt-6'>
            {post.tags.map((t: string) => (
              <Link
                key={t}
                href={`/tags/${encodeURIComponent(t)}`}
                className='bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 text-xs rounded transition-colors'
              >
                {t}
              </Link>
            ))}
          </div>
        )}

        {/* Sección de compartir en redes sociales */}
        <div className='mt-8 pt-6 border-t border-gray-200'>
          <div className='flex gap-4 align-middle items-center'>
            <h3 className='text-lg font-semibold'>Compartir</h3>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(postUrl)}&via=facundouferer`}
              target="_blank"
              rel="noopener noreferrer"
              className='bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full transition-colors flex items-center justify-center'
              title="Compartir en Twitter"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className='bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors flex items-center justify-center'
              title="Compartir en Facebook"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className='bg-blue-700 hover:bg-blue-800 text-white p-3 rounded-full transition-colors flex items-center justify-center'
              title="Compartir en LinkedIn"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
