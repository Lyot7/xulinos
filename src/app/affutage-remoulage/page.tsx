"use client";

import Image from 'next/image';
import React, {useEffect, useState, useRef } from "react";
import PrimaryButton from '@/components/PrimaryButton';
import { usePageData } from "@/context/WordPressContext";

export default function SharpeningPage() {
  const { pageData, loading, error, hasError, isLoaded } = usePageData('affutageRemoulage');
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string | null>(null);
  const fetchingImageRef = useRef<boolean>(false);
  const imageCache: Record<number, string> = {};

  useEffect(() => {
      if (pageData?.featured_media && !featuredImageUrl && !fetchingImageRef.current) {
        // Vérifier si l'image est déjà dans le cache
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
            
            // Mettre en cache l'URL de l'image
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
    
    <main className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{acf.title}</h1>
        <div className="w-full flex align-between flex-col">
          <h2 className="text-2xl font-bold text-white mb-4">{acf.subtitle}</h2>
          <p className="text-white/80 mb-4">
            {acf.paragraphe}
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="w-full md:w-1/2">
            <div className="rounded-lg overflow-hidden">
              <Image 
                src={acf.image1}
                alt="Service d'affûtage et rémoulage" 
                width={800}
                height={600}
                className="w-full h-auto"
              />
            </div>
          </div>
          
          <div className="w-full md:w-1/2">
            <p className="text-white/80 mb-6">
              {acf.corpremoulage}
            </p>            
            <PrimaryButton name="Prendre rendez-vous" className="text-lg py-3 px-6" />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <p>
            {acf.jardinage}
          </p>
              <Image 
                src={acf.image1}
                alt="Service d'affûtage et rémoulage" 
                width={800}
                height={600}
                className="w-full h-auto"
              />
        </div>
        <div className="flex flex-col md:flex-row gap-8 mb-12">
              <Image 
                src={acf.image1}
                alt="Service d'affûtage et rémoulage" 
                width={800}
                height={600}
                className="w-full h-auto"
              />
          <p>{acf.bricolage}</p>
        </div>
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <p>{acf.ciseauxetc}</p>
              <Image 
                src={acf.image1}
                alt="Service d'affûtage et rémoulage" 
                width={800}
                height={600}
                className="w-full h-auto"
              />
        </div>
        <div className="flex flex-col md:flex-row gap-8 mb-12">
              <Image 
                src={acf.image1}
                alt="Service d'affûtage et rémoulage" 
                width={800}
                height={600}
                className="w-full h-auto"
              />
          <p>{acf.veterinaire}</p>
        </div>
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <p>{acf.couteaux}</p>
              <Image 
                src={acf.image1}
                alt="Service d'affûtage et rémoulage" 
                width={800}
                height={600}
                className="w-full h-auto"
              />
        </div>
        
        <div className="bg-dark rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Tarifs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold text-primary mb-3">Couteaux</h3>
              <ul className="text-white/80 space-y-2">
                <li className="flex justify-between">
                  <span>Couteau de cuisine</span>
                  <span>12€</span>
                </li>
                <li className="flex justify-between">
                  <span>Couteau de chasse</span>
                  <span>15€</span>
                </li>
                <li className="flex justify-between">
                  <span>Couteau de poche</span>
                  <span>10€</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary mb-3">Autres outils</h3>
              <ul className="text-white/80 space-y-2">
                <li className="flex justify-between">
                  <span>Ciseaux</span>
                  <span>8€</span>
                </li>
                <li className="flex justify-between">
                  <span>Sécateurs</span>
                  <span>14€</span>
                </li>
                <li className="flex justify-between">
                  <span>Haches</span>
                  <span>18€</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
