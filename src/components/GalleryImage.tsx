import Image from "next/image";

type GalleryProps = {
  images: string[];
  className?: string;
};

export default function Gallery({ images, className = "" }: GalleryProps) {
  if (!images || images.length === 0) return null;

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 ${className}`}>
      {images.map((src, index) => (
        <Image
          key={index}
          src={src}
          alt={`Image ${index + 1}`}
          width={500}
          height={500}
          className="rounded-md object-cover w-full h-[200px] border-[0.5px] border-white"
        />
      ))}
    </div>
  );
}
