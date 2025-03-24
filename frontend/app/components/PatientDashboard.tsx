'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
}

export default function PatientDashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/patients');
        const data = await response.json();

        if (data.success) {
          setPatients(data.patients);
        } else {
          setError('Failed to load patients');
        }
      } catch (err) {
        setError('An error occurred while fetching patients');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleViewPatient = (patientId: number) => {
    router.push(`/patient/${patientId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 p-4 rounded-md">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Patient Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {patients.map((patient) => (
          <div 
            key={patient.id} 
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleViewPatient(patient.id)}
          >
            <h2 className="text-lg font-medium">{patient.name}</h2>
            <div className="mt-2 text-gray-600">
              <p>Age: {patient.age}</p>
              <p>Gender: {patient.gender}</p>
            </div>
            <button 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              onClick={(e) => {
                e.stopPropagation();
                handleViewPatient(patient.id);
              }}
            >
              View Patient
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 