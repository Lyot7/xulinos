'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import Link from 'next/link';
import { FaArrowRight, FaStar, FaPaperPlane } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
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

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  // Gestion du formulaire de contact
  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Logique d'envoi du formulaire à implémenter
    alert('Votre message a été envoyé. Nous vous répondrons rapidement.');
  };

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
              <PrimaryButton 
                name="Personnaliser mon couteau" 
                className="text-lg py-3 px-6"
                onClick={() => handleNavigation('/personnalisation')}
              />
              <SecondaryButton 
                name="Service Affûtage & Rémoulage" 
                className="text-lg py-3 px-6"
                onClick={() => handleNavigation('/affutage-remoulage')}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Services Features Section */}
      <section className="py-16 px-8 md:px-12 bg-primary">
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
      <section className="py-16 px-8 md:px-12 bg-dark">
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
              <button 
                onClick={() => handleNavigation('/a-propos')}
                className="inline-flex items-center text-white hover:text-white/80 font-medium"
              >
                Découvrir notre savoir-faire <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Produits Disponibles Section */}
      <section className="py-16 px-8 md:px-12 bg-primary">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Disponible immédiatement</h2>
          <p className="text-xl text-white/90 mb-10 max-w-3xl">
            Chaque couteau est une pièce unique, façonnée avec soin. Trouvez celui qui vous accompagnera au quotidien.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Produit 1 */}
            <div className="bg-dark rounded-xl overflow-hidden shadow-lg">
              <div className="relative h-72">
                <Image 
                  src="/images/knives/le-souverain/le-souverain.png" 
                  alt="Le Souverain" 
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                  className="hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-primary/80 text-white text-sm px-4 py-1.5 rounded-full">
                  Disponible à l'achat
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Le Souverain</h3>
                <p className="text-white/80">Bois de fer, lame en acier poli, pliant</p>
              </div>
            </div>
            
            {/* Produit 2 */}
            <div className="bg-dark rounded-xl overflow-hidden shadow-lg">
              <div className="relative h-72">
                <Image 
                  src="/images/knives/kiridashi-yoru/kiridashi-yoru.png" 
                  alt="Kiridashi 'Yoru'" 
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                  className="hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-primary/80 text-white text-sm px-4 py-1.5 rounded-full">
                  Disponible à l'achat
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Kiridashi 'Yoru'</h3>
                <p className="text-white/80">Bois d'ébène, acier damas</p>
              </div>
            </div>
            
            {/* Produit 3 */}
            <div className="bg-dark rounded-xl overflow-hidden shadow-lg">
              <div className="relative h-72">
                <Image 
                  src="/images/knives/le_damas_sylvestre/01.png" 
                  alt="Le Damas sylvestre" 
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                  className="hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-primary/80 text-white text-sm px-4 py-1.5 rounded-full">
                  Disponible à l'achat
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Le Damas sylvestre</h3>
                <p className="text-white/80">Bois de santal, acier carbone, guillochage</p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <button 
              onClick={() => handleNavigation('/couteaux')}
              className="inline-flex items-center text-white hover:text-white/80 font-medium text-lg"
            >
              Explorer toute la collection <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Personnalisation Section */}
      <section className="py-16 px-8 md:px-12 bg-dark">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Image */}
            <div className="w-full md:w-1/2">
              <div className="rounded-lg overflow-hidden">
                <Image 
                  src="/images/knives/nature01.jpg" 
                  alt="Couteau dans la nature" 
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            
            {/* Content */}
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Votre couteau, votre signature
              </h2>
              <p className="text-white/90 mb-6">
                Lame, manche, finition... Tout est entre vos mains. Choisissez un modèle existant et 
                adaptez-le à votre style ou partez de zéro pour une création 100% unique.
              </p>
              <button 
                onClick={() => handleNavigation('/personnalisation')} 
                className="inline-flex items-center bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-md transition-colors"
              >
                Personnaliser mon couteau <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages Section */}
      <section className="py-16 px-8 md:px-12 bg-[#7a6761]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
            Ils ont fait confiance à notre savoir-faire
          </h2>
          
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {/* Témoignage 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md w-[260px] h-[120px] flex flex-col justify-center">
              <div className="flex text-primary mb-2">
                <FaStar className="w-5 h-5" />
                <FaStar className="w-5 h-5" />
                <FaStar className="w-5 h-5" />
                <FaStar className="w-5 h-5" />
                <FaStar className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">James Dean</h3>
            </div>
            
            {/* Témoignage 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md w-[260px] h-[120px] flex flex-col justify-center">
              <div className="flex text-primary mb-2">
                <FaStar className="w-5 h-5" />
                <FaStar className="w-5 h-5" />
                <FaStar className="w-5 h-5" />
                <FaStar className="w-5 h-5" />
                <FaStar className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Marie Lefevre</h3>
            </div>
            
            {/* Témoignage 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md w-[260px] h-[120px] flex flex-col justify-center">
              <div className="flex text-primary mb-2">
                <FaStar className="w-5 h-5" />
                <FaStar className="w-5 h-5" />
                <FaStar className="w-5 h-5" />
                <FaStar className="w-5 h-5" />
                <FaStar className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Alex Moreau</h3>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <button 
              onClick={() => handleNavigation('/avis')}
              className="inline-flex items-center text-white hover:text-white/80 font-medium"
            >
              Voir tous les avis <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Formulaire de contact */}
      <section className="relative bg-dark py-16 px-8 md:px-12 overflow-hidden">
        {/* Image de fond */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute right-[-15%] bottom-[-22%] w-[100%] h-[100%]">
            <Image 
              src="/images/tree-logo.png" 
              alt="Logo Xulinos" 
              fill
              style={{ 
                objectFit: 'contain',
                objectPosition: 'right bottom'
              }}
              quality={100}
            />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Texte d'introduction */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Un projet en tête ? Parlons-en !
            </h2>
            <p className="text-xl text-white/90 mb-2 max-w-2xl">
              Besoin d'un couteau sur mesure ? Une question sur nos services ?
            </p>
            <p className="text-white/80 max-w-2xl">
              Laissez-nous un message et nous vous répondrons rapidement.
            </p>
          </div>
          
          {/* Formulaire */}
          <div className="max-w-2xl">
            <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
              <div>
                <label htmlFor="nom" className="block text-white mb-2">Nom</label>
                <input 
                  type="text" 
                  id="nom" 
                  className="w-full bg-white rounded-md p-3 text-gray-800" 
                  placeholder="Votre nom"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="prenom" className="block text-white mb-2">Prénom</label>
                <input 
                  type="text" 
                  id="prenom" 
                  className="w-full bg-white rounded-md p-3 text-gray-800" 
                  placeholder="Votre prénom"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-white mb-2">Adresse Mail</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full bg-white rounded-md p-3 text-gray-800" 
                  placeholder="Votre adresse email"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-white mb-2">Message</label>
                <textarea 
                  id="message" 
                  className="w-full bg-white rounded-md p-3 text-gray-800 min-h-[120px]" 
                  placeholder="Votre message"
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="mt-2 bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-md transition-colors flex items-center"
              >
                <FaPaperPlane className="mr-2" /> Soumettre mon projet
              </button>
            </form>
          </div>
        </div>
      </section>
       
    </main>
  );
}
