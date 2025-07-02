"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function FormulairePage() {
  const searchParams = useSearchParams();
  const services = searchParams.get("services")?.split(",") || [];

  const [form, setForm] = useState({
    nom: "",
    email: "",
    telephone: "",
    modele: "",
    typeBois: "",
    consentement: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consentement) {
      alert("Veuillez accepter la conservation de vos données.");
      return;
    }
    // Traitement de l'envoi
    console.log("Formulaire envoyé :", form);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Demande de devis</h1>
      <p className="mb-4 text-sm text-gray-300">Services sélectionnés :</p>
      <ul className="mb-6 list-disc list-inside text-sm text-gray-400">
        {services.map((s, i) => (
          <li key={i}>{decodeURIComponent(s)}</li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="nom"
          placeholder="Nom"
          className="w-full px-4 py-2 rounded bg-gray-800 text-white"
          value={form.nom}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full px-4 py-2 rounded bg-gray-800 text-white"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="telephone"
          placeholder="Numéro de téléphone"
          className="w-full px-4 py-2 rounded bg-gray-800 text-white"
          value={form.telephone}
          onChange={handleChange}
        />

        <input
          type="text"
          name="modele"
          placeholder="Modèle du couteau"
          className="w-full px-4 py-2 rounded bg-gray-800 text-white"
          value={form.modele}
          onChange={handleChange}
        />

        <input
          type="text"
          name="typeBois"
          placeholder="Type de bois souhaité"
          className="w-full px-4 py-2 rounded bg-gray-800 text-white"
          value={form.typeBois}
          onChange={handleChange}
        />

        <label className="flex items-start gap-2 text-sm text-gray-300">
          <input
            type="checkbox"
            name="consentement"
            checked={form.consentement}
            onChange={handleChange}
            required
          />
          <span>
            J’accepte que mes données soient utilisées uniquement dans le cadre de ma demande de devis, conformément à la politique de confidentialité.
          </span>
        </label>

        <button
          type="submit"
          className="bg-white text-black px-6 py-2 rounded hover:bg-gray-300 transition"
        >
          Envoyer la demande
        </button>
      </form>
    </div>
  );
}
