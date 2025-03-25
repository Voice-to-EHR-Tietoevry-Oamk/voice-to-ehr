'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import VoiceRecorder from '../../components/VoiceRecorder';
import EhrTextForm from '../../components/EhrTextForm';

interface PatientPageClientProps {
  patientId: string;
}

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
}

export default function PatientPageClient({ patientId }: PatientPageClientProps) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [ehrData, setEhrData] = useState<any>({
    symptoms: '',
    diagnosis: '',
    treatment: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for auth
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/');
      return;
    }

    const fetchPatient = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/patients/${patientId}`);
        const data = await response.json();

        if (data.success) {
          setPatient(data.patient);
        } else {
          setError('Failed to load patient data');
        }
      } catch (err) {
        setError('An error occurred while fetching patient data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [patientId, router]);

  const handleTranscriptionComplete = (transcriptionData: any) => {
    setEhrData(transcriptionData);
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-100 p-4 rounded-md">
          <p className="text-red-700">{error || 'Patient not found'}</p>
          <button 
            onClick={handleBackToDashboard}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-white shadow-sm mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Voice-to-EHR</h1>
          
          <button 
            onClick={handleBackToDashboard}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Patient Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Name</p>
              <p className="font-medium">{patient.name}</p>
            </div>
            <div>
              <p className="text-gray-600">Age</p>
              <p className="font-medium">{patient.age}</p>
            </div>
            <div>
              <p className="text-gray-600">Gender</p>
              <p className="font-medium">{patient.gender}</p>
            </div>
            <div>
              <p className="text-gray-600">Patient ID</p>
              <p className="font-medium">{patient.id}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <VoiceRecorder onTranscriptionComplete={handleTranscriptionComplete} />
          <EhrTextForm initialData={ehrData} patientId={parseInt(patientId, 10)} />
        </div>
      </main>
    </div>
  );
} 