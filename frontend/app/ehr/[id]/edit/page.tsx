import { use } from 'react';
import EditEhrPageClient from './EditEhrPageClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditEhrPage({ params }: PageProps) {
  const resolvedParams = use(params);
  return <EditEhrPageClient ehrId={resolvedParams.id} />;
} 