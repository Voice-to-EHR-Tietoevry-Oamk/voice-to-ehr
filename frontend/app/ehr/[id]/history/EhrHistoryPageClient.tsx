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

interface HistoryEntry {
  id: number;
  date: string;
  action: string;
  user: string;
  changes: string;
}

interface EhrHistoryPageClientProps {
  ehrId: string;
}

export default function EhrHistoryPageClient({ ehrId }: EhrHistoryPageClientProps) {
  const [ehr, setEhr] = useState<EhrRecord | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/');
      return;
    }

    // Fetch EHR data and history
    const fetchData = async () => {
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
          transcription: 'Patient reported experiencing mild headaches...',
          diagnosis: 'Tension headache',
          treatment: 'Prescribed pain relievers',
          notes: 'Follow-up scheduled'
        });

        setHistory([
          {
            id: 1,
            date: '2024-03-15 14:30',
            action: 'Created',
            user: 'Dr. Smith',
            changes: 'Initial EHR created'
          },
          {
            id: 2,
            date: '2024-03-15 14:45',
            action: 'Updated',
            user: 'Dr. Smith',
            changes: 'Added diagnosis and treatment plan'
          }
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link
              href={`/ehr/${ehrId}`}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">EHR History</h1>
              <p className="text-sm text-gray-500">#{ehr.id} - {ehr.patientName}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current EHR Status */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Current Status</h2>
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
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <dl className="mt-2 space-y-2">
                  <div>
                    <dt className="text-sm text-gray-500">Current Status</dt>
                    <dd className="text-sm text-gray-900">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        ehr.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {ehr.status}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* History Timeline */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Change History</h2>
          </div>
          <div className="px-6 py-4">
            <div className="flow-root">
              <ul className="-mb-8">
                {history.map((entry, index) => (
                  <li key={entry.id}>
                    <div className="relative pb-8">
                      {index !== history.length - 1 && (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                            entry.action === 'Created' ? 'bg-green-500' : 'bg-blue-500'
                          }`}>
                            <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                              {entry.action === 'Created' ? (
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                              ) : (
                                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 5a1 1 0 011-1h6a1 1 0 110 2H8a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H8z" clipRule="evenodd" />
                              )}
                            </svg>
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              {entry.action} by <span className="font-medium text-gray-900">{entry.user}</span>
                            </p>
                            <p className="mt-0.5 text-sm text-gray-900">{entry.changes}</p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            <time dateTime={entry.date}>{entry.date}</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 