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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title and Actions */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Electronic Health Records</h1>
          <Link
            href="/ehrs/new"
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 border border-transparent rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            New EHR
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300 mb-8">
          <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search Patients
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    id="search"
                    type="text"
                    placeholder="Enter patient name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white transition-colors duration-200"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Status
                </label>
                <div className="relative">
                  <select
                    id="status"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="block w-full pl-4 pr-10 py-2.5 text-base border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white appearance-none transition-colors duration-200"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending Review</option>
                    <option value="in-progress">In Progress</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* EHRs Table */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="px-8 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-lg font-medium text-gray-900">All EHRs</h2>
          </div>
          <div className="overflow-x-auto">
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
                  <tr key={ehr.id} className="hover:bg-gray-50 transition-colors">
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
                      <Link
                        href={`/ehr/${ehr.id}`}
                        className="text-blue-600 hover:text-blue-500 transition-colors"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
} 