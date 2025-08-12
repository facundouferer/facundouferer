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

const PortfolioItem: React.FC<PortfolioItemProps> = ({
  title,
  description,
  imageUrl,
  codeUrl,
  projectUrl,
  tags
}) => {
  return (
    <div className="pokemon-window m-4">
      <div className="pokemon-window-header">
        <h3 className="text-xl font-pokemon">{title}</h3>
      </div>
      <div className="pokemon-window-content p-4">
        <div className="relative w-full h-48 mb-4">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover rounded"
          />
        </div>
        <p className="mb-4 font-pokemon text-sm">{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span key={index} className="pokemon-tag">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex justify-between">
          <Link href={codeUrl} className="pokemon-button">
            Ver Código
          </Link>
          <Link href={projectUrl} className="pokemon-button">
            Ver Proyecto
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PortfolioItem;
