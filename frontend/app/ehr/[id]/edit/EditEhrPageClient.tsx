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

interface EditEhrPageClientProps {
  ehrId: string;
}

export default function EditEhrPageClient({ ehrId }: EditEhrPageClientProps) {
  const [ehr, setEhr] = useState<EhrRecord | null>(null);
  const [loading, setLoading] = useState(true);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement API call to update EHR
      console.log('Updating EHR:', ehr);
      router.push(`/ehr/${ehrId}`);
    } catch (error) {
      console.error('Error updating EHR:', error);
    }
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Edit EHR #{ehr.id}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Patient Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Patient Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-sm text-gray-900">{ehr.patientName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ID</label>
                <p className="mt-1 text-sm text-gray-900">{ehr.patientId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <p className="mt-1 text-sm text-gray-900">{ehr.date}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Doctor</label>
                <p className="mt-1 text-sm text-gray-900">{ehr.doctor}</p>
              </div>
            </div>
          </div>

          {/* Visit Details */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Visit Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Visit Type
                </label>
                <select
                  id="type"
                  value={ehr.type}
                  onChange={(e) => setEhr({ ...ehr, type: e.target.value })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="Consultation">Consultation</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Initial Visit">Initial Visit</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  value={ehr.status}
                  onChange={(e) => setEhr({ ...ehr, status: e.target.value })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Voice Recording */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Voice Recording</h2>
            <div className="space-y-4">
              <div className="flex justify-center">
                <button
                  type="button"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Start Recording
                </button>
              </div>
              <div>
                <label htmlFor="transcription" className="block text-sm font-medium text-gray-700">
                  Transcription
                </label>
                <textarea
                  id="transcription"
                  value={ehr.transcription}
                  onChange={(e) => setEhr({ ...ehr, transcription: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter or edit transcription..."
                />
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Medical Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700">
                  Diagnosis
                </label>
                <textarea
                  id="diagnosis"
                  value={ehr.diagnosis}
                  onChange={(e) => setEhr({ ...ehr, diagnosis: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter diagnosis..."
                />
              </div>
              <div>
                <label htmlFor="treatment" className="block text-sm font-medium text-gray-700">
                  Treatment Plan
                </label>
                <textarea
                  id="treatment"
                  value={ehr.treatment}
                  onChange={(e) => setEhr({ ...ehr, treatment: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter treatment plan..."
                />
              </div>
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  value={ehr.notes}
                  onChange={(e) => setEhr({ ...ehr, notes: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter additional notes..."
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <Link
              href={`/ehr/${ehrId}`}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </main>
    </div>
  );
} 