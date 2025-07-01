import React from 'react';
import Image from 'next/image';
import PrimaryButton from '@/components/PrimaryButton';

export default function SharpeningPage() {
  return (
    <main className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Affûtage & Rémoulage</h1>
        
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="w-full md:w-1/2">
            <div className="rounded-lg overflow-hidden">
              <Image 
                src="/images/affutage-remoulage.png" 
                alt="Service d'affûtage et rémoulage" 
                width={800}
                height={600}
                className="w-full h-auto"
              />
            </div>
          </div>
          
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl font-bold text-white mb-4">Redonnez vie à vos lames</h2>
            <p className="text-white/80 mb-4">
              Un couteau bien affûté est un outil sûr et efficace. Notre service d'affûtage 
              et de rémoulage redonne à vos lames leur tranchant d'origine, prolongeant ainsi 
              leur durée de vie et préservant leur performance.
            </p>
            <p className="text-white/80 mb-6">
              Que ce soit pour vos couteaux de cuisine, vos outils de jardinage ou vos ciseaux, 
              notre expertise vous garantit un résultat professionnel.
            </p>
            
            <div className="bg-dark rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-white mb-3">Nos services incluent :</h3>
              <ul className="text-white/80 space-y-2">
                <li>• Affûtage de couteaux de cuisine</li>
                <li>• Rémoulage d'outils de jardinage</li>
                <li>• Affûtage de ciseaux et matériel de coiffure</li>
                <li>• Entretien et restauration de lames anciennes</li>
              </ul>
            </div>
            
            <PrimaryButton name="Prendre rendez-vous" className="text-lg py-3 px-6" />
          </div>
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
