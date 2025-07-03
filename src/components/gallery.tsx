"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { FaShoppingCart } from "react-icons/fa";

type KnifeGalleryProps = {
  knives: any[];
  search: string;
  onlyAvailable: boolean;
  onKnifeClick?: (knife: any) => void;
};

export default function KnifeGallery({ knives, search, onlyAvailable, onKnifeClick }: KnifeGalleryProps) {
  const { addItem } = useCart();

  const filteredKnives = knives.filter((knife) => {
    const name = knife.title?.rendered || "";
    const description = knife.excerpt?.rendered || "";
    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      description.toLowerCase().includes(search.toLowerCase());
    const matchesAvailability = onlyAvailable
      ? (knife.class_list?.includes("couteaux_tag-disponible-a-lachat") || false)
      : true;
    return matchesSearch && matchesAvailability;
  });

  const handleAddToCart = (e: React.MouseEvent, knife: any) => {
    e.stopPropagation();
    
    // Récupérer l'image avec plusieurs fallbacks
    const imageUrl = knife.acf?.image_principale?.url || "/images/knives/le-souverain/le-souverain.png";
    
    addItem({
      id: knife.id.toString(),
      name: knife.title?.rendered,
      price: knife.acf?.prix || 0,
      description: knife.excerpt?.rendered,
      image: imageUrl,
      type: 'couteau',
    });
  };

  // Helper function to render image with proper guards
  const renderImage = (imageUrl: string, imageAlt: string) => {
    if (!imageUrl || imageUrl.trim() === '') {
      return (
        <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-400 text-sm">
          <span>Image non disponible</span>
        </div>
      );
    }

    return (
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover rounded-lg"
      />
    );
  };

  return (
    <section className="text-white w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredKnives.map((knife) => (
          <div
            key={knife.id}
            className="rounded-md overflow-hidden cursor-pointer hover:shadow-lg transition"
            onClick={() => onKnifeClick && onKnifeClick(knife)}
          >
            <div className="relative w-full h-48">
              {(() => {
                const imageUrl = knife.acf?.image_principale?.url || "/images/knives/le-souverain/le-souverain.png";
                const imageAlt = knife.acf?.image_principale?.alt || knife.title?.rendered || "Couteau artisanal";
                return renderImage(imageUrl, imageAlt);
              })()}
              
              {knife.class_list?.includes("couteaux_tag-disponible-a-lachat") && (
                <span className="absolute top-2 right-1 bg-sage text-black text-xs px-2 py-1 rounded-lg">
                  Disponible à l'achat
                </span>
              )}
              {knife.class_list?.includes("couteaux_tag-disponible-a-lachat") && (
                <button
                  onClick={(e) => handleAddToCart(e, knife)}
                  className="absolute bottom-2 right-2 bg-primary hover:bg-primary/80 text-white p-2 rounded-full transition-colors shadow-lg"
                  aria-label="Ajouter au panier"
                >
                  <FaShoppingCart size={16} />
                </button>
              )}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-md font-semibold">{knife.title?.rendered}</h3>
                <span className="text-sm">{knife.acf?.prix}</span>
              </div>
              <div
                className="text-sm"
                dangerouslySetInnerHTML={{ __html: knife.excerpt?.rendered || "" }}
              />
            </div>
          </div>
        ))}
      </div>

      {filteredKnives.length === 0 && (
        <p className="text-white mt-8 text-center">Aucun couteau ne correspond à vos critères.</p>
      )}
    </section>
  );
}
  