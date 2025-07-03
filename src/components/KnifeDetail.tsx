'use client';

import GalleryImage from "@/components/GalleryImage";
import PrimaryButton from "@/components/PrimaryButton";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

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

  return (
    <div className="bg-[#2d2d2d] text-white px-6 py-12 flex flex-col items-center">
      <div className="max-w-7xl w-full grid md:grid-cols-2 gap-12">
        <div>
          <Image
            src={mainImage}
            alt={name}
            width={800}
            height={600}
            className="rounded-md object-cover w-full"
          />
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

      <GalleryImage images={gallery} className="mt-12 max-w-7xl w-full" />
    </div>
  );
} 