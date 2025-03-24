'use client';

import { useState, useEffect } from 'react';

interface EhrFormData {
  symptoms: string;
  diagnosis: string;
  treatment: string;
}

interface EhrTextFormProps {
  initialData?: EhrFormData;
  patientId: number;
  onSaveComplete?: () => void;
}

export default function EhrTextForm({ 
  initialData = { symptoms: '', diagnosis: '', treatment: '' },
  patientId,
  onSaveComplete
}: EhrTextFormProps) {
  const [formData, setFormData] = useState<EhrFormData>(initialData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`http://localhost:5000/api/patients/${patientId}/records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          ...formData
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        if (onSaveComplete) {
          onSaveComplete();
        }
      } else {
        setError(data.message || 'Failed to save record');
      }
    } catch (err) {
      console.error('Error saving record:', err);
      setError('An error occurred while saving. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">EHR Text Form</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Record saved successfully!
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="symptoms" className="block font-medium mb-1">
            Symptoms
          </label>
          <textarea
            id="symptoms"
            name="symptoms"
            value={formData.symptoms}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter patient symptoms"
          />
        </div>

        <div>
          <label htmlFor="diagnosis" className="block font-medium mb-1">
            Diagnosis
          </label>
          <textarea
            id="diagnosis"
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter diagnosis"
          />
        </div>

        <div>
          <label htmlFor="treatment" className="block font-medium mb-1">
            Treatment
          </label>
          <textarea
            id="treatment"
            name="treatment"
            value={formData.treatment}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter treatment plan"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {saving ? 'Saving...' : 'Save Record'}
        </button>
      </div>
    </div>
  );
} 