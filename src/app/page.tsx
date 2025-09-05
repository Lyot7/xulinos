"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";
import LoadingSpinner from "@/components/LoadingSpinner";
import { FaArrowRight, FaStar, FaPaperPlane } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { usePageData, useCouteauxData } from "@/context/WordPressContext";
import { useSafeWordPressText } from "@/hooks/useWordPressText";
import { extractTextFromWordPress } from "@/utils/textEncoding";

// Types for WordPress data
export interface WPCouteau {
  id: number;
  title: { rendered: string };
  excerpt?: { rendered: string };
  acf?: {
    description_courte?: string;
    image_principale?: { url: string; alt?: string };
    disponibilite?: string;
    // ... add other ACF fields as needed
  };
  // ... add other WP fields as needed
}

export interface WPTemoignage {
  nom: string;
  commentaire: string;
  // ... add other fields if needed
}

export default function Home() {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroHeight, setHeroHeight] = useState<number | null>(null);

  // Fetch WordPress data
  const { pageData, loading } = usePageData("home");
  const { couteaux, loading: couteauxLoading } = useCouteauxData();
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string | null>(null);
  
  // Images extraites par champ ACF - avec gestion d'erreur améliorée
  const [acfImages, setAcfImages] = useState<{
    atelier: { source_url?: string } | null;
    signature: { source_url?: string } | null;
    banniere1: { source_url?: string } | null;
    banniere2: { source_url?: string } | null;
    banniere3: { source_url?: string } | null;
  }>({
    atelier: null,
    signature: null,
    banniere1: null,
    banniere2: null,
    banniere3: null
  });

  // Extract ACF data with safety checks
  const acfData = pageData?.acf || {};
  
  // Fonction pour récupérer une image ACF directement depuis l'API
  const getACFImage = async (imageId: number | undefined) => {
    if (!imageId) return null;
    
    try {
      const response = await fetch(`https://xulinos.xyz-agency.com/wp-json/wp/v2/media/${imageId}`);
      if (!response.ok) return null;
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching ACF image ${imageId}:`, error);
      return null;
    }
  };

  // Charger les images ACF
  useEffect(() => {
    const loadACFImages = async () => {
      if (!pageData?.acf) return;

      const imagePromises = [
        getACFImage(pageData.acf.entrez_dans_latelier?.image),
        getACFImage(pageData.acf.votre_couteau_votre_signature?.image),
        getACFImage(pageData.acf.banniere_icon_1?.icon?.value),
        getACFImage(pageData.acf.banniere_icon_2?.icon?.value),
        getACFImage(pageData.acf.banniere_icon_3?.icon?.value)
      ];

      try {
        const [atelier, signature, banniere1, banniere2, banniere3] = await Promise.all(imagePromises);
        setAcfImages({
          atelier,
          signature,
          banniere1,
          banniere2,
          banniere3
        });
      } catch (error) {
        console.error('Error loading ACF images:', error);
      }
    };

    loadACFImages();
  }, [pageData?.acf]);

  // Text placeholders - all fallback text defined at top level
  const PLACEHOLDERS = {
    // Hero section
    heroTitle: "L'art du couteau artisanal, façonné selon vos envies.",
    heroSubtitle: "Des pièces uniques, créées avec passion et savoir-faire.",
    banniereBouton1: "Personnaliser mon couteau",
    banniereBouton2: "Service Affûtage & Rémoulage",

    // Service features
    banniereIcon1Alt: "Savoir-faire artisanal",
    banniereTitre1: "Savoir-faire artisanal",
    banniereDescription1: "Chaque couteau est forgé avec précision et passion.",
    banniereIcon2Alt: "Affûtage & entretien",
    banniereTitre2: "Affûtage & entretien",
    banniereDescription2:
      "Offrez une seconde vie à vos lames avec un tranchant parfait.",
    banniereIcon3Alt: "Personnalisation",
    banniereTitre3: "Personnalisation",
    banniereDescription3:
      "Imaginez votre couteau idéal, nous le créons pour vous.",

    // Atelier section
    sectionAtelierImageAlt: "Couteaux artisanaux sur une table de cuisine",
    sectionAtelierTitre: "Entrez dans l'atelier : où l'acier prend vie",
    sectionAtelierDescription:
      "Chaque pièce que nous créons raconte une histoire. Entre tradition et innovation, notre atelier façonne des couteaux uniques, pensés pour durer. Découvrez nos matériaux nobles, nos techniques de fabrication et l'univers passionnant de la coutellerie artisanale.",
    sectionAtelierLien: "Découvrir notre savoir-faire",

    // Products section
    sectionProduitsTitre: "Disponible immédiatement",
    sectionProduitsDescription:
      "Chaque couteau est une pièce unique, façonnée avec soin. Trouvez celui qui vous accompagnera au quotidien.",
    sectionProduitsLien: "Explorer toute la collection",
    couteauTitle: "Couteau artisanal",
    couteauDescription: "Description du couteau",
    couteauImageAlt: "Couteau artisanal",
    disponibilite: "Disponible à l'achat",

    // Personalization section
    sectionPersonnalisationImageAlt: "Couteau dans la nature",
    sectionPersonnalisationTitre: "Votre couteau, votre signature",
    sectionPersonnalisationDescription:
      "Lame, manche, finition... Tout est entre vos mains. Choisissez un modèle existant et adaptez-le à votre style ou partez de zéro pour une création 100% unique.",
    sectionPersonnalisationLien: "Personnaliser mon couteau",

    // Testimonials section
    sectionTemoignagesTitre: "Ils ont fait confiance à notre savoir-faire",

    // Contact section
    sectionContactTitre: "Un projet en tête ? Parlons-en !",
    sectionContactSousTitre:
      "Besoin d'un couteau sur mesure ? Une question sur nos services ?",
    sectionContactDescription:
      "Laissez-nous un message et nous vous répondrons rapidement.",

    // Loading states
    loadingText: "Chargement...",
    errorText: "Erreur de chargement des données",
  };

  // Process all WordPress text at the top level (hooks must be called here)
  useSafeWordPressText(pageData?.title?.rendered); // Keep hook call for consistency
  const subtitle =
    useSafeWordPressText(acfData["sous-titre"]) || PLACEHOLDERS.heroSubtitle;
  const banniereBouton1Title =
    useSafeWordPressText(acfData.banniere_bouton_1?.title) ||
    PLACEHOLDERS.banniereBouton1;
  const banniereBouton2Title =
    useSafeWordPressText(acfData.banniere_bouton_2?.title) ||
    PLACEHOLDERS.banniereBouton2;
  const banniereIcon1Alt =
    useSafeWordPressText(acfData.banniere_icon_1?.alt) ||
    PLACEHOLDERS.banniereIcon1Alt;
  const banniereTitre1 =
    useSafeWordPressText(acfData.banniere_titre_1) ||
    PLACEHOLDERS.banniereTitre1;
  const banniereDescription1 =
    useSafeWordPressText(acfData.banniere_description_1) ||
    PLACEHOLDERS.banniereDescription1;
  const banniereIcon2Alt =
    useSafeWordPressText(acfData.banniere_icon_2?.alt) ||
    PLACEHOLDERS.banniereIcon2Alt;
  const banniereTitre2 =
    useSafeWordPressText(acfData.banniere_titre_2) ||
    PLACEHOLDERS.banniereTitre2;
  const banniereDescription2 =
    useSafeWordPressText(acfData.banniere_description_2) ||
    PLACEHOLDERS.banniereDescription2;
  const banniereIcon3Alt =
    useSafeWordPressText(acfData.banniere_icon_3?.alt) ||
    PLACEHOLDERS.banniereIcon3Alt;
  const banniereTitre3 =
    useSafeWordPressText(acfData.banniere_titre_3) ||
    PLACEHOLDERS.banniereTitre3;
  const banniereDescription3 =
    useSafeWordPressText(acfData.banniere_description_3) ||
    PLACEHOLDERS.banniereDescription3;
  const sectionAtelierImageAlt =
    useSafeWordPressText(acfData.section_atelier_image?.alt) ||
    PLACEHOLDERS.sectionAtelierImageAlt;
  const sectionAtelierTitre =
    useSafeWordPressText(acfData.section_atelier_titre) ||
    PLACEHOLDERS.sectionAtelierTitre;
  const sectionAtelierDescription =
    useSafeWordPressText(acfData.section_atelier_description) ||
    PLACEHOLDERS.sectionAtelierDescription;
  const sectionAtelierLienTitle =
    useSafeWordPressText(acfData.section_atelier_lien?.title) ||
    PLACEHOLDERS.sectionAtelierLien;
  const sectionProduitsTitre =
    useSafeWordPressText(acfData.section_produits_titre) ||
    PLACEHOLDERS.sectionProduitsTitre;
  const sectionProduitsDescription =
    useSafeWordPressText(acfData.section_produits_description) ||
    PLACEHOLDERS.sectionProduitsDescription;
  const sectionProduitsLienTitle =
    useSafeWordPressText(acfData.section_produits_lien?.title) ||
    PLACEHOLDERS.sectionProduitsLien;
  const sectionPersonnalisationImageAlt =
    useSafeWordPressText(acfData.section_personnalisation_image?.alt) ||
    PLACEHOLDERS.sectionPersonnalisationImageAlt;
  const sectionPersonnalisationTitre =
    useSafeWordPressText(acfData.section_personnalisation_titre) ||
    PLACEHOLDERS.sectionPersonnalisationTitre;
  const sectionPersonnalisationDescription =
    useSafeWordPressText(acfData.section_personnalisation_description) ||
    PLACEHOLDERS.sectionPersonnalisationDescription;
  const sectionPersonnalisationLienTitle =
    useSafeWordPressText(acfData.section_personnalisation_lien?.title) ||
    PLACEHOLDERS.sectionPersonnalisationLien;
  const sectionTemoignagesTitre =
    useSafeWordPressText(acfData.section_temoignages_titre) ||
    PLACEHOLDERS.sectionTemoignagesTitre;
  const sectionContactTitre =
    useSafeWordPressText(acfData.section_contact_titre) ||
    PLACEHOLDERS.sectionContactTitre;
  const sectionContactSousTitre =
    useSafeWordPressText(acfData.section_contact_sous_titre) ||
    PLACEHOLDERS.sectionContactSousTitre;
  const sectionContactDescription =
    useSafeWordPressText(acfData.section_contact_description) ||
    PLACEHOLDERS.sectionContactDescription;

  // Process dynamic couteaux text at top level (individual hook calls for each item)
  const couteau0TitleRaw = useSafeWordPressText((couteaux as WPCouteau[])[0]?.title?.rendered);
  const couteau0DescriptionRaw1 = useSafeWordPressText((couteaux as WPCouteau[])[0]?.acf?.description_courte);
  const couteau0DescriptionRaw2 = useSafeWordPressText((couteaux as WPCouteau[])[0]?.excerpt?.rendered);
  const couteau1TitleRaw = useSafeWordPressText((couteaux as WPCouteau[])[1]?.title?.rendered);
  const couteau1DescriptionRaw1 = useSafeWordPressText((couteaux as WPCouteau[])[1]?.acf?.description_courte);
  const couteau1DescriptionRaw2 = useSafeWordPressText((couteaux as WPCouteau[])[1]?.excerpt?.rendered);
  const couteau2TitleRaw = useSafeWordPressText((couteaux as WPCouteau[])[2]?.title?.rendered);
  const couteau2DescriptionRaw1 = useSafeWordPressText((couteaux as WPCouteau[])[2]?.acf?.description_courte);
  const couteau2DescriptionRaw2 = useSafeWordPressText((couteaux as WPCouteau[])[2]?.excerpt?.rendered);

  const couteau0Title = couteau0TitleRaw || PLACEHOLDERS.couteauTitle;
  const couteau0Description = couteau0DescriptionRaw1 || couteau0DescriptionRaw2 || PLACEHOLDERS.couteauDescription;
  const couteau1Title = couteau1TitleRaw || PLACEHOLDERS.couteauTitle;
  const couteau1Description = couteau1DescriptionRaw1 || couteau1DescriptionRaw2 || PLACEHOLDERS.couteauDescription;
  const couteau2Title = couteau2TitleRaw || PLACEHOLDERS.couteauTitle;
  const couteau2Description = couteau2DescriptionRaw1 || couteau2DescriptionRaw2 || PLACEHOLDERS.couteauDescription;

  const couteauxTitles = [couteau0Title, couteau1Title, couteau2Title];
  const couteauxDescriptions = [
    couteau0Description,
    couteau1Description,
    couteau2Description,
  ];

  // Debug logs for couteaux data
  console.log('Raw couteaux data:', couteaux);
  console.log('Couteaux loading state:', couteauxLoading);
  console.log('Couteaux array length:', Array.isArray(couteaux) ? couteaux.length : 'Not an array');

  const processedCouteaux = (couteaux as WPCouteau[]).map((couteau, i) => ({
    ...couteau,
    processedTitle: couteauxTitles[i] || PLACEHOLDERS.couteauTitle,
    processedDescription:
      couteauxDescriptions[i] || PLACEHOLDERS.couteauDescription,
  }));

  console.log('Processed couteaux:', processedCouteaux);

  // Process dynamic temoignages text at top level (individual hook calls for each item)
  const temoignages = (acfData.temoignages || []) as WPTemoignage[];
  const temoignage0Nom = useSafeWordPressText(temoignages[0]?.nom) || "";
  const temoignage0Commentaire =
    useSafeWordPressText(temoignages[0]?.commentaire) || "";
  const temoignage1Nom = useSafeWordPressText(temoignages[1]?.nom) || "";
  const temoignage1Commentaire =
    useSafeWordPressText(temoignages[1]?.commentaire) || "";
  const temoignage2Nom = useSafeWordPressText(temoignages[2]?.nom) || "";
  const temoignage2Commentaire =
    useSafeWordPressText(temoignages[2]?.commentaire) || "";

  const temoignagesNoms = [temoignage0Nom, temoignage1Nom, temoignage2Nom];
  const temoignagesCommentaires = [
    temoignage0Commentaire,
    temoignage1Commentaire,
    temoignage2Commentaire,
  ];

  const processedTemoignages = temoignages.map((t, i) => ({
    ...t,
    processedNom: temoignagesNoms[i] || "",
    processedCommentaire: temoignagesCommentaires[i] || "",
  }));

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  //Log WordPress data when it changes
  // useEffect(() => {
  //   console.log("Home page data:", pageData);
  //   console.log("Home page loading state:", loading);
  //   console.log("ACF Data:", acfData);
  //   if (error) {
  //     console.error("Home page error:", error);
  //   }
  // }, [pageData, loading, error, acfData]);

  // // Log couteaux data when it changes
  // useEffect(() => {
  //   console.log("Couteaux data:", couteaux);
  //   console.log("Couteaux loading state:", couteauxLoading);
  // }, [couteaux, couteauxLoading]);

  //CAPTCHA - removed unused variables

  // Fonction pour calculer la hauteur du hero en fonction de la fenêtre et du header
  const calculateHeroHeight = () => {
    // Récupérer la hauteur du header
    const header = document.querySelector("header");
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
    window.addEventListener("resize", calculateHeroHeight);

    return () => {
      window.removeEventListener("resize", calculateHeroHeight);
    };
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  // Gestion du formulaire de contact avec approche simplifiée
  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    const formData = new FormData(e.currentTarget);
    const contactData = {
      nom: formData.get("nom") as string,
      objet: formData.get("objet") as string,
      message: formData.get("message") as string,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitMessage(
          "Votre message a été préparé. Votre client email va s'ouvrir..."
        );

        // Ouvrir directement le client email
        window.location.href = result.mailtoLink;

        // Réinitialiser le formulaire après un délai
        setTimeout(() => {
          const form = document.getElementById(
            "contactForm"
          ) as HTMLFormElement;
          if (form) form.reset();
          setSubmitMessage("");
        }, 2000);
      } else {
        setSubmitMessage(
          result.error || "Une erreur est survenue. Veuillez réessayer."
        );
      }
    } catch {
      // console.error("Erreur lors de l'envoi:", error);
      setSubmitMessage(
        "Une erreur de connexion est survenue. Veuillez vérifier votre connexion internet et réessayer."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    async function fetchFeaturedImage() {
      if (!pageData || !pageData.featured_media) return;

      try {
        const res = await fetch(
          `https://xulinos.xyz-agency.com/wp-json/wp/v2/media/${pageData.featured_media}`
        );
        const data = await res.json();
        setFeaturedImageUrl(data.source_url);
      } catch (err) {
        console.error("Erreur lors du fetch de l'image mise en avant:", err);
      }
    }

    fetchFeaturedImage();
  }, [pageData]);

  // Removed unused images fetch

  // Fallback images pour les icônes de services
  const fallbackIcons = {
    banniere1: "/icons/knife.svg",
    banniere2: "/icons/palette.svg", 
    banniere3: "/icons/pencil-rule.svg"
  };

  // Show loading spinner while data is being fetched
  if (loading) {
    return <LoadingSpinner />;
  }

  // Show error message if no data is available
  if (!pageData) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-dark">
        <div className="text-white text-xl">{PLACEHOLDERS.errorText}</div>
      </main>
    );
  }

  return (
    <main className="flex flex-col">
      {/* Hero Section - Hauteur calculée dynamiquement */}
      <section
        ref={heroRef}
        className="relative w-full flex items-center"
        style={{ height: heroHeight ? `${heroHeight}px` : "100vh" }}
      >
        {/* Background Image with responsive container */}
        <div className="absolute inset-0 z-0">
          {featuredImageUrl ? (
            <Image
              src={featuredImageUrl}
              alt={pageData.title.rendered}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gray-900"></div>
          )}
        </div>

        {/* Hero Content - Centered vertically with responsive padding */}
        <div className="relative z-10 w-full py-12 sm:py-16 px-6 md:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto">
            <h1
              dangerouslySetInnerHTML={{ __html: pageData.title.rendered }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4"
            ></h1>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl">
              {subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <PrimaryButton
                name={banniereBouton1Title}
                className="text-lg py-3 px-6"
                onClick={() =>
                  handleNavigation(
                    acfData.banniere_bouton_1?.url || "/configurateur"
                  )
                }
              />
              <SecondaryButton
                name={banniereBouton2Title}
                className="text-lg py-3 px-6"
                onClick={() =>
                  handleNavigation(
                    acfData.banniere_bouton_2?.url || "/affutage-remoulage"
                  )
                }
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
                {acfImages.banniere1?.source_url ? (
                  <Image
                    src={acfImages.banniere1.source_url}
                    alt={banniereIcon1Alt}
                    width={96}
                    height={96}
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <Image
                    src={fallbackIcons.banniere1}
                    alt={banniereIcon1Alt}
                    width={96}
                    height={96}
                    className="object-contain w-full h-full"
                    priority
                  />
                )}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {banniereTitre1}
              </h3>
              <p className="text-white/90">
                {banniereDescription1}
              </p>
            </div>
            {/* Service Feature 2 */}
            <div className="flex flex-col items-center text-center flex-1 basis-[280px] min-w-[280px]">
              <div className="w-24 h-24 mb-6">
                {acfImages.banniere2?.source_url ? (
                  <Image
                    src={acfImages.banniere2.source_url}
                    alt={banniereIcon2Alt}
                    width={96}
                    height={96}
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <Image
                    src={fallbackIcons.banniere2}
                    alt={banniereIcon2Alt}
                    width={96}
                    height={96}
                    className="object-contain w-full h-full"
                  />
                )}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {banniereTitre2}
              </h3>
              <p className="text-white/90">
                {banniereDescription2}
              </p>
            </div>

            {/* Service Feature 3 */}
            <div className="flex flex-col items-center text-center flex-1 basis-[280px] min-w-[280px]">
              <div className="w-24 h-24 mb-6">
                {acfImages.banniere3?.source_url ? (
                  <Image
                    src={acfImages.banniere3.source_url}
                    alt={banniereIcon3Alt}
                    width={96}
                    height={96}
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <Image
                    src={fallbackIcons.banniere3}
                    alt={banniereIcon3Alt}
                    width={96}
                    height={96}
                    className="object-contain w-full h-full"
                  />
                )}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {banniereTitre3}
              </h3>
              <p className="text-white/90">
                {banniereDescription3}
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
                {acfImages.atelier?.source_url ? (
                  <Image
                    src={acfImages.atelier.source_url}
                    alt={sectionAtelierImageAlt}
                    width={600}
                    height={400}
                    className="rounded-md object-cover w-full h-auto"
                  />
                ) : (
                  <Image
                    src="/images/couteaux_table_cuisine_bouche.jpg"
                    alt={sectionAtelierImageAlt}
                    width={600}
                    height={400}
                    className="rounded-md object-cover w-full h-auto"
                  />
                )}
              </div>
            </div>

            {/* Content */}
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {sectionAtelierTitre}
              </h2>
              <p className="text-white/90 mb-6">
                {sectionAtelierDescription}
              </p>
              <button
                onClick={() =>
                  handleNavigation(
                    acfData.section_atelier_lien?.url || "/a-propos"
                  )
                }
                className="inline-flex items-center text-white hover:text-white/80 font-medium"
              >
                {sectionAtelierLienTitle} <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Produits Disponibles Section */}
      <section className="py-16 px-8 md:px-12 bg-primary">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {sectionProduitsTitre}
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-3xl">
            {sectionProduitsDescription}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Affiche seulement les 3 premiers produits */}
            {couteauxLoading ? (
              // Loading state
              Array.from({ length: 3 }).map((_, index) => (
                <div key={`loading-${index}`} className="bg-dark rounded-xl overflow-hidden shadow-lg">
                  <div className="relative h-72 bg-gray-700 animate-pulse">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <LoadingSpinner />
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-700 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>
              ))
            ) : (
              processedCouteaux.slice(0, 3).map((couteau, index) => (
                <div 
                  key={couteau.id || index} 
                  className="bg-dark rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  onClick={() => handleNavigation(`/couteaux/${couteau.id}`)}
                >
                  <div className="relative h-72">
                    {couteau.acf?.image_principale?.url ? (
                      <Image 
                        src={couteau.acf.image_principale.url}
                        alt={couteau.acf.image_principale.alt || couteau.processedTitle || PLACEHOLDERS.couteauTitle}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                        className="hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback to default image if WordPress image fails to load
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/knives/le-souverain/le-souverain.png";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <Image 
                          src="/images/knives/le-souverain/le-souverain.png"
                          alt={couteau.processedTitle || PLACEHOLDERS.couteauTitle}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          style={{ objectFit: 'cover', objectPosition: 'center' }}
                          className="hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-primary/80 text-white text-sm px-4 py-1.5 rounded-full">
                      {couteau.acf?.disponibilite || PLACEHOLDERS.disponibilite}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {couteau.processedTitle || PLACEHOLDERS.couteauTitle}
                    </h3>
                    <p className="text-white/80 line-clamp-4">
                      {extractTextFromWordPress(couteau.processedDescription || PLACEHOLDERS.couteauDescription)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => handleNavigation("/couteaux")}
              className="inline-flex items-center text-white hover:text-white/80 font-medium text-lg"
            >
              {sectionProduitsLienTitle} <FaArrowRight className="ml-2" />
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
                {acfImages.signature?.source_url ? (
                  <Image
                    src={acfImages.signature.source_url}
                    alt={sectionPersonnalisationImageAlt}
                    width={600}
                    height={400}
                    className="rounded-md object-cover w-full h-auto max-w-[400px] sm:max-w-[700px]"
                  />
                ) : (
                  <Image
                    src="/images/knives/nature01.jpg"
                    alt={sectionPersonnalisationImageAlt}
                    width={600}
                    height={400}
                    className="rounded-md object-cover w-full h-auto max-w-[400px] sm:max-w-[700px]"
                  />
                )}
              </div>
            </div>

            {/* Content */}
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {sectionPersonnalisationTitre}
              </h2>
              <p className="text-white/90 mb-6">
                {sectionPersonnalisationDescription}
              </p>
              <button
                onClick={() =>
                  handleNavigation(
                    acfData.section_personnalisation_lien?.url ||
                      "/configurateur"
                  )
                }
                className="inline-flex items-center bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-md transition-colors"
              >
                {sectionPersonnalisationLienTitle}{" "}
                <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages Section */}
      <section className="py-16 px-8 md:px-12 bg-[#7a6761]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
            {sectionTemoignagesTitre}
          </h2>

          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {/* Display dynamic testimonials or fallback to static ones */}
            {processedTemoignages && processedTemoignages.length > 0 ? (
              processedTemoignages.map((temoignage: {
                nom: string;
                commentaire: string;
                processedNom: string;
                processedCommentaire: string;
              }, index: number) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md w-[260px] h-[120px] flex flex-col justify-center"
                >
                  <div className="flex text-primary mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="w-5 h-5" />
                    ))}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {temoignage.processedNom || ""}
                  </h3>
                  {temoignage.processedCommentaire && (
                    <p className="text-sm text-gray-600 mt-1">
                      {temoignage.processedCommentaire || ""}
                    </p>
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
                  <h3 className="text-lg font-bold text-gray-800">
                    James Dean
                  </h3>
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
                  <h3 className="text-lg font-bold text-gray-800">
                    Marie Lefevre
                  </h3>
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
                  <h3 className="text-lg font-bold text-gray-800">
                    Alex Moreau
                  </h3>
                </div>
              </>
            )}
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => handleNavigation("/avis")}
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
              sizes="100vw"
              style={{
                objectFit: "contain",
                objectPosition: "right bottom",
              }}
              quality={100}
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Texte d'introduction */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {sectionContactTitre}
            </h2>
            <p className="text-xl text-white/90 mb-2 max-w-2xl">
              {sectionContactSousTitre}
            </p>
            <p className="text-white/80 max-w-2xl">
              {sectionContactDescription}
            </p>
          </div>

          {/* Formulaire */}
          <div className="max-w-2xl">
            <form
              id="contactForm"
              onSubmit={handleContactSubmit}
              className="flex flex-col gap-4"
            >
              <div>
                <label htmlFor="nom" className="block text-white mb-2">
                  Nom complet
                </label>
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
                <label htmlFor="objet" className="block text-white mb-2">
                  Objet
                </label>
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
                <label htmlFor="message" className="block text-white mb-2">
                  Message
                </label>
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
                {isSubmitting ? "Envoi en cours..." : "Soumettre mon projet"}
              </button>

              {submitMessage && (
                <div
                  className={`mt-4 p-4 rounded-md border-l-4 ${
                    submitMessage.includes("préparé")
                      ? "bg-green-900/20 border-green-500 text-green-100"
                      : "bg-red-900/20 border-red-500 text-red-100"
                  }`}
                >
                  <div className="flex items-center">
                    <span className="mr-2">
                      {submitMessage.includes("préparé") ? "✅" : "❌"}
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
