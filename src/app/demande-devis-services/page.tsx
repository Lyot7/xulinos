'use client';

import React, { useEffect, useState } from 'react';
import DemandeDevisForm from '@/components/DemandeDevisForm';

export default function DemandeDevisServicesPage() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const services = urlParams.get("services");
    if (services) {
      setSelectedServices(services.split(','));
    }
  }, []);

  return (
    <DemandeDevisForm withCartSummary={false} selectedServices={selectedServices.join(',')} />
  );
}
