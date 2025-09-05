"use client";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function FormulaireContent() {
  const searchParams = useSearchParams();
  const services = searchParams.get("services")?.split(",") || [];

  const [form, setForm] = useState({
    nom: "",
    objet: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  // Removed unused mailtoLink variable

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      // Préparer le message avec les services sélectionnés
      const servicesText = services.length > 0 
        ? `Services sélectionnés : ${services.map(s => decodeURIComponent(s)).join(", ")}\n\n`
        : "";

      const fullMessage = `${servicesText}${form.message}`;

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: form.nom,
          objet: form.objet,
          message: fullMessage,
          type: 'demande'
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitMessage('Votre demande a été préparée. Votre client email va s\'ouvrir...');
        
        // Ouvrir directement le client email
        window.location.href = result.mailtoLink;
        
        // Réinitialiser le formulaire après un délai
        setTimeout(() => {
          setForm({
            nom: "",
            objet: "",
            message: "",
          });
          setSubmitMessage("");
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
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Demande de devis</h1>
      
      {services.length > 0 && (
        <>
          <p className="mb-4 text-sm text-gray-300">Services sélectionnés :</p>
          <ul className="mb-6 list-disc list-inside text-sm text-gray-400">
            {services.map((s, i) => (
              <li key={i}>{decodeURIComponent(s)}</li>
            ))}
          </ul>
        </>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="nom"
          placeholder="Nom complet"
          className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:border-white focus:outline-none"
          value={form.nom}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="objet"
          placeholder="Objet de votre demande"
          className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:border-white focus:outline-none"
          value={form.objet}
          onChange={handleChange}
          required
        />

        <textarea
          name="message"
          placeholder="Détails de votre demande..."
          rows={6}
          className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:border-white focus:outline-none resize-none"
          value={form.message}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-white text-black px-6 py-2 rounded hover:bg-gray-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {isSubmitting ? 'Préparation en cours...' : 'Préparer ma demande'}
        </button>
      </form>

      {submitMessage && (
        <div className={`mt-6 p-4 rounded-md border-l-4 ${
          submitMessage.includes('préparée') ? 'bg-green-900/20 border-green-500 text-green-100' 
          : 'bg-red-900/20 border-red-500 text-red-100'
        }`}>
          <div className="flex items-center">
            <span className="mr-2">
              {submitMessage.includes('préparée') ? '✅' : '❌'}
            </span>
            <p className="text-sm font-medium">{submitMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FormulairePage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <FormulaireContent />
    </Suspense>
  );
}
