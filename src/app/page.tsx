'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import { FaArrowRight, FaStar, FaPaperPlane } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { usePageData, useCouteauxData } from '@/context/WordPressContext';

export default function Home() {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroHeight, setHeroHeight] = useState<number | null>(null);
  
  // Fetch WordPress data
  const { pageData, loading, error } = usePageData('home');
  const { couteaux, loading: couteauxLoading } = useCouteauxData();

  // Extract ACF data
  const acfData = pageData?.acf || {};
  const title = pageData?.title?.rendered;
  const subtitle = acfData['sous-titre'];

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Log WordPress data when it changes
  useEffect(() => {
    console.log('Home page data:', pageData);
    console.log('Home page loading state:', loading);
    console.log('ACF Data:', acfData);
    if (error) {
      console.error('Home page error:', error);
    }
  }, [pageData, loading, error, acfData]);

  // Log couteaux data when it changes
  useEffect(() => {
    console.log('Couteaux data:', couteaux);
    console.log('Couteaux loading state:', couteauxLoading);
  }, [couteaux, couteauxLoading]);

  //CAPTCHA
  const [token, setToken] = useState<string | null>(null);
  const handleVerify = (token: string) => {
    console.log('Turnstile token:', token);
    setToken(token);
  };

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

  // Gestion du formulaire de contact avec approche simplifiée
  const [mailtoLink, setMailtoLink] = useState<string | null>(null);
  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    setMailtoLink(null);

    const formData = new FormData(e.currentTarget);
    const contactData = {
      nom: formData.get('nom') as string,
      objet: formData.get('objet') as string,
      message: formData.get('message') as string,
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitMessage('Votre message a été préparé. Votre client email va s\'ouvrir...');
        
        // Ouvrir directement le client email
        window.location.href = result.mailtoLink;
        
        // Réinitialiser le formulaire après un délai
        setTimeout(() => {
          const form = document.getElementById('contactForm') as HTMLFormElement;
          if (form) form.reset();
          setSubmitMessage('');
          setMailtoLink(null);
        }, 2000);
      } else {
        setSubmitMessage(result.error || 'Une erreur est survenue. Veuillez réessayer.');
      }
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      setSubmitMessage('Une erreur de connexion est survenue. Veuillez vérifier votre connexion internet et réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show skeleton while loading critical data
  if (loading && !pageData) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Chargement...</div>
      </main>
    );
  }

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
            src={acfData.banniere_image?.url || "/images/hero-section.png"}
            alt={acfData.banniere_image?.alt || "Couteau artisanal"}
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
              {title || "L'art du couteau artisanal, façonné selon vos envies."}
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl">
              {subtitle || "Des pièces uniques, créées avec passion et savoir-faire."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <PrimaryButton 
                name={acfData.banniere_bouton_1?.title || "Personnaliser mon couteau"}
                className="text-lg py-3 px-6"
                onClick={() => handleNavigation(acfData.banniere_bouton_1?.url || '/configurateur')}
              />
              <SecondaryButton 
                name={acfData.banniere_bouton_2?.title || "Service Affûtage & Rémoulage"}
                className="text-lg py-3 px-6"
                onClick={() => handleNavigation(acfData.banniere_bouton_2?.url || '/affutage-remoulage')}
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
                  src={acfData.banniere_icon_1?.url || "/icons/pencil-rule.svg"}
                  alt={acfData.banniere_icon_1?.alt || "Savoir-faire artisanal"}
                  width={104}
                  height={104}
                />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {acfData.banniere_titre_1 || "Savoir-faire artisanal"}
              </h3>
              <p className="text-white/90">
                {acfData.banniere_description_1 || "Chaque couteau est forgé avec précision et passion."}
              </p>
            </div>       
            {/* Service Feature 2 */}
            <div className="flex flex-col items-center text-center flex-1 basis-[280px] min-w-[280px]">
              <div className="w-24 h-24 mb-6">
                <Image 
                  src={acfData.banniere_icon_2?.url || "/icons/knife.svg"}
                  alt={acfData.banniere_icon_2?.alt || "Affûtage & entretien"}
                  width={104}
                  height={104}
                />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {acfData.banniere_titre_2 || "Affûtage & entretien"}
              </h3>
              <p className="text-white/90">
                {acfData.banniere_description_2 || "Offrez une seconde vie à vos lames avec un tranchant parfait."}
              </p>
            </div>
            
            {/* Service Feature 3 */}
            <div className="flex flex-col items-center text-center flex-1 basis-[280px] min-w-[280px]">
              <div className="w-24 h-24 mb-6">
                <Image 
                  src={acfData.banniere_icon_3?.url || "/icons/palette.svg"}
                  alt={acfData.banniere_icon_3?.alt || "Personnalisation"}
                  width={104}
                  height={104}
                />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {acfData.banniere_titre_3 || "Personnalisation"}
              </h3>
              <p className="text-white/90">
                {acfData.banniere_description_3 || "Imaginez votre couteau idéal, nous le créons pour vous."}
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
                  src={acfData.section_atelier_image?.url || "/images/couteaux_table_cuisine_bouche.jpg"}
                  alt={acfData.section_atelier_image?.alt || "Couteaux artisanaux sur une table de cuisine"}
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            
            {/* Content */}
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {acfData.section_atelier_titre || "Entrez dans l'atelier : où l'acier prend vie"}
              </h2>
              <p className="text-white/90 mb-6">
                {acfData.section_atelier_description || "Chaque pièce que nous créons raconte une histoire. Entre tradition et innovation, notre atelier façonne des couteaux uniques, pensés pour durer. Découvrez nos matériaux nobles, nos techniques de fabrication et l'univers passionnant de la coutellerie artisanale."}
              </p>
              <button 
                onClick={() => handleNavigation(acfData.section_atelier_lien?.url || '/a-propos')}
                className="inline-flex items-center text-white hover:text-white/80 font-medium"
              >
                {acfData.section_atelier_lien?.title || "Découvrir notre savoir-faire"} <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Produits Disponibles Section */}
      <section className="py-16 px-8 md:px-12 bg-primary">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {acfData.section_produits_titre || "Disponible immédiatement"}
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-3xl">
            {acfData.section_produits_description || "Chaque couteau est une pièce unique, façonnée avec soin. Trouvez celui qui vous accompagnera au quotidien."}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Display dynamic products from WordPress or fallback to static ones */}
            {couteaux && couteaux.length > 0 ? (
              couteaux.slice(0, 3).map((couteau: any, index: number) => (
                <div key={couteau.id || index} className="bg-dark rounded-xl overflow-hidden shadow-lg">
                  <div className="relative h-72">
                    <Image 
                      src={couteau.acf?.image_principale?.url || "/images/knives/le-souverain/le-souverain.png"}
                      alt={couteau.title?.rendered || "Couteau artisanal"}
                      fill
                      style={{ objectFit: 'cover', objectPosition: 'center' }}
                      className="hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-primary/80 text-white text-sm px-4 py-1.5 rounded-full">
                      {couteau.acf?.disponibilite || "Disponible à l'achat"}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {couteau.title?.rendered || "Couteau artisanal"}
                    </h3>
                    <p className="text-white/80">
                      {couteau.acf?.description_courte || couteau.excerpt?.rendered?.replace(/<[^>]*>/g, '') || "Description du couteau"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              // Fallback to static products if no WordPress data
              <>
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
              </>
            )}
          </div>
          
          <div className="text-center mt-8">
            <button 
              onClick={() => handleNavigation('/couteaux')}
              className="inline-flex items-center text-white hover:text-white/80 font-medium text-lg"
            >
              {acfData.section_produits_lien?.title || "Explorer toute la collection"} <FaArrowRight className="ml-2" />
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
                  src={acfData.section_personnalisation_image?.url || "/images/knives/nature01.jpg"}
                  alt={acfData.section_personnalisation_image?.alt || "Couteau dans la nature"}
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            
            {/* Content */}
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {acfData.section_personnalisation_titre || "Votre couteau, votre signature"}
              </h2>
              <p className="text-white/90 mb-6">
                {acfData.section_personnalisation_description || "Lame, manche, finition... Tout est entre vos mains. Choisissez un modèle existant et adaptez-le à votre style ou partez de zéro pour une création 100% unique."}
              </p>
              <button 
                onClick={() => handleNavigation(acfData.section_personnalisation_lien?.url || '/configurateur')} 
                className="inline-flex items-center bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-md transition-colors"
              >
                {acfData.section_personnalisation_lien?.title || "Personnaliser mon couteau"} <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages Section */}
      <section className="py-16 px-8 md:px-12 bg-[#7a6761]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
            {acfData.section_temoignages_titre || "Ils ont fait confiance à notre savoir-faire"}
          </h2>
          
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {/* Display dynamic testimonials or fallback to static ones */}
            {acfData.temoignages && acfData.temoignages.length > 0 ? (
              acfData.temoignages.map((temoignage: any, index: number) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md w-[260px] h-[120px] flex flex-col justify-center">
                  <div className="flex text-primary mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="w-5 h-5" />
                    ))}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">{temoignage.nom}</h3>
                  {temoignage.commentaire && (
                    <p className="text-sm text-gray-600 mt-1">{temoignage.commentaire}</p>
                  )}
                </div>
              ))
            ) : (
              // Fallback to static testimonials
              <>
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
              </>
            )}
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
              {acfData.section_contact_titre || "Un projet en tête ? Parlons-en !"}
            </h2>
            <p className="text-xl text-white/90 mb-2 max-w-2xl">
              {acfData.section_contact_sous_titre || "Besoin d'un couteau sur mesure ? Une question sur nos services ?"}
            </p>
            <p className="text-white/80 max-w-2xl">
              {acfData.section_contact_description || "Laissez-nous un message et nous vous répondrons rapidement."}
            </p>
          </div>
          
          {/* Formulaire */}
          <div className="max-w-2xl">
            <form id="contactForm" onSubmit={handleContactSubmit} className="flex flex-col gap-4">
              <div>
                <label htmlFor="nom" className="block text-white mb-2">Nom complet</label>
                <input 
                  type="text" 
                  id="nom" 
                  name="nom"
                  className="w-full bg-white rounded-md p-3 text-gray-800" 
                  placeholder="Votre nom complet"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="objet" className="block text-white mb-2">Objet</label>
                <input 
                  type="text" 
                  id="objet" 
                  name="objet"
                  className="w-full bg-white rounded-md p-3 text-gray-800" 
                  placeholder="Objet de votre message"
                  required
                />
              </div>
              

              
              <div>
                <label htmlFor="message" className="block text-white mb-2">Message</label>
                <textarea 
                  id="message" 
                  name="message"
                  className="w-full bg-white rounded-md p-3 text-gray-800 min-h-[120px]" 
                  placeholder="Votre message"
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="mt-2 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white font-medium py-3 px-6 rounded-md transition-colors flex items-center"
              >
                <FaPaperPlane className="mr-2" /> 
                {isSubmitting ? 'Envoi en cours...' : 'Soumettre mon projet'}
              </button>
              
              {submitMessage && (
                <div className={`mt-4 p-4 rounded-md border-l-4 ${
                  submitMessage.includes('préparé') ? 'bg-green-900/20 border-green-500 text-green-100' 
                  : 'bg-red-900/20 border-red-500 text-red-100'
                }`}>
                  <div className="flex items-center">
                    <span className="mr-2">
                      {submitMessage.includes('préparé') ? '✅' : '❌'}
                    </span>
                    <p className="text-sm font-medium">{submitMessage}</p>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
       
    </main>
  );
}
