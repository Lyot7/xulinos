'use client';

import React from 'react';
import { useLegalPage } from '@/hooks/useLegalPage';
import { LegalPageContent } from './LegalPageContent';

interface LegalPageWrapperProps {
  pageKey: 'cgv' | 'configuration' | 'mentions';
}

export const LegalPageWrapper: React.FC<LegalPageWrapperProps> = ({ pageKey }) => {
  const { title, content, date, loading, error } = useLegalPage(pageKey);

  return (
    <LegalPageContent
      title={title}
      content={content}
      date={date}
      loading={loading}
      error={error}
    />
  );
}; 