import { use } from 'react';
import EhrHistoryPageClient from './EhrHistoryPageClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EhrHistoryPage({ params }: PageProps) {
  const resolvedParams = use(params);
  return <EhrHistoryPageClient ehrId={resolvedParams.id} />;
} 