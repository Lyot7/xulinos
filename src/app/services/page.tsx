"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ServiceCard from "@/components/ServicesCard";

type ApiService = {
  id: string;
  imageUrl: string;
  title1: string;
  paragraph: string;
  etiquettes: Record<string, string>;
};

export default function ServicesSection() {
  const [servicesData, setServicesData] = useState<ApiService[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("https://xulinos.xyz-agency.com/wp-json/wp/v2/pages/204?_embed");
        const data = await res.json();
        const acf = data.acf;
        const services: ApiService[] = [];

        // Créer une map image ID → URL
        const mediaMap = new Map<number, string>();
        data._embedded?.["wp:featuredmedia"]?.forEach((media: any) => {
          mediaMap.set(media.id, media.source_url);
        });

        // Parcourt les clés de l'objet ACF pour extraire les services
        for (const key in acf) {
          if (key.startsWith("service")) {
            const service = acf[key];
            const imageId = service.image1;
            let imageUrl = mediaMap.get(imageId) || "";

            // Si image manquante, fetch manuellement
            if (!imageUrl && imageId) {
              try {
                const imageRes = await fetch(`https://xulinos.xyz-agency.com/wp-json/wp/v2/media/${imageId}`);
                const imageData = await imageRes.json();
                imageUrl = imageData.source_url;
              } catch (err) {
                console.warn("Image manquante pour ID", imageId);
              }
            }

            services.push({
              id: key, // ✅ ID basé sur le nom du champ (ex: "service1", "service1_copier")
              title1: service.title1,
              paragraph: service.paragraph,
              etiquettes: service.etiquettes,
              imageUrl,
            });
          }
        }

        setServicesData(services);
      } catch (err) {
        console.error("Erreur de chargement des services :", err);
      }
    };

    fetchServices();
  }, []);

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
      router.push(`/demande-devis-services?services=${query}`);
    }
  };

  return (
    <section className="w-full min-h-screen flex flex-col md:flex-row text-white">
      {/* Image à gauche */}
      <div className="w-full md:w-1/3 h-64 md:h-screen">
        <img
          src="/images/hero-section.png"
          alt="Services illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contenu à droite */}
      <div className="w-full md:w-2/3 bg-[#232323] flex flex-col py-12 px-4 sm:px-6 md:px-8 overflow-y-auto">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Services</h2>
          <p className="text-gray-400 mb-6 text-sm md:text-base">
            Choisissez vos services, renseignez vos besoins, recevez un devis personnalisé.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
            {servicesData.map((s) => (
              <ServiceCard
                key={s.id}
                image={s.imageUrl}
                title={s.title1}
                description={s.paragraph}
                tags={Object.values(s.etiquettes || {})}
                selected={selected.includes(s.title1)}
                onToggle={() => toggleService(s.title1)}
              />
            ))}
          </div>
        </div>

        {/* Bas : compteur + boutons */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-gray-400">
              Services sélectionnés ({selected.length}/3)
            </p>
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
