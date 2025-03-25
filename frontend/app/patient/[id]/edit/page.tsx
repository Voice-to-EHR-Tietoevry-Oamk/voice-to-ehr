import { use } from 'react';
import EditPatientPageClient from './EditPatientPageClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditPatientPage({ params }: PageProps) {
  const { id } = use(params);
  return <EditPatientPageClient patientId={id} />;
} 