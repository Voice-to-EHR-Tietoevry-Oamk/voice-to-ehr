'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

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

  // Chart data
  const ehrTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'EHRs Created',
        data: [45, 59, 80, 81, 56, 55],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const ehrStatusData = {
    labels: ['Completed', 'Pending Review', 'In Progress'],
    datasets: [
      {
        data: [280, 45, 17],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(59, 130, 246, 0.8)',
        ],
      },
    ],
  };

  const patientAgeData = {
    labels: ['18-30', '31-45', '46-60', '61+'],
    datasets: [
      {
        label: 'Patients by Age Group',
        data: [45, 62, 38, 11],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Patients</h3>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalPatients}</p>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <h3 className="text-sm font-medium text-gray-500">Recent EHRs</h3>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.recentEhrs}</p>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <h3 className="text-sm font-medium text-gray-500">Pending Reviews</h3>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.pendingReviews}</p>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <h3 className="text-sm font-medium text-gray-500">Total EHRs</h3>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalEhrs}</p>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="px-8 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-lg font-medium text-gray-900">EHR Creation Trend</h2>
            </div>
            <div className="p-8">
              <div className="h-80">
                <Line options={chartOptions} data={ehrTrendData} />
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="px-8 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-lg font-medium text-gray-900">EHR Status Distribution</h2>
            </div>
            <div className="p-8">
              <div className="h-80">
                <Pie options={chartOptions} data={ehrStatusData} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="px-8 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-lg font-medium text-gray-900">Patient Age Distribution</h2>
            </div>
            <div className="p-8">
              <div className="h-80">
                <Bar options={chartOptions} data={patientAgeData} />
              </div>
            </div>
          </div>

          {/* Recent Patients */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="px-8 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Recent Patients</h2>
                <Link href="/patients" className="text-sm text-blue-600 hover:text-blue-500 transition-colors">
                  View all
                </Link>
              </div>
            </div>
            <div className="p-8">
              <div className="space-y-4">
                {recentPatients.map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{patient.name}</p>
                      <p className="text-sm text-gray-500">
                        {patient.age} years • {patient.gender}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`/patient/${patient.id}`}
                        className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
                      >
                        View
                      </Link>
                      <Link
                        href={`/patient/${patient.id}/edit`}
                        className="text-sm text-gray-600 hover:text-gray-500 transition-colors"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent EHRs */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="px-8 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Recent EHRs</h2>
              <Link href="/ehrs" className="text-sm text-blue-600 hover:text-blue-500 transition-colors">
                View all
              </Link>
            </div>
          </div>
          <div className="p-8">
            <div className="space-y-4">
              {recentEhrs.map((ehr) => (
                <div key={ehr.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
      </main>
    </div>
  );
}