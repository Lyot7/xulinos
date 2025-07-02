"use client";
import ServiceCard from "@/components/ServicesCard";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function ServicesSection() {
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();

  const servicesData = [
    {
      id: 1,
      image: "/images/knives/7560d7e117410fb63ca30d935819f9ea05d7eaf5.png",
      title: "Affûtage & Rémoulage",
      description: "J’affûte et remoule manuellement tous types de lames pour restaurer leur tranchant et leur géométrie d’origine, offrant aux pièces usées performance, durabilité et une seconde vie.",
      tags: ["Coiffure", "Cuir", "Cuisine"],
      showButton: true,
      slug: "affutage-remoulage",
    },
    {
      id: 2,
      image: "/images/knives/7560d7e117410fb63ca30d935819f9ea05d7eaf5.png",
      title: "Rénovation & Réparation",
      description: "Nous proposons la restauration de lames et de manches : remplacement de manches, polissage, rivets, ajustements et petites réparations. Chaque outil est traité avec soin, dans le respect de sa forme et de ses matériaux.",
      tags: ["Textile", "Bois"],
      showButton: false,
    },
    {
      id: 3,
      image: "/images/knives/7560d7e117410fb63ca30d935819f9ea05d7eaf5.png",
      title: "Personnalisation & Gravure",
      description: "Offrez une touche unique à vos couteaux grâce à notre service de personnalisation. Gravure de noms, initiales, logos ou motifs spéciaux sur la lame ou le manche : une manière élégante de marquer vos outils ou d’offrir un cadeau original. Chaque personnalisation est réalisée avec précision pour un rendu raffiné et durable.",
      tags: ["Personnalisation", "Gravure"],
      showButton: false,
    },
  ];

  const toggleService = (title: string) => {
    setSelected((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title].slice(0, 3)
    );
  };

  const handleRequestQuote = () => {
    if (selected.length > 0) {
      const query = selected.map((s) => encodeURIComponent(s)).join(",");
      router.push(`/formulaire?services=${query}`);
    }
  };

  return (
    <section className="w-full min-h-screen flex flex-col md:flex-row overflow-hidden text-white">
  <div className="w-full md:w-1/3 h-auto md:h-screen">
    <img
      src="/images/hero-section.png"
      alt="Services illustration"
      className="w-full h-full object-cover"
    />
  </div>

  <div className="w-full md:w-2/3 bg-[#232323] flex flex-col justify-between py-12 px-4 sm:px-6 md:px-8 max-h-screen md:overflow-y-auto">
    <div>
      <h2 className="text-3xl md:text-4xl font-bold mb-2">Services</h2>
      <p className="text-gray-400 mb-6 text-sm md:text-base">
        Choisissez vos services, renseignez vos besoins, recevez un devis personnalisé.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
        {servicesData.map((s) => (
          <ServiceCard
            key={s.title}
            {...s}
            selected={selected.includes(s.title)}
            onToggle={() => toggleService(s.title)}
          />
        ))}
      </div>
    </div>

    <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-gray-400">
          Services sélectionnés ({selected.length}/3)
        </p>
        <button className="border border-white rounded px-4 py-2 text-sm hover:bg-white hover:text-black transition">
          Contact rapide
        </button>
      </div>

      <button
        disabled={selected.length === 0}
        onClick={handleRequestQuote}
        className={`text-sm px-4 py-2 rounded transition w-full md:w-auto
          ${
            selected.length === 0
              ? "bg-gray-600 opacity-40 cursor-not-allowed text-white"
              : "bg-white text-black hover:bg-gray-200"
          }`}
      >
        Demande de devis personnalisé
      </button>
    </div>
  </div>
</section>

  );
}

