import { use } from 'react';
import EhrPageClient from './EhrPageClient';

interface PageProps {
  params: {
    id: string;
  };
}

export default function EhrPage({ params }: PageProps) {
  const resolvedParams = use(Promise.resolve(params));
  return <EhrPageClient ehrId={resolvedParams.id} />;
} 