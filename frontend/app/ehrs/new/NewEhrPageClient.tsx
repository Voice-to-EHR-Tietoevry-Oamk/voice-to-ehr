'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
}

interface NewEhrPageClientProps {
  patientId?: string;
}

type Step = 'patient' | 'visit' | 'recording' | 'prompt' | 'generate' | 'review';

export default function NewEhrPageClient({ patientId }: NewEhrPageClientProps) {
  const [currentStep, setCurrentStep] = useState<Step>('patient');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioChunks, setAudioChunks] = useState<BlobPart[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [aiPrompt, setAiPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedEhr, setGeneratedEhr] = useState<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check authentication
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/');
      return;
    }

    // Fetch patients data
    const fetchPatients = async () => {
      try {
        // Mock data for demonstration
        setPatients([
          { id: 1, name: 'John Doe', age: 45, gender: 'Male', email: 'john@example.com', phone: '(555) 123-4567' },
          { id: 2, name: 'Jane Smith', age: 32, gender: 'Female', email: 'jane@example.com', phone: '(555) 234-5678' },
          { id: 3, name: 'Mike Johnson', age: 28, gender: 'Male', email: 'mike@example.com', phone: '(555) 345-6789' },
        ]);

        // If patientId is provided, select that patient
        if (patientId) {
          const patient = patients.find(p => p.id.toString() === patientId);
          if (patient) {
            setSelectedPatient(patient);
            setCurrentStep('visit');
          }
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [patientId, router]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (recording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [recording, isPaused]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      // Set up audio context and analyser for waveform
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Start waveform animation
      const updateWaveform = () => {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        setWaveformData(Array.from(dataArray));
        animationFrameRef.current = requestAnimationFrame(updateWaveform);
      };
      updateWaveform();

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
      };
      
      setAudioChunks(chunks);
      mediaRecorder.start(200); // Collect data every 200ms
      setRecording(true);
      setRecordingTime(0);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      setIsPaused(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  const restartRecording = () => {
    stopRecording();
    setAudioBlob(null);
    setAudioChunks([]);
    setWaveformData([]);
    setRecordingTime(0);
  };

  const generateEhr = async () => {
    setGenerating(true);
    try {
      if (!audioBlob) {
        throw new Error('No audio recording found');
      }

      // Create form data with audio file
      const formData = new FormData();
      // Ensure the blob is sent with the correct filename and type
      const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
      formData.append('audio', audioFile);

      // Send to backend for processing
      const response = await fetch('http://localhost:5000/api/voice/transcribe', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - browser will set it with boundary
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process audio');
      }

      const data = await response.json();
      
      if (!data.transcription || !data.formatted_ehr) {
        throw new Error('Invalid response from server');
      }

      setGeneratedEhr({
        transcription: data.transcription,
        ...parseEhrSections(data.formatted_ehr)
      });
      
      // Move to review step
      setCurrentStep('review');
    } catch (error: any) {
      console.error('Error generating EHR:', error);
      alert(error.message || 'Failed to generate EHR. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const parseEhrSections = (formattedEhr: string) => {
    // Split the formatted EHR into sections
    const sections = formattedEhr.split('\n\n');
    const ehrData: any = {};
    
    sections.forEach(section => {
      if (section.includes('Chief Complaint:')) {
        ehrData.chiefComplaint = section.replace('Chief Complaint:', '').trim();
      } else if (section.includes('History of Present Illness:')) {
        ehrData.presentIllness = section.replace('History of Present Illness:', '').trim();
      } else if (section.includes('Past Medical History:')) {
        ehrData.pastHistory = section.replace('Past Medical History:', '').trim();
      } else if (section.includes('Medications:')) {
        ehrData.medications = section.replace('Medications:', '').trim();
      } else if (section.includes('Assessment:')) {
        ehrData.assessment = section.replace('Assessment:', '').trim();
      } else if (section.includes('Plan:')) {
        ehrData.plan = section.replace('Plan:', '').trim();
      }
    });
    
    return ehrData;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement API call to create new EHR
      console.log('Creating new EHR:', { ...generatedEhr, patientId: selectedPatient?.id });
      router.push('/ehrs');
    } catch (error) {
      console.error('Error creating EHR:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Image src="/loading.svg" alt="Loading" width={48} height={48} className="animate-spin" />
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title and Actions */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Create New EHR</h1>
          <Link
            href="/ehrs"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
          >
            Cancel
          </Link>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              {['patient', 'visit', 'recording', 'prompt', 'generate', 'review'].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep === step
                      ? 'bg-blue-600 text-white ring-2 ring-blue-200'
                      : index < ['patient', 'visit', 'recording', 'prompt', 'generate', 'review'].indexOf(currentStep)
                      ? 'bg-green-500 text-white ring-2 ring-green-200'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  {index < 5 && (
                    <div className={`w-20 h-1 mx-2 ${
                      index < ['patient', 'visit', 'recording', 'prompt', 'generate', 'review'].indexOf(currentStep)
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="px-8 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-lg font-medium text-gray-900">
              {currentStep === 'patient' && 'Select Patient'}
              {currentStep === 'visit' && 'Visit Details'}
              {currentStep === 'recording' && 'Voice Recording'}
              {currentStep === 'prompt' && 'AI Prompt'}
              {currentStep === 'generate' && 'Generate EHR'}
              {currentStep === 'review' && 'Review & Save'}
            </h2>
          </div>

          <div className="p-8">
            {currentStep === 'patient' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="patient" className="block text-sm font-medium text-gray-700 mb-3">
                    Select Patient
                  </label>
                  <div className="relative">
                    <select
                      value={selectedPatient?.id || ''}
                      onChange={(e) => {
                        const patient = patients.find(p => p.id.toString() === e.target.value);
                        setSelectedPatient(patient || null);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white pr-12"
                    >
                      <option value="">Select a patient</option>
                      {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {selectedPatient && (
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Patient Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Name</p>
                        <p className="text-sm text-gray-900">{selectedPatient.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Age</p>
                        <p className="text-sm text-gray-900">{selectedPatient.age} years</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Gender</p>
                        <p className="text-sm text-gray-900">{selectedPatient.gender}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Contact</p>
                        <p className="text-sm text-gray-900">{selectedPatient.phone}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-sm text-gray-900">{selectedPatient.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={() => setCurrentStep('visit')}
                    disabled={!selectedPatient}
                    className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 border border-transparent rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {currentStep === 'visit' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-3">
                    Visit Type
                  </label>
                  <select
                    id="type"
                    className="block w-full px-4 py-2.5 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="Consultation">Consultation</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Initial Visit">Initial Visit</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-3">
                    Visit Date
                  </label>
                  <input
                    type="datetime-local"
                    id="date"
                    className="block w-full px-4 py-2.5 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentStep('patient')}
                    className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setCurrentStep('recording')}
                    className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 border border-transparent rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {currentStep === 'recording' && (
              <div className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="text-4xl font-mono font-bold text-gray-900">
                    {formatTime(recordingTime)}
                  </div>
                  <div className="flex space-x-4">
                    {!recording ? (
                      <button
                        onClick={startRecording}
                        className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 border border-transparent rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        Start Recording
                      </button>
                    ) : (
                      <>
                        {isPaused ? (
                          <button
                            onClick={resumeRecording}
                            className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 border border-transparent rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            Resume
                          </button>
                        ) : (
                          <button
                            onClick={pauseRecording}
                            className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-yellow-600 to-yellow-700 border border-transparent rounded-lg hover:from-yellow-700 hover:to-yellow-800 transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            Pause
                          </button>
                        )}
                        <button
                          onClick={stopRecording}
                          className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 border border-transparent rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          Stop
                        </button>
                        <button
                          onClick={restartRecording}
                          className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-gray-600 to-gray-700 border border-transparent rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          Restart
                        </button>
                      </>
                    )}
                  </div>
                  {recording && (
                    <div className="w-full h-32 bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-center h-full space-x-1">
                        {waveformData.map((value, index) => (
                          <div
                            key={index}
                            className="w-1 bg-blue-500 rounded-full transition-all duration-75"
                            style={{ height: `${(value / 255) * 100}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {audioBlob && !recording && (
                    <div className="text-green-600 font-medium">
                      Voice recording completed successfully
                    </div>
                  )}
                </div>
                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setCurrentStep('visit')}
                    className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setCurrentStep('prompt')}
                    disabled={!audioBlob}
                    className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 border border-transparent rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {currentStep === 'prompt' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-3">
                    AI Prompt
                  </label>
                  <textarea
                    id="prompt"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    rows={4}
                    className="block w-full px-4 py-2.5 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter any additional context or instructions for the AI..."
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentStep('recording')}
                    className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setCurrentStep('generate')}
                    className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 border border-transparent rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {currentStep === 'generate' && (
              <div className="space-y-6">
                <div className="text-center">
                  <button
                    onClick={generateEhr}
                    disabled={generating}
                    className="px-8 py-4 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 border border-transparent rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {generating ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Generating EHR...</span>
                      </div>
                    ) : (
                      'Generate EHR'
                    )}
                  </button>
                  {generatedEhr && !generating && (
                    <div className="mt-4 text-green-600 font-medium">
                      EHR generated successfully!
                    </div>
                  )}
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentStep('prompt')}
                    className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setCurrentStep('review')}
                    disabled={!generatedEhr}
                    className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 border border-transparent rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {currentStep === 'review' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="transcription" className="block text-sm font-medium text-gray-700 mb-2">
                      Transcription
                    </label>
                    <textarea
                      id="transcription"
                      defaultValue={generatedEhr.transcription}
                      rows={4}
                      className="block w-full px-4 py-2.5 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-2">
                      Diagnosis
                    </label>
                    <textarea
                      id="diagnosis"
                      defaultValue={generatedEhr.diagnosis}
                      rows={3}
                      className="block w-full px-4 py-2.5 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="treatment" className="block text-sm font-medium text-gray-700 mb-2">
                      Treatment Plan
                    </label>
                    <textarea
                      id="treatment"
                      defaultValue={generatedEhr.treatment}
                      rows={3}
                      className="block w-full px-4 py-2.5 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="medications" className="block text-sm font-medium text-gray-700 mb-2">
                      Medications
                    </label>
                    <textarea
                      id="medications"
                      defaultValue={generatedEhr.medications}
                      rows={3}
                      className="block w-full px-4 py-2.5 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      id="notes"
                      defaultValue={generatedEhr.notes}
                      rows={3}
                      className="block w-full px-4 py-2.5 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('generate')}
                    className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                  >
                    Back
                  </button>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep('generate')}
                      className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-yellow-600 to-yellow-700 border border-transparent rounded-lg hover:from-yellow-700 hover:to-yellow-800 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      Regenerate
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 border border-transparent rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      Save EHR
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 