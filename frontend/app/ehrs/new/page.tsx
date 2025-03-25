import { use } from 'react';
import NewEhrPageClient from './NewEhrPageClient';

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function NewEhrPage({ searchParams }: PageProps) {
  const patientId = searchParams.patientId as string | undefined;
  
  return <NewEhrPageClient patientId={patientId} />;
} 