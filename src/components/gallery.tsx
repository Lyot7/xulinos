"use client";

import { useState } from "react";
import Image from "next/image";

// Données des couteaux
const knives = [
  {
    id: 1,
    name: "Kiridashi ‘Yoru’",
    description: "Bois d’ébène, acier damas",
    price: 356,
    image: "/images/knives/7560d7e117410fb63ca30d935819f9ea05d7eaf5.png",
    available: true,
  },
  {
    id: 2,
    name: "Le Damas sylvestre",
    description: "Bois de santal, acier carbone, guillochage",
    price: 265,
    image: "/images/knives/7560d7e117410fb63ca30d935819f9ea05d7eaf5.png",
    available: true,
  },
  {
    id: 3,
    name: "Le Souverain",
    description: "Bois de fer, lame en acier poli, pliant",
    price: 280,
    image: "/images/knives/7560d7e117410fb63ca30d935819f9ea05d7eaf5.jpg",
    available: true,
  },
  {
    id: 4,
    name: "Model 1",
    description: "Bois de santal, acier carbone, guillochage",
    price: 356,
    image: "/knives/7560d7e117410fb63ca30d935819f9ea05d7eaf5.jpg",
    available: true,
  },
  {
    id: 5,
    name: "Couteau 2",
    description: "Bois de santal, acier carbone, lame fixe",
    price: 310,
    image: "/knives/7560d7e117410fb63ca30d935819f9ea05d7eaf5.jpg",
    available: false,
  },
  {
    id: 6,
    name: "Model 1",
    description: "Bois de santal, acier carbone, guillochage",
    price: 356,
    image: "/knives/model1b.jpg",
    available: false,
  },
  {
    id: 7,
    name: "Model 1",
    description: "Bois de santal, acier carbone, guillochage",
    price: 356,
    image: "/knives/model1c.jpg",
    available: false,
  },
  {
    id: 8,
    name: "Model 1",
    description: "Bois de santal, acier carbone, guillochage",
    price: 356,
    image: "/knives/model1d.jpg",
    available: false,
  },
  {
    id: 9,
    name: "Model 1",
    description: "Bois de santal, acier carbone, guillochage",
    price: 356,
    image: "/knives/model1e.jpg",
    available: false,
  },
];

type KnifeGalleryProps = {
    search: string;
    onlyAvailable: boolean;
  };
  
  export default function KnifeGallery({ search, onlyAvailable }: KnifeGalleryProps) {
    const filteredKnives = knives.filter((knife) => {
      const matchesSearch =
        knife.name.toLowerCase().includes(search.toLowerCase()) ||
        knife.description.toLowerCase().includes(search.toLowerCase());
      const matchesAvailability = onlyAvailable ? knife.available : true;
      return matchesSearch && matchesAvailability;
    });
  
    return (
      <section className="text-white w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredKnives.map((knife) => (
            <div key={knife.id} className="rounded-md overflow-hidden">
              <div className="relative w-full h-48">
                <Image
                  src={knife.image}
                  alt={knife.name}
                  fill
                  className="object-cover rounded-lg"
                />
                {knife.available && (
                  <span className="absolute top-2 right-1 bg-sage text-black text-xs px-2 py-1 rounded-lg">
                    Disponible à l’achat
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-md font-semibold">{knife.name}</h3>
                  <span className="text-sm">{knife.price} €</span>
                </div>
                <p className="text-sm">{knife.description}</p>
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
  