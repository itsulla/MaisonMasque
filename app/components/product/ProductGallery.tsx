import {useState} from 'react';

interface GalleryImage {
  url: string;
  altText?: string | null;
  width?: number;
  height?: number;
}

interface ProductGalleryProps {
  images: GalleryImage[];
  title: string;
}

export function ProductGallery({images, title}: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images.length) {
    return (
      <div className="aspect-square overflow-hidden bg-ivory flex items-center justify-center">
        <span className="text-stone text-sm">No image available</span>
      </div>
    );
  }

  const mainImage = images[selectedImage] ?? images[0];

  return (
    <div>
      <div className="aspect-square overflow-hidden bg-ivory">
        <img
          src={mainImage.url}
          alt={mainImage.altText ?? title}
          width={mainImage.width ?? undefined}
          height={mainImage.height ?? undefined}
          className="hover:scale-105 transition-transform duration-500 object-cover w-full h-full cursor-zoom-in"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 mt-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`w-[80px] h-[80px] overflow-hidden border transition-colors ${
                index === selectedImage
                  ? 'border-gold'
                  : 'border-sand hover:border-gold'
              }`}
            >
              <img
                src={image.url}
                alt={image.altText ?? `${title} thumbnail ${index + 1}`}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
