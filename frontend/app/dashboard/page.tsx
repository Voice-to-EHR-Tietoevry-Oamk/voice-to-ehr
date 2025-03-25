'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DashboardStats {
  totalPatients: number;
  recentEhrs: number;
  pendingReviews: number;
  totalEhrs: number;
}

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  lastVisit: string;
}

interface EhrRecord {
  id: number;
  patientId: number;
  patientName: string;
  date: string;
  status: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    recentEhrs: 0,
    pendingReviews: 0,
    totalEhrs: 0
  });
  const [recentPatients, setRecentPatients] = useState<Patient[]>([]);
  const [recentEhrs, setRecentEhrs] = useState<EhrRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/');
      return;
    }

    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // Mock data for demonstration
        setStats({
          totalPatients: 156,
          recentEhrs: 23,
          pendingReviews: 8,
          totalEhrs: 342
        });

        setRecentPatients([
          { id: 1, name: 'John Doe', age: 45, gender: 'Male', lastVisit: '2024-03-15' },
          { id: 2, name: 'Jane Smith', age: 32, gender: 'Female', lastVisit: '2024-03-14' },
          { id: 3, name: 'Mike Johnson', age: 58, gender: 'Male', lastVisit: '2024-03-13' },
        ]);

        setRecentEhrs([
          { id: 1, patientId: 1, patientName: 'John Doe', date: '2024-03-15', status: 'Completed' },
          { id: 2, patientId: 2, patientName: 'Jane Smith', date: '2024-03-14', status: 'Pending Review' },
          { id: 3, patientId: 3, patientName: 'Mike Johnson', date: '2024-03-13', status: 'Completed' },
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">VoiceCare EHR Dashboard</h1>
          <button
            onClick={() => {
              localStorage.removeItem('user');
              router.push('/');
            }}
            className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Patients</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalPatients}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Recent EHRs</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.recentEhrs}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Pending Reviews</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.pendingReviews}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total EHRs</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalEhrs}</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Patients */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Recent Patients</h2>
                <Link href="/patients" className="text-sm text-blue-600 hover:text-blue-500">
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentPatients.map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{patient.name}</p>
                      <p className="text-sm text-gray-500">
                        {patient.age} years • {patient.gender}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`/patient/${patient.id}`}
                        className="text-sm text-blue-600 hover:text-blue-500"
                      >
                        View
                      </Link>
                      <Link
                        href={`/patient/${patient.id}/edit`}
                        className="text-sm text-gray-600 hover:text-gray-500"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent EHRs */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Recent EHRs</h2>
                <Link href="/ehrs" className="text-sm text-blue-600 hover:text-blue-500">
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentEhrs.map((ehr) => (
                  <div key={ehr.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{ehr.patientName}</p>
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
                        className="text-sm text-blue-600 hover:text-blue-500"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}