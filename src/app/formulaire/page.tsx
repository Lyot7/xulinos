"use client";
import { useSearchParams } from "next/navigation";

export default function FormulairePage() {
  const searchParams = useSearchParams();
  const services = searchParams.get("services")?.split(",") || [];

  return (
    <div>
      <h1>Formulaire de demande de devis</h1>
      <p>Services sélectionnés :</p>
      <ul>
        {services.map((s, i) => (
          <li key={i}>{decodeURIComponent(s)}</li>
        ))}
      </ul>
    </div>
  );
}
