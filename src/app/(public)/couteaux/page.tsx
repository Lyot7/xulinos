"use client";

import KnifeGallery from "@/components/gallery";
import SearchBar from "@/components/SearchBar";
import { Switcher } from "@/components/Switcher";
import { useState } from "react";

export default function CreationsPage() {
  const [search, setSearch] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  return (
    <div className="min-h-screen flex justify-center px-4">
      <div className="w-full max-w-7xl flex flex-col py-24">
      
        <h1 className="text-3xl font-bold mb-6 text-white text-left">
          Galerie des créations
        </h1>

        <div className="w-full flex justify-end items-center gap-4 mb-8">
          <Switcher
            label="Uniquement disponible à l'achat"
            checked={onlyAvailable}
            onChange={setOnlyAvailable}
          />
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Nom du modèle, bois, couleur ?"
          />
        </div>

        <KnifeGallery search={search} onlyAvailable={onlyAvailable} />
      </div>
    </div>
  );
}
