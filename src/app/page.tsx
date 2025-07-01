'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroHeight, setHeroHeight] = useState<number | null>(null);

  // Fonction pour calculer la hauteur du hero en fonction de la fenêtre et du header
  const calculateHeroHeight = () => {
    // Récupérer la hauteur du header
    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 0;
    
    // Calculer la hauteur disponible (100vh - hauteur du header)
    const availableHeight = window.innerHeight - headerHeight;
    
    // Définir une hauteur minimale pour le hero
    const minHeight = 500;
    
    // Utiliser la plus grande valeur entre la hauteur disponible et la hauteur minimale
    const calculatedHeight = Math.max(availableHeight, minHeight);
    
    setHeroHeight(calculatedHeight);
  };

  useEffect(() => {
    // Calculer la hauteur au chargement
    calculateHeroHeight();
    
    // Recalculer à chaque redimensionnement de la fenêtre
    window.addEventListener('resize', calculateHeroHeight);
    
    return () => {
      window.removeEventListener('resize', calculateHeroHeight);
    };
  }, []);

  return (
    <main className="flex flex-col">
      {/* Hero Section - Hauteur calculée dynamiquement */}
      <section 
        ref={heroRef}
        className="relative w-full flex items-center"
        style={{ height: heroHeight ? `${heroHeight}px` : '100vh' }}
      >
        {/* Background Image with responsive container */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/hero-section.png" 
            alt="Couteau artisanal" 
            fill
            style={{ objectFit: 'cover' }}
            priority
            quality={90}
          />
        </div>
        
        {/* Hero Content - Centered vertically with responsive padding */}
        <div className="relative z-10 w-full py-12 sm:py-16 px-6 md:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4">
              L'art du couteau artisanal, <br />
              façonné selon vos envies.
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl">
              Des pièces uniques, créées avec passion et savoir-faire.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <PrimaryButton name="Personnaliser mon couteau" className="text-lg py-3 px-6" />
              <SecondaryButton name="Service Affûtage & Rémoulage" className="text-lg py-3 px-6" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Services Features Section */}
      <section className="py-16 px-6 bg-primary">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16">
            {/* Service Feature 1 */}
            <div className="flex flex-col items-center text-center flex-1 basis-[280px] min-w-[280px]">
              <div className="w-24 h-24 mb-6">
                <Image 
                  src="/icons/pencil-rule.svg" 
                  alt="Savoir-faire artisanal" 
                  width={104}
                  height={104}
                />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Savoir-faire artisanal</h3>
              <p className="text-white/90">
                Chaque couteau est forgé avec<br />
                précision et passion.
              </p>
            </div>
            
            {/* Service Feature 2 */}
            <div className="flex flex-col items-center text-center flex-1 basis-[280px] min-w-[280px]">
              <div className="w-24 h-24 mb-6">
                <Image 
                  src="/icons/knife.svg" 
                  alt="Affûtage & entretien" 
                  width={104}
                  height={104}
                />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Affûtage & entretien</h3>
              <p className="text-white/90">
                Offrez une seconde vie à vos<br />
                lames avec un tranchant parfait.
              </p>
            </div>
            
            {/* Service Feature 3 */}
            <div className="flex flex-col items-center text-center flex-1 basis-[280px] min-w-[280px]">
              <div className="w-24 h-24 mb-6">
                <Image 
                  src="/icons/palette.svg" 
                  alt="Personnalisation" 
                  width={104}
                  height={104}
                />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Personnalisation</h3>
              <p className="text-white/90">
                Imaginez votre couteau idéal,<br />
                nous le créons pour vous.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Atelier Section */}
      <section className="py-16 px-6 bg-[#333333]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Image */}
            <div className="w-full md:w-1/2">
              <div className="rounded-lg overflow-hidden">
                <Image 
                  src="/images/couteaux_table_cuisine_bouche.jpg" 
                  alt="Couteaux artisanaux sur une table de cuisine" 
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            
            {/* Content */}
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Entrez dans l'atelier : où l'acier prend vie
              </h2>
              <p className="text-white/90 mb-6">
                Chaque pièce que nous créons raconte une histoire. Entre tradition et innovation,
                notre atelier façonne des couteaux uniques, pensés pour durer. Découvrez nos
                matériaux nobles, nos techniques de fabrication et l'univers passionnant de la
                coutellerie artisanale.
              </p>
              <Link 
                href="/a-propos" 
                className="inline-flex items-center text-white hover:text-white/80 font-medium"
              >
                Découvrir notre savoir-faire <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>
       
    </main>
  );
}
