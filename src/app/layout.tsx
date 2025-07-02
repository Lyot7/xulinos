import React from 'react';
import './globals.css';
import { WordPressProviderWrapper } from '@/components/WordPressProviderWrapper';

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
        <WordPressProviderWrapper>
        {children}
        </WordPressProviderWrapper>
      </body>
    </html>
  );
} 