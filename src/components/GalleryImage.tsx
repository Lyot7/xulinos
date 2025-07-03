import Image from "next/image";

type GalleryProps = {
  images: string[];
  className?: string;
};

export default function Gallery({ images, className = "" }: GalleryProps) {
  if (!images || images.length === 0) return null;

  // Filter out empty or invalid URLs
  const validImages = images.filter(img => img && img.trim() !== '');

  if (validImages.length === 0) {
    return (
      <div className={`flex items-center justify-center h-[200px] bg-gray-800 rounded-md ${className}`}>
        <span className="text-gray-400">Aucune image disponible</span>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 ${className}`}>
      {validImages.map((src, index) => (
        <div key={index} className="relative w-full h-[200px] rounded-md overflow-hidden border-[0.5px] border-white">
          {src && src.trim() !== '' ? (
            <Image
              src={src}
              alt={`Image ${index + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-400 text-sm">
              <span>N/A</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
