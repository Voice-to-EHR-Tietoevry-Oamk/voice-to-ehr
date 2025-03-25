import { use } from 'react';
import PatientPageClient from './PatientPageClient';

interface PageProps {
  params: {
    id: string;
  };
}

export default function PatientPage({ params }: PageProps) {
  const resolvedParams = use(Promise.resolve(params));
  return <PatientPageClient patientId={resolvedParams.id} />;
}