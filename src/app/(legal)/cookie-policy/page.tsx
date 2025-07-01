import React from 'react';

export default function CookiePolicyPage() {
  return (
    <main className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Politique des cookies</h1>
        
        <div className="bg-dark rounded-xl p-8">
          <p className="text-white/80 mb-6">
            Dernière mise à jour : 1er juin 2023
          </p>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Qu'est-ce qu'un cookie ?</h2>
              <p className="text-white/80">
                Un cookie est un petit fichier texte qui est stocké sur votre ordinateur ou appareil mobile 
                lorsque vous visitez un site web. Les cookies sont largement utilisés pour faire fonctionner 
                les sites web ou les rendre plus efficaces, ainsi que pour fournir des informations aux 
                propriétaires du site.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Comment nous utilisons les cookies</h2>
              <p className="text-white/80 mb-3">
                Notre site web utilise des cookies pour diverses raisons, notamment pour :
              </p>
              <ul className="text-white/80 space-y-2 ml-6">
                <li className="list-disc">Assurer le bon fonctionnement du site (cookies essentiels)</li>
                <li className="list-disc">Comprendre comment vous interagissez avec notre site (cookies analytiques)</li>
                <li className="list-disc">Améliorer votre expérience utilisateur (cookies de fonctionnalité)</li>
                <li className="list-disc">Vous proposer des publicités pertinentes (cookies de ciblage)</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Types de cookies que nous utilisons</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Cookies essentiels</h3>
                  <p className="text-white/80">
                    Ces cookies sont nécessaires au fonctionnement du site et ne peuvent pas être désactivés 
                    dans nos systèmes. Ils sont généralement établis en réponse à des actions que vous avez 
                    effectuées et qui constituent une demande de services.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Cookies analytiques</h3>
                  <p className="text-white/80">
                    Ces cookies nous permettent de compter les visites et les sources de trafic afin que 
                    nous puissions mesurer et améliorer les performances de notre site.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Cookies de fonctionnalité</h3>
                  <p className="text-white/80">
                    Ces cookies permettent au site de fournir une fonctionnalité et une personnalisation 
                    améliorées. Ils peuvent être définis par nous ou par des fournisseurs tiers.
                  </p>
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Comment gérer les cookies</h2>
              <p className="text-white/80">
                Vous pouvez configurer votre navigateur pour refuser tous les cookies ou pour indiquer 
                quand un cookie est envoyé. Cependant, si vous n'acceptez pas les cookies, il se peut 
                que vous ne puissiez pas utiliser certaines parties de notre site.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Contact</h2>
              <p className="text-white/80">
                Si vous avez des questions concernant notre politique de cookies, veuillez nous contacter 
                à contact@xulinos.fr ou par téléphone au 01 23 45 67 89.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
