"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function AboutSection() {
  const [acf, setAcf] = useState(null);
  const [pageData, setPageData] = useState(null);
  const [featuredImageUrl, setFeaturedImageUrl] = useState(null);

  useEffect(() => {
    async function fetchPage() {
      try {
        const resPage = await fetch(
          "https://xulinos.xyz-agency.com/wp-json/wp/v2/pages/13"
        );
        const dataPage = await resPage.json();

        setPageData(dataPage);

        if (dataPage.acf) {
          setAcf(dataPage.acf);
        }

        if (dataPage.featured_media) {
          const resMedia = await fetch(
            `https://xulinos.xyz-agency.com/wp-json/wp/v2/media/${dataPage.featured_media}`
          );
          const dataMedia = await resMedia.json();

          setFeaturedImageUrl(dataMedia.source_url);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de la page ou de l'image :",
          error
        );
      }
    }

    fetchPage();
  }, []);

  if (!acf || !pageData) {
    return (
      <section className="text-white py-10 px-3 sm:py-12 sm:px-6">
        <div className="max-w-7xl mx-auto flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="text-white py-10 px-3 sm:py-12 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-8 sm:gap-12">
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 items-start">
          <div className="order-1 lg:order-1 lg:w-1/2 w-full mb-6 lg:mb-0 flex justify-center">
            {featuredImageUrl && (
              <img
                src={featuredImageUrl}
                alt={pageData.title.rendered}
                className="rounded-md object-cover w-full max-w-[400px] sm:max-w-[700px] h-auto"
              />
            )}
          </div>

          <div className="order-2 lg:order-2 lg:w-1/2 w-full space-y-4 sm:space-y-6 text-base sm:text-sm leading-relaxed">
            <h2
              dangerouslySetInnerHTML={{ __html: pageData.title.rendered }}
              className="text-2xl font-bold mb-4"
            />
            <h3 className="font-bold mb-1">{acf.titre_1}</h3>
            <p>{acf.paragraphe_1}</p>

            <h3 className="font-bold mb-1">{acf.titre_2}</h3>
            <p>{acf.paragraphe_2}</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 items-start">
          <div className="order-1 lg:order-1 lg:w-1/2 w-full space-y-4 sm:space-y-6 text-base sm:text-sm leading-relaxed">
            <div>
              <h3 className="font-bold mb-1">{acf.titre_3}</h3>
              <p>{acf.paragraphe_3}</p>
            </div>

            <div>
              <h3 className="font-bold mb-1">{acf.titre_4}</h3>
              <p>{acf.paragraphe_4}</p>
            </div>
          </div>

          <div className="order-2 lg:order-2 w-full lg:w-auto flex flex-col lg:flex-row justify-center items-center gap-4 sm:gap-6 flex-wrap mt-6 lg:mt-0">
            <Image
              src="/images/tree-logo.png"
              alt="Logos Xulinos"
              width={250}
              height={250}
              className="object-contain w-40 h-40 sm:w-[250px] sm:h-[250px]"
            />
            <Image
              src="/branding/logo/combination-mark-hand.svg"
              alt="logo Xulinos"
              width={250}
              height={250}
              className="object-contain w-40 h-40 sm:w-[250px] sm:h-[250px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
