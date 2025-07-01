import React from 'react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <main className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">À propos</h1>
        <div className="bg-dark rounded-xl p-8 mb-12">
          <p className="text-xl text-white/90 mb-6">
            Découvrez l'histoire et le savoir-faire derrière notre atelier de coutellerie artisanale.
          </p>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2">
              <h2 className="text-2xl font-bold text-white mb-4">Notre passion</h2>
              <p className="text-white/80 mb-4">
                Depuis notre création, nous nous efforçons de perpétuer les traditions de la coutellerie 
                artisanale tout en y apportant une touche de modernité. Chaque couteau qui sort de notre 
                atelier est le fruit d'un travail minutieux et passionné.
              </p>
              <p className="text-white/80">
                Nos artisans combinent des techniques ancestrales avec des approches contemporaines 
                pour créer des pièces uniques qui allient esthétique et fonctionnalité.
              </p>
            </div>
            <div className="w-full md:w-1/2 relative h-[300px] md:h-auto">
              <div className="rounded-lg overflow-hidden h-full">
                <Image 
                  src="/images/hero-section.png" 
                  alt="Notre atelier" 
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
