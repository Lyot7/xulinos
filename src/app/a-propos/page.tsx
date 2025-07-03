"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { usePageData } from "@/context/WordPressContext";
import { parseWordPressContent } from "@/utils/wordpressApi";

const imageCache: Record<number, string> = {};

export default function AboutSection() {
  const { pageData, loading, error, hasError, isLoaded } = usePageData('about');
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string | null>(null);
  const fetchingImageRef = useRef<boolean>(false);

  useEffect(() => {
    if (pageData?.featured_media && !featuredImageUrl && !fetchingImageRef.current) {
      if (imageCache[pageData.featured_media]) {
        setFeaturedImageUrl(imageCache[pageData.featured_media]);
        return;
      }
      
      fetchingImageRef.current = true;
      
      const fetchFeaturedImage = async () => {
        try {
          const response = await fetch(
            `https://xulinos.xyz-agency.com/wp-json/wp/v2/media/${pageData.featured_media}`
          );
          
          if (!response.ok) {
            throw new Error(`Failed to fetch featured image: ${response.status}`);
          }
          
          const mediaData = await response.json();
          console.log("Featured media data:", mediaData);
          
          if (mediaData.source_url) {
            imageCache[pageData.featured_media] = mediaData.source_url;
          }
          
          setFeaturedImageUrl(mediaData.source_url);
        } catch (error) {
          console.error("Erreur lors du chargement de l'image:", error);
        } finally {
          fetchingImageRef.current = false;
        }
      };
      
      fetchFeaturedImage();
    }
  }, [pageData, featuredImageUrl]);

  if (loading && !isLoaded) {
    return (
      <section className="text-white py-10 px-3 sm:py-12 sm:px-6">
        <div className="max-w-7xl mx-auto flex justify-center items-center h-64">
          <p>Chargement...</p>
        </div>
      </section>
    );
  }

  if ((error || hasError) && !pageData) {
    return (
      <section className="text-white py-10 px-3 sm:py-12 sm:px-6">
        <div className="max-w-7xl mx-auto flex justify-center items-center h-64">
          <p>Erreur: {error?.message || "Impossible de charger les données"}</p>
        </div>
      </section>
    );
  }

  const acf = pageData?.acf || {};

  return (
    <section className="text-white py-10 px-3 sm:py-12 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-8 sm:gap-12">
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 items-start">
          <div className="lg:order-1 lg:w-1/2 w-full mb-6 lg:mb-0 flex justify-center">
            {featuredImageUrl && (
              <img
                src={featuredImageUrl}
                alt={parseWordPressContent(pageData?.title)}
                className="rounded-md object-cover w-full max-w-[400px] sm:max-w-[700px] h-auto"
              />
            )}
          </div>

          <div className="lg:order-2 lg:w-1/2 w-full space-y-4 sm:space-y-6 text-base sm:text-sm leading-relaxed">
            {pageData?.title?.rendered && (
              <h2
                dangerouslySetInnerHTML={{ __html: pageData.title.rendered }}
                className="text-2xl font-bold mb-4"
              />
            )}
            {acf.titre_1 && (
              <>
                <h3 className="font-bold mb-1">{acf.titre_1}</h3>
                <p>{acf.paragraphe_1}</p>
              </>
            )}

            {acf.titre_2 && (
              <>
                <h3 className="font-bold mb-1">{acf.titre_2}</h3>
                <p>{acf.paragraphe_2}</p>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 items-start">
          <div className="lg:order-1 lg:w-1/2 w-full space-y-4 sm:space-y-6 text-base sm:text-sm leading-relaxed">
            {acf.titre_3 && (
              <div>
                <h3 className="font-bold mb-1">{acf.titre_3}</h3>
                <p>{acf.paragraphe_3}</p>
              </div>
            )}

            {acf.titre_4 && (
              <div>
                <h3 className="font-bold mb-1">{acf.titre_4}</h3>
                <p>{acf.paragraphe_4}</p>
              </div>
            )}
          </div>

          <div className="lg:order-2 w-full lg:w-auto flex flex-col lg:flex-row justify-center items-center gap-4 sm:gap-6 flex-wrap mt-6 lg:mt-0">
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
