import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <main className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Politique de confidentialité</h1>
        
        <div className="bg-dark rounded-xl p-8">
          <p className="text-white/80 mb-6">
            Dernière mise à jour : 1er juin 2023
          </p>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
              <p className="text-white/80">
                Xulinos s'engage à protéger la vie privée des visiteurs de notre site web. Cette politique 
                de confidentialité explique comment nous collectons, utilisons et protégeons vos informations 
                personnelles lorsque vous visitez notre site ou effectuez un achat.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Informations que nous collectons</h2>
              <p className="text-white/80 mb-3">
                Lorsque vous visitez notre site, nous pouvons collecter les types d'informations suivants :
              </p>
              <ul className="text-white/80 space-y-2 ml-6">
                <li className="list-disc">Informations personnelles (nom, adresse e-mail, adresse postale, numéro de téléphone)</li>
                <li className="list-disc">Informations de paiement (cryptées et sécurisées)</li>
                <li className="list-disc">Informations de navigation (adresse IP, type de navigateur, pages visitées)</li>
                <li className="list-disc">Préférences et historique d'achat</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Comment nous utilisons vos informations</h2>
              <p className="text-white/80 mb-3">
                Nous utilisons vos informations pour :
              </p>
              <ul className="text-white/80 space-y-2 ml-6">
                <li className="list-disc">Traiter vos commandes et vous fournir nos services</li>
                <li className="list-disc">Communiquer avec vous concernant votre commande ou nos services</li>
                <li className="list-disc">Améliorer notre site web et nos offres</li>
                <li className="list-disc">Vous envoyer des informations marketing (avec votre consentement)</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Contact</h2>
              <p className="text-white/80">
                Si vous avez des questions concernant notre politique de confidentialité, veuillez nous 
                contacter à contact@xulinos.fr ou par téléphone au 01 23 45 67 89.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
