'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface EhrRecord {
  id: number;
  patientId: number;
  patientName: string;
  date: string;
  type: string;
  status: string;
  doctor: string;
  transcription: string;
  diagnosis: string;
  treatment: string;
  notes: string;
}

interface EhrPageClientProps {
  ehrId: string;
}

export default function EhrPageClient({ ehrId }: EhrPageClientProps) {
  const [ehr, setEhr] = useState<EhrRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/');
      return;
    }

    // Fetch EHR data
    const fetchEhrData = async () => {
      try {
        // Mock data for demonstration
        setEhr({
          id: parseInt(ehrId),
          patientId: 1,
          patientName: 'John Doe',
          date: '2024-03-15',
          type: 'Consultation',
          status: 'Completed',
          doctor: 'Dr. Smith',
          transcription: 'Patient reported experiencing mild headaches and fatigue over the past week. No fever or other symptoms noted.',
          diagnosis: 'Tension headache, likely stress-related',
          treatment: 'Prescribed over-the-counter pain relievers and recommended stress management techniques.',
          notes: 'Follow-up appointment scheduled for next week.'
        });
      } catch (error) {
        console.error('Error fetching EHR data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEhrData();
  }, [ehrId, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!ehr) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">EHR not found</h2>
          <Link href="/ehrs" className="mt-4 text-blue-600 hover:text-blue-500">
            Return to EHRs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title and Actions */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">EHR #{ehr.id}</h1>
            <p className="text-sm text-gray-500 mt-1">{ehr.patientName}</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
            <button
              onClick={() => {
                // Handle save
                setIsEditing(false);
              }}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                isEditing
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } transition-all duration-200`}
            >
              Save
            </button>
          </div>
        </div>

        {/* EHR Info Card */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">EHR Information</h2>
              <span className={`px-2 py-1 text-xs rounded-full ${
                ehr.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {ehr.status}
              </span>
            </div>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Visit Details</h3>
                <dl className="mt-2 space-y-2">
                  <div>
                    <dt className="text-sm text-gray-500">Date</dt>
                    <dd className="text-sm text-gray-900">{ehr.date}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Type</dt>
                    <dd className="text-sm text-gray-900">{ehr.type}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Doctor</dt>
                    <dd className="text-sm text-gray-900">{ehr.doctor}</dd>
                  </div>
                </dl>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Patient Information</h3>
                <dl className="mt-2 space-y-2">
                  <div>
                    <dt className="text-sm text-gray-500">Name</dt>
                    <dd className="text-sm text-gray-900">{ehr.patientName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">ID</dt>
                    <dd className="text-sm text-gray-900">{ehr.patientId}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Transcription */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Voice Transcription</h2>
            </div>
            <div className="p-6">
              {isEditing ? (
                <textarea
                  value={ehr.transcription}
                  onChange={(e) => setEhr({ ...ehr, transcription: e.target.value })}
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter transcription..."
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">{ehr.transcription}</p>
              )}
            </div>
          </div>

          {/* Diagnosis */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Diagnosis</h2>
            </div>
            <div className="p-6">
              {isEditing ? (
                <textarea
                  value={ehr.diagnosis}
                  onChange={(e) => setEhr({ ...ehr, diagnosis: e.target.value })}
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter diagnosis..."
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">{ehr.diagnosis}</p>
              )}
            </div>
          </div>

          {/* Treatment */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Treatment Plan</h2>
            </div>
            <div className="p-6">
              {isEditing ? (
                <textarea
                  value={ehr.treatment}
                  onChange={(e) => setEhr({ ...ehr, treatment: e.target.value })}
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter treatment plan..."
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">{ehr.treatment}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Additional Notes</h2>
            </div>
            <div className="p-6">
              {isEditing ? (
                <textarea
                  value={ehr.notes}
                  onChange={(e) => setEhr({ ...ehr, notes: e.target.value })}
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter additional notes..."
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">{ehr.notes}</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 