import React from 'react';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
} 