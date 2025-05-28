// src/components/PostList.tsx
"use client"; // Indicar que es un Componente de Cliente si usas App Router

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown'; // Importar ReactMarkdown
import Link from 'next/link';
import Loading from '@/components/Loading';
// Define una interfaz para la estructura de un post
// Ajústala según la estructura real de tus datos de post
interface Post {
  _id: string; // Asumiendo que MongoDB usa _id
  title: string;
  content: string;
  slug?: string;
  tags: string[];
}

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;

      if (!baseUrl) {
        setError("La URL base no está configurada en las variables de entorno del cliente (NEXT_PUBLIC_BASE_URL).");
        setLoading(false);
        return;
      }

      if (!apiKey) {
        setError("La API Key no está configurada en las variables de entorno del cliente (NEXT_PUBLIC_API_KEY).");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${baseUrl}/api/posts`, {
          method: 'GET',
          headers: {
            'X-API-KEY': apiKey,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          let errorMessage = `Error: ${response.status}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            console.error("Error al analizar la respuesta de la API:", e);
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();
        if (data && Array.isArray(data.posts)) { // Asumiendo que la API devuelve { posts: [...] }
          setPosts(data.posts);
        } else if (Array.isArray(data)) { // O si devuelve directamente el array
          setPosts(data);
        } else {
          console.warn("La respuesta de la API no tiene el formato esperado:", data);
          setPosts([]);
        }

      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Ocurrió un error desconocido al obtener los posts.');
        }
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p>Error al cargar posts: {error}</p>;
  }

  if (posts.length === 0) {
    return <p>No hay posts para mostrar.</p>;
  }

  return (
    <div className='max-w-4xl mx-auto py-7 px-4 sm:px-6 lg:px-8'>
      {posts.map((post) => (
        <div
          key={post._id}
          className=''
        >
          <Link href={`/posts/${post.slug}`}>
            <h1 className='mb-2 text-3xl'>{post.title}</h1>
          </Link>
          <div className="bg-white p-5 text-gray-700 cuentos">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-200 text-gray-700 px-2 py-1 text-xs mb-3"
              >{tag}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;
