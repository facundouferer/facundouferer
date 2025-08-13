import Image from 'next/image';
import { ImageProps } from 'next/image';

interface SEOImageProps extends Omit<ImageProps, 'alt'> {
  alt: string; // Hacer alt obligatorio para SEO
  title?: string;
  loading?: 'lazy' | 'eager';
}

export default function SEOImage({
  alt,
  title,
  loading = 'lazy',
  ...props
}: SEOImageProps) {
  return (
    <Image
      {...props}
      alt={alt}
      title={title || alt}
      loading={loading}
      // Optimizaciones para SEO
      quality={90}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
    />
  );
}
