import React from 'react';

export default function TermsOfServicePage() {
  return (
    <main className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Conditions générales d'utilisation</h1>
        
        <div className="bg-dark rounded-xl p-8">
          <p className="text-white/80 mb-6">
            Dernière mise à jour : 1er juin 2023
          </p>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptation des conditions</h2>
              <p className="text-white/80">
                En accédant à ce site web, vous acceptez d'être lié par ces conditions d'utilisation, 
                toutes les lois et réglementations applicables, et vous acceptez que vous êtes responsable 
                du respect des lois locales applicables. Si vous n'acceptez pas l'une de ces conditions, 
                vous êtes interdit d'utiliser ou d'accéder à ce site.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Commandes et paiements</h2>
              <p className="text-white/80 mb-3">
                En passant une commande sur notre site, vous garantissez que :
              </p>
              <ul className="text-white/80 space-y-2 ml-6">
                <li className="list-disc">Vous êtes légalement capable de conclure des contrats</li>
                <li className="list-disc">Les informations que vous fournissez sont exactes et complètes</li>
                <li className="list-disc">Vous acceptez de payer intégralement tous les biens que vous achetez</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Livraison et retours</h2>
              <p className="text-white/80 mb-3">
                Nos délais de livraison sont généralement de 5 à 10 jours ouvrables. Pour les produits 
                personnalisés, le délai peut être prolongé jusqu'à 3 semaines.
              </p>
              <p className="text-white/80">
                Vous disposez d'un délai de 14 jours à compter de la réception pour retourner un produit 
                non personnalisé. Les produits personnalisés ne peuvent être retournés sauf en cas de défaut.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Propriété intellectuelle</h2>
              <p className="text-white/80">
                Tous les contenus présents sur ce site (textes, images, logos, designs) sont la propriété 
                exclusive de Xulinos ou de ses fournisseurs de contenu et sont protégés par les lois 
                françaises et internationales relatives à la propriété intellectuelle.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Contact</h2>
              <p className="text-white/80">
                Pour toute question concernant ces conditions d'utilisation, veuillez nous contacter 
                à contact@xulinos.fr ou par téléphone au 01 23 45 67 89.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
