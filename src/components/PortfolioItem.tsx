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
            <span key={index} className="pokemon-tag">
              {tag}
            </span>
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
