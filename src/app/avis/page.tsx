'use client';

import React, { useState } from 'react';
import { FaStar, FaPaperPlane } from 'react-icons/fa';

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
    nom: '',
    objet: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [mailtoLink, setMailtoLink] = useState<string | null>(null);

  // Gérer les changements dans le formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReview({
      ...newReview,
      [name]: value
    });
  };

  // Soumettre un nouvel avis
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier que tous les champs sont remplis
    if (!newReview.nom || !newReview.objet || !newReview.message) {
      setSubmitMessage('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage('');
    setMailtoLink(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newReview,
          type: 'avis'
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitMessage('Votre avis a été préparé. Votre client email va s\'ouvrir...');
        
        // Ouvrir directement le client email
        window.location.href = result.mailtoLink;
        
        // Ajouter l'avis localement pour l'affichage
        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
        
        const newTestimonial: Testimonial = {
          id: testimonials.length + 1,
          name: newReview.nom,
          rating: 5, // Note par défaut
          comment: newReview.message,
          date: formattedDate
        };
        
        setTestimonials([...testimonials, newTestimonial]);
        
        // Réinitialiser le formulaire après un délai
        setTimeout(() => {
          setNewReview({
            nom: '',
            objet: '',
            message: ''
          });
          setSubmitMessage('');
          setMailtoLink(null);
        }, 2000);
      } else {
        setSubmitMessage(result.error || 'Une erreur est survenue. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      setSubmitMessage('Une erreur de connexion est survenue. Veuillez vérifier votre connexion internet et réessayer.');
    } finally {
      setIsSubmitting(false);
    }
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
              <label htmlFor="nom" className="block text-white mb-2">Votre nom *</label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={newReview.nom}
                onChange={handleInputChange}
                className="w-full p-3 bg-white text-gray-800 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            <div>
              <label htmlFor="objet" className="block text-white mb-2">Objet *</label>
              <input
                type="text"
                id="objet"
                name="objet"
                value={newReview.objet}
                onChange={handleInputChange}
                className="w-full p-3 bg-white text-gray-800 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ex: Avis sur mon couteau personnalisé"
                required
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-white mb-2">Votre commentaire *</label>
              <textarea
                id="message"
                name="message"
                value={newReview.message}
                onChange={handleInputChange}
                rows={4}
                className="w-full p-3 bg-white text-gray-800 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Partagez votre expérience avec Xulinos..."
                required
              ></textarea>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white font-medium py-3 px-6 rounded-md transition-colors"
              >
                {isSubmitting ? 'Préparation en cours...' : 'Préparer mon avis'}
              </button>
            </div>
          </form>

          {submitMessage && (
            <div className={`mt-6 p-4 rounded-md border-l-4 ${
              submitMessage.includes('préparé') ? 'bg-green-900/20 border-green-500 text-green-100' 
              : 'bg-red-900/20 border-red-500 text-red-100'
            }`}>
              <div className="flex items-center">
                <span className="mr-2">
                  {submitMessage.includes('préparé') ? '✅' : '❌'}
                </span>
                <p className="text-sm font-medium">{submitMessage}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
