import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface PortfolioItemProps {
  title: string;
  description: string;
  imageUrl: string;
  codeUrl: string;
  projectUrl: string;
  tags: string[];
}

// Función para mapear tags a nombres de archivo reales
const getImageFileName = (tag: string): string | null => {
  const tagMap: { [key: string]: string | null } = {
    'frontend': null, // No existe
    'next.js': 'NextJS.png',
    'nextjs': 'NextJS.png',
    'wordpress': 'WordPress.png',
    'gemini': 'Gemini.png',
    'react': 'React.png',
    '.net': 'net.png',
    'google ai api': 'ai.png',
    'figma': 'Figma.png',
    'tailwindcss': 'TailwindCSS.png',
    'tailwind css': 'TailwindCSS.png',
    'mongodb': 'MongoDB.png',
    'javascript': 'JavaScript.png',
    'rest-api': 'Rest-Api.png',
    'rest api': 'Rest-Api.png',
    'vercel': 'Vercel.png',
    'typescript': 'TypeScript.png',
    'css': 'css.png',
    'html': 'html.png',
    'mysql': 'mysql.png',
    'apache': 'apache.png',
    'nginx': 'nginx.png',
    'bot': 'bot.png'
  };

  const fileName = tagMap[tag.toLowerCase()];
  return fileName || null;
};

// Componente para renderizar un tag individual
const TagItem: React.FC<{ tag: string }> = ({ tag }) => {
  const fileName = getImageFileName(tag);
  const imagePath = fileName ? `/img/logos/${fileName}` : null;

  return (
    <>
      {imagePath ? (
        <span className="flex items-center">
          <div className="flex items-center gap-1">
            <Image
              src={imagePath}
              alt={tag}
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
        </span>
      ) : (
        <span className="pokemon-tag flex items-center">
          <span className="text-xs">{tag}</span>
        </span>
      )}
    </>
  );
};

const PortfolioItem: React.FC<PortfolioItemProps> = ({
  title,
  description,
  imageUrl,
  codeUrl,
  projectUrl,
  tags
}) => {
  return (
    <div className="pokemon-window m-3">
      <div className="pokemon-window-header">
        <h2 className="text-xl">{title}</h2>
      </div>
      <div className="pokemon-window-content p-4">
        <div className="relative w-full h-48 mb-4">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
        <p className="mb-4 font-pokemon text-sm m-1">{description}</p>
        <div className="flex flex-wrap gap-2 m-1">
          {tags.map((tag, index) => (
            <TagItem key={index} tag={tag} />
          ))}
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <Link href={codeUrl} className="pokemon-button-secondary" target='_blank'>
            Código
          </Link>
          <Link href={projectUrl} className="pokemon-button" target='_blank'>
            Demo
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PortfolioItem;
