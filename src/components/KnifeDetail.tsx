'use client';

import GalleryImage from "@/components/GalleryImage";
import PrimaryButton from "@/components/PrimaryButton";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";

type KnifeDetailProps = {
  id: string;
  name: string;
  price: number;
  available: boolean;
  description: string;
  mainImage: string;
  gallery: string[];
};

export default function KnifeDetail({
  id,
  name,
  price,
  available,
  description,
  mainImage,
  gallery,
}: KnifeDetailProps) {
  const { addItem } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Combiner mainImage et gallery pour créer toutes les images
  // Filter out empty or invalid URLs
  const allImages = [mainImage, ...gallery].filter(img => img && img.trim() !== '');

  const handleAddToCart = () => {
    addItem({
      id,
      name,
      price,
      description,
      image: mainImage,
      type: 'couteau',
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const openModal = () => {
    setIsModalOpen(true);
    // Empêcher le scroll du body
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Restaurer le scroll du body
    document.body.style.overflow = 'unset';
  };

  // Gestion des touches clavier pour le modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isModalOpen) return;
    
    switch (e.key) {
      case 'Escape':
        closeModal();
        break;
      case 'ArrowLeft':
        prevImage();
        break;
      case 'ArrowRight':
        nextImage();
        break;
    }
  };

  // Helper function to render image with proper guards
  const renderImage = (src: string, alt: string, className: string, sizes?: string) => {
    if (!src || src.trim() === '') {
      return (
        <div className={`${className} bg-gray-800 flex items-center justify-center text-gray-400`}>
          <span>Image non disponible</span>
        </div>
      );
    }

    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes || "(max-width: 768px) 100vw, 50vw"}
        className={className}
      />
    );
  };

  return (
    <>
      <div className="bg-[#2d2d2d] text-white px-6 py-12 flex flex-col items-center" onKeyDown={handleKeyDown}>
        <div className="max-w-7xl w-full grid md:grid-cols-2 gap-12">
          {/* Carrousel d'images */}
          <div className="relative">
            <div 
              className="relative aspect-[4/3] rounded-md overflow-hidden bg-gray-800 cursor-pointer"
              onClick={openModal}
            >
              {allImages.length > 0 ? (
                renderImage(
                  allImages[currentImageIndex],
                  `${name} - Image ${currentImageIndex + 1}`,
                  "object-cover transition-opacity duration-300",
                  "(max-width: 768px) 100vw, 50vw"
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span>Aucune image disponible</span>
                </div>
              )}
              
              {/* Boutons de navigation */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
                    aria-label="Image précédente"
                  >
                    <FaChevronLeft size={20} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-4 rounded-full transition-colors z-10"
                    aria-label="Image suivante"
                  >
                    <FaChevronRight size={20} />
                  </button>
                </>
              )}
              
              {/* Indicateur de position */}
              {allImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {allImages.length}
                </div>
              )}

              {/* Indicateur de clic pour ouvrir en plein écran */}
              <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded-full text-xs opacity-0 hover:opacity-100 transition-opacity">
                Cliquez pour agrandir
              </div>
            </div>
            
            {/* Miniatures */}
            {allImages.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex 
                        ? 'border-white' 
                        : 'border-transparent hover:border-white/50'
                    }`}
                  >
                    {image && image.trim() !== '' ? (
                      <Image
                        src={image}
                        alt={`Miniature ${index + 1}`}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-400 text-xs">
                        <span>N/A</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Texte produit */}
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">{name}</h1>
            {available && (
              <span className="bg-sage text-dark text-xs font-medium px-2 py-1 rounded-full w-fit">
                Disponible à l'achat
              </span>
            )}
         
            <p className="text-4xl font-bold">{price}</p>

            
            <div
              className="text-white prose prose-invert"
              dangerouslySetInnerHTML={{ __html: description }}
            />

            {available ? (
              <PrimaryButton 
                className="mt-4 bg-wenge py-4" 
                icon={<Image src={"/icons/shopping-cart.svg"} width={20} height={20} alt={""}/>} 
                name={"Ajouter au panier"}
                onClick={handleAddToCart}
              />
            ) : (
              <PrimaryButton 
                className="mt-4 bg-gray-600 py-4 cursor-not-allowed" 
                name={"Non disponible"}
                disabled
              />
            )}
              
          </div>
        </div>
      </div>

      {/* Modal plein écran */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          {/* Bouton fermer */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 z-20"
            aria-label="Fermer"
          >
            <FaTimes size={24} />
          </button>

          {/* Image principale */}
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {allImages.length > 0 ? (
              renderImage(
                allImages[currentImageIndex],
                `${name} - Image ${currentImageIndex + 1}`,
                "object-contain",
                "100vw"
              )
            ) : (
              <div className="text-white text-center">
                <span>Aucune image disponible</span>
              </div>
            )}
            
            {/* Boutons de navigation */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-4 rounded-full transition-colors z-10"
                  aria-label="Image précédente"
                >
                  <FaChevronLeft size={24} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-4 rounded-full transition-colors z-10"
                  aria-label="Image suivante"
                >
                  <FaChevronRight size={24} />
                </button>
              </>
            )}
            
            {/* Indicateur de position */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-lg">
                {currentImageIndex + 1} / {allImages.length}
              </div>
            )}
          </div>

          {/* Miniatures en bas */}
          {allImages.length > 1 && (
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-3 overflow-x-auto max-w-full px-4">
              {allImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                    index === currentImageIndex 
                      ? 'border-white' 
                      : 'border-transparent hover:border-white/50'
                  }`}
                >
                  {image && image.trim() !== '' ? (
                    <Image
                      src={image}
                      alt={`Miniature ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-400 text-xs">
                      <span>N/A</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
} 