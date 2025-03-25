'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface EhrRecord {
  id: number;
  patientId: number;
  patientName: string;
  date: string;
  status: string;
  type: string;
  doctor: string;
}

export default function EhrsPage() {
  const [ehrs, setEhrs] = useState<EhrRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/');
      return;
    }

    // Fetch EHRs data
    const fetchEhrs = async () => {
      try {
        // Mock data for demonstration
        setEhrs([
          { id: 1, patientId: 1, patientName: 'John Doe', date: '2024-03-15', status: 'Completed', type: 'Consultation', doctor: 'Dr. Smith' },
          { id: 2, patientId: 2, patientName: 'Jane Smith', date: '2024-03-14', status: 'Pending Review', type: 'Follow-up', doctor: 'Dr. Johnson' },
          { id: 3, patientId: 3, patientName: 'Mike Johnson', date: '2024-03-13', status: 'Completed', type: 'Initial Visit', doctor: 'Dr. Williams' },
          { id: 4, patientId: 4, patientName: 'Sarah Williams', date: '2024-03-12', status: 'In Progress', type: 'Consultation', doctor: 'Dr. Brown' },
          { id: 5, patientId: 5, patientName: 'David Brown', date: '2024-03-11', status: 'Completed', type: 'Follow-up', doctor: 'Dr. Davis' },
        ]);
      } catch (error) {
        console.error('Error fetching EHRs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEhrs();
  }, [router]);

  const filteredEhrs = ehrs.filter(ehr => {
    const matchesSearch = ehr.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || ehr.status.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });

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
          <h1 className="text-2xl font-bold text-gray-900">EHR Management</h1>
          <div className="flex space-x-4">
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
            >
              Dashboard
            </Link>
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
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex space-x-4 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search EHRs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending review">Pending Review</option>
              <option value="in progress">In Progress</option>
            </select>
          </div>
          <Link
            href="/ehrs/new"
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create New EHR
          </Link>
        </div>

        {/* EHRs Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEhrs.map((ehr) => (
                <tr key={ehr.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{ehr.patientName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{ehr.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{ehr.doctor}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{ehr.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      ehr.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      ehr.status === 'Pending Review' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {ehr.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <Link
                        href={`/ehr/${ehr.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>
                      <Link
                        href={`/ehr/${ehr.id}/edit`}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/ehr/${ehr.id}/history`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        History
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
} 