'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  address: string;
  lastVisit: string;
  status: string;
}

interface EhrRecord {
  id: number;
  date: string;
  type: string;
  status: string;
  doctor: string;
}

interface PatientPageClientProps {
  patientId: string;
}

export default function PatientPageClient({ patientId }: PatientPageClientProps) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [ehrs, setEhrs] = useState<EhrRecord[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/');
      return;
    }

    // Fetch patient data
    const fetchPatientData = async () => {
      try {
        // Mock data for demonstration
        setPatient({
          id: parseInt(patientId),
          name: 'John Doe',
          age: 45,
          gender: 'Male',
          email: 'john.doe@example.com',
          phone: '(555) 123-4567',
          address: '123 Main St, City, State 12345',
          lastVisit: '2024-03-15',
          status: 'Active'
        });

        setEhrs([
          { id: 1, date: '2024-03-15', type: 'Consultation', status: 'Completed', doctor: 'Dr. Smith' },
          { id: 2, date: '2024-02-15', type: 'Follow-up', status: 'Completed', doctor: 'Dr. Johnson' },
          { id: 3, date: '2024-01-15', type: 'Initial Visit', status: 'Completed', doctor: 'Dr. Williams' },
        ]);
      } catch (error) {
        console.error('Error fetching patient data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [patientId, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Patient not found</h2>
          <Link href="/patients" className="mt-4 text-blue-600 hover:text-blue-500">
            Return to Patients
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
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">{patient.name}</h1>
            <p className="text-sm text-gray-500 mt-1">#{patient.id}</p>
          </div>
          <div className="flex space-x-4">
            <Link
              href={`/patient/${patient.id}/edit`}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              Edit Patient
            </Link>
            <Link
              href={`/ehrs/new?patientId=${patient.id}`}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 border border-transparent rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              New EHR
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Patient Information */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="px-8 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-lg font-medium text-gray-900">Patient Information</h2>
              </div>
              <div className="p-8">
                <dl className="space-y-4">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <dt className="text-sm text-gray-500 w-28">Age</dt>
                    <dd className="text-sm text-gray-900">{patient.age} years</dd>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <dt className="text-sm text-gray-500 w-28">Gender</dt>
                    <dd className="text-sm text-gray-900">{patient.gender}</dd>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <dt className="text-sm text-gray-500 w-28">Email</dt>
                    <dd className="text-sm text-gray-900">{patient.email}</dd>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <dt className="text-sm text-gray-500 w-28">Phone</dt>
                    <dd className="text-sm text-gray-900">{patient.phone}</dd>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <dt className="text-sm text-gray-500 w-28">Address</dt>
                    <dd className="text-sm text-gray-900">{patient.address}</dd>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <dt className="text-sm text-gray-500 w-28">Last Visit</dt>
                    <dd className="text-sm text-gray-900">{patient.lastVisit}</dd>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <dt className="text-sm text-gray-500 w-28">Status</dt>
                    <dd className="text-sm text-gray-900">{patient.status}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="border-b border-gray-100">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`${
                      activeTab === 'overview'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('ehrs')}
                    className={`${
                      activeTab === 'ehrs'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors`}
                  >
                    EHRs
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`${
                      activeTab === 'history'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors`}
                  >
                    History
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-8">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                      <div className="space-y-4">
                        {ehrs.slice(0, 3).map((ehr) => (
                          <div key={ehr.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{ehr.type}</p>
                              <p className="text-sm text-gray-500">{ehr.date}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                ehr.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {ehr.status}
                              </span>
                              <Link
                                href={`/ehr/${ehr.id}`}
                                className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
                              >
                                View
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'ehrs' && (
                  <div className="space-y-4">
                    {ehrs.map((ehr) => (
                      <div key={ehr.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{ehr.type}</p>
                          <p className="text-sm text-gray-500">{ehr.date} • {ehr.doctor}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            ehr.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {ehr.status}
                          </span>
                          <Link
                            href={`/ehr/${ehr.id}`}
                            className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className="text-sm text-gray-500">
                    Patient history and timeline will be displayed here.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 