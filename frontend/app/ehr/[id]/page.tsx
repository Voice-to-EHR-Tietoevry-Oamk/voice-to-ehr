import { use } from 'react';
import EhrPageClient from './EhrPageClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EhrPage({ params }: PageProps) {
  const resolvedParams = use(params);
  return <EhrPageClient ehrId={resolvedParams.id} />;
} 