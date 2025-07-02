'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import PrimaryButton from '@/components/PrimaryButton';

export default function ConfigurateurPage() {
  const [step, setStep] = useState(1);
  const [selectedKnife, setSelectedKnife] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  
  const knives = [
    { id: 'chef', name: 'Couteau de Chef', image: '/images/knives/le-souverain/le-souverain.png' },
    { id: 'damas', name: 'Le Damas Sylvestre', image: '/images/knives/le_damas_sylvestre/01.png' },
    { id: 'kiridashi', name: 'Kiridashi Yoru', image: '/images/knives/kiridashi-yoru/kiridashi-yoru.png' },
  ];
  
  const materials = [
    { id: 'noyer', name: 'Bois de Noyer', color: 'bg-amber-800' },
    { id: 'ebene', name: 'Ébène', color: 'bg-gray-900' },
    { id: 'olivier', name: 'Bois d\'Olivier', color: 'bg-amber-600' },
  ];
  
  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white">1. Choisissez votre modèle de couteau</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {knives.map((knife) => (
                <div 
                  key={knife.id}
                  className={`bg-dark p-4 rounded-lg cursor-pointer transition-all ${selectedKnife === knife.id ? 'ring-2 ring-primary' : 'hover:bg-opacity-80'}`}
                  onClick={() => setSelectedKnife(knife.id)}
                >
                  <div className="relative h-48 mb-4">
                    <Image
                      src={knife.image}
                      alt={knife.name}
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-white text-center">{knife.name}</h3>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <PrimaryButton 
                name="Continuer" 
                onClick={() => setStep(2)} 
                disabled={!selectedKnife}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white">2. Choisissez le matériau du manche</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {materials.map((material) => (
                <div 
                  key={material.id}
                  className={`bg-dark p-4 rounded-lg cursor-pointer transition-all ${selectedMaterial === material.id ? 'ring-2 ring-primary' : 'hover:bg-opacity-80'}`}
                  onClick={() => setSelectedMaterial(material.id)}
                >
                  <div className={`w-full h-24 rounded-md mb-4 ${material.color}`}></div>
                  <h3 className="text-xl font-semibold text-white text-center">{material.name}</h3>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <PrimaryButton 
                name="Retour" 
                onClick={() => setStep(1)}
              />
              <PrimaryButton 
                name="Continuer" 
                onClick={() => setStep(3)} 
                disabled={!selectedMaterial}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white">3. Récapitulatif de votre configuration</h2>
            <div className="bg-dark p-6 rounded-lg">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="relative w-full md:w-1/2 h-64">
                  {selectedKnife && (
                    <Image
                      src={knives.find(k => k.id === selectedKnife)?.image || ''}
                      alt="Couteau personnalisé"
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  )}
                </div>
                <div className="w-full md:w-1/2 space-y-4">
                  <h3 className="text-xl font-bold text-white">Votre couteau personnalisé</h3>
                  <p className="text-white/80">
                    <strong>Modèle :</strong> {knives.find(k => k.id === selectedKnife)?.name}
                  </p>
                  <p className="text-white/80">
                    <strong>Matériau du manche :</strong> {materials.find(m => m.id === selectedMaterial)?.name}
                  </p>
                  <p className="text-white/80 mt-4">
                    Votre couteau personnalisé sera fabriqué avec le plus grand soin par nos artisans. 
                    Le délai de fabrication est d'environ 2-3 semaines.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <PrimaryButton 
                name="Retour" 
                onClick={() => setStep(2)}
              />
              <PrimaryButton 
                name="Demander un devis" 
                onClick={() => alert('Votre demande de devis a été envoyée. Nous vous contacterons prochainement.')}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="py-16 px-8 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Configurateur de couteau</h1>
        <p className="text-xl text-white/90 mb-10 max-w-3xl">
          Créez votre couteau sur mesure en quelques étapes simples. Choisissez le modèle, 
          les matériaux et les finitions pour obtenir une pièce unique qui vous ressemble.
        </p>
        
        {/* Indicateur d'étape */}
        <div className="flex items-center mb-12">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary' : 'bg-gray-700'}`}>
            <span className="text-white font-bold">1</span>
          </div>
          <div className={`h-1 w-12 ${step >= 2 ? 'bg-primary' : 'bg-gray-700'}`}></div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary' : 'bg-gray-700'}`}>
            <span className="text-white font-bold">2</span>
          </div>
          <div className={`h-1 w-12 ${step >= 3 ? 'bg-primary' : 'bg-gray-700'}`}></div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary' : 'bg-gray-700'}`}>
            <span className="text-white font-bold">3</span>
          </div>
        </div>
        
        {/* Contenu de l'étape */}
        <div className="bg-black/30 rounded-xl p-8">
          {renderStepContent()}
        </div>
      </div>
    </main>
  );
}
