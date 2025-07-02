import React from 'react';
import './globals.css';
import ClientWrapper from '@/components/ClientWrapper';

export const metadata = {
  title: 'Xulinos - Coutellerie Artisanale',
  description: 'Couteaux artisanaux, affûtage et rémoulage par Xulinos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
} 