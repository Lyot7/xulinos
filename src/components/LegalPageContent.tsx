'use client';

import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LegalPageContentProps {
  title: string;
  content: string;
  date: string;
  loading: boolean;
  error: string | null;
}

export const LegalPageContent: React.FC<LegalPageContentProps> = ({
  title,
  content,
  date,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <main className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner />
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-8">
            <h1 className="text-2xl font-bold text-red-400 mb-4">Erreur</h1>
            <p className="text-red-300">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-dark rounded-xl p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {title}
          </h1>
          
          {date && (
            <p className="text-white/60 text-sm mb-8 pb-4 border-b border-white">
              Dernière mise à jour : {date}
            </p>
          )}
          
          <div 
            className="legal-content text-white/90"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </main>
  );
}; 