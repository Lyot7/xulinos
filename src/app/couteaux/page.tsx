"use client";

import KnifeGallery from "@/components/gallery";
import SearchBar from "@/components/SearchBar";
import { Switcher } from "@/components/Switcher";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreationsPage() {
  const [search, setSearch] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [knives, setKnives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("https://xulinos.xyz-agency.com/wp-json/wp/v2/couteaux?_embed")
      .then((res) => res.json())
      .then((data) => {
        setKnives(data);
        setLoading(false);
      });
  }, []);

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

        {loading ? (
          <div className="text-white">Chargement...</div>
        ) : (
          <KnifeGallery
            knives={knives}
            search={search}
            onlyAvailable={onlyAvailable}
            onKnifeClick={(knife) => {
              router.push(`/couteaux/${knife.id}`);
            }}
          />
        )}
      </div>
    </div>
  );
}