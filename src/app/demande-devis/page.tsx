'use client';

import DemandeDevisForm from '@/components/DemandeDevisForm';

export default function DemandeDevisPage() {
  return (
    <div className="min-h-screen bg-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Demande de devis personnalisé
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Remplissez ce formulaire pour recevoir un devis détaillé pour vos couteaux artisanaux.
          </p>
        </div>
        <DemandeDevisForm withCartSummary={true} />
      </div>
    </div>
  );
}
