'use client';

import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

interface Testimonial {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export default function AvisPage() {
  // État initial avec les 3 avis mentionnés
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: 1,
      name: "James Dean",
      rating: 5,
      comment: "J'ai commandé un couteau personnalisé pour mon père et il est absolument magnifique. La qualité de fabrication est exceptionnelle et le service client a été impeccable tout au long du processus.",
      date: "15/04/2023"
    },
    {
      id: 2,
      name: "Marie Lefevre",
      rating: 5,
      comment: "Le service d'affûtage est vraiment excellent. Mes couteaux de cuisine sont comme neufs ! Je recommande vivement Xulinos pour leur professionnalisme et leur savoir-faire.",
      date: "23/06/2023"
    },
    {
      id: 3,
      name: "Alex Moreau",
      rating: 5,
      comment: "J'ai reçu mon Kiridashi 'Yoru' et je suis impressionné par la finesse du travail. L'équilibre est parfait et la lame est d'une précision remarquable. Un grand merci à l'artisan !",
      date: "07/09/2023"
    }
  ]);

  // État pour le formulaire d'avis
  const [newReview, setNewReview] = useState({
    name: '',
    rating: 5,
    comment: ''
  });

  // Gérer les changements dans le formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReview({
      ...newReview,
      [name]: value
    });
  };

  // Gérer le changement de note
  const handleRatingChange = (rating: number) => {
    setNewReview({
      ...newReview,
      rating
    });
  };

  // Soumettre un nouvel avis
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier que tous les champs sont remplis
    if (!newReview.name || !newReview.comment) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    
    // Créer un nouvel avis
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
    
    const newTestimonial: Testimonial = {
      id: testimonials.length + 1,
      name: newReview.name,
      rating: newReview.rating,
      comment: newReview.comment,
      date: formattedDate
    };
    
    // Ajouter le nouvel avis à la liste
    setTestimonials([...testimonials, newTestimonial]);
    
    // Réinitialiser le formulaire
    setNewReview({
      name: '',
      rating: 5,
      comment: ''
    });
  };

  return (
    <main className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Avis clients</h1>
        
        {/* Liste des avis */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Ce que nos clients disent de nous</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-dark rounded-xl p-6 shadow-lg">
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i} 
                      className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-white'}`}
                    />
                  ))}
                </div>
                <p className="text-white/90 mb-4 italic">"{testimonial.comment}"</p>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white">{testimonial.name}</h3>
                  <span className="text-sm text-white/60">{testimonial.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Formulaire pour ajouter un avis */}
        <div className="bg-dark rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Partagez votre expérience</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-white mb-2">Votre nom *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newReview.name}
                onChange={handleInputChange}
                className="w-full p-3 bg-white text-gray-800 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            <div>
              <label className="block text-white mb-2">Votre note *</label>
              <div className="flex gap-2 p-3 rounded-md">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    className="text-2xl focus:outline-none"
                  >
                    <FaStar 
                      className={`w-8 h-8 ${star <= newReview.rating ? 'text-yellow-400' : 'text-white'}`}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="comment" className="block text-white mb-2">Votre commentaire *</label>
              <textarea
                id="comment"
                name="comment"
                value={newReview.comment}
                onChange={handleInputChange}
                rows={4}
                className="w-full p-3 bg-white text-gray-800 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              ></textarea>
            </div>
            
            <div>
              <button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-md transition-colors"
              >
                Publier mon avis
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
