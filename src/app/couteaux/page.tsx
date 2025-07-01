import React from 'react';
import Image from 'next/image';

export default function KnivesPage() {
  return (
    <main className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Nos couteaux</h1>
        <p className="text-xl text-white/90 mb-8 max-w-3xl">
          Découvrez notre collection de couteaux artisanaux, façonnés avec passion et savoir-faire.
          Chaque pièce est unique et raconte sa propre histoire.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Couteau 1 */}
          <div className="bg-dark rounded-xl overflow-hidden shadow-lg">
            <div className="relative h-72">
              <Image 
                src="/images/knives/le-souverain.png" 
                alt="Le Souverain" 
                fill
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">Le Souverain</h3>
              <p className="text-white/80 mb-4">Bois de fer, lame en acier poli, pliant</p>
              <p className="text-primary font-medium">250,00 €</p>
            </div>
          </div>

          {/* Couteau 2 */}
          <div className="bg-dark rounded-xl overflow-hidden shadow-lg">
            <div className="relative h-72">
              <Image 
                src="/images/knives/kiridashi-yoru.png" 
                alt="Kiridashi 'Yoru'" 
                fill
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">Kiridashi 'Yoru'</h3>
              <p className="text-white/80 mb-4">Bois d'ébène, acier damas</p>
              <p className="text-primary font-medium">180,00 €</p>
            </div>
          </div>

          {/* Couteau 3 */}
          <div className="bg-dark rounded-xl overflow-hidden shadow-lg">
            <div className="relative h-72">
              <Image 
                src="/images/knives/le_damas_sylvestre.jpg" 
                alt="Le Damas sylvestre" 
                fill
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">Le Damas sylvestre</h3>
              <p className="text-white/80 mb-4">Bois de santal, acier carbone, guillochage</p>
              <p className="text-primary font-medium">320,00 €</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
